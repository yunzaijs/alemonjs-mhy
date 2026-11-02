import RoleCombatCard from "../../img/views/RoleCombatCard.js";
import { queryMihoyoApi } from "../../model/mihoyo/query.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/roleCombat.ts
/**
* 幻想真境剧诗
* 命令: #剧诗 / #幻想真境剧诗
*/
var roleCombat_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const result = await queryMihoyoApi({
		userId,
		game: "gs",
		api: "roleCombat",
		query: { need_detail: true }
	});
	const format = Format.create();
	if (!result.success) {
		const md = Format.createMarkdown();
		md.addText(`[剧诗] ${result.message}`);
		format.addMarkdown(md);
	} else {
		const cardData = {
			...result.data,
			uid: result.uid ?? ""
		};
		const img = await renderComponentIsHtmlToBuffer(RoleCombatCard, { data: cardData });
		format.addImage(img);
	}
	message.send({ format });
};

export { roleCombat_default as default };