import { resolveLedgerMonth, formatLedgerMonth } from '../model/mihoyo/ledger';
import { extraActions } from './extra';
import { Expose, ExposeError, type ExposeValueSchema } from 'alemonjs';
import { addUserUid, removeUserUid, getUserUids, bindUserCookie, deleteUserCookie } from '../model/mihoyo/account';
import { bindStoken, deleteUserStoken } from '../model/mihoyo/stoken';
import { queryMihoyoApi } from '../model/mihoyo/query';
import { performGameSign, performBbsSign } from '../model/mihoyo/sign';
import { action, object } from './shared';
import type { GameInput, UidInput, QueryInput } from './types';

const game = { type: 'string' as const, enum: ['gs', 'sr', 'zzz'] };
const string = { type: 'string' } as const;
const boolean = { type: 'boolean' } as const;
const gameInput = object({ game }, ['game']);
const uidInput = object({ game, uid: { type: 'string', minLength: 8, maxLength: 10 } }, ['game', 'uid']);
const resultSchema = object({ success: boolean, message: string }, ['success', 'message']);
const queryOutput = object({ success: boolean, message: string, uid: string, api: string, dataJson: string }, ['success', 'message']);

// 仅开放固定查询，不接受任意 API、UID、query 或 body，避免覆盖当前用户身份或执行兑换操作。
function queryAction(description: string, api: string, games: string[], extra: Record<string, ExposeValueSchema> = {}) {
  return action<QueryInput, { success: boolean; message: string; uid?: string; api?: string; dataJson?: string }>(
    description,
    object({ game: { ...game, enum: games }, ...extra }, ['game']),
    queryOutput,
    async (input, userId) => {
      const period = api === 'ys_ledger' ? resolveLedgerMonth(input.month) : null;

      if (api === 'ys_ledger' && !period) {
        throw new ExposeError('INVALID_INPUT', '札记仅支持最近三个月');
      }
      const result = await queryMihoyoApi({
        userId,
        game: input.game,
        api,
        query:
          api === 'spiralAbyss'
            ? { schedule_type: input.scheduleType ?? 1 }
            : api === 'roleCombat'
              ? { need_detail: true }
              : api === 'ys_ledger'
                ? { month: formatLedgerMonth(period!, input.game) }
                : undefined,
        cached: api !== 'ys_ledger',
        body: api === 'character' && input.game === 'gs' ? {} : undefined
      });

      return {
        success: result.success,
        message: result.message,
        ...(result.uid ? { uid: result.uid } : {}),
        ...(result.api ? { api: result.api } : {}),
        ...(result.data !== undefined ? { dataJson: JSON.stringify(result.data) } : {})
      };
    }
  );
}

const capabilityCard = { displayName: '米游社', entryCommand: '/米游社帮助' };

export const mhyExpose = Expose.create().provide({
  name: 'mhy',
  ...capabilityCard,
  version: '1.0.0',
  description: '米游社账号、原神/星铁/绝区零查询与签到；操作身份来自当前消息，不返回 Cookie 或 Stoken。',
  actions: {
    ...extraActions,
    get_uids: action<GameInput, { uids: string[] }>(
      '查询当前用户绑定的 UID 列表，首项为主 UID',
      gameInput,
      object({ uids: { type: 'array', items: string } }, ['uids']),
      async (input, userId) => ({ uids: await getUserUids(userId, input.game) })
    ),
    bind_uid: action<UidInput, { success: boolean; message: string }>(
      '绑定当前用户游戏 UID',
      uidInput,
      resultSchema,
      async (input, userId) => {
        if (!/^\d{8,10}$/.test(input.uid)) {
          throw new ExposeError('INVALID_INPUT', 'UID必须为8至10位数字');
        }
        await addUserUid(userId, input.game, input.uid);

        return { success: true, message: 'UID已绑定' };
      },
      'write'
    ),
    delete_uid: action<UidInput, { success: boolean; message: string }>(
      '删除当前用户游戏 UID',
      uidInput,
      resultSchema,
      async (input, userId) => {
        if (!/^\d{8,10}$/.test(input.uid)) {
          throw new ExposeError('INVALID_INPUT', 'UID必须为8至10位数字');
        }
        const success = await removeUserUid(userId, input.game, input.uid);

        return { success, message: success ? 'UID已删除' : '未绑定该UID' };
      },
      'write'
    ),
    bind_cookie: action<{ cookie: string }, { success: boolean; message: string }>(
      '私聊绑定当前用户 Cookie，仅返回绑定结果',
      object({ cookie: { type: 'string', minLength: 1, maxLength: 20000 } }, ['cookie']),
      resultSchema,
      async (input, userId) => {
        const result = await bindUserCookie(userId, input.cookie);

        return { success: result.success, message: result.message };
      },
      'write',
      true
    ),
    bind_stoken: action<{ stoken: string }, { success: boolean; message: string }>(
      '私聊绑定当前用户 Stoken，仅返回绑定结果',
      object({ stoken: { type: 'string', minLength: 1, maxLength: 20000 } }, ['stoken']),
      resultSchema,
      async (input, userId) => {
        const result = await bindStoken(userId, input.stoken);

        return { success: result.success, message: result.message };
      },
      'write',
      true
    ),
    delete_cookie: action(
      '删除当前用户 Cookie',
      object({}),
      resultSchema,
      async (_input, userId) => {
        const success = await deleteUserCookie(userId);

        return { success, message: success ? 'Cookie已删除' : '尚未绑定Cookie' };
      },
      'write'
    ),
    delete_stoken: action(
      '删除当前用户 Stoken',
      object({}),
      resultSchema,
      async (_input, userId) => {
        await deleteUserStoken(userId);

        return { success: true, message: 'Stoken已清除' };
      },
      'write'
    ),
    get_daily_note: queryAction('查询实时便笺', 'dailyNote', ['gs', 'sr', 'zzz']),
    get_player_index: queryAction('查询玩家总览（含探索数据）', 'index', ['gs', 'sr', 'zzz']),
    get_characters: queryAction('查询角色列表（含武器数据）', 'character', ['gs', 'sr', 'zzz']),
    get_spiral_abyss: queryAction('查询深渊/混沌回忆', 'spiralAbyss', ['gs', 'sr'], {
      scheduleType: { type: 'integer', minimum: 1, maximum: 2 }
    }),
    get_role_combat: queryAction('查询幻想真境剧诗', 'roleCombat', ['gs']),
    get_ledger: queryAction('查询原石/星琼月度札记', 'ys_ledger', ['gs', 'sr'], {
      month: { type: 'integer', minimum: 1, maximum: 12 }
    }),
    get_buddy: queryAction('查询邦布', 'buddy', ['zzz']),
    get_gcg_decks: queryAction('查询七圣召唤牌组', 'deckList', ['gs']),
    game_sign: action<{ game?: string }, { success: boolean; message: string }>(
      '游戏签到，省略 game 时签到所有已支持游戏',
      object({ game: { type: 'string', enum: ['gs', 'sr', 'bh3'] } }),
      resultSchema,
      async (input, userId) => {
        const result = await performGameSign(userId, input.game);

        return { success: result.success, message: result.message };
      },
      'write'
    ),
    bbs_sign: action('米游社社区签到', object({}), resultSchema, (_input, userId) => performBbsSign(userId), 'write')
  }
});
