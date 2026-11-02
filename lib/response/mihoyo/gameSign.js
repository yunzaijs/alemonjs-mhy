import { performGameSign, resolveSignGameKey } from "../../model/mihoyo/sign.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/gameSign.ts
/**
* 游戏签到 响应处理
* 命令: #原神签到 / #星铁签到 / #游戏签到 / #签到
*/
var gameSign_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const rawText = e.MessageText ?? "";
	const gameKey = resolveSignGameKey(rawText);
	const md = Format.createMarkdown();
	md.addText("正在签到中，请稍等...");
	const tipFormat = Format.create();
	tipFormat.addMarkdown(md);
	message.send({ format: tipFormat });
	const result = await performGameSign(userId, gameKey);
	const resMd = Format.createMarkdown();
	resMd.addText(result.message);
	const resFormat = Format.create();
	resFormat.addMarkdown(resMd);
	message.send({ format: resFormat });
};

export { gameSign_default as default };