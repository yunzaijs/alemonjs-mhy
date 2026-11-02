import test from 'node:test';
import assert from 'node:assert/strict';
import { Expose, logger } from 'alemonjs';
import { createTestApp } from 'alemonjs/testing';
import { mhyExpose } from '../lib/expose/index.js';
import { mihoyoKeys as keys } from '../lib/model/keys.js';

test('shared services run through Expose with isolated Redis and HTTP fixtures', async t => {
  const previous = { redis: globalThis.ioRedis, fetch: globalThis.fetch, logger: globalThis.logger };
  const store = new Map();
  globalThis.logger = logger;
  globalThis.ioRedis = {
    get: async key => store.get(key) ?? null,
    setex: async (key, _ttl, value) => {
      store.set(key, value);
      return 'OK';
    },
    exists: async key => Number(store.has(key)),
    del: async key => Number(store.delete(key))
  };
  const requests = [];
  let qrState = 'Scanned';
  let qrFetchGate;
  let failQrFetch = false;
  globalThis.fetch = async (input, options) => {
    const url = new URL(String(input));
    requests.push({ url, options });
    let data = {};
    if (url.pathname.endsWith('/qrcode/fetch')) {
      if (qrFetchGate) await qrFetchGate;
      if (failQrFetch) throw new Error('fixture network failure');
      data = { url: 'https://example.test/qr?ticket=PRIVATE_TICKET' };
    } else if (url.pathname.endsWith('/qrcode/query'))
      data = { stat: qrState, ...(qrState === 'Confirmed' ? { payload: { raw: JSON.stringify({ uid: '1', token: 'PRIVATE_GAME_TOKEN' }) } } : {}) };
    else if (url.pathname.endsWith('/getTokenByGameToken')) data = { token: { token: 'PRIVATE_STOKEN' }, user_info: { aid: '1', mid: 'PRIVATE_MID' } };
    else if (url.pathname.endsWith('/getCookieAccountInfoByGameToken')) data = { cookie_token: 'PRIVATE_COOKIE' };
    else if (url.pathname.endsWith('/getLTokenBySToken')) data = { ltoken: 'PRIVATE_LTOKEN' };
    else if (url.pathname.includes('getUserGameRolesByCookie'))
      data = { list: [{ game_uid: '100000002', game_biz: 'hk4e_cn', region: 'cn_gf01', nickname: 'fixture' }] };
    else if (url.pathname.endsWith('/GetUserInfo')) data = { uid: '100000001' };
    else if (url.pathname.endsWith('/GetCrystalLog')) data = { list: [{ id: '1', add_num: '60', datetime: 'today' }] };
    else if (url.pathname.endsWith('/getNewsList')) data = { list: [{ post: { post_id: '1', subject: '公告', content: '正文', created_at: 1 } }] };
    else if (url.pathname.endsWith('/user_instant/list')) data = { list: [{ post: { post: { structured_content: 'act_id=fixture' } } }] };
    else if (url.pathname.endsWith('/miyolive/index')) data = { live: { title: '直播', code_ver: 1, remain: 0 } };
    else if (url.pathname.endsWith('/refreshCode')) data = { code_list: [{ code: 'CODE123' }] };
    else if (url.pathname.endsWith('/birthdaystar/account/index'))
      data = { role: [{ role_id: 1, name: '角色', take_picture: 'https://example.test/card.png' }] };
    else if (url.pathname.endsWith('/getFp')) data = { device_fp: 'fixture-fp' };
    else if (url.pathname.endsWith('/deckList')) data = { deck_list: [{ id: 1, name: '牌组' }] };
    else if (url.pathname.endsWith('/monthInfo') || url.pathname.endsWith('/month_info')) data = { month: url.searchParams.get('month') };
    return new Response(JSON.stringify({ retcode: 0, message: 'OK', data }), {
      headers: { 'set-cookie': 'e_hk4e_token=PRIVATE_TOKEN;' }
    });
  };
  const app = createTestApp({ config: { 'alemonjs-mhy': { expose: { allowed_callers: ['caller'] } } } });
  try {
    await app.mount({ expose: mhyExpose }, {}, 'alemonjs-mhy');
    const client = Expose.create();
    const event = app.events.privateMessage({}, { Platform: 'qq-bot', BotId: 'bot', UserId: 'user' });
    async function call(action, input = {}, user = 'user') {
      const result = await app.invoke({ ...event, UserId: user }, () => client.call('mhy', 'alemonjs-mhy', action, input), 'caller');
      assert.equal(result.actions.length, 0, action);
      assert.equal(result.value.ok, true, JSON.stringify(result.value));
      const value = result.value.data;
      return Object.hasOwn(value, 'value') ? value.value : value;
    }
    assert.ok((await call('get_help')).includes('#'));
    for (const name of ['get_cookie_help', 'get_stoken_help', 'get_pay_help']) assert.ok((await call(name)).length);
    await call('bind_uid', { game: 'gs', uid: '100000001' });
    await call('bind_uid', { game: 'gs', uid: '100000002' });
    assert.equal((await call('get_all_uids')).gs.length, 2);
    await call('delete_uid_by_index', { game: 'gs', index: 1 });
    assert.deepEqual((await call('get_uids', { game: 'gs' })).uids, ['100000002']);
    assert.equal((await call('get_cookie_status')).bound, false);
    store.set(keys.cookieByUser('user'), JSON.stringify({ ck: 'PRIVATE_COOKIE', ltuid: '1', isV2: true, uids: { gs: ['100000002'], sr: [], zzz: [] } }));
    store.set(keys.stokenByUser('user'), JSON.stringify({ stuid: '1', stoken: 'PRIVATE_STOKEN', uid: '100000002' }));
    assert.equal((await call('get_cookie_status')).bound, true);
    assert.equal((await call('get_stoken_status')).bound, true);
    assert.equal((await call('check_cookie')).checks[0].retcode, 0);
    assert.equal((await call('get_news', { game: 'gs', index: 1 })).post.post.subject, '公告');
    assert.deepEqual((await call('get_exchange_codes', { game: 'gs' })).codes, ['CODE123']);
    assert.ok((await call('use_exchange_code', { game: 'gs', code: 'CODE123' })).includes('兑换成功'));
    assert.equal((await call('get_gcg_deck', { id: 1 })).deck.name, '牌组');
    assert.equal((await call('get_gcg_cards', { kind: 'action' })).success, true);
    assert.equal((await call('claim_birthday')).results[0].result, 'success');
    const started = await call('start_login');
    assert.ok(started.qrDataUrl.startsWith('data:image/png;base64,'));
    assert.equal((await call('poll_login', {}, 'other')).status, 'expired');
    assert.equal((await call('poll_login')).status, 'Scanned');
    qrState = 'Expired';
    assert.equal((await call('poll_login')).status, 'Expired');
    assert.equal(store.has(keys.qrLoginLock('user')), false);
    await call('start_login');
    await call('cancel_login');
    assert.equal((await call('poll_login')).status, 'expired');
    await call('start_login');
    qrState = 'Confirmed';
    const confirmed = await call('poll_login');
    assert.equal(confirmed.status, 'Confirmed');
    assert.equal(store.has(keys.qrLoginLock('user')), false);
    assert.ok(JSON.parse(store.get(keys.stokenByUser('user'))).stoken);
    assert.equal(JSON.stringify(confirmed).includes('PRIVATE_'), false);
    for (const [action, game] of [
      ['get_daily_note', 'gs'],
      ['get_player_index', 'sr'],
      ['get_characters', 'gs'],
      ['get_spiral_abyss', 'gs'],
      ['get_role_combat', 'gs'],
      ['get_buddy', 'zzz']
    ]) {
      // Unsupported/unbound accounts are ordinary business failures, not fabricated results.
      const result = await call(action, { game });
      assert.equal(typeof result.success, 'boolean');
    }
    // A failed start must release its lock, and concurrent calls must not replace the active session.
    await call('cancel_login');
    failQrFetch = true;
    assert.equal((await call('start_login')).status, 'error');
    failQrFetch = false;
    let releaseQr;
    qrFetchGate = new Promise(resolve => {
      releaseQr = resolve;
    });
    const beforeStart = requests.length;
    const pendingStart = call('start_login');
    // The HTTP fixture signals that the first start holds the lock.
    while (requests.length === beforeStart) await new Promise(resolve => setImmediate(resolve));
    const blocked = await app.invoke(event, () => client.call('mhy', 'alemonjs-mhy', 'start_login', {}), 'caller');
    assert.equal(blocked.value.ok, false);
    assert.equal(blocked.value.error.code, 'FORBIDDEN');
    releaseQr();
    assert.equal((await pendingStart).status, 'waiting');
    qrFetchGate = undefined;
    await call('cancel_login');
    // Verify the resolved cross-year month actually reaches the HTTP request through Expose.
    store.set(keys.uidByUserAndGame('user', 'sr'), JSON.stringify(['800000001']));
    t.mock.timers.enable({ apis: ['Date'], now: new Date(2026, 0, 15) });
    try {
      const ledger = await call('get_ledger', { game: 'sr', month: 12 });
      assert.equal(ledger.success, true);
      const request = requests.filter(item => item.url.pathname.endsWith('/month_info')).at(-1);
      assert.equal(request.url.searchParams.get('month'), '202512');
      const rejected = await app.invoke(event, () => client.call('mhy', 'alemonjs-mhy', 'get_ledger', { game: 'sr', month: 10 }), 'caller');
      assert.equal(rejected.value.error.code, 'INVALID_INPUT');
    } finally {
      t.mock.timers.reset();
    }
    const pay = await call('import_pay_log', { link: 'https://example.test/?authkey=PRIVATE_AUTHKEY' });
    assert.equal(pay.data.totalRmb, 6);
    assert.equal((await call('get_pay_log')).crystal, 60);
    assert.equal((await call('refresh_pay_log')).data.records, 1);
    // Both users import credentials for the SAME UID: refresh must keep each user's own key.
    await call('import_pay_log', { link: 'https://example.test/?authkey=OTHER_AUTHKEY' }, 'other');
    await call('refresh_pay_log');
    const ownRefresh = requests.filter(request => request.url.pathname.endsWith('/GetUserInfo')).at(-1);
    assert.equal(ownRefresh.url.searchParams.get('authkey'), 'PRIVATE_AUTHKEY');
    store.delete(keys.authKeyByUser('user'));
    const expiredBefore = requests.length;
    assert.ok((await call('refresh_pay_log')).message.includes('过期'));
    assert.equal(requests.length, expiredBefore, 'must not fall back to shared UID credentials');
    store.delete(keys.payLogByUser('other'));
    const before = requests.length;
    await call('refresh_pay_log', {}, 'other');
    assert.equal(requests.length, before, 'another user cannot use the imported authkey');
    for (const name of ['get_cookie_status', 'get_stoken_status', 'get_pay_log']) {
      const value = JSON.stringify(await call(name));
      for (const secret of ['PRIVATE_COOKIE', 'PRIVATE_STOKEN', 'PRIVATE_AUTHKEY', 'PRIVATE_TOKEN', 'PRIVATE_TICKET'])
        assert.equal(value.includes(secret), false);
    }
  } finally {
    await app.dispose();
    globalThis.fetch = previous.fetch;
    globalThis.ioRedis = previous.redis;
    globalThis.logger = previous.logger;
  }
});
