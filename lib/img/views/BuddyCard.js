import { UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate } from "./shared.js";
import React from "react";

// src/img/views/BuddyCard.tsx
const RARITY_STYLE = {
	S: "#c6923a",
	A: "#a256e1",
	B: "#5180cb"
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
		background: "linear-gradient(135deg, #b4e3c5, #8dd4a8)",
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
	count: {
		textAlign: "center",
		fontSize: "13px",
		color: "#9e8e7e",
		padding: "4px 0 12px",
		borderBottom: "1px solid #f0ede8",
		marginBottom: "8px"
	},
	buddyRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "6px 0",
		borderBottom: "1px solid #f8f6f2"
	},
	buddyLeft: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	},
	rarityBadge: {
		fontSize: "11px",
		padding: "1px 8px",
		borderRadius: "4px",
		color: "#fff",
		fontWeight: "bold"
	},
	buddyName: {
		fontSize: "14px",
		fontWeight: "bold"
	},
	buddyInfo: {
		fontSize: "12px",
		color: "#6b5e4f"
	},
	noData: {
		textAlign: "center",
		padding: "20px 0",
		color: "#9e8e7e",
		fontSize: "14px"
	}
};
function StarDisplay({ count }) {
	return /* @__PURE__ */ React.createElement("span", { style: {
		color: "#c6923a",
		fontSize: "12px"
	} }, "★".repeat(count));
}
function BuddyCard({ data }) {
	const dateStr = formatDate();
	const sorted = [...data.list ?? []].sort((a, b) => b.level - a.level || b.star - a.star);
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "500px" } }, /* @__PURE__ */ React.createElement("div", { style: styles.card }, /* @__PURE__ */ React.createElement("div", { style: styles.header }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: UI_ICONS.role,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: "#2a4a35"
	} }, "绝区零 · 邦布")), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: "#4a7a5b"
	} }, "UID ", data.uid)), /* @__PURE__ */ React.createElement("div", { style: styles.body }, sorted.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: styles.noData }, "暂无邦布数据") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.count }, "共 ", sorted.length, " 只邦布"), sorted.map((b, i) => {
		const color = RARITY_STYLE[b.rarity] ?? "#808080";
		return /* @__PURE__ */ React.createElement("div", {
			key: i,
			style: styles.buddyRow
		}, /* @__PURE__ */ React.createElement("div", { style: styles.buddyLeft }, /* @__PURE__ */ React.createElement("span", { style: {
			...styles.rarityBadge,
			background: color
		} }, b.rarity), /* @__PURE__ */ React.createElement("span", { style: {
			...styles.buddyName,
			color
		} }, b.name)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: styles.buddyInfo }, "Lv.", b.level), /* @__PURE__ */ React.createElement(StarDisplay, { count: b.star })));
	}))), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { BuddyCard as default };