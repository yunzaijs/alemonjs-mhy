import SpiralAbyssCard from "../../img/views/SpiralAbyssCard.js";
import { queryMihoyoApi } from "../../model/mihoyo/query.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/spiralAbyss.ts
/**
* 深渊 / 忘却之庭 / 虚构叙事查询
* 命令: #深渊 / #上期深渊 / #星铁深渊 / #忘却之庭
*/
const ABYSS_NAMES = {
	gs: "深境螺旋",
	sr: "忘却之庭",
	zzz: "式舆防卫战"
};
const resolveGame = (text) => {
	if (text.includes("星铁") || text.includes("忘却之庭") || text.includes("虚构叙事")) return "sr";
	return "gs";
};
var spiralAbyss_default = async (e) => {
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
		md.addText("绝区零暂不支持深渊查询");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const scheduleType = /上期|往期/.test(text) ? 2 : 1;
	const result = await queryMihoyoApi({
		userId,
		game,
		api: "spiralAbyss",
		query: { schedule_type: scheduleType }
	});
	const format = Format.create();
	if (!result.success) {
		const md = Format.createMarkdown();
		md.addText(`[${ABYSS_NAMES[game]}] ${result.message}`);
		format.addMarkdown(md);
	} else {
		const cardData = {
			...result.data,
			game,
			uid: result.uid ?? ""
		};
		const img = await renderComponentIsHtmlToBuffer(SpiralAbyssCard, { data: cardData });
		format.addImage(img);
	}
	message.send({ format });
};

export { spiralAbyss_default as default };