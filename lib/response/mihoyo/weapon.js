import WeaponCard from "../../img/views/WeaponCard.js";
import { queryMihoyoApi } from "../../model/mihoyo/query.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/weapon.ts
/**
* 武器查询
* 命令: #武器 / #五星武器 / #四星武器
*/
var weapon_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const text = e.MessageText ?? "";
	const result = await queryMihoyoApi({
		userId,
		game: "gs",
		api: "character",
		body: {}
	});
	const format = Format.create();
	if (!result.success) {
		const md = Format.createMarkdown();
		md.addText(`[武器] ${result.message}`);
		format.addMarkdown(md);
	} else {
		const data = result.data;
		const img = await renderComponentIsHtmlToBuffer(WeaponCard, { data: {
			uid: result.uid ?? "",
			avatars: data.avatars,
			filterText: text
		} });
		format.addImage(img);
	}
	message.send({ format });
};

export { weapon_default as default };