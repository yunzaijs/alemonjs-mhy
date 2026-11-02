import PlayerIndexCard from "../../img/views/PlayerIndexCard.js";
import { queryMihoyoApi } from "../../model/mihoyo/query.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/playerIndex.ts
/**
* 角色面板查询
* 命令: #角色 / #原神角色 / #星铁角色 / #绝区零角色
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
var playerIndex_default = async (e) => {
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
		api: "index"
	});
	const format = Format.create();
	if (!result.success) {
		const md = Format.createMarkdown();
		md.addText(`[${GAME_NAMES[game]}角色] ${result.message}`);
		format.addMarkdown(md);
	} else {
		const cardData = {
			...result.data,
			game,
			uid: result.uid ?? ""
		};
		const img = await renderComponentIsHtmlToBuffer(PlayerIndexCard, { data: cardData });
		format.addImage(img);
	}
	message.send({ format });
};

export { playerIndex_default as default };