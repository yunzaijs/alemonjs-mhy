import { bindStoken, buildStokenCookie, deleteUserStoken, getUserStoken } from "../../model/mihoyo/stoken.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/bindStoken.ts
/**
* 绑定Stoken 响应处理
* 命令: stoken=*** / #绑定stoken
*/
const gameNames = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
var bindStoken_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const isPrivate = /private/.test(event.name);
	const rawText = e.MessageText ?? "";
	if (/^(!|！|\/|#|＃)绑定stoken$/i.test(rawText)) {
		const md = Format.createMarkdown();
		md.addText("请在【私聊】中直接发送你的stoken");
		md.addNewline();
		md.addText("格式: stoken=v2_***;stuid=123;mid=***;");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	if (/^(!|！|\/|#|＃)我的stoken$/i.test(rawText)) {
		if (!isPrivate) {
			const md = Format.createMarkdown();
			md.addText("请私聊查看stoken信息");
			const format = Format.create();
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		const data = await getUserStoken(userId);
		if (!data) {
			const md = Format.createMarkdown();
			md.addText("未绑定stoken");
			const format = Format.create();
			format.addMarkdown(md);
			message.send({ format });
			return;
		}
		const md = Format.createMarkdown();
		md.addText(buildStokenCookie(data));
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	if (/^(!|！|\/|#|＃)删除(我的)?stoken$/i.test(rawText)) {
		const deleted = await deleteUserStoken(userId);
		const md = Format.createMarkdown();
		md.addText(deleted ? "stoken已删除" : "未绑定stoken，无需删除");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	if (!isPrivate) {
		const md = Format.createMarkdown();
		md.addText("请在【私聊】中发送stoken，不要在群里发送！");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const result = await bindStoken(userId, rawText);
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
		if (lines.length > 0) {
			md.addText(lines.join("\n"));
			md.addNewline();
		}
		md.addText("可用指令:");
		md.addNewline();
		md.addText("#原神签到 / #星铁签到 / #游戏签到");
		md.addNewline();
		md.addText("#米游社签到 (获取米游币)");
		md.addNewline();
		md.addText("#我的stoken / #删除stoken");
	}
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { bindStoken_default as default };