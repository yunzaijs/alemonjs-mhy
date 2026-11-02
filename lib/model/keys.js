// src/model/keys.ts
/**
* 存储在 Redis 里的 Key 相关
*/
const mihoyoKeyPrefix = "data:alemonjs-mhy";
const mihoyoKeys = {
	base: (data) => `${mihoyoKeyPrefix}${data ?? ""}`,
	cookieByUser: (userId) => `${mihoyoKeyPrefix}:cookie:user:${userId}`,
	stokenByUser: (userId) => `${mihoyoKeyPrefix}:stoken:user:${userId}`,
	uidByUserAndGame: (userId, game) => `${mihoyoKeyPrefix}:uid:user:${userId}:${game}`,
	authKeyByUser: (userId) => `${mihoyoKeyPrefix}:authkey:user:${userId}`,
	authKeyByUid: (uid) => `${mihoyoKeyPrefix}:authkey:uid:${uid}`,
	payLogByUser: (userId) => `${mihoyoKeyPrefix}:paylog:user:${userId}`,
	queryCache: (game, uid, api) => `${mihoyoKeyPrefix}:cache:${game}:${uid}:${api}`,
	deviceFp: (uid) => `${mihoyoKeyPrefix}:device_fp:${uid}`,
	qrLoginLock: (userId) => `${mihoyoKeyPrefix}:qrlogin:lock:${userId}`,
	publicCookiePool: () => `${mihoyoKeyPrefix}:public:cookie_pool`,
	migrationPhase: () => `${mihoyoKeyPrefix}:migration:phase`
};

export { mihoyoKeys };