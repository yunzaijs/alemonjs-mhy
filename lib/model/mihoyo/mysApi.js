import { mihoyoConstants } from "../../constants/mihoyo.js";
import { mihoyoKeys } from "../keys.js";
import { buildMihoyoApiUrl } from "./apiMap.js";
import { resolveMihoyoRegion } from "./region.js";
import { getIoRedis } from "@alemonjs/db";
import md5 from "md5";

// src/model/mihoyo/mysApi.ts
/**
* 米游社 API HTTP 客户端
* 包含 DS 签名、device_fp、请求头构建、缓存
*/
const CN_SALT = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs";
const OS_SALT = "okr4obncj8bw5a65hbnn5oo6ixjc3l9w";
const CN_APP_VERSION = "2.40.1";
const OS_APP_VERSION = "2.55.0";
const CN_CLIENT_TYPE = "5";
const OS_CLIENT_TYPE = "2";
const DS_RANDOM_MIN = 1e5;
const DS_RANDOM_RANGE = 9e5;
const HEX_CHARS = "0123456789abcdef";
const SEED_LENGTH = 16;
const DEVICE_ID_HASH_LENGTH = 5;
const MS_PER_SECOND = 1e3;
const GAME_ROLE_URL_CN = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie";
const GAME_ROLE_URL_OS = "https://sg-public-api.hoyolab.com/binding/api/getUserGameRolesByCookie";
const USER_FULL_INFO_URL = "https://bbs-api.mihoyo.com/user/wapi/getUserFullInfo?gids=2";
const VALID_GAME_BIZ = [
	"hk4e_cn",
	"hkrpg_cn",
	"nap_cn",
	"nap_global",
	"hk4e_global",
	"hkrpg_global"
];
const generateDs = (query, body, regionType) => {
	const salt = regionType === "cn" ? CN_SALT : OS_SALT;
	const t = Math.round(Date.now() / MS_PER_SECOND);
	const r = Math.floor(Math.random() * DS_RANDOM_RANGE + DS_RANDOM_MIN);
	return `${t},${r},${md5(`salt=${salt}&t=${t}&r=${r}&b=${body}&q=${query}`)}`;
};
const generateSeed = () => {
	let result = "";
	for (let i = 0; i < SEED_LENGTH; i++) result += HEX_CHARS[Math.floor(Math.random() * 16)];
	return result;
};
const generateDeviceId = (uid) => {
	return `Yz-${md5(uid).substring(0, DEVICE_ID_HASH_LENGTH)}`;
};
const buildHeaders = (query, body, uid, regionType, deviceFp) => {
	const isCn = regionType === "cn";
	const deviceId = generateDeviceId(uid);
	const headers = {
		"x-rpc-app_version": isCn ? CN_APP_VERSION : OS_APP_VERSION,
		"x-rpc-client_type": isCn ? CN_CLIENT_TYPE : OS_CLIENT_TYPE,
		"User-Agent": isCn ? `Mozilla/5.0 (Linux; Android 12; ${deviceId}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/${CN_APP_VERSION}` : `Mozilla/5.0 (Linux; Android 11; J9110 Build/55.2.A.4.332; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 miHoYoBBSOversea/${OS_APP_VERSION}`,
		Referer: isCn ? "https://webstatic.mihoyo.com/" : "https://act.hoyolab.com/",
		DS: generateDs(query, body, regionType)
	};
	if (deviceFp) headers["x-rpc-device_fp"] = deviceFp;
	return headers;
};
const FP_URL_CN = "https://public-data-api.mihoyo.com/device-fp/api/getFp";
const FP_URL_OS = "https://sg-public-data-api.hoyoverse.com/device-fp/api/getFp";
const FP_CACHE_SECONDS = 3600;
const buildCnExtFields = (deviceId) => {
	return JSON.stringify({
		proxyStatus: "0",
		accelerometer: "-0.159515x-0.830887x-0.682495",
		ramCapacity: "3746",
		IDFV: deviceId.toUpperCase(),
		gyroscope: "-0.191951x-0.112927x0.632637",
		isJailBreak: "0",
		model: "iPhone12,5",
		ramRemain: "115",
		chargeStatus: "1",
		networkType: "WIFI",
		vendor: "--",
		osVersion: "17.0.2",
		batteryStatus: "50",
		screenSize: "414×896",
		cpuCores: "6",
		appMemory: "55",
		romCapacity: "488153",
		romRemain: "157348",
		cpuType: "CPU_TYPE_ARM64",
		magnetometer: "-84.426331x-89.708435x-37.117889"
	});
};
const OS_EXT_FIELDS = JSON.stringify({
	proxyStatus: 1,
	isRoot: 1,
	romCapacity: "512",
	deviceName: "Xperia 1",
	productName: "J9110",
	romRemain: "483",
	hostname: "BuildHost",
	screenSize: "1096x2434",
	isTablet: 0,
	model: "J9110",
	brand: "Sony",
	hardware: "qcom",
	deviceType: "J9110",
	devId: "REL",
	serialNumber: "unknown",
	sdCapacity: 107433,
	buildTime: "1633631032000",
	buildUser: "BuildUser",
	simState: 1,
	ramRemain: "98076",
	appUpdateTimeDiff: 1716545162858,
	deviceInfo: "Sony/J9110/J9110:11/55.2.A.4.332/055002A004033203408384484:user/release-keys",
	buildType: "user",
	sdkVersion: "30",
	ui_mode: "UI_MODE_TYPE_NORMAL",
	isMockLocation: 0,
	cpuType: "arm64-v8a",
	isAirMode: 0,
	ringMode: 2,
	chargeStatus: 1,
	manufacturer: "Sony",
	emulatorStatus: 0,
	appMemory: "512",
	osVersion: "11",
	vendor: "unknown",
	accelerometer: "-0.9233304x7.574181x6.472585",
	sdRemain: 97931,
	buildTags: "release-keys",
	packageName: "com.mihoyo.hoyolab",
	networkType: "WiFi",
	debugStatus: 1,
	ramCapacity: "107433",
	magnetometer: "-9.075001x-27.300001x-3.3000002",
	display: "55.2.A.4.332",
	appInstallTimeDiff: 1716489549794,
	packageVersion: "",
	gyroscope: "0.027029991x-0.04459185x0.032222193",
	batteryStatus: 45,
	hasKeyboard: 0,
	board: "msmnile"
});
/** 获取设备指纹（带 Redis 缓存） */
const fetchDeviceFp = async (uid, _cookie, regionType) => {
	const redis = getIoRedis();
	const cacheKey = mihoyoKeys.deviceFp(uid);
	const cached = await redis.get(cacheKey);
	if (cached) return cached;
	const isCn = regionType === "cn";
	const seedId = generateSeed();
	const deviceId = generateDeviceId(uid);
	const body = JSON.stringify({
		seed_id: seedId,
		device_id: isCn ? deviceId.toUpperCase() : "35315696b7071100",
		platform: isCn ? "1" : "2",
		seed_time: `${Date.now()}`,
		ext_fields: isCn ? buildCnExtFields(deviceId) : OS_EXT_FIELDS,
		app_name: isCn ? "bbs_cn" : "bbs_oversea",
		device_fp: "38d7ee834d1e9"
	});
	try {
		const res = await fetch(isCn ? FP_URL_CN : FP_URL_OS, {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body
		});
		if (!res.ok) {
			logger.warn(`[device_fp][${uid}] HTTP ${res.status} ${res.statusText}`);
			return null;
		}
		const json = await res.json();
		if (json.retcode !== void 0 && json.retcode !== 0) {
			logger.warn(`[device_fp][${uid}] retcode: ${json.retcode}`);
			return null;
		}
		const fp = json.data?.device_fp ?? null;
		if (fp) await redis.setex(cacheKey, FP_CACHE_SECONDS, fp);
		else logger.warn(`[device_fp][${uid}] 返回数据中缺少 device_fp`);
		return fp;
	} catch (error) {
		logger.warn(`[device_fp][${uid}] 请求异常: ${String(error)}`);
		return null;
	}
};
const buildCacheKey = (uid, api, game) => {
	return mihoyoKeys.queryCache(game, uid, api);
};
/** 清除指定 UID 的 device_fp 缓存 */
const clearDeviceFpCache = async (uid) => {
	await getIoRedis().del(mihoyoKeys.deviceFp(uid));
};
/**
* 执行一次米游社 HTTP 请求（内部方法，不含重试逻辑）
*/
const doFetch = async (params) => {
	const { uid, cookie, api, game, urlResult, body, cached } = params;
	const redis = getIoRedis();
	const region = resolveMihoyoRegion(uid, game);
	const mergedBody = urlResult.method === "POST" ? {
		...urlResult.defaultBody,
		...body ?? {}
	} : void 0;
	const bodyString = mergedBody ? JSON.stringify(mergedBody) : "";
	const queryForDs = urlResult.query;
	const deviceFp = await fetchDeviceFp(uid, cookie, region.type);
	if (!deviceFp) logger.warn(`[米游社接口][${api}][${uid}] device_fp 获取失败，请求将不包含 x-rpc-device_fp`);
	const headers = buildHeaders(queryForDs, bodyString, uid, region.type, deviceFp ?? void 0);
	headers["Cookie"] = cookie;
	if (urlResult.method === "POST") headers["Content-Type"] = "application/json";
	const fetchOptions = {
		method: urlResult.method.toLowerCase(),
		headers
	};
	if (mergedBody) fetchOptions.body = bodyString;
	const start = Date.now();
	logger.info(`[米游社接口][${api}][${uid}] ${urlResult.method} ${urlResult.url}`);
	try {
		const response = await fetch(urlResult.url, fetchOptions);
		if (!response.ok) {
			logger.error(`[米游社接口][${api}][${uid}] ${response.status} ${response.statusText}`);
			return null;
		}
		logger.mark(`[米游社接口][${api}][${uid}] ${Date.now() - start}ms`);
		const res = await response.json();
		if (!res) {
			logger.mark("[米游社接口] 没有返回数据");
			return null;
		}
		res.api = api;
		if (res.retcode !== 0) logger.warn(`[米游社接口][${api}][${uid}] retcode: ${res.retcode}, message: ${res.message}, data: ${JSON.stringify(res.data)}`);
		if (cached && res.retcode === 0) await redis.setex(buildCacheKey(uid, api, game), mihoyoConstants.cacheSeconds, JSON.stringify(res));
		return res;
	} catch (error) {
		logger.error(`[米游社接口][${api}][${uid}] 请求异常: ${String(error)}`);
		return null;
	}
};
/** 遇到验证码时自动重试的 retcode */
const RETCODE_VERIFICATION = /* @__PURE__ */ new Set([1034, 10035]);
/**
* 向米游社发起一次 API 请求
* 遇到 1034/10035 时自动刷新 device_fp 重试一次
*/
const mysApiFetch = async (params) => {
	const { uid, cookie, api, game, query, body, cached } = params;
	const redis = getIoRedis();
	const cacheKey = buildCacheKey(uid, api, game);
	const cachedData = await redis.get(cacheKey);
	if (cachedData) return JSON.parse(cachedData);
	const urlResult = buildMihoyoApiUrl({
		api,
		game,
		uid,
		query
	});
	if (!urlResult) return null;
	const res = await doFetch({
		uid,
		cookie,
		api,
		game,
		urlResult,
		body,
		cached
	});
	if (res && RETCODE_VERIFICATION.has(res.retcode)) {
		logger.mark(`[米游社接口][${api}][${uid}] 遇到验证码(${res.retcode})，刷新 device_fp 后重试`);
		await clearDeviceFpCache(uid);
		const retryRes = await doFetch({
			uid,
			cookie,
			api,
			game,
			urlResult,
			body,
			cached
		});
		if (retryRes && !RETCODE_VERIFICATION.has(retryRes.retcode)) return retryRes;
		logger.mark(`[米游社接口][${api}][${uid}] 重试后仍遇到验证码，建议用户稍后再试`);
		return retryRes ?? res;
	}
	return res;
};
/**
* 使用 cookie 获取绑定的游戏角色列表
*/
const fetchGameRoles = async (cookie) => {
	for (const url of [GAME_ROLE_URL_CN, GAME_ROLE_URL_OS]) try {
		const res = await fetch(url, {
			method: "get",
			headers: { Cookie: cookie }
		});
		if (!res.ok) continue;
		const json = await res.json();
		if (json.retcode === 0) return {
			success: true,
			roles: (json.data?.list ?? []).filter((v) => VALID_GAME_BIZ.includes(v.game_biz)),
			message: "ok"
		};
		if (json.retcode === -100) return {
			success: false,
			roles: [],
			message: "该CK已失效，请重新登录获取"
		};
	} catch {
		continue;
	}
	return {
		success: false,
		roles: [],
		message: "无法验证Cookie，请检查网络或重试"
	};
};
/**
* 获取用户通行证信息（用于 v2 cookie 获取 ltuid）
*/
const fetchUserFullInfo = async (cookie) => {
	try {
		const res = await fetch(USER_FULL_INFO_URL, {
			method: "get",
			headers: {
				Cookie: cookie,
				Accept: "application/json, text/plain, */*",
				Connection: "keep-alive",
				Host: "bbs-api.mihoyo.com",
				Origin: "https://m.bbs.mihoyo.com",
				Referer: "https://m.bbs.mihoyo.com/"
			}
		});
		if (!res.ok) return null;
		return (await res.json()).data?.user_info ?? null;
	} catch {
		return null;
	}
};

export { fetchDeviceFp, fetchGameRoles, fetchUserFullInfo, mysApiFetch };