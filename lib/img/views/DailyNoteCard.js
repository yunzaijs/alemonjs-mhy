import { BG_IMAGES, UI_ICONS } from "../../assets/img/index.js";
import HTML from "./HTML.js";
import { formatDate, getTheme } from "./shared.js";
import React from "react";

// src/img/views/DailyNoteCard.tsx
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const PERCENT_100 = 100;
const formatTime = (seconds) => {
	if (seconds <= 0) return "已满";
	if (seconds >= SECONDS_PER_DAY) return `${Math.floor(seconds / SECONDS_PER_DAY)}天${Math.floor(seconds % SECONDS_PER_DAY / SECONDS_PER_HOUR)}小时`;
	const h = Math.floor(seconds / SECONDS_PER_HOUR);
	const m = Math.floor(seconds % SECONDS_PER_HOUR / SECONDS_PER_MINUTE);
	return h > 0 ? `${h}小时${m}分` : `${m}分钟`;
};
const formatRecoverAt = (seconds) => {
	if (seconds <= 0) return "";
	const target = new Date(Date.now() + seconds * 1e3);
	const now = /* @__PURE__ */ new Date();
	return `${target.getDate() === now.getDate() ? "今天" : "明天"} ${String(target.getHours()).padStart(2, "0")}:${String(target.getMinutes()).padStart(2, "0")}`;
};
const percent = (cur, max) => max > 0 ? cur / max * PERCENT_100 : 0;
const GAME_LABELS = {
	gs: {
		name: "原神",
		color: "#8b6d3f",
		icon: BG_IMAGES.genshinLogo
	},
	sr: {
		name: "星穹铁道",
		color: "#5c6bc0",
		icon: UI_ICONS.role
	},
	zzz: {
		name: "绝区零",
		color: "#e65100",
		icon: UI_ICONS.role
	}
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
		padding: "10px 0",
		borderBottom: "1px solid #f0ede8"
	},
	rowLast: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "10px 0"
	},
	label: {
		display: "flex",
		alignItems: "center",
		gap: "8px",
		color: "#6b5e4f",
		fontSize: "14px"
	},
	value: {
		fontWeight: "bold",
		fontSize: "16px",
		color: "#1e1f20"
	},
	valueFull: {
		fontWeight: "bold",
		fontSize: "16px",
		color: "#c62828"
	},
	sub: {
		fontSize: "12px",
		color: "#9e8e7e",
		marginTop: "2px"
	},
	progressBg: {
		width: "100%",
		height: "8px",
		borderRadius: "4px",
		background: "#f0ede8",
		marginTop: "8px"
	}
};
function ProgressBar({ value, max, color }) {
	const pct = percent(value, max);
	return /* @__PURE__ */ React.createElement("div", { style: styles.progressBg }, /* @__PURE__ */ React.createElement("div", { style: {
		width: `${pct}%`,
		height: "8px",
		borderRadius: "4px",
		background: `linear-gradient(90deg, ${color}, ${color}cc)`
	} }));
}
function Row({ icon, label, value, sub, isFull, isLast }) {
	const isUrl = icon.startsWith("/") || icon.startsWith("http");
	return /* @__PURE__ */ React.createElement("div", { style: isLast ? styles.rowLast : styles.row }, /* @__PURE__ */ React.createElement("div", { style: styles.label }, isUrl ? /* @__PURE__ */ React.createElement("img", {
		src: icon,
		style: {
			width: "20px",
			height: "20px"
		}
	}) : /* @__PURE__ */ React.createElement("span", null, icon), /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: isFull ? styles.valueFull : styles.value }, value), sub && /* @__PURE__ */ React.createElement("div", { style: styles.sub }, sub)));
}
function GsCard({ data }) {
	const resinSec = Number(data.resin_recovery_time);
	const coinSec = Number(data.home_coin_recovery_time);
	const resinFull = data.current_resin >= data.max_resin;
	const coinFull = data.current_home_coin >= data.max_home_coin;
	const expDone = data.expeditions.filter((e) => Number(e.remained_time) <= 0).length;
	const expTotal = data.expeditions.length;
	let transformerText = "";
	if (data.transformer) {
		if (!data.transformer.obtained) transformerText = "尚未获得";
		else if (data.transformer.recovery_time.reached) transformerText = "可使用";
		else {
			const t = data.transformer.recovery_time;
			const parts = [];
			if (t.Day > 0) parts.push(`${t.Day}天`);
			if (t.Hour > 0) parts.push(`${t.Hour}时`);
			if (t.Minute > 0) parts.push(`${t.Minute}分`);
			transformerText = parts.join("") || "冷却中";
		}
	}
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
		icon: UI_ICONS.resin,
		label: "原粹树脂",
		value: `${data.current_resin} / ${data.max_resin}`,
		sub: resinFull ? "已满" : `${formatTime(resinSec)} · ${formatRecoverAt(resinSec)}`,
		isFull: resinFull
	}), /* @__PURE__ */ React.createElement(ProgressBar, {
		value: data.current_resin,
		max: data.max_resin,
		color: "#8b6d3f"
	}), /* @__PURE__ */ React.createElement("div", { style: { height: "8px" } }), /* @__PURE__ */ React.createElement(Row, {
		icon: UI_ICONS.checkin,
		label: "每日委托",
		value: `${data.finished_task_num} / ${data.total_task_num}`,
		isFull: data.finished_task_num >= data.total_task_num
	}), /* @__PURE__ */ React.createElement(Row, {
		icon: UI_ICONS.primogem,
		label: "洞天宝钱",
		value: `${data.current_home_coin} / ${data.max_home_coin}`,
		sub: coinFull ? "已满" : formatTime(coinSec),
		isFull: coinFull
	}), /* @__PURE__ */ React.createElement(Row, {
		icon: "🧭",
		label: "探索派遣",
		value: `${expDone} / ${expTotal} 完成`,
		sub: expDone < expTotal ? "进行中" : "全部完成",
		isFull: expDone >= expTotal
	}), data.transformer && /* @__PURE__ */ React.createElement(Row, {
		icon: "🔮",
		label: "参量质变仪",
		value: transformerText,
		isFull: data.transformer.recovery_time?.reached,
		isLast: true
	}));
}
function SrCard({ data }) {
	const staminaFull = data.current_stamina >= data.max_stamina;
	const expDone = data.expeditions.filter((e) => e.remaining_time <= 0).length;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
		icon: "⚡",
		label: "开拓力",
		value: `${data.current_stamina} / ${data.max_stamina}`,
		sub: staminaFull ? "已满" : `${formatTime(data.stamina_recover_time)} · ${formatRecoverAt(data.stamina_recover_time)}`,
		isFull: staminaFull
	}), /* @__PURE__ */ React.createElement(ProgressBar, {
		value: data.current_stamina,
		max: data.max_stamina,
		color: "#5c6bc0"
	}), /* @__PURE__ */ React.createElement("div", { style: { height: "8px" } }), /* @__PURE__ */ React.createElement(Row, {
		icon: "🔋",
		label: "后备开拓力",
		value: `${data.current_reserve_stamina}`
	}), /* @__PURE__ */ React.createElement(Row, {
		icon: "📋",
		label: "每日实训",
		value: `${data.current_train_score} / ${data.max_train_score}`,
		isFull: data.current_train_score >= data.max_train_score
	}), /* @__PURE__ */ React.createElement(Row, {
		icon: "🧭",
		label: "委托派遣",
		value: `${expDone} / ${data.expeditions.length} 完成`,
		sub: expDone < data.expeditions.length ? "进行中" : "全部完成",
		isLast: true
	}));
}
function ZzzCard({ data }) {
	const cur = data.energy.progress.current;
	const max = data.energy.progress.max;
	const full = cur >= max;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, {
		icon: "🔋",
		label: "电量",
		value: `${cur} / ${max}`,
		sub: full ? "已满" : `${formatTime(data.energy.restore)} · ${formatRecoverAt(data.energy.restore)}`,
		isFull: full
	}), /* @__PURE__ */ React.createElement(ProgressBar, {
		value: cur,
		max,
		color: "#e65100"
	}), /* @__PURE__ */ React.createElement("div", { style: { height: "8px" } }), /* @__PURE__ */ React.createElement(Row, {
		icon: "🔥",
		label: "活跃度",
		value: `${data.vitality.current} / ${data.vitality.max}`,
		isFull: data.vitality.current >= data.vitality.max,
		isLast: true
	}));
}
function DailyNoteCard({ data }) {
	const gameInfo = GAME_LABELS[data.game];
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
		src: gameInfo.icon,
		style: {
			width: "24px",
			height: "24px"
		}
	}), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "18px",
		fontWeight: "bold",
		color: theme.headerText
	} }, gameInfo.name, " · 实时便笺")), /* @__PURE__ */ React.createElement("span", { style: {
		fontSize: "13px",
		color: theme.headerSub
	} }, "UID ", data.uid)), /* @__PURE__ */ React.createElement("div", { style: styles.body }, data.game === "gs" && /* @__PURE__ */ React.createElement(GsCard, { data }), data.game === "sr" && /* @__PURE__ */ React.createElement(SrCard, { data }), data.game === "zzz" && /* @__PURE__ */ React.createElement(ZzzCard, { data })), /* @__PURE__ */ React.createElement("div", { style: {
		textAlign: "right",
		padding: "8px 4px 0",
		fontSize: "11px",
		color: "#b0a89c"
	} }, dateStr)));
}

export { DailyNoteCard as default };