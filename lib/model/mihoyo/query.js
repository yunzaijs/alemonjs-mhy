import { getUserCookie, getUserMainUid } from "./account.js";
import { mysApiFetch } from "./mysApi.js";

// src/model/mihoyo/query.ts
/**
* 通用查询服务
* 根据用户 ID 获取 Cookie + UID，发起米游社 API 请求
*/
const RETCODE_MESSAGES = {
	[-1]: "请求异常，请稍后重试",
	[-100]: "Cookie已失效，请重新绑定",
	[-10001]: "Cookie已失效，请重新绑定",
	[10001]: "绑定的Cookie已过期",
	[10101]: "查询已达今日上限",
	[10102]: "米游社数据未公开，请前往米游社开启数据展示",
	[10103]: "Cookie无效，请重新绑定",
	[10104]: "暂无该角色数据，请前往米游社开启数据展示",
	[1034]: "遇到验证码，请稍后再试或前往米游社App完成验证",
	[10035]: "遇到验证码，请稍后再试或前往米游社App完成验证",
	[5003]: "接口数据异常，请稍后重试",
	[10041]: "米游社账号异常，暂时无法查询",
	[12118]: "请先前往米游社开启数据展示"
};
const formatRetcode = (res) => {
	const known = RETCODE_MESSAGES[res.retcode];
	if (known) return `${known} (retcode:${res.retcode})`;
	return `接口返回错误 [${res.retcode}] ${res.message}`;
};
/**
* 执行米游社查询
*/
const queryMihoyoApi = async (params) => {
	const { userId, game, api, query, body, cached } = params;
	const cookieData = await getUserCookie(userId);
	if (!cookieData) return {
		success: false,
		message: "尚未绑定Cookie，请先发送Cookie进行绑定"
	};
	const uid = await getUserMainUid(userId, game);
	if (!uid) return {
		success: false,
		message: `尚未绑定${game === "gs" ? "原神" : game === "sr" ? "星穹铁道" : "绝区零"}UID`
	};
	const res = await mysApiFetch({
		uid,
		cookie: cookieData.ck,
		api,
		game,
		query,
		body,
		cached: cached ?? true
	});
	if (!res) return {
		success: false,
		message: "请求米游社接口失败，请稍后重试",
		uid
	};
	if (res.retcode !== 0) return {
		success: false,
		message: formatRetcode(res),
		uid
	};
	return {
		success: true,
		message: "ok",
		data: res.data,
		uid,
		api: res.api
	};
};

export { queryMihoyoApi };