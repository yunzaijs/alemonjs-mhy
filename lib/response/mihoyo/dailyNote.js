import DailyNoteCard from "../../img/views/DailyNoteCard.js";
import { queryMihoyoApi } from "../../model/mihoyo/query.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/dailyNote.ts
/**
* 体力查询
* 命令: #体力 / #原神体力 / #星铁体力 / #绝区零体力 / #树脂 / #查询体力
*/
const GAME_NAMES = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
const resolveGame = (text) => {
	if (text.includes("星铁")) return "sr";
	if (text.includes("绝区零")) return "zzz";
	return "gs";
};
var dailyNote_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const text = e.MessageText ?? "";
	const game = resolveGame(text);
	const result = await queryMihoyoApi({
		userId,
		game,
		api: "dailyNote"
	});
	const format = Format.create();
	if (!result.success) {
		const md = Format.createMarkdown();
		md.addText(`[${GAME_NAMES[game]}体力] ${result.message}`);
		format.addMarkdown(md);
	} else {
		const noteData = {
			...result.data,
			game,
			uid: result.uid ?? ""
		};
		const img = await renderComponentIsHtmlToBuffer(DailyNoteCard, { data: noteData });
		format.addImage(img);
	}
	message.send({ format });
};

export { dailyNote_default as default };