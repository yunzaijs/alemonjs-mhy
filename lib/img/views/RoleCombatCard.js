import { UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate } from "./shared.js";
import React from "react";

// src/img/views/RoleCombatCard.tsx
const RARITY_COLORS = {
	5: "#c6923a",
	4: "#a256e1",
	3: "#5180cb"
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
	roundBox: {
		padding: "8px 0",
		borderBottom: "1px solid #f8f6f2"
	},
	roundHeader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "4px"
	},
	roundTitle: {
		fontSize: "14px",
		fontWeight: "bold",
		color: "#4a3c2a"
	},
	medal: {
		fontSize: "14px",
		color: "#c6923a"
	},
	avatarList: {
		display: "flex",
		flexWrap: "wrap",
		gap: "4px"
	},
	avatarTag: {
		fontSize: "12px",
		padding: "2px 8px",
		borderRadius: "4px",
		background: "#f8f6f2"
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
function RoleCombatCard({ data }) {
	const dateStr = formatDate();
	const noData = !data.has_data || data.data.length === 0;
	const noDetail = data.has_data && !data.has_detail_data;
	let schedule;
	let stat;
	let detail;
	if (!noData) {
		schedule = data.data[0].schedule;
		stat = data.data[0].stat;
		detail = data.data[0].detail;
	}
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "600px" } }, /* @__PURE__ */ React.createElement("div", { style: styles.card }, /* @__PURE__ */ React.createElement("div", { style: styles.header }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: UI_ICONS.team,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: "#4a3c2a"
	} }, "幻想真境剧诗")), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: "#7a6b57"
	} }, "UID ", data.uid)), /* @__PURE__ */ React.createElement("div", { style: styles.body }, noData ? /* @__PURE__ */ React.createElement("div", { style: styles.noData }, "本期暂无挑战数据") : noDetail ? /* @__PURE__ */ React.createElement("div", { style: styles.noData }, "数据还没更新，请稍后再试") : /* @__PURE__ */ React.createElement(React.Fragment, null, schedule && /* @__PURE__ */ React.createElement(StatRow, {
		label: "周期",
		value: `${schedule.start_date_time.month}/${schedule.start_date_time.day} ~ ${schedule.end_date_time.month}/${schedule.end_date_time.day}`
	}), stat && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(StatRow, {
		label: "最深幕数",
		value: `第${stat.max_round_id}幕`
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "异端值",
		value: stat.heresy_count
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "获取金币",
		value: stat.coin_num
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "助战次数",
		value: `${stat.rent_cnt}次`
	})), detail && detail.rounds_data.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "各幕阵容"), detail.rounds_data.map((round, ri) => /* @__PURE__ */ React.createElement("div", {
		key: ri,
		style: styles.roundBox
	}, /* @__PURE__ */ React.createElement("div", { style: styles.roundHeader }, /* @__PURE__ */ React.createElement("span", { style: styles.roundTitle }, "第", round.round_id, "幕"), round.is_get_medal && /* @__PURE__ */ React.createElement("span", { style: styles.medal }, "✦ 勋章")), /* @__PURE__ */ React.createElement("div", { style: styles.avatarList }, round.avatars.map((a, ai) => /* @__PURE__ */ React.createElement("span", {
		key: ai,
		style: {
			...styles.avatarTag,
			color: RARITY_COLORS[a.rarity] ?? "#1e1f20"
		}
	}, a.name, " Lv.", a.level)))))), detail && detail.backup_avatars.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "候选角色"), /* @__PURE__ */ React.createElement("div", { style: styles.avatarList }, detail.backup_avatars.map((a, ai) => /* @__PURE__ */ React.createElement("span", {
		key: ai,
		style: {
			...styles.avatarTag,
			color: RARITY_COLORS[a.rarity] ?? "#1e1f20"
		}
	}, a.name, " Lv.", a.level)))))), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { RoleCombatCard as default };