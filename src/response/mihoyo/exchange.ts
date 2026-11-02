import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { getActIdFromPosts, getActIdFromNav, fetchCodesFromMiyolive } from '@src/model/mihoyo/exchange';
import type { MihoyoGame } from '@src/model/mihoyo/types';
const GAME_NAMES = { gs: '原神', sr: '星穹铁道', zzz: '绝区零' };
const resolveGame = (text: string): MihoyoGame => {
  if (/星铁|崩铁/.test(text)) {
    return 'sr';
  }
  if (/绝区零/.test(text)) {
    return 'zzz';
  }

  return 'gs';
};

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const text = e.MessageText ?? '';
  const game = resolveGame(text);

  const md = Format.createMarkdown();

  // 1. 从帖子获取 act_id
  let actId = await getActIdFromPosts(game);

  // 2. 备选: 从导航栏获取
  actId ??= await getActIdFromNav(game);

  if (!actId) {
    md.addText(`【${GAME_NAMES[game]}·兑换码】\n\n暂未获取到直播活动信息`);

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 3. 通过 miyolive API 获取兑换码
  const { codes, title, deadline } = await fetchCodesFromMiyolive(actId);

  if (codes.length === 0) {
    md.addText(`【${title || GAME_NAMES[game]}·兑换码】\n\n暂无可用兑换码，可能尚未发布或已过期`);
  } else {
    const lines: string[] = [`【${title || GAME_NAMES[game]}·兑换码】`, '', ...codes.map((code, i) => `${i + 1}. ${code}`)];

    if (deadline) {
      lines.push('', `过期时间: ${deadline}`);
    }

    md.addText(lines.join('\n'));
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
