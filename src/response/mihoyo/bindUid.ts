/**
 * 绑定UID 响应处理
 * 命令: #绑定uid123456789 / #原神绑定uid / #星铁绑定uid / #绝区零绑定uid
 */
import { addUserUid, getUserUids } from '@src/model/mihoyo/account';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const GAME_PREFIX_MAP: Record<string, MihoyoGame> = {
  原神: 'gs',
  星铁: 'sr',
  绝区零: 'zzz'
};

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

// 各游戏 UID 的正则模式
const UID_PATTERNS: Record<MihoyoGame, RegExp> = {
  gs: /(18|[1-9])\d{8}/,
  sr: /(18|[1-9])\d{8}/,
  zzz: /(1[0-9]|[1-9])\d{8}|[1-9]\d{7}/
};

const resolveGame = (text: string): MihoyoGame => {
  for (const [prefix, game] of Object.entries(GAME_PREFIX_MAP)) {
    if (text.includes(prefix)) {
      return game;
    }
  }

  return 'gs';
};

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';

  // 识别游戏类型
  const game = resolveGame(text);
  const pattern = UID_PATTERNS[game];
  const match = text.match(pattern);

  if (!match) {
    const md = Format.createMarkdown();

    md.addText(`请输入正确的${GAME_NAMES[game]}UID`);
    md.addNewline();
    md.addText(`示例: /${game === 'gs' ? '原神' : game === 'sr' ? '星铁' : '绝区零'}绑定uid 100000001`);
    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const uid = match[0];

  await addUserUid(userId, game, uid);

  // 获取当前绑定列表
  const allUids = await getUserUids(userId, game);
  const md = Format.createMarkdown();

  md.addText(`【${GAME_NAMES[game]}】UID绑定成功`);
  md.addNewline();
  md.addText(`当前绑定: ${allUids.join(', ')}`);

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
