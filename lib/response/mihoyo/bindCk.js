import { bindUserCookie } from "../../model/mihoyo/account.js";
import { isCookieLike } from "../../model/mihoyo/cookie.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/bindCk.ts
/**
* 绑定Cookie 响应处理
* 命令: #绑定cookie / 私聊直接发送cookie
*/
const gameNames = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
var bindCk_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const isPrivate = /private/.test(event.name);
	const rawCk = e.MessageText ?? "";
	if (/^(!|！|\/|#|＃)绑定c(oo)?k(ie)?$/i.test(rawCk)) {
		const md = Format.createMarkdown();
		md.addText("请在【私聊】中直接发送你的米游社Cookie");
		md.addNewline();
		md.addText("获取方式：浏览器登录米游社，F12打开控制台，输入 document.cookie");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	if (!isCookieLike(rawCk)) return;
	if (!isPrivate) {
		const md = Format.createMarkdown();
		md.addText("请私聊发送Cookie，不要在群里发送！");
		const warnFormat = Format.create();
		warnFormat.addMarkdown(md);
		message.send({ format: warnFormat });
		return;
	}
	const result = await bindUserCookie(userId, rawCk);
	const md = Format.createMarkdown();
	md.addText(result.message);
	md.addNewline();
	if (result.success && result.uids) {
		const lines = [];
		for (const game of [
			"gs",
			"sr",
			"zzz"
		]) {
			const uids = result.uids[game];
			if (uids.length > 0) lines.push(`【${gameNames[game]}】: ${uids.join(", ")}`);
		}
		if (lines.length > 0) md.addText(lines.join("\n"));
	}
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { bindCk_default as default };