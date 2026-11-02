import { mihoyoKeys } from "../keys.js";
import { getIoRedis } from "@alemonjs/db";

// src/model/mihoyo/payLog.ts
/**
* 充值记录
* 命令: #充值记录 / #消费记录 / #充值统计 / #消费统计 / #充值帮助
*       #更新充值记录
*       (私聊) 发送含 authkey 的米游社链接
*/
const AUTHKEY_EXPIRY = 86400;
const PAYDATA_EXPIRY = 2592e3;
const BASE_URL = "https://hk4e-api.mihoyo.com/common/hk4e_self_help_query/User";
const HEADERS = {
	accept: "application/json, text/plain, */*",
	"accept-language": "zh-CN,zh;q=0.9",
	"sec-fetch-dest": "empty",
	"sec-fetch-mode": "cors",
	"sec-fetch-site": "same-site"
};
const buildQueryUrl = (api, authkey, endId = "") => {
	const path = {
		getUserInfo: "/GetUserInfo",
		getPrimogemLog: "/GetPrimogemLog",
		getCrystalLog: "/GetCrystalLog"
	}[api] ?? "/GetCrystalLog";
	const params = new URLSearchParams({
		selfquery_type: "1",
		sign_type: "2",
		auth_appid: "csc",
		authkey_ver: "1",
		game_biz: "hk4e_cn",
		win_direction: "portrait",
		bbs_auth_required: "true",
		bbs_game_role_required: "hk4e_cn",
		app_client: "bbs",
		lang: "zh-cn",
		csc_authkey_required: "true",
		authkey
	});
	if (api !== "getUserInfo") {
		params.set("add_type", "produce");
		params.set("size", "20");
		params.set("end_id", endId);
		params.set("page_id", "1");
	}
	return `${BASE_URL}${path}?${params.toString()}`;
};
/** 获取用户信息 */
const getUserInfo = async (authkey) => {
	try {
		const json = await (await fetch(buildQueryUrl("getUserInfo", authkey), { headers: HEADERS })).json();
		if (json.retcode === -101) return { errorMsg: "链接已过期，请重新获取" };
		if (json.retcode === -100) return { errorMsg: "链接不正确，请重新获取" };
		if (/unknown auth appid/.test(json.message)) return { errorMsg: "该链接无法获取充值记录，请使用客服页面链接" };
		if (json.data?.uid) return { uid: json.data.uid };
		return { errorMsg: `获取失败 (${json.retcode})` };
	} catch {
		return { errorMsg: "请求失败" };
	}
};
/** 分页获取结晶记录 */
const fetchCrystalLog = async (authkey) => {
	const allRecords = [];
	let endId = "";
	for (let page = 0; page < 50; page++) try {
		const json = await (await fetch(buildQueryUrl("getCrystalLog", authkey, endId), { headers: HEADERS })).json();
		if (json.retcode === -101 || json.retcode === -100) return {
			records: allRecords,
			errorMsg: "链接已过期"
		};
		const list = json.data?.list ?? [];
		allRecords.push(...list);
		if (list.length < 20) break;
		endId = list[list.length - 1].id;
	} catch {
		break;
	}
	return { records: allRecords };
};
/** 处理记录数据 */
const processPayData = (records, uid) => {
	const priceMap = {
		8080: 648,
		3880: 328,
		2240: 198,
		1090: 98,
		330: 30,
		60: 6,
		300: 30,
		680: 68
	};
	let crystal = 0;
	let totalRmb = 0;
	for (const r of records) {
		const num = Number(r.add_num);
		if (num <= 0) continue;
		crystal += num;
		totalRmb += priceMap[num] ?? 0;
	}
	return {
		uid,
		crystal,
		totalRmb,
		records: records.length
	};
};
/** 使用 authkey 获取并保存数据 */
const fetchAndSavePayData = async (authkey, userId, sendMsg) => {
	const redis = getIoRedis();
	const userInfo = await getUserInfo(authkey);
	if (userInfo.errorMsg) {
		sendMsg(`获取失败: ${userInfo.errorMsg}`);
		return null;
	}
	const { records, errorMsg } = await fetchCrystalLog(authkey);
	if (errorMsg && records.length === 0) {
		sendMsg(`获取失败: ${errorMsg}`);
		return null;
	}
	const payData = processPayData(records, userInfo.uid);
	await redis.setex(mihoyoKeys.authKeyByUser(userId), AUTHKEY_EXPIRY, authkey);
	await redis.setex(mihoyoKeys.authKeyByUid(payData.uid), AUTHKEY_EXPIRY, authkey);
	await redis.setex(mihoyoKeys.payLogByUser(userId), PAYDATA_EXPIRY, JSON.stringify(payData));
	return payData;
};
const formatPayData = (data) => {
	return [
		`【充值统计】 UID:${data.uid}`,
		"",
		`总结晶: ${data.crystal}`,
		`预估消费: ￥${data.totalRmb}`,
		`充值记录数: ${data.records}条`
	].join("\n");
};

export { fetchAndSavePayData, formatPayData };