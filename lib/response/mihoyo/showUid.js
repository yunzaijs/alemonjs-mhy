import { getUserCookie, getUserUids } from "../../model/mihoyo/account.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/showUid.ts
/**
* 查看当前绑定的UID列表
* 命令: #uid / #原神uid / #星铁uid / #绝区零uid
*/
const GAME_NAMES = {
	gs: "原神",
	sr: "星穹铁道",
	zzz: "绝区零"
};
const ALL_GAMES = [
	"gs",
	"sr",
	"zzz"
];
var showUid_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const text = e.MessageText ?? "";
	const md = Format.createMarkdown();
	const lines = [];
	const hasCk = !!await getUserCookie(userId);
	let games = ALL_GAMES;
	if (text.includes("原神")) games = ["gs"];
	else if (text.includes("星铁")) games = ["sr"];
	else if (text.includes("绝区零")) games = ["zzz"];
	for (const game of games) {
		const uids = await getUserUids(userId, game);
		if (uids.length > 0) lines.push(`【${GAME_NAMES[game]}】: ${uids.join(", ")}`);
	}
	if (lines.length === 0) {
		md.addText("暂无绑定的UID");
		md.addNewline();
		md.addText("使用 #绑定uid + UID 进行绑定");
	} else {
		md.addText(lines.join("\n"));
		md.addNewline();
		md.addText(hasCk ? "(已绑定Cookie)" : "(未绑定Cookie)");
	}
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { showUid_default as default };