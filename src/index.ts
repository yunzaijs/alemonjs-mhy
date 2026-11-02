import { mhyExpose } from './expose';
import router from './response/router';

// ─── 导出供其他插件使用的 API ────────────────────────

export { mhyExpose } from './expose';

// 类型
export type { BindCookieResult, StoredCookieData } from '@src/model/mihoyo/account';
export type { GameRoleInfo, MysApiResponse } from '@src/model/mihoyo/mysApi';
export type { QueryResult } from '@src/model/mihoyo/query';
export type { BbsSignResult, SignResult, SignRoleResult } from '@src/model/mihoyo/sign';
export type { BindStokenResult, QrCodeStatus, QrSession, StokenData } from '@src/model/mihoyo/stoken';
export type { MihoyoGame, MihoyoRegionProfile, MihoyoRegionType } from '@src/model/mihoyo/types';
export type { MihoyoContext } from '@src/model/mw.js';

// 游戏类型检测
export { resolveGame } from '@src/model/mw.js';

// 区服识别
export { resolveMihoyoRegion } from '@src/model/mihoyo/region';

// 账号 & Cookie
export { addUserUid, bindUserCookie, deleteUserCookie, getUserCookie, getUserMainUid, getUserUids, removeUserUid } from '@src/model/mihoyo/account';

// Stoken
export { bindStoken, buildStokenCookie, deleteUserStoken, getUserStoken, saveUserStoken } from '@src/model/mihoyo/stoken';

// 签到
export { performBbsSign, performGameSign, resolveSignGameKey } from '@src/model/mihoyo/sign';

// 统一查询
export { queryMihoyoApi } from '@src/model/mihoyo/query';

// 底层 API
export { fetchGameRoles, fetchUserFullInfo, mysApiFetch } from '@src/model/mihoyo/mysApi';

// ─── 模块注册 ────────────────────────────────────────

export default defineChildren({
  register() {
    return {
      responseRouter: router,
      expose: mhyExpose
    };
  },
  onCreated() {
    logger.info('Mihoyo API Server Done');
  }
});
