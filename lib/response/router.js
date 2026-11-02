import { mihoyoRouteRules } from "../constants/mihoyo.js";
import { defineRouter, lazy } from "alemonjs";

// src/response/router.ts
var router_default = defineRouter([{
	selects: [
		"private.message.create",
		"message.create",
		"interaction.create",
		"private.interaction.create"
	],
	handler: lazy(() => import("./mw.js")),
	children: [
		{
			regular: mihoyoRouteRules.help,
			handler: lazy(() => import("./mihoyo/help.js"))
		},
		{
			regular: mihoyoRouteRules.bindCk,
			handler: lazy(() => import("./mihoyo/bindCk.js"))
		},
		{
			regular: mihoyoRouteRules.cookieAccept,
			handler: lazy(() => import("./mihoyo/bindCk.js"))
		},
		{
			regular: mihoyoRouteRules.bindUid,
			handler: lazy(() => import("./mihoyo/bindUid.js"))
		},
		{
			regular: mihoyoRouteRules.showUid,
			handler: lazy(() => import("./mihoyo/showUid.js"))
		},
		{
			regular: mihoyoRouteRules.myCk,
			handler: lazy(() => import("./mihoyo/myCk.js"))
		},
		{
			regular: mihoyoRouteRules.delUid,
			handler: lazy(() => import("./mihoyo/delUid.js"))
		},
		{
			regular: mihoyoRouteRules.dailyNote,
			handler: lazy(() => import("./mihoyo/dailyNote.js"))
		},
		{
			regular: mihoyoRouteRules.playerIndex,
			handler: lazy(() => import("./mihoyo/playerIndex.js"))
		},
		{
			regular: mihoyoRouteRules.spiralAbyss,
			handler: lazy(() => import("./mihoyo/spiralAbyss.js"))
		},
		{
			regular: mihoyoRouteRules.roleExplore,
			handler: lazy(() => import("./mihoyo/roleExplore.js"))
		},
		{
			regular: mihoyoRouteRules.weapon,
			handler: lazy(() => import("./mihoyo/weapon.js"))
		},
		{
			regular: mihoyoRouteRules.buddy,
			handler: lazy(() => import("./mihoyo/buddy.js"))
		},
		{
			regular: mihoyoRouteRules.roleCombat,
			handler: lazy(() => import("./mihoyo/roleCombat.js"))
		},
		{
			regular: mihoyoRouteRules.ledger,
			handler: lazy(() => import("./mihoyo/ledger.js"))
		},
		{
			regular: mihoyoRouteRules.exchange,
			handler: lazy(() => import("./mihoyo/exchange.js"))
		},
		{
			regular: mihoyoRouteRules.mysNews,
			handler: lazy(() => import("./mihoyo/mysNews.js"))
		},
		{
			regular: mihoyoRouteRules.ckHelp,
			handler: lazy(() => import("./mihoyo/ckHelp.js"))
		},
		{
			regular: mihoyoRouteRules.ckCheck,
			handler: lazy(() => import("./mihoyo/ckCheck.js"))
		},
		{
			regular: mihoyoRouteRules.bindStoken,
			handler: lazy(() => import("./mihoyo/bindStoken.js"))
		},
		{
			regular: mihoyoRouteRules.stokenAccept,
			handler: lazy(() => import("./mihoyo/bindStoken.js"))
		},
		{
			regular: mihoyoRouteRules.myStoken,
			handler: lazy(() => import("./mihoyo/bindStoken.js"))
		},
		{
			regular: mihoyoRouteRules.delStoken,
			handler: lazy(() => import("./mihoyo/bindStoken.js"))
		},
		{
			regular: mihoyoRouteRules.gameSign,
			handler: lazy(() => import("./mihoyo/gameSign.js"))
		},
		{
			regular: mihoyoRouteRules.bbsSign,
			handler: lazy(() => import("./mihoyo/bbsSign.js"))
		},
		{
			regular: mihoyoRouteRules.qrLogin,
			handler: lazy(() => import("./mihoyo/qrLogin.js"))
		},
		{
			regular: mihoyoRouteRules.useCode,
			handler: lazy(() => import("./mihoyo/useCode.js"))
		},
		{
			regular: mihoyoRouteRules.sevenSaints,
			handler: lazy(() => import("./mihoyo/sevenSaints.js"))
		},
		{
			regular: mihoyoRouteRules.birthday,
			handler: lazy(() => import("./mihoyo/birthday.js"))
		},
		{
			regular: mihoyoRouteRules.payLog,
			handler: lazy(() => import("./mihoyo/payLog.js"))
		},
		{
			regular: mihoyoRouteRules.payLogAuth,
			handler: lazy(() => import("./mihoyo/payLog.js"))
		}
	]
}]);

export { router_default as default };