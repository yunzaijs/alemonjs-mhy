import { getUserCookie } from "./account.js";
import { buildStokenCookie, getUserStoken } from "./stoken.js";
import md5 from "md5";

// src/model/mihoyo/sign.ts
/**
* 米游社签到服务
* 支持原神、星穹铁道等游戏签到
*/
const MHY_WEB_API = "https://api-takumi.mihoyo.com";
const MHY_BBS_API = "https://bbs-api.mihoyo.com";
const MHY_APP_VERSION = "2.70.1";
const MHY_SALT_WEB = "sjdNFJB7XxyDWGIAk0eTV8AOCfMJmyEo";
const DELAY_MS = 2e3;
const SIGN_GAMES = {
	gs: {
		name: "原神",
		gameName: "genshin",
		biz: "hk4e_cn",
		actid: "e202311201442471",
		referer: "https://act.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=e202311201442471&utm_source=bbs&utm_medium=mys&utm_campaign=icon",
		signGameHeader: "hk4e"
	},
	sr: {
		name: "崩坏星穹铁道",
		gameName: "hkrpg",
		biz: "hkrpg_cn",
		actid: "e202304121516551",
		referer: "https://webstatic.mihoyo.com/bbs/event/signin/hkrpg/index.html?bbs_auth_required=true&act_id=e202304121516551&bbs_auth_required=true&bbs_presentation_style=fullscreen&utm_source=h5&utm_medium=mys&utm_campaign=zj"
	},
	bh3: {
		name: "崩坏3",
		gameName: "bh3",
		biz: "bh3_cn",
		actid: "e202207181446311",
		referer: "https://webstatic.mihoyo.com/bh3/event/euthenia/index.html?bbs_presentation_style=fullscreen&bbs_game_role_required=bh3_cn&bbs_auth_required=true&act_id=e202207181446311&utm_source=bbs&utm_medium=mys&utm_campaign=icon"
	}
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomString = (len) => {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < len; i++) result += chars[Math.floor(Math.random() * 36)];
	return result;
};
const generateDs = (salt = MHY_SALT_WEB) => {
	const r = randomString(6);
	const t = Math.floor(Date.now() / 1e3);
	return `${t},${r},${md5(`salt=${salt}&t=${t}&r=${r}`)}`;
};
const DEVICE_ID = randomString(32).toUpperCase();
const fetchApi = async (url, options) => {
	try {
		const res = await fetch(url, {
			method: options.method ?? "GET",
			headers: options.headers ?? {},
			body: options.body
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
};
const buildSignHeaders = (cookie, config) => {
	const headers = {
		"accept-language": "zh-CN,zh;q=0.9",
		"x-rpc-device_id": DEVICE_ID,
		"User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/${MHY_APP_VERSION}`,
		Referer: config.referer,
		Host: "api-takumi.mihoyo.com",
		"x-rpc-channel": "appstore",
		"x-rpc-app_version": MHY_APP_VERSION,
		"x-requested-with": "com.mihoyo.hyperion",
		"x-rpc-client_type": "5",
		"Content-Type": "application/json;charset=UTF-8",
		DS: generateDs(),
		Cookie: cookie
	};
	if (config.signGameHeader) headers["x-rpc-signgame"] = config.signGameHeader;
	return headers;
};
const fetchSignRoles = async (cookie, biz) => {
	const url = `${MHY_WEB_API}/binding/api/getUserGameRolesByCookie?game_biz=${biz}`;
	const headers = {
		Cookie: cookie,
		DS: generateDs(),
		"x-rpc-app_version": MHY_APP_VERSION,
		"x-rpc-client_type": "5",
		"User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/${MHY_APP_VERSION}`
	};
	const res = await fetchApi(url, { headers });
	if (res?.retcode !== 0 || !res.data?.list) return [];
	return res.data.list;
};
const fetchSignInfo = async (cookie, config, uid, region) => {
	const url = `${MHY_WEB_API}/event/luna/info?region=${region}&act_id=${config.actid}&uid=${uid}`;
	const res = await fetchApi(url, { headers: buildSignHeaders(cookie, config) });
	if (res?.retcode !== 0 || !res.data) return null;
	return {
		isSigned: res.data.is_sign,
		totalDays: res.data.total_sign_day
	};
};
const doSign = (cookie, config, uid, region, extraHeaders) => {
	const url = `${MHY_WEB_API}/event/luna/sign`;
	const body = JSON.stringify({
		region,
		act_id: config.actid,
		uid
	});
	const headers = buildSignHeaders(cookie, config);
	if (extraHeaders) Object.assign(headers, extraHeaders);
	return fetchApi(url, {
		method: "POST",
		headers,
		body
	});
};
const fetchSignRewards = async (cookie, config) => {
	const url = `${MHY_WEB_API}/event/luna/home?act_id=${config.actid}`;
	const res = await fetchApi(url, { headers: buildSignHeaders(cookie, config) });
	if (res?.retcode !== 0 || !res.data?.awards) return [];
	return res.data.awards;
};
const performGameSign = async (userId, gameKey) => {
	const cookie = (await getUserCookie(userId))?.ck;
	if (!cookie) return {
		success: false,
		message: "尚未绑定Cookie，请先绑定Cookie",
		details: []
	};
	const targetGames = gameKey ? [gameKey] : Object.keys(SIGN_GAMES);
	const details = [];
	const lines = [];
	for (const key of targetGames) {
		const config = SIGN_GAMES[key];
		if (!config) continue;
		lines.push(`【${config.name}】`);
		const roles = await fetchSignRoles(cookie, config.biz);
		if (roles.length === 0) {
			lines.push(`  未绑定${config.name}角色`);
			continue;
		}
		for (const role of roles) {
			await sleep(DELAY_MS);
			const info = await fetchSignInfo(cookie, config, role.game_uid, role.region);
			if (!info) {
				const detail = {
					gameName: config.name,
					nickname: role.nickname,
					uid: role.game_uid,
					signed: false,
					alreadySigned: false,
					totalDays: 0,
					error: "查询签到状态失败"
				};
				details.push(detail);
				lines.push(`  ${role.nickname}(${role.game_uid}): 查询签到状态失败`);
				continue;
			}
			if (info.isSigned) {
				const detail = {
					gameName: config.name,
					nickname: role.nickname,
					uid: role.game_uid,
					signed: true,
					alreadySigned: true,
					totalDays: info.totalDays
				};
				details.push(detail);
				lines.push(`  ${role.nickname}(${role.game_uid}): 今日已签到 (累计${info.totalDays}天)`);
				continue;
			}
			await sleep(DELAY_MS);
			const signRes = await doSign(cookie, config, role.game_uid, role.region);
			const isGt = signRes?.data?.gt;
			let signed = false;
			if (isGt) {
				const detail = {
					gameName: config.name,
					nickname: role.nickname,
					uid: role.game_uid,
					signed: false,
					alreadySigned: false,
					totalDays: info.totalDays,
					error: "触发验证码，请稍后在米游社手动签到"
				};
				details.push(detail);
				lines.push(`  ${role.nickname}(${role.game_uid}): 触发验证码，请手动签到`);
				continue;
			}
			if (signRes?.retcode === 0 || signRes?.message === "OK") signed = true;
			const todayReward = (await fetchSignRewards(cookie, config))[info.totalDays];
			const detail = {
				gameName: config.name,
				nickname: role.nickname,
				uid: role.game_uid,
				signed,
				alreadySigned: false,
				totalDays: info.totalDays + (signed ? 1 : 0),
				reward: todayReward ? `${todayReward.name}×${todayReward.cnt}` : void 0,
				error: signed ? void 0 : signRes?.message ?? "签到失败"
			};
			details.push(detail);
			if (signed) {
				const rewardText = detail.reward ? ` 奖励: ${detail.reward}` : "";
				lines.push(`  ${role.nickname}(${role.game_uid}): 签到成功 (累计${detail.totalDays}天)${rewardText}`);
			} else lines.push(`  ${role.nickname}(${role.game_uid}): ${detail.error}`);
		}
	}
	return {
		success: true,
		message: lines.join("\n"),
		details
	};
};
const resolveSignGameKey = (text) => {
	if (text.includes("原神")) return "gs";
	if (text.includes("星铁") || text.includes("星穹铁道") || text.includes("崩铁")) return "sr";
	if (text.includes("崩坏3") || text.includes("崩三") || text.includes("崩3")) return "bh3";
};
const MHY_SALT = "S9Hrn38d2b55PamfIR9BNA3Tx9sQTOem";
const MHY_SALT2 = "LyD1rXqMv2GJhnwdvCBjFOKGiKuLY3aO";
const generateDs2 = (q, b, salt) => {
	const t = Math.floor(Date.now() / 1e3);
	const r = Math.floor(Math.random() * 1e5 + 100001);
	return `${t},${r},${md5(`salt=${salt}&t=${t}&r=${r}&b=${b}&q=${q}`)}`;
};
const FORUM_LIST = [
	{
		name: "原神",
		forumid: 26
	},
	{
		name: "崩坏3",
		forumid: 1
	},
	{
		name: "崩坏星穹铁道",
		forumid: 52
	},
	{
		name: "绝区零",
		forumid: 57
	},
	{
		name: "大别野",
		forumid: 34
	}
];
const DEVICE_NAME = randomString(8);
const buildBbsHeaders = (stokenCookie, forumid, isSignPost) => {
	const body = isSignPost ? JSON.stringify({ gids: forumid }) : "";
	return {
		Cookie: stokenCookie,
		"x-rpc-channel": "miyousheluodi",
		"x-rpc-device_id": DEVICE_ID,
		"x-rpc-app_version": MHY_APP_VERSION,
		"x-rpc-device_model": "Mi 10",
		"x-rpc-device_name": DEVICE_NAME,
		"x-rpc-client_type": "2",
		DS: isSignPost ? generateDs2("", body, MHY_SALT2) : generateDs(MHY_SALT),
		Referer: "https://app.mihoyo.com",
		"x-rpc-sys_version": "12",
		Host: "bbs-api.mihoyo.com",
		"User-Agent": "okhttp/4.8.0"
	};
};
const performBbsSign = async (userId) => {
	const stokenData = await getUserStoken(userId);
	if (!stokenData) return {
		success: false,
		message: "尚未绑定stoken，请先通过 #扫码登录 或发送stoken进行绑定"
	};
	const stCookie = buildStokenCookie(stokenData);
	const stateRes = await fetchApi(`${MHY_BBS_API}/apihub/sapi/getUserMissionsState`, { headers: buildBbsHeaders(stCookie, 0, false) });
	if (!stateRes?.data) return {
		success: false,
		message: "stoken已失效，请重新绑定"
	};
	if (stateRes.data.can_get_points === 0) return {
		success: true,
		message: `米游币任务已完成\n当前米游币: ${stateRes.data.total_points}`
	};
	const lines = [`当前米游币: ${stateRes.data.total_points}, 今日可获取: ${stateRes.data.can_get_points}`];
	for (const forum of FORUM_LIST) {
		const signBody = JSON.stringify({ gids: forum.forumid });
		const signRes = await fetchApi(`${MHY_BBS_API}/apihub/app/api/signIn`, {
			method: "POST",
			headers: buildBbsHeaders(stCookie, forum.forumid, true),
			body: signBody
		});
		lines.push(`${forum.name} 社区签到: ${signRes?.message ?? "请求失败"}`);
		const postRes = await fetchApi(`${MHY_BBS_API}/post/api/getForumPostList?forum_id=${forum.forumid}&is_good=false&is_hot=false&page_size=5&sort_type=1`, { headers: buildBbsHeaders(stCookie, forum.forumid, false) });
		if (postRes?.data?.list) {
			const posts = postRes.data.list;
			let views = 0;
			let likes = 0;
			for (const p of posts.slice(0, 3)) {
				const postId = p.post.post_id;
				if ((await fetchApi(`${MHY_BBS_API}/post/api/getPostFull?post_id=${postId}`, { headers: buildBbsHeaders(stCookie, forum.forumid, false) }))?.retcode === 0) views++;
				if ((await fetchApi(`${MHY_BBS_API}/apihub/sapi/upvotePost`, {
					method: "POST",
					headers: buildBbsHeaders(stCookie, forum.forumid, false),
					body: JSON.stringify({
						post_id: postId,
						is_cancel: false
					})
				}))?.retcode === 0) likes++;
				await sleep(1500);
			}
			lines.push(`  浏览: ${views}  点赞: ${likes}`);
		}
		await sleep(DELAY_MS);
	}
	return {
		success: true,
		message: lines.join("\n")
	};
};

export { performBbsSign, performGameSign, resolveSignGameKey };