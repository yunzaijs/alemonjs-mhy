import { BG_IMAGES, ELEMENT_ICONS, REGION_ICONS, UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate, getTheme } from "./shared.js";
import React from "react";

// src/img/views/RoleExploreCard.tsx
const GAME_LABELS = {
	gs: {
		name: "原神",
		icon: BG_IMAGES.genshinLogo,
		color: "#8b6d3f"
	},
	sr: {
		name: "星穹铁道",
		icon: UI_ICONS.role,
		color: "#5c6bc0"
	},
	zzz: {
		name: "绝区零",
		icon: UI_ICONS.role,
		color: "#e65100"
	}
};
const OCULUS_NAMES = [
	{
		key: "anemoculus_number",
		label: "风神瞳",
		element: "风"
	},
	{
		key: "geoculus_number",
		label: "岩神瞳",
		element: "岩"
	},
	{
		key: "electroculus_number",
		label: "雷神瞳",
		element: "雷"
	},
	{
		key: "dendroculus_number",
		label: "草神瞳",
		element: "草"
	},
	{
		key: "hydroculus_number",
		label: "水神瞳",
		element: "水"
	},
	{
		key: "pyroculus_number",
		label: "火神瞳",
		element: "火"
	}
];
const styles = {
	card: {
		padding: "24px",
		background: "linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)",
		fontFamily: "\"tttgbnumber\", system-ui, sans-serif",
		fontSize: "14px",
		color: "#1e1f20"
	},
	header: {
		background: "linear-gradient(135deg, #e8d5b0, #d3bc8e)",
		borderRadius: "12px 12px 0 0",
		padding: "14px 20px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
	},
	body: {
		background: "#fff",
		borderRadius: "0 0 12px 12px",
		padding: "16px 20px",
		boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
	},
	section: { marginBottom: "12px" },
	sectionTitle: {
		fontSize: "13px",
		color: "#9e8e7e",
		borderBottom: "1px solid #f0ede8",
		paddingBottom: "6px",
		marginBottom: "8px"
	},
	statGrid: {
		display: "flex",
		flexWrap: "wrap"
	},
	statItem: {
		width: "50%",
		padding: "6px 0",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center"
	},
	statLabel: {
		color: "#6b5e4f",
		fontSize: "13px"
	},
	statValue: {
		fontWeight: "bold",
		fontSize: "14px",
		color: "#1e1f20",
		paddingRight: "12px"
	},
	chestGrid: {
		display: "flex",
		flexWrap: "wrap",
		gap: "0"
	},
	exploreRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "4px 0"
	},
	progressBg: {
		width: "100%",
		height: "6px",
		borderRadius: "3px",
		background: "#f0ede8",
		marginTop: "2px",
		marginBottom: "4px"
	}
};
function StatPair({ label, value, icon }) {
	return /* @__PURE__ */ React.createElement("div", { style: styles.statItem }, /* @__PURE__ */ React.createElement("span", { style: {
		...styles.statLabel,
		display: "flex",
		alignItems: "center",
		gap: "4px"
	} }, icon && /* @__PURE__ */ React.createElement("img", {
		src: icon,
		style: {
			width: "16px",
			height: "16px"
		}
	}), label), /* @__PURE__ */ React.createElement("span", { style: styles.statValue }, value));
}
function ProgressBar({ value, max, color }) {
	const pct = max > 0 ? Math.min(value / max * 100, 100) : 0;
	return /* @__PURE__ */ React.createElement("div", { style: styles.progressBg }, /* @__PURE__ */ React.createElement("div", { style: {
		width: `${pct}%`,
		height: "6px",
		borderRadius: "3px",
		background: color
	} }));
}
function GsContent({ data }) {
	const s = data.stats;
	const totalChest = s.luxurious_chest_number + s.precious_chest_number + s.exquisite_chest_number + s.common_chest_number + s.magic_chest_number;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.section }, /* @__PURE__ */ React.createElement("div", { style: styles.statGrid }, /* @__PURE__ */ React.createElement(StatPair, {
		label: "成就",
		value: s.achievement_number
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "角色数",
		value: s.avatar_number
	}))), /* @__PURE__ */ React.createElement("div", { style: styles.section }, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "🎁 宝箱 · 共 ", totalChest), /* @__PURE__ */ React.createElement("div", { style: styles.chestGrid }, /* @__PURE__ */ React.createElement(StatPair, {
		label: "华丽",
		value: s.luxurious_chest_number
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "珍贵",
		value: s.precious_chest_number
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "精致",
		value: s.exquisite_chest_number
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "普通",
		value: s.common_chest_number
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "奇馈",
		value: s.magic_chest_number
	}))), /* @__PURE__ */ React.createElement("div", { style: styles.section }, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "✨ 神瞳"), /* @__PURE__ */ React.createElement("div", { style: styles.statGrid }, OCULUS_NAMES.map((o, i) => {
		const val = s[o.key] ?? 0;
		const elemIcon = ELEMENT_ICONS[o.element];
		return val > 0 ? /* @__PURE__ */ React.createElement(StatPair, {
			key: i,
			label: o.label,
			value: val,
			icon: elemIcon
		}) : null;
	}))), data.homes && data.homes.length > 0 && /* @__PURE__ */ React.createElement("div", { style: styles.section }, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "🏠 尘歌壶"), /* @__PURE__ */ React.createElement("div", { style: styles.statGrid }, /* @__PURE__ */ React.createElement(StatPair, {
		label: "等级",
		value: data.homes[0].level
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "仙力",
		value: data.homes[0].comfort_num
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "摆设",
		value: data.homes[0].item_num
	}))), data.world_explorations.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "🗺️ 世界探索"), [...data.world_explorations].sort((a, b) => b.exploration_percentage - a.exploration_percentage).map((w, i) => {
		const pct = w.exploration_percentage / 10;
		const offerings = w.offerings?.length > 0 ? w.offerings.map((o) => `${o.name}Lv.${o.level}`).join(" ") : "";
		return /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("div", { style: styles.exploreRow }, /* @__PURE__ */ React.createElement("span", { style: {
			fontSize: "13px",
			color: "#6b5e4f",
			display: "flex",
			alignItems: "center",
			gap: "4px"
		} }, REGION_ICONS[w.name] && /* @__PURE__ */ React.createElement("img", {
			src: REGION_ICONS[w.name],
			style: {
				width: "18px",
				height: "18px",
				borderRadius: "3px"
			}
		}), w.name), /* @__PURE__ */ React.createElement("span", { style: {
			fontSize: "13px",
			fontWeight: "bold"
		} }, pct.toFixed(1), "%")), /* @__PURE__ */ React.createElement(ProgressBar, {
			value: pct,
			max: 100,
			color: "#8b6d3f"
		}), offerings && /* @__PURE__ */ React.createElement("div", { style: {
			fontSize: "11px",
			color: "#9e8e7e",
			marginTop: "-2px",
			marginBottom: "2px"
		} }, offerings));
	})));
}
function SrContent({ data }) {
	const s = data.stats;
	return /* @__PURE__ */ React.createElement("div", { style: styles.statGrid }, /* @__PURE__ */ React.createElement(StatPair, {
		label: "活跃天数",
		value: s.active_days
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "角色数",
		value: s.avatar_num
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "成就",
		value: s.achievement_num
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "宝箱",
		value: s.chest_num
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "忘却之庭",
		value: s.abyss_process
	}));
}
function ZzzContent({ data }) {
	const s = data.stats;
	return /* @__PURE__ */ React.createElement("div", { style: styles.statGrid }, /* @__PURE__ */ React.createElement(StatPair, {
		label: "活跃天数",
		value: s.active_days
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "代理人",
		value: s.avatar_num
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "邦布",
		value: s.buddy_num
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "成就",
		value: s.achievement_count
	}), /* @__PURE__ */ React.createElement(StatPair, {
		label: "式舆防卫战",
		value: `第${s.cur_period_zone_layer_count}层`
	}), s.world_level_name && /* @__PURE__ */ React.createElement(StatPair, {
		label: "等级",
		value: s.world_level_name
	}));
}
function RoleExploreCard({ data }) {
	const gameInfo = GAME_LABELS[data.game];
	const theme = getTheme(data.game);
	const dateStr = formatDate();
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "600px" } }, /* @__PURE__ */ React.createElement("div", { style: styles.card }, /* @__PURE__ */ React.createElement("div", { style: {
		...styles.header,
		background: theme.gradient
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: gameInfo.icon,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: theme.headerText
	} }, gameInfo.name, " · 探索")), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: theme.headerSub
	} }, "UID ", data.uid)), /* @__PURE__ */ React.createElement("div", { style: styles.body }, data.game === "gs" && /* @__PURE__ */ React.createElement(GsContent, { data }), data.game === "sr" && /* @__PURE__ */ React.createElement(SrContent, { data }), data.game === "zzz" && /* @__PURE__ */ React.createElement(ZzzContent, { data })), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { RoleExploreCard as default };