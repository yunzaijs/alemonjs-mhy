import { resolveLedgerMonth, formatLedgerMonth } from '@src/model/mihoyo/ledger';
/**
 * 札记 / 原石统计 / 星琼统计
 * 命令: #札记 / #原石 / #星琼 / #原石6月
 */
import LedgerCard, { type LedgerData } from '@src/img/views/LedgerCard.js';
import { queryMihoyoApi } from '@src/model/mihoyo/query';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const resolveGame = (text: string): MihoyoGame => {
  if (text.includes('星铁') || text.includes('星琼')) {
    return 'sr';
  }

  return 'gs';
};

const MONTH_CN: Record<string, number> = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  十一: 11,
  十二: 12
};

const parseMonth = (text: string): number => {
  const cleaned = text.replace(/[#!！/＃]|原神|星铁|原石|星琼|札记/g, '').trim();

  if (!cleaned) {
    return new Date().getMonth() + 1;
  }

  const monthStr = cleaned.replace(/月$/, '');

  // 数字月份
  const num = Number(monthStr);

  if (!isNaN(num) && num >= 1 && num <= 12) {
    return num;
  }

  // 中文月份
  if (MONTH_CN[monthStr] !== undefined) {
    return MONTH_CN[monthStr];
  }

  return new Date().getMonth() + 1;
};

// ─── 入口 ────────────────────────────────────────────

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';
  const game = resolveGame(text);

  if (game === 'zzz') {
    const md = Format.createMarkdown();

    md.addText('绝区零暂不支持札记查询');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const month = parseMonth(text);

  const period = resolveLedgerMonth(month);

  if (!period) {
    const md = Format.createMarkdown();

    md.addText('札记仅支持查询最近三个月的数据');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 星铁月份格式为 YYYYMM
  const queryMonth = formatLedgerMonth(period, game);

  const result = await queryMihoyoApi({
    userId,
    game,
    api: 'ys_ledger',
    query: { month: queryMonth },
    cached: false
  });

  const format = Format.create();

  if (!result.success) {
    const md = Format.createMarkdown();

    md.addText(`[${GAME_NAMES[game]}札记] ${result.message}`);
    format.addMarkdown(md);
  } else {
    const cardData = { ...result.data, game, uid: result.uid ?? '' } as LedgerData;
    const img = await renderComponentIsHtmlToBuffer(LedgerCard, { data: cardData });

    format.addImage(img);
  }

  void message.send({ format });
};
