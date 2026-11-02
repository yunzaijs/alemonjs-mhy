import HTML from "./HTML.js";
import React from "react";

// src/img/views/CkHelpCard.tsx
const STEPS = [
	{
		num: 1,
		text: "使用浏览器打开 miyoushe.com"
	},
	{
		num: 2,
		text: "登录你的米游社账号"
	},
	{
		num: 3,
		text: "按 F12 打开开发者工具"
	},
	{
		num: 4,
		text: "切换到 Console (控制台) 标签"
	},
	{
		num: 5,
		text: "输入 document.cookie 并回车",
		highlight: true
	},
	{
		num: 6,
		text: "复制输出的全部内容"
	}
];
const COMMANDS = [
	{
		cmd: "#绑定ck <Cookie>",
		desc: "绑定Cookie (请私聊发送)"
	},
	{
		cmd: "#我的ck",
		desc: "查看Cookie绑定状态"
	},
	{
		cmd: "#删除ck",
		desc: "删除已绑定的Cookie"
	},
	{
		cmd: "#检查ck",
		desc: "验证Cookie是否有效"
	},
	{
		cmd: "#绑定uid <UID>",
		desc: "手动绑定游戏UID"
	},
	{
		cmd: "#我的uid",
		desc: "查看已绑定的UID列表"
	},
	{
		cmd: "#扫码登录",
		desc: "扫码一键绑定Cookie+Stoken"
	}
];
const WARNINGS = [
	"请在私聊中发送Cookie，避免泄露",
	"Cookie有效期约30天，过期需重新获取",
	"切勿将Cookie分享给他人",
	"退出米游社登录后Cookie将失效"
];
function CkHelpCard() {
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "500px" } }, /* @__PURE__ */ React.createElement("div", { style: {
		padding: "20px",
		background: "linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)",
		fontFamily: "\"tttgbnumber\", system-ui, sans-serif",
		fontSize: "16px",
		color: "#1e1f20",
		textAlign: "left"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		background: "linear-gradient(135deg, #e8d5b0, #d3bc8e)",
		borderRadius: "12px 12px 0 0",
		padding: "16px 24px",
		display: "flex",
		alignItems: "center",
		gap: "10px",
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
	} }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "28px" } }, "🍪"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "20px",
		fontWeight: "bold",
		color: "#4a3a20"
	} }, "Cookie 绑定教程"), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "12px",
		color: "#6b5838",
		marginTop: "2px"
	} }, "获取并绑定米游社Cookie"))), /* @__PURE__ */ React.createElement("div", { style: {
		background: "#fff",
		borderRadius: "0 0 12px 12px",
		padding: "24px",
		boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
		display: "flex",
		flexDirection: "column",
		gap: "20px"
	} }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "15px",
		fontWeight: "bold",
		color: "#4a3a20",
		marginBottom: "12px",
		display: "flex",
		alignItems: "center",
		gap: "6px"
	} }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "16px" } }, "📖"), "获取Cookie步骤"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		gap: "8px"
	} }, STEPS.map((step) => /* @__PURE__ */ React.createElement("div", {
		key: step.num,
		style: {
			display: "flex",
			alignItems: "center",
			gap: "10px",
			padding: "8px 12px",
			background: step.highlight ? "#fdf6e3" : "#fafafa",
			borderRadius: "8px",
			border: step.highlight ? "1px solid #e8d5b0" : "1px solid #f0f0f0"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		width: "24px",
		height: "24px",
		borderRadius: "50%",
		background: step.highlight ? "linear-gradient(135deg, #e8d5b0, #d3bc8e)" : "#e8e8e8",
		color: step.highlight ? "#4a3a20" : "#666",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "12px",
		fontWeight: "bold",
		flexShrink: 0
	} }, step.num), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: step.highlight ? "#4a3a20" : "#444",
		fontWeight: step.highlight ? "bold" : "normal"
	} }, step.text))))), /* @__PURE__ */ React.createElement("div", { style: {
		height: "1px",
		background: "#f0ebe3"
	} }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "15px",
		fontWeight: "bold",
		color: "#4a3a20",
		marginBottom: "12px",
		display: "flex",
		alignItems: "center",
		gap: "6px"
	} }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "16px" } }, "⌨️"), "相关命令"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		gap: "6px"
	} }, COMMANDS.map((item) => /* @__PURE__ */ React.createElement("div", {
		key: item.cmd,
		style: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			padding: "6px 12px",
			background: "#fafafa",
			borderRadius: "6px"
		}
	}, /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		fontWeight: "bold",
		color: "#8b6d3f",
		minWidth: "170px"
	} }, item.cmd), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "12px",
		color: "#888"
	} }, item.desc))))), /* @__PURE__ */ React.createElement("div", { style: {
		height: "1px",
		background: "#f0ebe3"
	} }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "15px",
		fontWeight: "bold",
		color: "#c62828",
		marginBottom: "10px",
		display: "flex",
		alignItems: "center",
		gap: "6px"
	} }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "16px" } }, "⚠️"), "注意事项"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		gap: "6px"
	} }, WARNINGS.map((w) => /* @__PURE__ */ React.createElement("div", {
		key: w,
		style: {
			display: "flex",
			alignItems: "flex-start",
			gap: "8px",
			padding: "6px 12px",
			background: "#fff5f5",
			borderRadius: "6px",
			border: "1px solid #fce4ec"
		}
	}, /* @__PURE__ */ React.createElement("span", { style: {
		color: "#c62828",
		fontSize: "12px",
		marginTop: "1px"
	} }, "•"), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "12px",
		color: "#c62828"
	} }, w))))))));
}

export { CkHelpCard as default };