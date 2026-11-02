import { bindUserCookie } from "./account.js";
import { clearQrSession, fetchTokenByGameToken, getQrSession, qrCodeFetch, qrCodeQuery, saveUserStoken, setQrSession } from "./stoken.js";
import { ExposeError } from "alemonjs";
import { randomBytes } from "node:crypto";
import QRCode from "qrcode";

// src/model/mihoyo/exposeLogin.ts
const busy = /* @__PURE__ */ new Set();
async function login(userId, mode) {
	if (busy.has(userId)) throw new ExposeError("FORBIDDEN", "登录会话正在处理中，请稍后重试");
	busy.add(userId);
	try {
		if (mode === "cancel") {
			await clearQrSession(userId);
			return { status: "cancelled" };
		}
		const session = await getQrSession(userId);
		if (mode === "start") {
			if (session) return {
				status: "waiting",
				qrDataUrl: session.qrDataUrl
			};
			const device = randomBytes(32).toString("hex");
			const qr = await qrCodeFetch(device);
			if (!qr) return {
				status: "error",
				message: "获取二维码失败"
			};
			const qrDataUrl = await QRCode.toDataURL(qr.url);
			await setQrSession(userId, {
				device,
				ticket: qr.ticket,
				qrDataUrl
			});
			return {
				status: "waiting",
				qrDataUrl
			};
		}
		if (!session) return { status: "expired" };
		const result = await qrCodeQuery(session.device, session.ticket);
		if (!result) return {
			status: "error",
			message: "查询扫码状态失败"
		};
		if (result.stat === "Expired") await clearQrSession(userId);
		if (result.stat !== "Confirmed" || !result.raw) return { status: result.stat };
		const tokens = await fetchTokenByGameToken(result.raw.uid, result.raw.token);
		if (!tokens) return {
			status: "error",
			message: "换取登录凭据失败"
		};
		const bound = await bindUserCookie(userId, `ltoken=${tokens.ltoken};ltuid=${tokens.stuid};cookie_token=${tokens.cookieToken};account_id=${tokens.stuid};`);
		if (!bound.success) return {
			status: "error",
			message: bound.message
		};
		await saveUserStoken(userId, {
			stuid: tokens.stuid,
			stoken: tokens.stoken,
			ltoken: tokens.ltoken,
			mid: tokens.mid,
			uid: bound.uids?.gs[0] ?? bound.uids?.sr[0] ?? bound.uids?.zzz[0] ?? "",
			userId
		});
		await clearQrSession(userId);
		return {
			status: "Confirmed",
			message: bound.message
		};
	} finally {
		busy.delete(userId);
	}
}

export { login };