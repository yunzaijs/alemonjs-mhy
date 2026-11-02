import { UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate, getTheme } from "./shared.js";
import React from "react";

// src/img/views/LedgerCard.tsx
const formatBigNum = (num) => {
	if (num > 1e4) return `${(num / 1e4).toFixed(1)}w`;
	return String(num);
};
const BAR_COLORS = [
	"#c6923a",
	"#5c6bc0",
	"#e65100",
	"#2e7d32",
	"#ad1457",
	"#00838f",
	"#6d4c41",
	"#546e7a"
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
		fontSize: "15px"
	},
	sub: {
		fontSize: "12px",
		color: "#9e8e7e"
	},
	bigNum: {
		fontSize: "28px",
		fontWeight: "bold",
		color: "#c6923a",
		textAlign: "center",
		padding: "8px 0"
	},
	pullText: {
		fontSize: "13px",
		color: "#9e8e7e",
		textAlign: "center",
		marginTop: "-4px",
		marginBottom: "8px"
	},
	sectionTitle: {
		fontSize: "13px",
		color: "#9e8e7e",
		borderBottom: "1px solid #f0ede8",
		paddingBottom: "6px",
		marginBottom: "8px",
		marginTop: "12px"
	},
	barRow: { padding: "5px 0" },
	barLabel: {
		display: "flex",
		justifyContent: "space-between",
		fontSize: "12px",
		marginBottom: "3px"
	},
	barBg: {
		width: "100%",
		height: "8px",
		borderRadius: "4px",
		background: "#f0ede8"
	},
	rateUp: {
		color: "#2e7d32",
		fontSize: "12px"
	},
	rateDown: {
		color: "#c62828",
		fontSize: "12px"
	}
};
function StatRow({ label, value, sub }) {
	return /* @__PURE__ */ React.createElement("div", { style: styles.row }, /* @__PURE__ */ React.createElement("span", { style: styles.label }, label), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: styles.value }, value), sub && /* @__PURE__ */ React.createElement("div", { style: styles.sub }, sub)));
}
function SourceBar({ name, num, percent, color }) {
	return /* @__PURE__ */ React.createElement("div", { style: styles.barRow }, /* @__PURE__ */ React.createElement("div", { style: styles.barLabel }, /* @__PURE__ */ React.createElement("span", { style: { color: "#6b5e4f" } }, name), /* @__PURE__ */ React.createElement("span", { style: {
		color: "#1e1f20",
		fontWeight: "bold"
	} }, formatBigNum(num), " (", percent, "%)")), /* @__PURE__ */ React.createElement("div", { style: styles.barBg }, /* @__PURE__ */ React.createElement("div", { style: {
		width: `${percent}%`,
		height: "8px",
		borderRadius: "4px",
		background: color
	} })));
}
function RateText({ rate }) {
	if (rate > 0) return /* @__PURE__ */ React.createElement("span", { style: styles.rateUp }, "↑", rate, "%");
	if (rate < 0) return /* @__PURE__ */ React.createElement("span", { style: styles.rateDown }, "↓", Math.abs(rate), "%");
	return /* @__PURE__ */ React.createElement("span", { style: styles.sub }, "持平");
}
function GsContent({ data }) {
	const m = data.month_data;
	const d = data.day_data;
	const pulls = Math.floor(m.current_primogems / 160);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.bigNum }, formatBigNum(m.current_primogems)), /* @__PURE__ */ React.createElement("div", { style: styles.pullText }, "本月原石 ≈ ", pulls, " 抽"), /* @__PURE__ */ React.createElement(StatRow, {
		label: "本月摩拉",
		value: formatBigNum(m.current_mora)
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "今日原石",
		value: formatBigNum(d.current_primogems)
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "今日摩拉",
		value: formatBigNum(d.current_mora)
	}), /* @__PURE__ */ React.createElement("div", { style: styles.row }, /* @__PURE__ */ React.createElement("span", { style: styles.label }, "上月原石 ", formatBigNum(m.last_primogems)), /* @__PURE__ */ React.createElement(RateText, { rate: m.primogem_rate })), /* @__PURE__ */ React.createElement("div", { style: styles.row }, /* @__PURE__ */ React.createElement("span", { style: styles.label }, "上月摩拉 ", formatBigNum(m.last_mora)), /* @__PURE__ */ React.createElement(RateText, { rate: m.mora_rate })), m.group_by && m.group_by.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "来源分布"), m.group_by.map((g, i) => /* @__PURE__ */ React.createElement(SourceBar, {
		key: i,
		name: g.action_name,
		num: g.num,
		percent: g.percent,
		color: BAR_COLORS[i % BAR_COLORS.length]
	}))));
}
function SrContent({ data }) {
	const m = data.month_data;
	const d = data.day_data;
	const pulls = Math.floor(m.current_hcoin / 160);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.bigNum }, formatBigNum(m.current_hcoin)), /* @__PURE__ */ React.createElement("div", { style: styles.pullText }, "本月星琼 ≈ ", pulls, " 抽"), /* @__PURE__ */ React.createElement(StatRow, {
		label: "本月通票",
		value: formatBigNum(m.current_rails_pass)
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "今日星琼",
		value: formatBigNum(d.current_hcoin)
	}), /* @__PURE__ */ React.createElement(StatRow, {
		label: "今日通票",
		value: formatBigNum(d.current_rails_pass)
	}), /* @__PURE__ */ React.createElement("div", { style: styles.row }, /* @__PURE__ */ React.createElement("span", { style: styles.label }, "上月星琼 ", formatBigNum(m.last_hcoin)), /* @__PURE__ */ React.createElement(RateText, { rate: m.hcoin_rate })), /* @__PURE__ */ React.createElement("div", { style: styles.row }, /* @__PURE__ */ React.createElement("span", { style: styles.label }, "上月通票 ", formatBigNum(m.last_rails_pass)), /* @__PURE__ */ React.createElement(RateText, { rate: m.rails_rate })), m.group_by && m.group_by.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.sectionTitle }, "来源分布"), m.group_by.map((g, i) => {
		const name = g.action_name.length > 4 ? g.action_name.slice(0, 4) : g.action_name;
		return /* @__PURE__ */ React.createElement(SourceBar, {
			key: i,
			name,
			num: g.num,
			percent: g.percent,
			color: BAR_COLORS[i % BAR_COLORS.length]
		});
	})));
}
const TITLES = {
	gs: {
		name: "原神 · 札记",
		icon: UI_ICONS.ledger
	},
	sr: {
		name: "星穹铁道 · 开拓月历",
		icon: UI_ICONS.ledger
	}
};
function LedgerCard({ data }) {
	const info = TITLES[data.game];
	const month = data.game === "gs" ? `${data.data_month}月` : data.data_month;
	const theme = getTheme(data.game);
	const dateStr = formatDate();
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "500px" } }, /* @__PURE__ */ React.createElement("div", { style: styles.card }, /* @__PURE__ */ React.createElement("div", { style: {
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
	}), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: theme.headerText
	} }, info.name), /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "12px",
		color: theme.headerSub
	} }, month))), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: theme.headerSub
	} }, "UID ", data.uid)), /* @__PURE__ */ React.createElement("div", { style: styles.body }, data.game === "gs" && /* @__PURE__ */ React.createElement(GsContent, { data }), data.game === "sr" && /* @__PURE__ */ React.createElement(SrContent, { data })), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { LedgerCard as default };