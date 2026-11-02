import { getUserCookie } from "../../model/mihoyo/account.js";
import { mysApiFetch } from "../../model/mihoyo/mysApi.js";
import { Format, createEvent, useMessage } from "alemonjs";

// src/response/mihoyo/ckCheck.ts
/**
* CK状态检查
* 命令: #检查ck / #验证cookie
*/
var ckCheck_default = async (e) => {
	const event = createEvent({
		event: e,
		selects: ["message.create", "private.message.create"]
	});
	const [message] = useMessage(event);
	const userId = event.UserId;
	const cookieData = await getUserCookie(userId);
	if (!cookieData) {
		const md = Format.createMarkdown();
		md.addText("尚未绑定Cookie，请使用 #ck帮助 查看绑定教程");
		const format = Format.create();
		format.addMarkdown(md);
		message.send({ format });
		return;
	}
	const lines = [
		"【Cookie状态检查】",
		"",
		`CK类型: ${cookieData.isV2 ? "v2" : "v1"}`,
		`ltuid: ${cookieData.ltuid}`,
		""
	];
	const games = [
		"gs",
		"sr",
		"zzz"
	];
	const gameNames = {
		gs: "原神",
		sr: "星穹铁道",
		zzz: "绝区零"
	};
	for (const game of games) {
		const uids = cookieData.uids[game] ?? [];
		if (uids.length === 0) {
			lines.push(`${gameNames[game]}: 未绑定`);
			continue;
		}
		const uid = uids[0];
		const res = await mysApiFetch({
			uid,
			cookie: cookieData.ck,
			api: "index",
			game,
			cached: false
		});
		if (!res) lines.push(`${gameNames[game]} ${uid}: 请求失败`);
		else if (res.retcode === 0) lines.push(`${gameNames[game]} ${uid}: ✓ 正常`);
		else if (res.retcode === -100 || res.retcode === 10001 || res.retcode === -10001) lines.push(`${gameNames[game]} ${uid}: ✗ Cookie已失效`);
		else if (res.retcode === 10101) lines.push(`${gameNames[game]} ${uid}: ⚠ 查询次数已用完`);
		else if (res.retcode === 1034) lines.push(`${gameNames[game]} ${uid}: ⚠ 需要验证码`);
		else lines.push(`${gameNames[game]} ${uid}: ✗ 错误[${res.retcode}] ${res.message}`);
	}
	const md = Format.createMarkdown();
	md.addText(lines.join("\n"));
	const format = Format.create();
	format.addMarkdown(md);
	message.send({ format });
};

export { ckCheck_default as default };