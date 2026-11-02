import type { MysNewsData } from '@src/img/views/MysNewsCard.js';
import MysNewsCard from '@src/img/views/MysNewsCard.js';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';
import { fetchNewsList } from '@src/model/mihoyo/mysNews';
import type { MihoyoGame } from '@src/model/mihoyo/types';
const resolveGame = (text: string): MihoyoGame => {
  if (text.includes('星铁')) {
    return 'sr';
  }

  if (text.includes('绝区零')) {
    return 'zzz';
  }

  return 'gs';
};

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

const GAME_GID: Record<MihoyoGame, number> = {
  gs: 2,
  sr: 6,
  zzz: 8
};

const formatDate = (timestamp: number): string => {
  const d = new Date(timestamp * 1000);

  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ─── 入口 ────────────────────────────────────────────

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const text = e.MessageText ?? '';
  const game = resolveGame(text);
  const gameName = GAME_NAMES[game];

  let type = 1;
  let typeName = '公告';

  if (text.includes('资讯')) {
    type = 3;
    typeName = '资讯';
  } else if (text.includes('活动')) {
    type = 2;
    typeName = '活动';
  }

  // 解析页码
  const pageMatch = text.match(/\d+$/);
  const requestedPage = pageMatch ? Number(pageMatch[0]) : 0;

  const gid = GAME_GID[game];
  const posts = await fetchNewsList(gid, type, 10);

  let cardData: MysNewsData;

  if (requestedPage > 0 && requestedPage <= posts.length) {
    const post = posts[requestedPage - 1];
    let content = post.post.content;

    content = content.replace(/<[^>]+>/g, '');
    content = content.replace(/\s+/g, ' ').trim();
    const maxLen = 500;

    if (content.length > maxLen) {
      content = content.slice(0, maxLen) + '...';
    }

    cardData = {
      mode: 'detail',
      game: gameName,
      typeName,
      subject: post.post.subject,
      date: formatDate(post.post.created_at),
      content
    };
  } else {
    cardData = {
      mode: 'list',
      game: gameName,
      typeName,
      items: posts.map(p => ({
        subject: p.post.subject,
        date: formatDate(p.post.created_at)
      }))
    };
  }

  const img = await renderComponentIsHtmlToBuffer(MysNewsCard, { data: cardData });
  const format = Format.create();

  format.addImage(img);
  void message.send({ format });
};
