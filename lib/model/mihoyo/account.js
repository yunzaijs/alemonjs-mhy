import { mihoyoKeys } from "../keys.js";
import { buildCookieString, extractGameUids, parseCookieFields } from "./cookie.js";
import { fetchGameRoles, fetchUserFullInfo } from "./mysApi.js";
import { getIoRedis } from "@alemonjs/db";

// src/model/mihoyo/account.ts
/**
* 米游社账号服务
* 管理用户 UID ↔ Cookie 绑定关系（基于 Redis）
*/
const COOKIE_EXPIRY_SECONDS = 2592e3;
const UID_EXPIRY_SECONDS = 7776e3;
/**
* 获取用户绑定的 UID 列表
*/
const getUserUids = async (userId, game) => {
	const redis = getIoRedis();
	const key = mihoyoKeys.uidByUserAndGame(userId, game);
	const raw = await redis.get(key);
	if (!raw) return [];
	return JSON.parse(raw);
};
/**
* 获取用户当前游戏的主 UID（列表中的第一个）
*/
const getUserMainUid = async (userId, game) => {
	return (await getUserUids(userId, game))[0] ?? null;
};
/**
* 添加 UID 到用户绑定列表
*/
const addUserUid = async (userId, game, uid) => {
	const redis = getIoRedis();
	const key = mihoyoKeys.uidByUserAndGame(userId, game);
	const uids = await getUserUids(userId, game);
	if (uids.includes(uid)) return;
	uids.push(uid);
	await redis.setex(key, UID_EXPIRY_SECONDS, JSON.stringify(uids));
};
/**
* 从用户绑定列表中移除 UID
*/
const removeUserUid = async (userId, game, uid) => {
	const redis = getIoRedis();
	const key = mihoyoKeys.uidByUserAndGame(userId, game);
	const uids = await getUserUids(userId, game);
	const index = uids.indexOf(uid);
	if (index < 0) return false;
	uids.splice(index, 1);
	if (uids.length === 0) await redis.del(key);
	else await redis.setex(key, UID_EXPIRY_SECONDS, JSON.stringify(uids));
	return true;
};
/**
* 获取用户已存储的 cookie 数据
*/
const getUserCookie = async (userId) => {
	const redis = getIoRedis();
	const key = mihoyoKeys.cookieByUser(userId);
	const raw = await redis.get(key);
	if (!raw) return null;
	return JSON.parse(raw);
};
/**
* 保存用户的 cookie 数据
*/
const saveUserCookie = async (userId, data) => {
	const redis = getIoRedis();
	const key = mihoyoKeys.cookieByUser(userId);
	await redis.setex(key, COOKIE_EXPIRY_SECONDS, JSON.stringify(data));
};
/**
* 删除用户的 cookie 数据
*/
const deleteUserCookie = async (userId) => {
	const redis = getIoRedis();
	const key = mihoyoKeys.cookieByUser(userId);
	if (await redis.exists(key) === 0) return false;
	await redis.del(key);
	return true;
};
/**
* 绑定 Cookie：解析 → 验证 → 获取角色 → 存储
*/
const bindUserCookie = async (userId, rawCookie) => {
	const fields = parseCookieFields(rawCookie);
	const cookieResult = buildCookieString(fields);
	if (!cookieResult) return {
		success: false,
		message: "发送的Cookie不完整\n请退出米游社【重新登录】，刷新完整Cookie"
	};
	const roleResult = await fetchGameRoles(cookieResult.ck);
	if (!roleResult.success) return {
		success: false,
		message: `绑定Cookie失败：${roleResult.message}`
	};
	if (roleResult.roles.length === 0) return {
		success: false,
		message: "该账号尚未绑定原神、星穹铁道或绝区零角色"
	};
	let finalLtuid = cookieResult.ltuid;
	if (cookieResult.isV2 && !/^\d+$/.test(finalLtuid)) {
		const fullInfo = await fetchUserFullInfo(cookieResult.ck);
		if (fullInfo?.uid) finalLtuid = fullInfo.uid;
		else return {
			success: false,
			message: "绑定Cookie失败：无法获取通行证ID"
		};
	}
	const gameUids = extractGameUids(roleResult.roles);
	const storeData = {
		ck: cookieResult.ck,
		ltuid: finalLtuid,
		isV2: cookieResult.isV2,
		uids: gameUids
	};
	await saveUserCookie(userId, storeData);
	for (const game of [
		"gs",
		"sr",
		"zzz"
	]) for (const uid of gameUids[game]) await addUserUid(userId, game, uid);
	logger.mark(`[米游社绑定] 用户 ${userId} 绑定成功 [ltuid:${finalLtuid}]`);
	return {
		success: true,
		message: "绑定Cookie成功",
		uids: gameUids
	};
};

export { addUserUid, bindUserCookie, deleteUserCookie, getUserCookie, getUserMainUid, getUserUids, removeUserUid };