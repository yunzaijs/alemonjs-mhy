/**
 * 绑定Stoken 响应处理
 * 命令: stoken=*** / #绑定stoken
 */
import { bindStoken, buildStokenCookie, deleteUserStoken, getUserStoken } from '@src/model/mihoyo/stoken';
import type { MihoyoGame } from '@src/model/mihoyo/types';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';

const gameNames: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const isPrivate = /private/.test(event.name);
  const rawText = e.MessageText ?? '';

  // #绑定stoken 命令 → 提示用法
  if (/^(!|！|\/|#|＃)绑定stoken$/i.test(rawText)) {
    const md = Format.createMarkdown();

    md.addText('请在【私聊】中直接发送你的stoken');
    md.addNewline();
    md.addText('格式: stoken=v2_***;stuid=123;mid=***;');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // #我的stoken → 查看绑定数据
  if (/^(!|！|\/|#|＃)我的stoken$/i.test(rawText)) {
    if (!isPrivate) {
      const md = Format.createMarkdown();

      md.addText('请私聊查看stoken信息');

      const format = Format.create();

      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    const data = await getUserStoken(userId);

    if (!data) {
      const md = Format.createMarkdown();

      md.addText('未绑定stoken');

      const format = Format.create();

      format.addMarkdown(md);
      void message.send({ format });

      return;
    }

    const md = Format.createMarkdown();

    md.addText(buildStokenCookie(data));

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // #删除stoken → 删除绑定
  if (/^(!|！|\/|#|＃)删除(我的)?stoken$/i.test(rawText)) {
    const deleted = await deleteUserStoken(userId);
    const md = Format.createMarkdown();

    md.addText(deleted ? 'stoken已删除' : '未绑定stoken，无需删除');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // stoken=*** 直接绑定
  if (!isPrivate) {
    const md = Format.createMarkdown();

    md.addText('请在【私聊】中发送stoken，不要在群里发送！');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const result = await bindStoken(userId, rawText);
  const md = Format.createMarkdown();

  md.addText(result.message);
  md.addNewline();

  if (result.success && result.uids) {
    const lines: string[] = [];

    for (const game of ['gs', 'sr', 'zzz'] as MihoyoGame[]) {
      const uids = result.uids[game];

      if (uids.length > 0) {
        lines.push(`【${gameNames[game]}】: ${uids.join(', ')}`);
      }
    }

    if (lines.length > 0) {
      md.addText(lines.join('\n'));
      md.addNewline();
    }

    md.addText('可用指令:');
    md.addNewline();
    md.addText('/原神签到 / /星铁签到 / #全部签到');
    md.addNewline();
    md.addText('/米游社签到 (获取米游币)');
    md.addNewline();
    md.addText('#我的stoken / #删除stoken');
  }

  const format = Format.create();

  format.addMarkdown(md);
  void message.send({ format });
};
