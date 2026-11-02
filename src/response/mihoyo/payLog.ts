import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { fetchAndSavePayData, formatPayData } from '@src/model/mihoyo/payLog';
import { getIoRedis } from '@alemonjs/db';
import { mihoyoKeys } from '@src/model/keys';
import { getUserMainUid } from '@src/model/mihoyo/account';
import type { PayLogData } from '@src/model/mihoyo/payLog';
export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;
  const text = e.MessageText ?? '';
  const redis = getIoRedis();

  const sendText = (content: string) => {
    const md = Format.createMarkdown();

    md.addText(content);

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });
  };

  // ── 帮助命令 ──
  if (/帮助/.test(text)) {
    sendText(
      [
        '【充值记录 使用帮助】',
        '',
        '1. 在米游社App中进入客服页面',
        '2. 复制页面链接(包含authkey)',
        '3. 私聊发送该链接',
        '4. 发送 #充值记录 查看统计',
        '',
        '安卓教程: https://b23.tv/K5qfLad'
      ].join('\n')
    );

    return;
  }

  // ── 处理 authkey 链接 ──
  if (/authkey=/.test(text)) {
    const match = text.match(/authkey=([^&\s\u4e00-\u9fa5]+)/);

    if (!match) {
      sendText('链接无效，未找到authkey，请重新发送');

      return;
    }

    const authkey = decodeURIComponent(match[1]);

    sendText('正在获取充值数据，可能需要30秒...');

    const payData = await fetchAndSavePayData(authkey, userId, sendText);

    if (payData) {
      sendText(formatPayData(payData));
    }

    return;
  }

  // ── 更新命令 ──
  if (/更新/.test(text)) {
    const uid = await getUserMainUid(userId, 'gs');

    if (uid) {
      const savedKey = await redis.get(mihoyoKeys.authKeyByUser(userId));

      if (savedKey) {
        sendText('正在更新充值数据...');

        const payData = await fetchAndSavePayData(savedKey, userId, sendText);

        if (payData) {
          sendText(formatPayData(payData));
        }

        return;
      }
    }

    sendText('请先私聊发送米游社客服页面链接\n可发送 #充值帮助 查看教程');

    return;
  }

  // ── 查看记录 ──
  const cached = await redis.get(mihoyoKeys.payLogByUser(userId));

  if (cached) {
    const payData = JSON.parse(cached) as PayLogData;

    sendText(formatPayData(payData) + '\n\n发送 #更新充值记录 可刷新数据');

    return;
  }

  // 尝试使用已有 authkey
  const uid = await getUserMainUid(userId, 'gs');

  if (uid) {
    const savedKey = await redis.get(mihoyoKeys.authKeyByUser(userId));

    if (savedKey) {
      sendText('正在获取充值数据...');

      const payData = await fetchAndSavePayData(savedKey, userId, sendText);

      if (payData) {
        sendText(formatPayData(payData));

        return;
      }
    }
  }

  sendText('暂无充值数据，请私聊发送米游社客服页面链接\n可发送 #充值帮助 查看教程');
};
