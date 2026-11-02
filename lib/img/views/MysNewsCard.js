import { UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate } from "./shared.js";
import React from "react";

// src/img/views/MysNewsCard.tsx
const GAME_COLORS = {
	原神: "#8b6d3f",
	星穹铁道: "#5c6bc0",
	绝区零: "#e65100"
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
	listRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
		padding: "8px 0",
		borderBottom: "1px solid #f0ede8",
		gap: "12px"
	},
	index: {
		fontSize: "13px",
		fontWeight: "bold",
		color: "#c6923a",
		flexShrink: 0,
		width: "20px"
	},
	subject: {
		fontSize: "13px",
		color: "#1e1f20",
		flex: 1,
		lineHeight: "1.4"
	},
	date: {
		fontSize: "11px",
		color: "#9e8e7e",
		flexShrink: 0
	},
	detailTitle: {
		fontSize: "15px",
		fontWeight: "bold",
		color: "#4a3c2a",
		lineHeight: "1.5",
		paddingBottom: "8px",
		borderBottom: "1px solid #f0ede8",
		marginBottom: "10px"
	},
	detailDate: {
		fontSize: "12px",
		color: "#9e8e7e",
		marginBottom: "12px"
	},
	detailContent: {
		fontSize: "13px",
		color: "#3a3a3a",
		lineHeight: "1.8",
		whiteSpace: "pre-wrap",
		wordBreak: "break-all"
	},
	hint: {
		fontSize: "12px",
		color: "#9e8e7e",
		textAlign: "center",
		padding: "8px 0 0"
	},
	noData: {
		textAlign: "center",
		padding: "20px 0",
		color: "#9e8e7e",
		fontSize: "14px"
	}
};
function ListContent({ data }) {
	if (data.items.length === 0) return /* @__PURE__ */ React.createElement("div", { style: styles.noData }, "暂无", data.typeName, "数据");
	return /* @__PURE__ */ React.createElement(React.Fragment, null, data.items.map((item, i) => /* @__PURE__ */ React.createElement("div", {
		key: i,
		style: styles.listRow
	}, /* @__PURE__ */ React.createElement("span", { style: styles.index }, i + 1), /* @__PURE__ */ React.createElement("span", { style: styles.subject }, item.subject), /* @__PURE__ */ React.createElement("span", { style: styles.date }, item.date))), /* @__PURE__ */ React.createElement("div", { style: styles.hint }, "发送 #", data.typeName, "+序号 查看详情"));
}
function DetailContent({ data }) {
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.detailTitle }, data.subject), /* @__PURE__ */ React.createElement("div", { style: styles.detailDate }, "发布时间: ", data.date), /* @__PURE__ */ React.createElement("div", { style: styles.detailContent }, data.content));
}
function MysNewsCard({ data }) {
	const accent = GAME_COLORS[data.game] ?? "#8b6d3f";
	const title = `${data.game} · ${data.typeName}${data.mode === "list" ? "列表" : ""}`;
	const dateStr = formatDate();
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "500px" } }, /* @__PURE__ */ React.createElement("div", { style: styles.card }, /* @__PURE__ */ React.createElement("div", { style: styles.header }, /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: UI_ICONS.miyoushe,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: accent
	} }, title))), /* @__PURE__ */ React.createElement("div", { style: styles.body }, data.mode === "list" && /* @__PURE__ */ React.createElement(ListContent, { data }), data.mode === "detail" && /* @__PURE__ */ React.createElement(DetailContent, { data })), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { MysNewsCard as default };