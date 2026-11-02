import CkHelpCard from "../../img/views/CkHelpCard.js";
import { Format, createEvent, useMessage } from "alemonjs";
import { renderComponentIsHtmlToBuffer } from "jsxp";

// src/response/mihoyo/ckHelp.ts
/**
* CK帮助 / Cookie教程
* 命令: #ck帮助 / #cookie帮助
*/
var ckHelp_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const img = await renderComponentIsHtmlToBuffer(CkHelpCard, {});
	if (typeof img === "boolean") {
		const md = Format.createMarkdown();
		md.addText("Cookie帮助图片加载失败，请稍后重试");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const format = Format.create();
	format.addImage(img);
	message.send({ format });
};

export { ckHelp_default as default };