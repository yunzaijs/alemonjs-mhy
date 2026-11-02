// src/model/mihoyo/region.ts
const gameRegionMap = {
	gs: [
		"cn_gf01",
		"cn_qd01",
		"os_usa",
		"os_euro",
		"os_asia",
		"os_cht"
	],
	sr: [
		"prod_gf_cn",
		"prod_qd_cn",
		"prod_official_usa",
		"prod_official_euro",
		"prod_official_asia",
		"prod_official_cht"
	],
	zzz: [
		"prod_gf_cn",
		"prod_gf_cn",
		"prod_gf_us",
		"prod_gf_eu",
		"prod_gf_jp",
		"prod_gf_sg"
	]
};
const getRegionByIndex = (game, index) => {
	const regions = gameRegionMap[game];
	return regions[index] ?? regions[0];
};
const resolveMihoyoRegion = (uid, game) => {
	const value = String(uid || "");
	if (game === "zzz") {
		if (value.length < 10) return {
			game,
			server: getRegionByIndex(game, 0),
			type: "cn"
		};
		const prefix = value.slice(0, -8);
		if (prefix === "10") return {
			game,
			server: getRegionByIndex(game, 2),
			type: "global"
		};
		if (prefix === "15") return {
			game,
			server: getRegionByIndex(game, 3),
			type: "global"
		};
		if (prefix === "13") return {
			game,
			server: getRegionByIndex(game, 4),
			type: "global"
		};
		if (prefix === "17") return {
			game,
			server: getRegionByIndex(game, 5),
			type: "global"
		};
		return {
			game,
			server: getRegionByIndex(game, 0),
			type: "cn"
		};
	}
	const prefix = value.slice(0, -8);
	if (prefix === "5") return {
		game,
		server: getRegionByIndex(game, 1),
		type: "cn"
	};
	if (prefix === "6") return {
		game,
		server: getRegionByIndex(game, 2),
		type: "global"
	};
	if (prefix === "7") return {
		game,
		server: getRegionByIndex(game, 3),
		type: "global"
	};
	if (prefix === "8" || prefix === "18") return {
		game,
		server: getRegionByIndex(game, 4),
		type: "global"
	};
	if (prefix === "9") return {
		game,
		server: getRegionByIndex(game, 5),
		type: "global"
	};
	return {
		game,
		server: getRegionByIndex(game, 0),
		type: "cn"
	};
};

export { resolveMihoyoRegion };