import { redeemCode } from '@src/model/mihoyo/useCode';
/**
 * 兑换码使用
 * 命令: #兑换码使用XXXX / #原神兑换码使用XXXX / #cdk-uXXXX
 */
import { getUserCookie, getUserMainUid } from '@src/model/mihoyo/account';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

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
  const userId = event.UserId;
  const text = e.MessageText ?? '';
  const game = resolveGame(text);

  // 提取兑换码
  const cdkCode = text.replace(/^(!|！|\/|#|＃)(原神|星铁|崩铁|绝区零)?(兑换码使用|cdk-u)/i, '').trim();

  if (!cdkCode) {
    const md = Format.createMarkdown();

    md.addText('请在命令后输入兑换码，如: #兑换码使用ABCD1234');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const cookieData = await getUserCookie(userId);

  if (!cookieData) {
    const md = Format.createMarkdown();

    md.addText('尚未绑定Cookie，请先绑定后再使用兑换码');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const uid = await getUserMainUid(userId, game);

  if (!uid) {
    const md = Format.createMarkdown();

    md.addText(`尚未绑定${GAME_NAMES[game]}UID`);

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const md = Format.createMarkdown();

  md.addText(await redeemCode(userId, game, cdkCode));

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
