import { extraSchemas, projectOutput } from './schemas';
import type { CookieCheck, BirthdayClaim } from './types';
import { readFileSync } from 'node:fs';
import { getIoRedis } from '@alemonjs/db';
import { ExposeError } from 'alemonjs';
import { action, object } from './shared';
import { getUserCookie, getUserMainUid, getUserUids, removeUserUid } from '../model/mihoyo/account';
import { getUserStoken } from '../model/mihoyo/stoken';
import { mysApiFetch } from '../model/mihoyo/mysApi';
import { queryMihoyoApi } from '../model/mihoyo/query';
import { resolveMihoyoRegion } from '../model/mihoyo/region';
import { getActIdFromPosts, getActIdFromNav, fetchCodesFromMiyolive } from '../model/mihoyo/exchange';
import { fetchNewsList } from '../model/mihoyo/mysNews';
import { getEHk4eToken, getBirthdayStars, claimBirthdayDraw } from '../model/mihoyo/birthday';
import { fetchAndSavePayData } from '../model/mihoyo/payLog';
import { redeemCode } from '../model/mihoyo/useCode';
import { login } from '../model/mihoyo/exposeLogin';
import { mihoyoKeys } from '../model/keys';
import type { MihoyoGame } from '../model/mihoyo/types';

const string = { type: 'string' } as const;
const game = { type: 'string' as const, enum: ['gs', 'sr', 'zzz'] };
const empty = object({});

function dataAction<I>(
  name: string,
  description: string,
  input: Parameters<typeof action>[1],
  handler: (input: I, userId: string) => unknown | Promise<unknown>,
  effect: 'read' | 'write' = 'read',
  privateOnly = false
) {
  const schema = extraSchemas[name];

  return action<I, { dataJson: string; value: unknown }>(
    description,
    input,
    object({ dataJson: string, value: schema }, ['dataJson', 'value']),
    async (input, userId) => {
      const value = projectOutput(await handler(input, userId), schema);

      return { dataJson: JSON.stringify(value), value };
    },
    effect,
    privateOnly
  );
}
const payHelp = '在米游社App进入客服页面，复制包含authkey的链接，私聊导入后查询充值统计。安卓教程: https://b23.tv/K5qfLad';

