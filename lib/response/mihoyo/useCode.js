import { redeemCode } from "../../model/mihoyo/useCode.js";
import { getUserCookie, getUserMainUid } from "../../model/mihoyo/account.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/useCode.ts
/**
* 兑换码使用
* 命令: #兑换码使用XXXX / #原神兑换码使用XXXX / #cdk-uXXXX
*/
const GAME_NAMES = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
const resolveGame = (text) => {
	if (/星铁|崩铁/.test(text)) return "sr";
	if (/绝区零/.test(text)) return "zzz";
	return "gs";
};
var useCode_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const text = e.MessageText ?? "";
	const game = resolveGame(text);
	const cdkCode = text.replace(/^(!|！|\/|#|＃)(原神|星铁|崩铁|绝区零)?(兑换码使用|cdk-u)/i, "").trim();
	if (!cdkCode) {
		const md = Format.createMarkdown();
		md.addText("请在命令后输入兑换码，如: #兑换码使用ABCD1234");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	if (!await getUserCookie(userId)) {
		const md = Format.createMarkdown();
		md.addText("尚未绑定Cookie，请先绑定后再使用兑换码");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	if (!await getUserMainUid(userId, game)) {
		const md = Format.createMarkdown();
		md.addText(`尚未绑定${GAME_NAMES[game]}UID`);
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const md = Format.createMarkdown();
	md.addText(await redeemCode(userId, game, cdkCode));
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { useCode_default as default };