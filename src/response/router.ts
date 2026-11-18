import { accountRouteRules, gsRouteRules, mihoyoRouteRules, srRouteRules } from '@src/constants/mihoyo';
import { defineRouter, lazy } from 'alemonjs';

export default defineRouter([
  {
    // 局部中间件
    // 仅限消息和交互事件处理
    selects: ['private.message.create', 'message.create', 'interaction.create', 'private.interaction.create'],
    handler: lazy(() => import('@src/response/mw')),
    children: [
      // ─── 原神统一入口 ────────────────────────────
      {
        regular: gsRouteRules.help,
        handler: lazy(() => import('@src/response/mihoyo/help'))
      },
      {
        regular: gsRouteRules.bindUid,
        handler: lazy(() => import('@src/response/mihoyo/bindUid'))
      },
      {
        regular: gsRouteRules.showUid,
        handler: lazy(() => import('@src/response/mihoyo/showUid'))
      },
      {
        regular: gsRouteRules.delUid,
        handler: lazy(() => import('@src/response/mihoyo/delUid'))
      },
      {
        regular: gsRouteRules.dailyNote,
        handler: lazy(() => import('@src/response/mihoyo/dailyNote'))
      },
      {
        regular: gsRouteRules.playerIndex,
        handler: lazy(() => import('@src/response/mihoyo/playerIndex'))
      },
      {
        regular: gsRouteRules.spiralAbyss,
        handler: lazy(() => import('@src/response/mihoyo/spiralAbyss'))
      },
      {
        regular: gsRouteRules.roleExplore,
        handler: lazy(() => import('@src/response/mihoyo/roleExplore'))
      },
      {
        regular: gsRouteRules.weapon,
        handler: lazy(() => import('@src/response/mihoyo/weapon'))
      },
      {
        regular: gsRouteRules.roleCombat,
        handler: lazy(() => import('@src/response/mihoyo/roleCombat'))
      },
      {
        regular: gsRouteRules.ledger,
        handler: lazy(() => import('@src/response/mihoyo/ledger'))
      },
      {
        regular: gsRouteRules.exchange,
        handler: lazy(() => import('@src/response/mihoyo/exchange'))
      },
      {
        regular: gsRouteRules.useCode,
        handler: lazy(() => import('@src/response/mihoyo/useCode'))
      },
      {
        regular: gsRouteRules.mysNews,
        handler: lazy(() => import('@src/response/mihoyo/mysNews'))
      },
      {
        regular: gsRouteRules.gameSign,
        handler: lazy(() => import('@src/response/mihoyo/gameSign'))
      },
      {
        regular: gsRouteRules.sevenSaints,
        handler: lazy(() => import('@src/response/mihoyo/sevenSaints'))
      },
      {
        regular: gsRouteRules.birthday,
        handler: lazy(() => import('@src/response/mihoyo/birthday'))
      },
      // ─── 星铁统一入口 ────────────────────────────
      {
        regular: srRouteRules.help,
        handler: lazy(() => import('@src/response/mihoyo/help'))
      },
      {
        regular: srRouteRules.bindUid,
        handler: lazy(() => import('@src/response/mihoyo/bindUid'))
      },
      {
        regular: srRouteRules.showUid,
        handler: lazy(() => import('@src/response/mihoyo/showUid'))
      },
      {
        regular: srRouteRules.delUid,
        handler: lazy(() => import('@src/response/mihoyo/delUid'))
      },
      {
        regular: srRouteRules.dailyNote,
        handler: lazy(() => import('@src/response/mihoyo/dailyNote'))
      },
      {
        regular: srRouteRules.playerIndex,
        handler: lazy(() => import('@src/response/mihoyo/playerIndex'))
      },
      {
        regular: srRouteRules.spiralAbyss,
        handler: lazy(() => import('@src/response/mihoyo/spiralAbyss'))
      },
      {
        regular: srRouteRules.ledger,
        handler: lazy(() => import('@src/response/mihoyo/ledger'))
      },
      {
        regular: srRouteRules.exchange,
        handler: lazy(() => import('@src/response/mihoyo/exchange'))
      },
      {
        regular: srRouteRules.useCode,
        handler: lazy(() => import('@src/response/mihoyo/useCode'))
      },
      {
        regular: srRouteRules.mysNews,
        handler: lazy(() => import('@src/response/mihoyo/mysNews'))
      },
      {
        regular: srRouteRules.gameSign,
        handler: lazy(() => import('@src/response/mihoyo/gameSign'))
      },
      // ─── 账号 ────────────────────────────────────
      {
        regular: accountRouteRules.help,
        handler: lazy(() => import('@src/response/mihoyo/help'))
      },
      {
        regular: accountRouteRules.bindCk,
        handler: lazy(() => import('@src/response/mihoyo/bindCk'))
      },
      {
        regular: accountRouteRules.cookieAccept,
        handler: lazy(() => import('@src/response/mihoyo/bindCk'))
      },
      {
        regular: accountRouteRules.myCk,
        handler: lazy(() => import('@src/response/mihoyo/myCk'))
      },
      {
        regular: accountRouteRules.ckHelp,
        handler: lazy(() => import('@src/response/mihoyo/ckHelp'))
      },
      {
        regular: accountRouteRules.ckCheck,
        handler: lazy(() => import('@src/response/mihoyo/ckCheck'))
      },
      // ─── 其他游戏 ────────────────────────────────
      {
        regular: mihoyoRouteRules.help,
        handler: lazy(() => import('@src/response/mihoyo/help'))
      },
      {
        regular: mihoyoRouteRules.bindUid,
        handler: lazy(() => import('@src/response/mihoyo/bindUid'))
      },
      {
        regular: mihoyoRouteRules.showUid,
        handler: lazy(() => import('@src/response/mihoyo/showUid'))
      },
      {
        regular: mihoyoRouteRules.delUid,
        handler: lazy(() => import('@src/response/mihoyo/delUid'))
      },
      {
        regular: mihoyoRouteRules.dailyNote,
        handler: lazy(() => import('@src/response/mihoyo/dailyNote'))
      },
      {
        regular: mihoyoRouteRules.playerIndex,
        handler: lazy(() => import('@src/response/mihoyo/playerIndex'))
      },
      {
        regular: mihoyoRouteRules.roleExplore,
        handler: lazy(() => import('@src/response/mihoyo/roleExplore'))
      },
      {
        regular: mihoyoRouteRules.buddy,
        handler: lazy(() => import('@src/response/mihoyo/buddy'))
      },
      {
        regular: mihoyoRouteRules.exchange,
        handler: lazy(() => import('@src/response/mihoyo/exchange'))
      },
      {
        regular: mihoyoRouteRules.mysNews,
        handler: lazy(() => import('@src/response/mihoyo/mysNews'))
      },
      // ─── stoken ──────────────────────────────────
      {
        regular: accountRouteRules.bindStoken,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      {
        regular: accountRouteRules.stokenAccept,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      {
        regular: accountRouteRules.myStoken,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      {
        regular: accountRouteRules.delStoken,
        handler: lazy(() => import('@src/response/mihoyo/bindStoken'))
      },
      // ─── 签到 ────────────────────────────────────
      {
        regular: mihoyoRouteRules.gameSign,
        handler: lazy(() => import('@src/response/mihoyo/gameSign'))
      },
      {
        regular: accountRouteRules.bbsSign,
        handler: lazy(() => import('@src/response/mihoyo/bbsSign'))
      },
      // ─── 扫码登录 ────────────────────────────────
      {
        regular: accountRouteRules.qrLogin,
        handler: lazy(() => import('@src/response/mihoyo/qrLogin'))
      },
      // ─── 兑换码使用 ──────────────────────────────
      {
        regular: mihoyoRouteRules.useCode,
        handler: lazy(() => import('@src/response/mihoyo/useCode'))
      },
      // ─── 充值记录 ────────────────────────────────
      {
        regular: accountRouteRules.payLog,
        handler: lazy(() => import('@src/response/mihoyo/payLog'))
      },
      {
        regular: accountRouteRules.payLogAuth,
        handler: lazy(() => import('@src/response/mihoyo/payLog'))
      }
    ]
  }
]);
