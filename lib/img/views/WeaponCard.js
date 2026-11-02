import { UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate } from "./shared.js";
import React from "react";

// src/img/views/WeaponCard.tsx
const RARITY_COLORS = {
	5: "#c6923a",
	4: "#a256e1",
	3: "#5180cb",
	2: "#4a8f6d",
	1: "#808080"
};
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
	summary: {
		display: "flex",
		justifyContent: "space-around",
		padding: "8px 0 12px",
		borderBottom: "1px solid #f0ede8",
		marginBottom: "8px"
	},
	summaryItem: { textAlign: "center" },
	summaryNum: {
		fontSize: "18px",
		fontWeight: "bold"
	},
	summaryLabel: {
		fontSize: "11px",
		color: "#9e8e7e"
	},
	weaponRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "6px 0",
		borderBottom: "1px solid #f8f6f2"
	},
	weaponLeft: {
		display: "flex",
		alignItems: "center",
		gap: "6px"
	},
	rarityBadge: {
		fontSize: "11px",
		padding: "1px 6px",
		borderRadius: "4px",
		color: "#fff",
		fontWeight: "bold"
	},
	weaponName: {
		fontSize: "13px",
		fontWeight: "bold"
	},
	weaponInfo: {
		fontSize: "12px",
		color: "#6b5e4f"
	},
	equip: {
		fontSize: "11px",
		color: "#9e8e7e"
	}
};
function WeaponCard({ data }) {
	const { uid, avatars, filterText } = data;
	let list = avatars.filter((a) => a.weapon.rarity > 1);
	let filterRarity = 0;
	if (/五星|5星/.test(filterText)) filterRarity = 5;
	else if (/四星|4星/.test(filterText)) filterRarity = 4;
	if (filterRarity > 0) list = list.filter((a) => a.weapon.rarity === filterRarity);
	list.sort((a, b) => {
		const diff = b.weapon.rarity - a.weapon.rarity;
		if (diff !== 0) return diff;
		const lvDiff = b.weapon.level - a.weapon.level;
		if (lvDiff !== 0) return lvDiff;
		return b.weapon.affix_level - a.weapon.affix_level;
	});
	const count5 = list.filter((a) => a.weapon.rarity === 5).length;
	const count4 = list.filter((a) => a.weapon.rarity === 4).length;
	const countOther = list.filter((a) => a.weapon.rarity <= 3).length;
	const dateStr = formatDate();
	const filterLabel = filterRarity > 0 ? ` · ${filterRarity}星` : "";
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "500px" } }, /* @__PURE__ */ React.createElement("div", { style: styles.card }, /* @__PURE__ */ React.createElement("div", { style: styles.header }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: UI_ICONS.weapon,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: "#4a3c2a"
	} }, "原神 · 武器", filterLabel)), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: "#7a6b57"
	} }, "UID ", uid)), /* @__PURE__ */ React.createElement("div", { style: styles.body }, list.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "center",
		padding: "20px 0",
		color: "#9e8e7e"
	} }, "暂无武器数据") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.summary }, /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("div", { style: {
		...styles.summaryNum,
		color: RARITY_COLORS[5]
	} }, count5), /* @__PURE__ */ React.createElement("div", { style: styles.summaryLabel }, "五星")), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("div", { style: {
		...styles.summaryNum,
		color: RARITY_COLORS[4]
	} }, count4), /* @__PURE__ */ React.createElement("div", { style: styles.summaryLabel }, "四星")), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("div", { style: {
		...styles.summaryNum,
		color: RARITY_COLORS[3]
	} }, countOther), /* @__PURE__ */ React.createElement("div", { style: styles.summaryLabel }, "三星及以下"))), list.map((a, i) => {
		const w = a.weapon;
		return /* @__PURE__ */ React.createElement("div", {
			key: i,
			style: styles.weaponRow
		}, /* @__PURE__ */ React.createElement("div", { style: styles.weaponLeft }, /* @__PURE__ */ React.createElement("span", { style: {
			...styles.rarityBadge,
			background: RARITY_COLORS[w.rarity] ?? "#808080"
		} }, "★", w.rarity), /* @__PURE__ */ React.createElement("span", { style: {
			...styles.weaponName,
			color: RARITY_COLORS[w.rarity] ?? "#1e1f20"
		} }, w.name)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: styles.weaponInfo }, "Lv.", w.level, " 精", w.affix_level), /* @__PURE__ */ React.createElement("div", { style: styles.equip }, "→ ", a.name)));
	}))), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { WeaponCard as default };