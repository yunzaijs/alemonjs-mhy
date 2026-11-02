import { addUserUid, getUserUids } from "../../model/mihoyo/account.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/bindUid.ts
/**
* 绑定UID 响应处理
* 命令: #绑定uid123456789 / #原神绑定uid / #星铁绑定uid / #绝区零绑定uid
*/
const GAME_PREFIX_MAP = {
	原神: "gs",
	星铁: "sr",
	绝区零: "zzz"
};
const GAME_NAMES = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
const UID_PATTERNS = {
	gs: /(18|[1-9])\d{8}/,
	sr: /(18|[1-9])\d{8}/,
	zzz: /(1[0-9]|[1-9])\d{8}|[1-9]\d{7}/
};
const resolveGame = (text) => {
	for (const [prefix, game] of Object.entries(GAME_PREFIX_MAP)) if (text.includes(prefix)) return game;
	return "gs";
};
var bindUid_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const text = e.MessageText ?? "";
	const game = resolveGame(text);
	const pattern = UID_PATTERNS[game];
	const match = text.match(pattern);
	if (!match) {
		const md = Format.createMarkdown();
		md.addText(`请输入正确的${GAME_NAMES[game]}UID`);
		md.addNewline();
		md.addText("示例: #绑定uid100000001");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const uid = match[0];
	await addUserUid(userId, game, uid);
	const allUids = await getUserUids(userId, game);
	const md = Format.createMarkdown();
	md.addText(`【${GAME_NAMES[game]}】UID绑定成功`);
	md.addNewline();
	md.addText(`当前绑定: ${allUids.join(", ")}`);
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { bindUid_default as default };