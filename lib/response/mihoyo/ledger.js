import { formatLedgerMonth, resolveLedgerMonth } from "../../model/mihoyo/ledger.js";
import LedgerCard from "../../img/views/LedgerCard.js";
import { queryMihoyoApi } from "../../model/mihoyo/query.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/ledger.ts
/**
* 札记 / 原石统计 / 星琼统计
* 命令: #札记 / #原石 / #星琼 / #原石6月
*/
const GAME_NAMES = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
const resolveGame = (text) => {
	if (text.includes("星铁") || text.includes("星琼")) return "sr";
	return "gs";
};
const MONTH_CN = {
	一: 1,
	二: 2,
	三: 3,
	四: 4,
	五: 5,
	六: 6,
	七: 7,
	八: 8,
	九: 9,
	十: 10,
	十一: 11,
	十二: 12
};
const parseMonth = (text) => {
	const cleaned = text.replace(/[#!！/＃]|原神|星铁|原石|星琼|札记/g, "").trim();
	if (!cleaned) return (/* @__PURE__ */ new Date()).getMonth() + 1;
	const monthStr = cleaned.replace(/月$/, "");
	const num = Number(monthStr);
	if (!isNaN(num) && num >= 1 && num <= 12) return num;
	if (MONTH_CN[monthStr] !== void 0) return MONTH_CN[monthStr];
	return (/* @__PURE__ */ new Date()).getMonth() + 1;
};
var ledger_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const text = e.MessageText ?? "";
	const game = resolveGame(text);
	if (game === "zzz") {
		const md = Format.createMarkdown();
		md.addText("绝区零暂不支持札记查询");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const month = parseMonth(text);
	const period = resolveLedgerMonth(month);
	if (!period) {
		const md = Format.createMarkdown();
		md.addText("札记仅支持查询最近三个月的数据");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const queryMonth = formatLedgerMonth(period, game);
	const result = await queryMihoyoApi({
		userId,
		game,
		api: "ys_ledger",
		query: { month: queryMonth },
		cached: false
	});
	const format = Format.create();
	if (!result.success) {
		const md = Format.createMarkdown();
		md.addText(`[${GAME_NAMES[game]}札记] ${result.message}`);
		format.addMarkdown(md);
	} else {
		const cardData = {
			...result.data,
			game,
			uid: result.uid ?? ""
		};
		const img = await renderComponentIsHtmlToBuffer(LedgerCard, { data: cardData });
		format.addImage(img);
	}
	message.send({ format });
};

export { ledger_default as default };