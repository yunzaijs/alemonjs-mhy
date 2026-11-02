import { mihoyoConstants } from "../../constants/mihoyo.js";
import { deleteUserCookie, getUserCookie } from "../../model/mihoyo/account.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/myCk.ts
/**
* 我的Cookie / 删除Cookie
* 命令: #我的ck / #删除ck
*/
const GAME_NAMES = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
const MASK_KEEP = mihoyoConstants.ckMaskKeepLength;
const maskCookie = (ck) => {
	if (ck.length <= MASK_KEEP * 2) return "***";
	return ck.slice(0, MASK_KEEP) + "***" + ck.slice(-MASK_KEEP);
};
var myCk_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const text = e.MessageText ?? "";
	const isDelete = /删除/.test(text);
	const md = Format.createMarkdown();
	if (isDelete) {
		if (await deleteUserCookie(userId)) md.addText("已删除绑定的Cookie");
		else md.addText("当前没有绑定的Cookie");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const stored = await getUserCookie(userId);
	if (!stored) {
		md.addText("当前未绑定Cookie");
		md.addNewline();
		md.addText("请私聊发送Cookie进行绑定");
		const earlyFormat = Format.create();
		earlyFormat.addMarkdown(md);
		message.send({ format: earlyFormat });
		return;
	}
	const lines = [
		`ltuid: ${stored.ltuid}`,
		`格式: ${stored.isV2 ? "v2" : "v1"}`,
		`Cookie: ${maskCookie(stored.ck)}`
	];
	for (const game of [
		"gs",
		"sr",
		"zzz"
	]) {
		const uids = stored.uids[game];
		if (uids.length > 0) lines.push(`【${GAME_NAMES[game]}】: ${uids.join(", ")}`);
	}
	md.addText(lines.join("\n"));
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { myCk_default as default };