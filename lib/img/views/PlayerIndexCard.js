import { BG_IMAGES, ELEMENT_ICONS, UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate, getTheme } from "./shared.js";
import React from "react";

// src/img/views/PlayerIndexCard.tsx
const RARITY_COLORS = {
	5: "#c6923a",
	4: "#a256e1",
	3: "#5180cb"
};
const GAME_ICONS = {
	gs: BG_IMAGES.genshinLogo,
	sr: UI_ICONS.role,
	zzz: UI_ICONS.role
};
/** 居中统计块 */
function StatBlock({ label, value, accent }) {
	return /* @__PURE__ */ React.createElement("div", { style: {
		flex: "1 1 0",
		minWidth: "0",
		textAlign: "center",
		padding: "10px 4px",
		background: "#faf8f5",
		borderRadius: "8px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: accent
	} }, value), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "11px",
		color: "#9e8e7e",
		marginTop: "3px"
	} }, label));
}
/** 统计行 — 自动等分 */
function StatRow({ items, accent }) {
	return /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		gap: "8px",
		marginBottom: "10px"
	} }, items.map((it, i) => /* @__PURE__ */ React.createElement(StatBlock, {
		key: i,
		label: it.label,
		value: it.value,
		accent
	})));
}
/** 带圆点 + 元素图标的角色行 */
/** 角色信息标签 */
function InfoTag({ label, value }) {
	return /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "11px",
		color: "#6b5e4f",
		background: "#f0ede8",
		borderRadius: "4px",
		padding: "1px 6px"
	} }, label, /* @__PURE__ */ React.createElement("span", { style: {
		fontWeight: "bold",
		color: "#4a4039"
	} }, value));
}
function AvatarRow({ name, tags, rarity, elementIcon }) {
	const color = RARITY_COLORS[rarity] ?? "#1e1f20";
	return /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "7px 10px",
		background: "#faf8f5",
		borderRadius: "6px",
		marginBottom: "4px",
		borderLeft: `3px solid ${color}`
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "6px"
	} }, elementIcon && /* @__PURE__ */ React.createElement("img", {
		src: elementIcon,
		style: {
			width: "16px",
			height: "16px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		fontWeight: "bold",
		color
	} }, name)), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "4px"
	} }, tags.map((t, i) => /* @__PURE__ */ React.createElement(InfoTag, {
		key: i,
		label: t.label,
		value: t.value
	}))));
}
/** 分区标题 */
function SectionTitle({ text }) {
	return /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "13px",
		fontWeight: "bold",
		color: "#6b5e4f",
		padding: "8px 0 6px",
		borderBottom: "2px solid #f0ede8",
		marginBottom: "8px",
		display: "flex",
		alignItems: "center",
		gap: "6px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: "3px",
		height: "14px",
		borderRadius: "2px",
		background: "#c6923a"
	} }), text);
}
/** 进度条 */
function ProgressBar({ value, max, color }) {
	const pct = max > 0 ? Math.min(value / max * 100, 100) : 0;
	return /* @__PURE__ */ React.createElement("div", { style: {
		width: "100%",
		height: "6px",
		borderRadius: "3px",
		background: "#f0ede8",
		marginTop: "3px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		width: `${pct}%`,
		height: "6px",
		borderRadius: "3px",
		background: color
	} }));
}
function GsContent({ data, accent }) {
	const s = data.stats;
	const sorted = [...data.avatars].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
	const top = sorted.slice(0, 10);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatRow, {
		accent,
		items: [
			{
				label: "活跃天数",
				value: s.active_day_number
			},
			{
				label: "成就",
				value: s.achievement_number
			},
			{
				label: "角色数",
				value: s.avatar_number
			},
			{
				label: "深渊",
				value: s.spiral_abyss
			}
		]
	}), data.world_explorations.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "10px" } }, /* @__PURE__ */ React.createElement(SectionTitle, { text: "世界探索" }), [...data.world_explorations].sort((a, b) => b.exploration_percentage - a.exploration_percentage).slice(0, 8).map((w, i) => {
		const pct = w.exploration_percentage / 10;
		return /* @__PURE__ */ React.createElement("div", {
			key: i,
			style: { marginBottom: "6px" }
		}, /* @__PURE__ */ React.createElement("div", { style: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center"
		} }, /* @__PURE__ */ React.createElement("span", { style: {
			fontSize: "13px",
			color: "#6b5e4f"
		} }, w.name), /* @__PURE__ */ React.createElement("span", { style: {
			fontSize: "13px",
			fontWeight: "bold",
			color: "#4a3c2a"
		} }, pct.toFixed(1), "%")), /* @__PURE__ */ React.createElement(ProgressBar, {
			value: pct,
			max: 100,
			color: accent
		}));
	})), top.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SectionTitle, { text: `角色 Top${top.length}` }), top.map((a, i) => /* @__PURE__ */ React.createElement(AvatarRow, {
		key: i,
		name: a.name,
		tags: [
			{
				label: "Lv.",
				value: a.level
			},
			{
				label: "命座",
				value: a.actived_constellation_num
			},
			{
				label: "好感",
				value: a.fetter
			}
		],
		rarity: a.rarity,
		elementIcon: ELEMENT_ICONS[a.element]
	})), sorted.length > 10 && /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "12px",
		color: "#9e8e7e",
		textAlign: "center",
		padding: "6px 0"
	} }, "共 ", sorted.length, " 个角色")));
}
function SrContent({ data, accent }) {
	const s = data.stats;
	const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level || b.rarity - a.rarity);
	const top = sorted.slice(0, 10);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatRow, {
		accent,
		items: [
			{
				label: "活跃天数",
				value: s.active_days
			},
			{
				label: "成就",
				value: s.achievement_num
			},
			{
				label: "角色数",
				value: s.avatar_num
			}
		]
	}), /* @__PURE__ */ React.createElement(StatRow, {
		accent,
		items: [{
			label: "宝箱",
			value: s.chest_num
		}, {
			label: "忘却之庭",
			value: s.abyss_process
		}]
	}), top.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SectionTitle, { text: `角色 Top${top.length}` }), top.map((a, i) => /* @__PURE__ */ React.createElement(AvatarRow, {
		key: i,
		name: a.name,
		tags: [{
			label: "Lv.",
			value: a.level
		}, {
			label: "星魂",
			value: a.rank
		}],
		rarity: a.rarity
	})), sorted.length > 10 && /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "12px",
		color: "#9e8e7e",
		textAlign: "center",
		padding: "6px 0"
	} }, "共 ", sorted.length, " 个角色")));
}
function ZzzContent({ data, accent }) {
	const s = data.stats;
	const sorted = [...data.avatar_list].sort((a, b) => b.level - a.level);
	const top = sorted.slice(0, 10);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatRow, {
		accent,
		items: [
			{
				label: "活跃天数",
				value: s.active_days
			},
			{
				label: "成就",
				value: s.achievement_count
			},
			{
				label: "代理人",
				value: s.avatar_num
			}
		]
	}), /* @__PURE__ */ React.createElement(StatRow, {
		accent,
		items: [{
			label: "邦布",
			value: s.buddy_num
		}, {
			label: "式舆防卫战",
			value: `第${s.cur_period_zone_layer_count}层`
		}]
	}), top.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SectionTitle, { text: `代理人 Top${top.length}` }), top.map((a, i) => /* @__PURE__ */ React.createElement(AvatarRow, {
		key: i,
		name: a.name_mi18n,
		tags: [
			{
				label: "Lv.",
				value: a.level
			},
			{
				label: "",
				value: a.rarity
			},
			{
				label: "影画",
				value: a.rank
			}
		],
		rarity: 0
	})), sorted.length > 10 && /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "12px",
		color: "#9e8e7e",
		textAlign: "center",
		padding: "6px 0"
	} }, "共 ", sorted.length, " 个代理人")));
}
function PlayerIndexCard({ data }) {
	const theme = getTheme(data.game);
	const dateStr = formatDate();
	const icon = GAME_ICONS[data.game] ?? GAME_ICONS.gs;
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "520px" } }, /* @__PURE__ */ React.createElement("div", { style: {
		padding: "24px",
		background: "linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)",
		fontFamily: "\"tttgbnumber\", system-ui, sans-serif",
		fontSize: "14px",
		color: "#1e1f20"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		background: theme.gradient,
		borderRadius: "12px 12px 0 0",
		padding: "14px 20px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: icon,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: theme.headerText
	} }, theme.name, " · 角色面板")), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: theme.headerSub
	} }, "UID ", data.uid)), /* @__PURE__ */ React.createElement("div", { style: {
		background: "#fff",
		borderRadius: "0 0 12px 12px",
		padding: "16px 18px",
		boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
	} }, data.game === "gs" && /* @__PURE__ */ React.createElement(GsContent, {
		data,
		accent: theme.accent
	}), data.game === "sr" && /* @__PURE__ */ React.createElement(SrContent, {
		data,
		accent: theme.accent
	}), data.game === "zzz" && /* @__PURE__ */ React.createElement(ZzzContent, {
		data,
		accent: theme.accent
	})), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { PlayerIndexCard as default };