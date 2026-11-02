import test from 'node:test';
import assert from 'node:assert/strict';
import { Expose } from 'alemonjs';
import { createTestApp } from 'alemonjs/testing';
import { mhyExpose } from '../lib/expose/index.js';

test('Expose contracts, caller authorization and message identity', async () => {
  const app = createTestApp({ config: { 'alemonjs-mhy': { expose: { allowed_callers: ['caller'] } } } });
  try {
    await app.mount({ expose: mhyExpose }, {}, 'alemonjs-mhy');
    const client = Expose.create();
    const event = app.events.privateMessage({}, { Platform: 'qq-bot', BotId: 'bot', UserId: 'user' });
    const call = async (action, input, caller = 'caller', source = event) => {
      const result = await app.invoke(source, () => client.call('mhy', 'alemonjs-mhy', action, input), caller);
      assert.equal(result.actions.length, 0);
      return result.value;
    };
    const actions = mhyExpose.getConfigs()[0].actions;
    assert.equal(Object.keys(actions).length, 38);
    for (const action of Object.values(actions)) {
      assert.ok(action.inputSchema);
      assert.ok(action.outputSchema);
      assert.ok(['read', 'write'].includes(action.effect));
    }
    for (const [action, input] of [
      ['get_uids', { game: 'gs', userId: 'victim' }],
      ['get_daily_note', { game: 'bad' }],
      ['get_role_combat', { game: 'sr' }],
      ['get_spiral_abyss', { game: 'gs', scheduleType: 0 }],
      ['get_ledger', { game: 'gs', month: 13 }],
      ['bind_uid', { game: 'gs', uid: 'abcdefgh' }],
      ['get_daily_note', { game: 'gs', api: 'useCdk' }],
      ['game_sign', { game: 'zzz' }]
    ]) {
      assert.equal((await call(action, input)).error.code, 'INVALID_INPUT', action);
    }
    // Invalid cookies stop in the real parser before any Redis or network access.
    const bound = await call('bind_cookie', { cookie: 'invalid' });
    assert.equal(bound.ok, true);
    assert.equal(bound.data.success, false);
    assert.deepEqual(Object.keys(bound.data).sort(), ['message', 'success']);
    assert.equal((await call('get_uids', { game: 'gs' }, 'other')).error.code, 'FORBIDDEN');
    assert.equal((await call('get_uids', { game: 'gs' }, 'caller', { ...event, UserId: '' })).error.code, 'FORBIDDEN');
    const group = app.events.groupMessage({}, { Platform: 'qq-bot', BotId: 'bot', UserId: 'user' });
    assert.equal((await call('bind_cookie', { cookie: 'invalid' }, 'caller', group)).error.code, 'FORBIDDEN');
    for (const [name, input] of [
      ['start_login', {}],
      ['poll_login', {}],
      ['cancel_login', {}],
      ['get_stoken_status', {}],
      ['get_pay_log', {}],
      ['refresh_pay_log', {}],
      ['import_pay_log', { link: 'authkey=a' }]
    ])
      assert.equal((await call(name, input, 'caller', group)).error.code, 'FORBIDDEN', name);
    for (const [name, input] of [
      ['get_news', { game: 'gs', index: 11 }],
      ['get_gcg_cards', { kind: 'invalid' }],
      ['get_gcg_deck', { id: 0 }],
      ['poll_login', { ticket: 'foreign' }],
      ['import_pay_log', { link: 'authkey=%XX' }],
      ['use_exchange_code', { game: 'gs', code: '   ' }]
    ])
      assert.equal((await call(name, input)).error.code, 'INVALID_INPUT', name);
    for (const expose of [{ enabled: false }, { allowed_callers: [] }, { allowed_callers: 'caller' }]) {
      app.configure({ 'alemonjs-mhy': { expose } });
      assert.equal((await call('get_uids', { game: 'gs' })).error.code, 'FORBIDDEN');
    }
  } finally {
    await app.dispose();
  }
});

test('every registered route and Expose action has a coverage mapping', async () => {
  const { readFile } = await import('node:fs/promises');
  const router = await readFile(new URL('../src/response/router.ts', import.meta.url), 'utf8');
  const coverage = JSON.parse(await readFile(new URL('./expose-coverage.json', import.meta.url), 'utf8'));
  const routes = [...router.matchAll(/regular: mihoyoRouteRules\.(\w+)/g)].map(match => match[1]);
  assert.deepEqual(Object.keys(coverage).sort(), routes.sort());
  const actions = mhyExpose.getConfigs()[0].actions;
  for (const [route, names] of Object.entries(coverage)) {
    assert.ok(names.length, route);
    for (const name of names) assert.ok(actions[name], `${route}: ${name}`);
  }
  assert.deepEqual([...new Set(Object.values(coverage).flat())].sort(), Object.keys(actions).sort());
});
