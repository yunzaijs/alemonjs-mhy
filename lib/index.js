import { mhyExpose } from "./expose/index.js";
import router_default from "./response/router.js";
import { resolveGame } from "./model/mw.js";
import { resolveMihoyoRegion } from "./model/mihoyo/region.js";
import { addUserUid, bindUserCookie, deleteUserCookie, getUserCookie, getUserMainUid, getUserUids, removeUserUid } from "./model/mihoyo/account.js";
import { bindStoken, buildStokenCookie, deleteUserStoken, getUserStoken, saveUserStoken } from "./model/mihoyo/stoken.js";
import { performBbsSign, performGameSign, resolveSignGameKey } from "./model/mihoyo/sign.js";
import { queryMihoyoApi } from "./model/mihoyo/query.js";
import { fetchGameRoles, fetchUserFullInfo, mysApiFetch } from "./model/mihoyo/mysApi.js";

// src/index.ts
var src_default = defineChildren({
	register() {
		return {
			responseRouter: router_default,
			expose: mhyExpose
		};
	},
	onCreated() {
		logger.info("Mihoyo API Server Done");
	}
});

export { addUserUid, bindStoken, bindUserCookie, buildStokenCookie, src_default as default, deleteUserCookie, deleteUserStoken, fetchGameRoles, fetchUserFullInfo, getUserCookie, getUserMainUid, getUserStoken, getUserUids, mhyExpose, mysApiFetch, performBbsSign, performGameSign, queryMihoyoApi, removeUserUid, resolveGame, resolveMihoyoRegion, resolveSignGameKey, saveUserStoken };