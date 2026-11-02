import test from 'node:test';
import assert from 'node:assert/strict';
import { Expose } from 'alemonjs';
import { createTestApp } from 'alemonjs/testing';
import { resolveLedgerMonth, formatLedgerMonth } from '../lib/model/mihoyo/ledger.js';
import { mhyExpose } from '../lib/expose/index.js';

test('ledger resolves year and three-month boundary for every calendar month', () => {
  for (let current = 0; current < 12; current++) {
    const now = new Date(2026, current, 15);
    const allowed = new Set();
    for (let offset = 0; offset < 3; offset++) {
      const expected = new Date(2026, current - offset, 1);
      const month = expected.getMonth() + 1;
      allowed.add(month);
      const period = resolveLedgerMonth(month, now);
      assert.deepEqual(period, { month, year: expected.getFullYear() });
      assert.equal(formatLedgerMonth(period, 'sr'), `${expected.getFullYear()}${String(month).padStart(2, '0')}`);
      assert.equal(formatLedgerMonth(period, 'gs'), String(month));
    }
    for (let month = 1; month <= 12; month++) {
      if (!allowed.has(month)) assert.equal(resolveLedgerMonth(month, now), null);
    }
  }
});

test('structured Expose result is validated, not just its JSON string', async () => {
  const app = createTestApp({ config: { 'alemonjs-mhy': { expose: { allowed_callers: ['caller'] } } } });
  const config = mhyExpose.getConfigs()[0];
  const good = config.actions.get_cookie_status;
  assert.deepEqual(good.outputSchema.required, ['dataJson', 'value']);
  // Deliberately return malformed data using the real action's contract.
  const provider = Expose.create().provide({
    name: 'contract-test',
    description: 'Fixture for output validation',
    actions: {
      invalid: Expose.action({ ...good, authorize: () => true, handler: () => ({ dataJson: '{"bound":"yes"}', value: { bound: 'yes' } }) })
    }
  });
  try {
    await app.mount({ expose: provider }, {}, 'contract-provider');
    const event = app.events.privateMessage({}, { Platform: 'qq-bot', BotId: 'bot', UserId: 'user' });
    const result = await app.invoke(event, () => Expose.create().call('contract-test', 'contract-provider', 'invalid', {}), 'caller');
    assert.equal(result.value.ok, false);
    assert.equal(result.value.error.code, 'INVALID_OUTPUT');
  } finally {
    await app.dispose();
  }
});
