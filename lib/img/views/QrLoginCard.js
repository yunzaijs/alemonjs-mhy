import HTML from "./HTML.js";
import React from "react";

// src/img/views/QrLoginCard.tsx
const STATUS_CONFIG = {
	waiting: {
		label: "等待扫码",
		color: "#8b6d3f",
		bg: "#fdf6e3",
		icon: "📱"
	},
	scanned: {
		label: "已扫码 · 请在手机上确认",
		color: "#2d7d46",
		bg: "#e8f5e9",
		icon: "✅"
	},
	confirmed: {
		label: "登录成功",
		color: "#1565c0",
		bg: "#e3f2fd",
		icon: "🎉"
	},
	expired: {
		label: "二维码已过期",
		color: "#c62828",
		bg: "#fce4ec",
		icon: "⏰"
	},
	error: {
		label: "获取失败",
		color: "#c62828",
		bg: "#fce4ec",
		icon: "❌"
	}
};
function QrLoginCard({ data }) {
	const { qrDataUrl, status, uidLines } = data;
	const cfg = STATUS_CONFIG[status];
	return /* @__PURE__ */ React.createElement(HTML, { style: { width: "380px" } }, /* @__PURE__ */ React.createElement("div", { style: {
		padding: "20px",
		background: "linear-gradient(180deg, #f0ebe3 0%, #f5f6fb 40%)",
		fontFamily: "\"tttgbnumber\", system-ui, sans-serif",
		fontSize: "16px",
		color: "#1e1f20"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		background: "linear-gradient(135deg, #e8d5b0, #d3bc8e)",
		borderRadius: "12px 12px 0 0",
		padding: "16px 24px",
		display: "flex",
		alignItems: "center",
		gap: "10px",
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
	} }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "28px" } }, "🔐"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column"
	} }, /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "20px",
		fontWeight: "bold",
		color: "#4a3a20"
	} }, "米游社 · 扫码登录"), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "12px",
		color: "#6b5838",
		marginTop: "2px"
	} }, "Cookie & Stoken 一键绑定"))), /* @__PURE__ */ React.createElement("div", { style: {
		background: "#fff",
		borderRadius: "0 0 12px 12px",
		padding: "24px",
		boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "16px"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		background: "#fff",
		border: "3px solid #e8d5b0",
		borderRadius: "16px",
		padding: "12px",
		boxShadow: "0 2px 12px rgba(211,188,142,0.25)",
		position: "relative"
	} }, /* @__PURE__ */ React.createElement("img", {
		src: qrDataUrl,
		style: {
			width: "220px",
			height: "220px",
			borderRadius: "8px",
			display: "block",
			opacity: status === "expired" || status === "error" ? .3 : 1
		}
	}), (status === "expired" || status === "error") && /* @__PURE__ */ React.createElement("div", { style: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		background: "rgba(0,0,0,0.6)",
		color: "#fff",
		padding: "8px 16px",
		borderRadius: "8px",
		fontSize: "16px",
		fontWeight: "bold",
		whiteSpace: "nowrap"
	} }, status === "expired" ? "已过期" : "获取失败")), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		background: cfg.bg,
		padding: "10px 20px",
		borderRadius: "24px",
		border: `1px solid ${cfg.color}20`
	} }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "18px" } }, cfg.icon), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "15px",
		fontWeight: "bold",
		color: cfg.color
	} }, cfg.label)), (status === "waiting" || status === "scanned") && /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexDirection: "column",
		gap: "10px",
		width: "100%",
		padding: "0 8px"
	} }, [
		{
			step: "1",
			text: "打开 米游社App",
			highlight: "米游社App"
		},
		{
			step: "2",
			text: "点击右下角 我的",
			highlight: "我的"
		},
		{
			step: "3",
			text: "点击左上角 扫一扫",
			highlight: "扫一扫"
		},
		{
			step: "4",
			text: "扫描上方二维码并确认登录",
			highlight: "确认登录"
		}
	].map((item, idx) => /* @__PURE__ */ React.createElement("div", {
		key: idx,
		style: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			background: "#faf8f4",
			padding: "10px 14px",
			borderRadius: "10px"
		}
	}, /* @__PURE__ */ React.createElement("div", { style: {
		width: "24px",
		height: "24px",
		borderRadius: "50%",
		background: "linear-gradient(135deg, #d3bc8e, #c4a870)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "13px",
		fontWeight: "bold",
		color: "#fff",
		flexShrink: 0
	} }, item.step), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "14px",
		color: "#4a3a20"
	} }, item.text)))), status === "confirmed" && uidLines && uidLines.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
		width: "100%",
		background: "#f0f7ff",
		borderRadius: "12px",
		padding: "14px 18px",
		border: "1px solid #bbdefb"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "14px",
		fontWeight: "bold",
		color: "#1565c0",
		marginBottom: "8px"
	} }, "已绑定角色"), uidLines.map((line, idx) => /* @__PURE__ */ React.createElement("div", {
		key: idx,
		style: {
			fontSize: "13px",
			color: "#37474f",
			padding: "4px 0",
			borderBottom: idx < uidLines.length - 1 ? "1px dashed #e0e0e0" : "none"
		}
	}, line))), status === "confirmed" && /* @__PURE__ */ React.createElement("div", { style: {
		width: "100%",
		background: "#faf8f4",
		borderRadius: "12px",
		padding: "14px 18px",
		border: "1px solid #e8d5b0"
	} }, /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "13px",
		fontWeight: "bold",
		color: "#8b6d3f",
		marginBottom: "6px"
	} }, "可用指令"), /* @__PURE__ */ React.createElement("div", { style: {
		display: "flex",
		flexWrap: "wrap",
		gap: "6px"
	} }, [
		"#原神签到",
		"#星铁签到",
		"#米游社签到",
		"#体力",
		"#深渊",
		"#我的stoken"
	].map((cmd, idx) => /* @__PURE__ */ React.createElement("span", {
		key: idx,
		style: {
			background: "#e8d5b0",
			color: "#4a3a20",
			padding: "4px 10px",
			borderRadius: "6px",
			fontSize: "12px",
			fontWeight: "bold"
		}
	}, cmd)))), status === "expired" && /* @__PURE__ */ React.createElement("div", { style: {
		fontSize: "13px",
		color: "#877254",
		textAlign: "center"
	} }, "请重新发送 ", /* @__PURE__ */ React.createElement("span", { style: {
		fontWeight: "bold",
		color: "#8b6d3f"
	} }, "#扫码登录"), " 获取新的二维码")), /* @__PURE__ */ React.createElement("div", { style: {
		marginTop: "12px",
		padding: "10px 16px",
		background: "rgba(255,255,255,0.7)",
		borderRadius: "10px",
		fontSize: "11px",
		color: "#b0a18a",
		lineHeight: "1.6",
		textAlign: "center"
	} }, "⚠️ 仅用于米游社查询及游戏服务 · 开发者不会保存登录状态", /* @__PURE__ */ React.createElement("br", null), "账号安全问题与开发者无关 · Powered by alemonjs")));
}

export { QrLoginCard as default };