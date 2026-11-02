import { fetchCodesFromMiyolive, getActIdFromNav, getActIdFromPosts } from "../../model/mihoyo/exchange.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/exchange.ts
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
var exchange_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const text = e.MessageText ?? "";
	const game = resolveGame(text);
	const md = Format.createMarkdown();
	let actId = await getActIdFromPosts(game);
	actId ??= await getActIdFromNav(game);
	if (!actId) {
		md.addText(`【${GAME_NAMES[game]}·兑换码】\n\n暂未获取到直播活动信息`);
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const { codes, title, deadline } = await fetchCodesFromMiyolive(actId);
	if (codes.length === 0) md.addText(`【${title || GAME_NAMES[game]}·兑换码】\n\n暂无可用兑换码，可能尚未发布或已过期`);
	else {
		const lines = [
			`【${title || GAME_NAMES[game]}·兑换码】`,
			"",
			...codes.map((code, i) => `${i + 1}. ${code}`)
		];
		if (deadline) lines.push("", `过期时间: ${deadline}`);
		md.addText(lines.join("\n"));
	}
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { exchange_default as default };