export const extraActions = {
  get_help: dataAction('get_help', '查询完整命令帮助', empty, () => readFileSync(new URL('../../README_COMMAND.md', import.meta.url), 'utf8')),
  get_cookie_help: dataAction(
    'get_cookie_help',
    '查询Cookie获取和绑定教程',
    empty,
    () => '浏览器打开miyoushe.com并登录，F12进入Console，输入document.cookie，复制完整输出后私聊绑定。也可使用扫码登录。退出米游社会使Cookie失效。'
  ),
  get_stoken_help: dataAction('get_stoken_help', '查询Stoken绑定教程', empty, () => '私聊发送 stoken=v2_***;stuid=123;mid=***; 或使用扫码登录。'),
  get_all_uids: dataAction('get_all_uids', '查询全部游戏UID及Cookie绑定状态', empty, async (_input, userId) => ({
    gs: await getUserUids(userId, 'gs'),
    sr: await getUserUids(userId, 'sr'),
    zzz: await getUserUids(userId, 'zzz'),
    cookieBound: Boolean(await getUserCookie(userId))
  })),
  get_cookie_status: dataAction('get_cookie_status', '查询Cookie绑定信息，隐藏全部凭据', empty, async (_input, userId) => {
    const value = await getUserCookie(userId);

    return value ? { bound: true, ltuid: value.ltuid, isV2: value.isV2, uids: value.uids } : { bound: false };
  }),
  get_stoken_status: dataAction(
    'get_stoken_status',
    '私聊查询Stoken绑定信息，隐藏全部凭据',
    empty,
    async (_input, userId) => {
      const value = await getUserStoken(userId);

      return value ? { bound: true, stuid: value.stuid, uid: value.uid } : { bound: false };
    },
    'read',
    true
  ),
  check_cookie: dataAction('check_cookie', '实时验证各游戏Cookie状态', empty, async (_input, userId) => {
    const cookie = await getUserCookie(userId);

    if (!cookie) {
      return { bound: false };
    }
    const checks: CookieCheck[] = [];

    for (const game of ['gs', 'sr', 'zzz'] as const) {
      const uid = cookie.uids[game]?.[0];

      if (!uid) {
        checks.push({ game, bound: false });
        continue;
      }
      const res = await mysApiFetch({ uid, game, cookie: cookie.ck, api: 'index', cached: false });

      checks.push({ game, uid, retcode: res?.retcode ?? null, message: res?.message ?? '请求失败' });
    }

    return { bound: true, checks };
  }),
  delete_uid_by_index: dataAction<{ game: MihoyoGame; index?: number }>(
    'delete_uid_by_index',
    '按1起始序号删除UID，省略时删除最后一个',
    object({ game, index: { type: 'integer', minimum: 1 } }, ['game']),
    async (input, userId) => {
      const uids = await getUserUids(userId, input.game);
      const uid = uids[(input.index ?? uids.length) - 1];

      return { success: uid ? await removeUserUid(userId, input.game, uid) : false };
    },
    'write'
  ),
  get_exchange_codes: dataAction<{ game: MihoyoGame }>('get_exchange_codes', '查询官方直播兑换码', object({ game }, ['game']), async input => {
    const act = (await getActIdFromPosts(input.game)) ?? (await getActIdFromNav(input.game));

    return act ? fetchCodesFromMiyolive(act) : { codes: [], message: '暂未获取到直播活动信息' };
  }),
  get_news: dataAction<{ game: MihoyoGame; type?: number; index?: number }>(
    'get_news',
    '查询公告/活动/资讯，type为1/2/3；可按1起始序号查看正文',
    object({ game, type: { type: 'integer', minimum: 1, maximum: 3 }, index: { type: 'integer', minimum: 1, maximum: 10 } }, ['game']),
    async input => {
      const posts = await fetchNewsList({ gs: 2, sr: 6, zzz: 8 }[input.game], input.type ?? 1, 10);

      return input.index ? { post: posts[input.index - 1] ?? null } : { posts };
    }
  ),
  use_exchange_code: dataAction<{ game: MihoyoGame; code: string }>(
    'use_exchange_code',
    '使用兑换码',
    object({ game, code: { type: 'string', minLength: 1, maxLength: 100 } }, ['game', 'code']),
    (input, userId) => {
      if (!/^[a-zA-Z0-9]+$/.test(input.code)) {
        throw new ExposeError('INVALID_INPUT', '兑换码须为字母和数字');
      }

      return redeemCode(userId, input.game, input.code);
    },
    'write'
  ),
  get_gcg_cards: dataAction<{ kind: string }>(
    'get_gcg_cards',
    '查询七圣召唤角色牌/行动牌',
    object({ kind: { type: 'string', enum: ['avatar', 'action'] } }, ['kind']),
    async (input, userId) => {
      const result = await queryMihoyoApi({
        userId,
        game: 'gs',
        api: 'gcgCardList',
        query: { need_avatar: String(input.kind === 'avatar'), need_action: String(input.kind === 'action'), need_map: 'false' }
      });

      return {
        success: result.success,
        message: result.message,
        ...(result.uid ? { uid: result.uid } : {}),
        ...(result.data !== undefined ? { dataJson: JSON.stringify(result.data) } : {})
      };
    }
  ),
  get_gcg_deck: dataAction<{ id: number }>(
    'get_gcg_deck',
    '按牌组ID查看七圣召唤牌组详情',
    object({ id: { type: 'integer', minimum: 1, maximum: 99 } }, ['id']),
    async (input, userId) => {
      const result = await queryMihoyoApi({ userId, game: 'gs', api: 'deckList' });

      return result.success
        ? { success: true, deck: result.data?.deck_list?.find((deck: { id: number }) => String(deck.id) === String(input.id)) ?? null }
        : result;
    }
  ),
  claim_birthday: dataAction(
    'claim_birthday',
    '查询今日生日角色并逐一领取生日卡，返回图片URL和领取结果',
    empty,
    async (_input, userId) => {
      const cookie = await getUserCookie(userId);
      const uid = await getUserMainUid(userId, 'gs');

      if (!cookie || !uid) {
        return { success: false, message: '请先绑定Cookie和原神UID' };
      }
      const region = resolveMihoyoRegion(uid, 'gs');
      const biz = region.type === 'cn' ? 'hk4e_cn' : 'hk4e_global';
      const token = await getEHk4eToken(cookie.ck, uid, region.server, biz);

      if (!token) {
        return { success: false, message: '获取token失败，请刷新Cookie' };
      }
      const roles = await getBirthdayStars(uid, token, cookie.ck, region.server, biz);
      const results: BirthdayClaim[] = [];

      for (const role of roles) {
        results.push({
          name: role.name,
          imageUrl: role.take_picture,
          result: await claimBirthdayDraw(uid, token, cookie.ck, region.server, biz, role.role_id)
        });
      }

      return { results };
    },
    'write'
  ),
  start_login: dataAction('start_login', '私聊开始扫码登录，返回二维码DataURL', empty, (_input, userId) => login(userId, 'start'), 'write', true),
  poll_login: dataAction(
    'poll_login',
    '私聊查询当前用户扫码会话，确认后完成Cookie和Stoken绑定',
    empty,
    (_input, userId) => login(userId, 'poll'),
    'write',
    true
  ),
  cancel_login: dataAction('cancel_login', '私聊取消当前用户扫码会话', empty, (_input, userId) => login(userId, 'cancel'), 'write', true),
  get_pay_help: dataAction('get_pay_help', '充值查询帮助', empty, () => payHelp),
  import_pay_log: dataAction<{ link: string }>(
    'import_pay_log',
    '私聊导入含authkey的客服链接，获取并保存充值统计',
    object({ link: { type: 'string', minLength: 1, maxLength: 20000 } }, ['link']),
    async (input, userId) => {
      const match = input.link.match(/authkey=([^&\s\u4e00-\u9fa5]+)/);

      if (!match) {
        throw new ExposeError('INVALID_INPUT', '链接中没有authkey');
      }
      let key: string;

      try {
        key = decodeURIComponent(match[1]);
      } catch {
        throw new ExposeError('INVALID_INPUT', 'authkey编码无效');
      }
      const errors: string[] = [];
      const data = await fetchAndSavePayData(key, userId, text => {
        errors.push(text);
      });

      return { data, errors };
    },
    'write',
    true
  ),
  get_pay_log: dataAction(
    'get_pay_log',
    '私聊读取当前用户已保存的充值统计',
    empty,
    async (_input, userId) => {
      const raw = await getIoRedis().get(mihoyoKeys.payLogByUser(userId));

      return raw ? JSON.parse(raw) : { message: '暂无充值数据，请导入客服链接' };
    },
    'read',
    true
  ),
  refresh_pay_log: dataAction(
    'refresh_pay_log',
    '私聊使用当前用户已导入的凭据刷新充值统计',
    empty,
    async (_input, userId) => {
      // Only use credentials imported by this user, never another holder of the same UID.
      const redis = getIoRedis();
      const raw = await redis.get(mihoyoKeys.payLogByUser(userId));

      if (!raw) {
        return { message: '请先导入客服链接' };
      }
      const key = await redis.get(mihoyoKeys.authKeyByUser(userId));

      if (!key) {
        return { message: '链接已过期，请重新导入' };
      }
      const errors: string[] = [];

      return {
        data: await fetchAndSavePayData(key, userId, text => {
          errors.push(text);
        }),
        errors
      };
    },
    'write',
    true
  )
};
