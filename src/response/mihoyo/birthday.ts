import { createEvent, EventsEnum, Format, useMessage } from 'alemonjs';
import { getEHk4eToken, getBirthdayStars, claimBirthdayDraw } from '@src/model/mihoyo/birthday';
import { getUserCookie, getUserMainUid } from '@src/model/mihoyo/account';
import { resolveMihoyoRegion } from '@src/model/mihoyo/region';
export default async (e: EventsEnum) => {
  const event = createEvent({
    event: e,
    selects: ['message.create', 'private.message.create']
  });

  const [message] = useMessage(event);
  const userId = event.UserId;

  const game = 'gs' as const;

  const cookieData = await getUserCookie(userId);

  if (!cookieData) {
    const md = Format.createMarkdown();

    md.addText('[留影叙佳期] 请先绑定Cookie');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const uid = await getUserMainUid(userId, game);

  if (!uid) {
    const md = Format.createMarkdown();

    md.addText('[留影叙佳期] 请先绑定原神UID');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  const region = resolveMihoyoRegion(uid, game);
  const gameBiz = region.type === 'cn' ? 'hk4e_cn' : 'hk4e_global';

  // 获取 token
  const token = await getEHk4eToken(cookieData.ck, uid, region.server, gameBiz);

  if (!token) {
    const md = Format.createMarkdown();

    md.addText('[留影叙佳期] 获取token失败，请刷新Cookie后重试');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 获取今日生日角色
  const roles = await getBirthdayStars(uid, token, cookieData.ck, region.server, gameBiz);

  if (roles.length === 0) {
    const md = Format.createMarkdown();

    md.addText('[留影叙佳期] 今天没有生日角色哦~');

    const format = Format.create();

    format.addMarkdown(md);
    void message.send({ format });

    return;
  }

  // 逐个处理生日角色
  for (const role of roles) {
    // 发送角色图片
    if (role.take_picture) {
      try {
        const imgRes = await fetch(role.take_picture);

        if (imgRes.ok) {
          const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
          const imgFormat = Format.create();

          imgFormat.addImage(imgBuffer);
          void message.send({ format: imgFormat });
        }
      } catch {
        // 图片获取失败，跳过
      }
    }

    // 领取生日卡片
    const result = await claimBirthdayDraw(uid, token, cookieData.ck, region.server, gameBiz, role.role_id);
    const resMd = Format.createMarkdown();

    if (result === 'success') {
      resMd.addText(`${role.name}的生日卡片领取成功~`);
    } else {
      resMd.addText(`${role.name}: ${result}`);
    }

    const resFormat = Format.create();

    resFormat.addMarkdown(resMd);
    void message.send({ format: resFormat });
  }
};
