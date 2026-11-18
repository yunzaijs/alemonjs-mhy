import MihoyoHelp, { MHY_TOTAL_PAGES } from '@src/img/views/MihoyoHelp';
import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { renderComponentIsHtmlToBuffer } from 'jsxp';

export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);

  const text = e.MessageText ?? '';
  const game = /米游社|米哈游|mhy|mihoyo/i.test(text)
    ? 'mhy'
    : /星铁|星穹铁道|崩铁/.test(text)
      ? 'sr'
      : /绝区零|zzz|邦布/i.test(text)
        ? 'zzz'
        : 'gs';
  const pageMatch = e.MessageText.match(/(\d+)/);
  let page = pageMatch ? parseInt(pageMatch[1]) : 1;

  if (page < 1) {
    page = 1;
  }

  if (page > MHY_TOTAL_PAGES) {
    page = MHY_TOTAL_PAGES;
  }

  const img = await renderComponentIsHtmlToBuffer(MihoyoHelp, {
    data: { page, totalPages: MHY_TOTAL_PAGES, game }
  });

  if (typeof img === 'boolean') {
    const format = Format.create();

    const md = Format.createMarkdown();

    md.addText('米游社帮助图片加载失败，请稍后重试');
    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const format = Format.create();

  format.addImage(img);
  void message.send({ format });
};
