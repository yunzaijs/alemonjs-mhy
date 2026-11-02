// src/model/mihoyo/birthday.ts
/**
* 留影叙佳期
* 命令: #留影叙佳期 / #留影 / #领生日卡 / #生日卡
* 仅支持原神
*/
const ACTIVITY_ID = "20220301153521";
/** 获取 e_hk4e_token */
const getEHk4eToken = async (cookie, uid, region, gameBiz) => {
	const url = region.includes("cn") ? "https://api-takumi.mihoyo.com/common/badge/v1/login/account" : "https://api-os-takumi.mihoyo.com/common/badge/v1/login/account";
	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				Cookie: cookie,
				"Content-Type": "application/json;charset=UTF-8",
				Referer: "https://webstatic.mihoyo.com/",
				Origin: "https://webstatic.mihoyo.com"
			},
			body: JSON.stringify({
				uid: Number(uid),
				game_biz: gameBiz,
				lang: "zh-cn",
				region
			})
		});
		const tokenMatch = res.headers.get("set-cookie")?.match(/e_hk4e_token=(.*?);/);
		if (!tokenMatch) return null;
		if ((await res.json()).retcode !== 0) return null;
		return tokenMatch[1];
	} catch {
		return null;
	}
};
/** 获取今日生日角色列表 */
const getBirthdayStars = async (uid, token, cookie, region, gameBiz) => {
	try {
		const url = `https://hk4e-api.mihoyo.com/event/birthdaystar/account/index?${new URLSearchParams({
			lang: "zh-cn",
			badge_uid: uid,
			badge_region: region,
			game_biz: gameBiz,
			activity_id: ACTIVITY_ID
		}).toString()}`;
		return (await (await fetch(url, { headers: { Cookie: `e_hk4e_token=${token};${cookie}` } })).json()).data?.role ?? [];
	} catch {
		return [];
	}
};
/** 领取生日卡片 */
const claimBirthdayDraw = async (uid, token, cookie, region, gameBiz, roleId) => {
	try {
		const url = `https://hk4e-api.mihoyo.com/event/birthdaystar/account/post_my_draw?${new URLSearchParams({
			lang: "zh-cn",
			badge_uid: uid,
			badge_region: region,
			game_biz: gameBiz,
			activity_id: ACTIVITY_ID
		}).toString()}`;
		const json = await (await fetch(url, {
			method: "POST",
			headers: {
				Cookie: `e_hk4e_token=${token};${cookie}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ role_id: roleId })
		})).json();
		return json.retcode === 0 ? "success" : json.message;
	} catch {
		return "请求失败";
	}
};

export { claimBirthdayDraw, getBirthdayStars, getEHk4eToken };