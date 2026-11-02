import { UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate, getTheme } from "./shared.js";
import React from "react";

// src/img/views/SpiralAbyssCard.tsx
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
	row: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "8px 0",
		borderBottom: "1px solid #f0ede8"
	},
	label: {
		color: "#6b5e4f",
		fontSize: "13px"
	},
	value: {
		fontWeight: "bold",
		fontSize: "14px"
	},
	sectionTitle: {
		fontSize: "13px",
		color: "#9e8e7e",
		borderBottom: "1px solid #f0ede8",
		paddingBottom: "6px",
		marginBottom: "8px",
		marginTop: "12px"
	},
	floorRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "6px 0",
		borderBottom: "1px solid #f8f6f2"
	},
	floorName: {
		fontSize: "13px",
		fontWeight: "bold",
		color: "#4a3c2a"
	},
	stars: {
		fontSize: "13px",
		color: "#c6923a"
	},
	noData: {
		textAlign: "center",
		padding: "20px 0",
		color: "#9e8e7e",
		fontSize: "14px"
	}
};
function StatRow({ label, value }) {
	return /* @__PURE__ */ React.createElement("div", { style: styles.row }, /* @__PURE__ */ React.createElement("span", { style: styles.label }, label), /* @__PURE__ */ React.createElement("span", { style: styles.value }, value));
}
function StarDisplay({ count, max }) {
	const filled = "★".repeat(count);
	const empty = "☆".repeat(max - count);
	return /* @__PURE__ */ React.createElement("span", { style: styles.stars }, filled, empty);
}
function GsContent({ data }) {
	const highFloors = data.floors.filter((f) => f.index >= 9);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatRow, {
		label: "最深抵达",
		value: data.max_floor
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "总星数",
		value: `${data.total_star}★`
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "战斗次数",
		value: `${data.total_win_times} / ${data.total_battle_times}`
	}), data.damage_rank.length > 0 && /* @__PURE__ */ React.createElement(StatRow, {
		label: "最强一击",
		value: data.damage_rank[0].value.toLocaleString()
	}), data.defeat_rank.length > 0 && /* @__PURE__ */ React.createElement(StatRow, {
		label: "最多击破",
		value: data.defeat_rank[0].value.toLocaleString()
	}), data.take_damage_rank.length > 0 && /* @__PURE__ */ React.createElement(StatRow, {
		label: "最多承伤",
		value: data.take_damage_rank[0].value.toLocaleString()
	}), highFloors.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "楼层详情"), highFloors.map((floor, fi) => /* @__PURE__ */ React.createElement("div", { key: fi }, /* @__PURE__ */ React.createElement("div", { style: styles.floorRow }, /* @__PURE__ */ React.createElement("span", { style: styles.floorName }, "第", floor.index, "层"), /* @__PURE__ */ React.createElement(StarDisplay, {
		count: floor.star,
		max: floor.max_star
	})), floor.levels.map((level, li) => /* @__PURE__ */ React.createElement("div", {
		key: li,
		style: {
			padding: "3px 0 3px 16px",
			fontSize: "12px",
			color: "#6b5e4f",
			display: "flex",
			justifyContent: "space-between"
		}
	}, /* @__PURE__ */ React.createElement("span", null, "第", level.index, "间"), /* @__PURE__ */ React.createElement(StarDisplay, {
		count: level.star,
		max: level.max_star
	})))))));
}
function SrContent({ data }) {
	if (!data.has_data) return /* @__PURE__ */ React.createElement("div", { style: styles.noData }, "本期暂无挑战数据");
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatRow, {
		label: "最深抵达",
		value: data.max_floor
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "总星数",
		value: `${data.total_stars}★`
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "战斗次数",
		value: data.total_battles
	}), data.all_floor_detail.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "楼层详情"), data.all_floor_detail.map((floor, fi) => /* @__PURE__ */ React.createElement("div", {
		key: fi,
		style: styles.floorRow
	}, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: styles.floorName }, floor.name), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "11px",
		color: "#9e8e7e"
	} }, floor.round_num, "轮")), /* @__PURE__ */ React.createElement(StarDisplay, {
		count: floor.star_num,
		max: 3
	})))));
}
const TITLES = {
	gs: {
		name: "原神 · 深境螺旋",
		icon: UI_ICONS.abyss
	},
	sr: {
		name: "星穹铁道 · 忘却之庭",
		icon: UI_ICONS.abyss
	}
};
function SpiralAbyssCard({ data }) {
	const info = TITLES[data.game];
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
		src: info.icon,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: theme.headerText
	} }, info.name)), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: theme.headerSub
	} }, "UID ", data.uid)), /* @__PURE__ */ React.createElement("div", { style: styles.body }, data.game === "gs" && /* @__PURE__ */ React.createElement(GsContent, { data }), data.game === "sr" && /* @__PURE__ */ React.createElement(SrContent, { data })), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { SpiralAbyssCard as default };