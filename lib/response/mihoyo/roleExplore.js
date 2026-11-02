import RoleExploreCard from "../../img/views/RoleExploreCard.js";
import { queryMihoyoApi } from "../../model/mihoyo/query.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/roleExplore.ts
/**
* 探索 / 宝箱 / 成就 查询
* 命令: #探索 / #宝箱 / #成就 / #尘歌壶
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
var roleExplore_default = async (e) => {
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
		md.addText(`[${GAME_NAMES[game]}探索] ${result.message}`);
		format.addMarkdown(md);
	} else {
		const cardData = {
			...result.data,
			game,
			uid: result.uid ?? ""
		};
		const img = await renderComponentIsHtmlToBuffer(RoleExploreCard, { data: cardData });
		format.addImage(img);
	}
	message.send({ format });
};

export { roleExplore_default as default };