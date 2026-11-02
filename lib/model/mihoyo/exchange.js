// src/model/mihoyo/exchange.ts
const MIYOLIVE_UIDS = {
	gs: "75276539",
	sr: "80823548",
	zzz: "152039148"
};
const GAME_GIDS = {
	gs: "2",
	sr: "6",
	zzz: "8"
};
/** 从官方帖子中提取直播 act_id */
const getActIdFromPosts = async (game) => {
	try {
		const url = `https://bbs-api.mihoyo.com/painter/api/user_instant/list?offset=0&size=20&uid=${MIYOLIVE_UIDS[game]}`;
		const json = await (await fetch(url)).json();
		if (json.retcode !== 0) return null;
		for (const p of json.data?.list ?? []) {
			const sc = p?.post?.post?.structured_content;
			if (!sc) continue;
			const match = sc.match(/act_id=([a-zA-Z0-9]+)/);
			if (match) return match[1];
		}
		return null;
	} catch {
		return null;
	}
};
/** 从导航栏获取 act_id (备选) */
const getActIdFromNav = async (game) => {
	try {
		const url = `https://bbs-api.miyoushe.com/apihub/api/home/new?gids=${GAME_GIDS[game]}&parts=1%2C3%2C4`;
		const json = await (await fetch(url)).json();
		if (json.retcode !== 0) return null;
		const nav = json.data?.navigator?.find((item) => /前瞻|特别节目/.test(item.name) && item.app_path.includes("act_id="));
		if (nav) {
			const match = nav.app_path.match(/act_id=([a-zA-Z0-9]+)/);
			if (match) return match[1];
		}
		return null;
	} catch {
		return null;
	}
};
/** 通过 miyolive API 获取兑换码 */
const fetchCodesFromMiyolive = async (actId) => {
	try {
		const indexJson = await (await fetch("https://api-takumi.mihoyo.com/event/miyolive/index", { headers: { "x-rpc-act_id": actId } })).json();
		if (indexJson.retcode !== 0 || !indexJson.data?.live) return {
			codes: [],
			title: "",
			deadline: ""
		};
		const { title, code_ver: codeVer, remain } = indexJson.data.live;
		if (remain > 0) return {
			codes: [],
			title,
			deadline: ""
		};
		const now = Math.floor(Date.now() / 1e3);
		const codeList = (await (await fetch(`https://api-takumi-static.mihoyo.com/event/miyolive/refreshCode?version=${codeVer}&time=${now}`, { headers: { "x-rpc-act_id": actId } })).json()).data?.code_list ?? [];
		const codes = codeList.map((c) => c.code).filter(Boolean);
		let deadline = "";
		if (codeList.length > 0 && codeList[0].to_get_time) {
			const date = /* @__PURE__ */ new Date(codeList[0].to_get_time * 1e3);
			date.setDate(date.getDate() + 3);
			deadline = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} 23:59:59`;
		}
		return {
			codes,
			title,
			deadline
		};
	} catch {
		return {
			codes: [],
			title: "",
			deadline: ""
		};
	}
};

export { fetchCodesFromMiyolive, getActIdFromNav, getActIdFromPosts };