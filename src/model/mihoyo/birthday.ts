/**
 * 留影叙佳期
 * 命令: #留影叙佳期 / #留影 / #领生日卡 / #生日卡
 * 仅支持原神
 */

const ACTIVITY_ID = '20220301153521';

/** 获取 e_hk4e_token */
export const getEHk4eToken = async (cookie: string, uid: string, region: string, gameBiz: string): Promise<string | null> => {
  const isCn = region.includes('cn');
  const url = isCn ? 'https://api-takumi.mihoyo.com/common/badge/v1/login/account' : 'https://api-os-takumi.mihoyo.com/common/badge/v1/login/account';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        'Content-Type': 'application/json;charset=UTF-8',
        Referer: 'https://webstatic.mihoyo.com/',
        Origin: 'https://webstatic.mihoyo.com'
      },
      body: JSON.stringify({
        uid: Number(uid),
        game_biz: gameBiz,
        lang: 'zh-cn',
        region
      })
    });

    const setCookie = res.headers.get('set-cookie');
    const tokenMatch = setCookie?.match(/e_hk4e_token=(.*?);/);

    if (!tokenMatch) {
      return null;
    }

    const json = (await res.json()) as { retcode: number };

    if (json.retcode !== 0) {
      return null;
    }

    return tokenMatch[1];
  } catch {
    return null;
  }
};

interface BirthdayRole {
  role_id: number;
  name: string;
  take_picture: string;
}

/** 获取今日生日角色列表 */
export const getBirthdayStars = async (uid: string, token: string, cookie: string, region: string, gameBiz: string): Promise<BirthdayRole[]> => {
  try {
    const params = new URLSearchParams({
      lang: 'zh-cn',
      badge_uid: uid,
      badge_region: region,
      game_biz: gameBiz,
      activity_id: ACTIVITY_ID
    });
    const url = `https://hk4e-api.mihoyo.com/event/birthdaystar/account/index?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Cookie: `e_hk4e_token=${token};${cookie}` }
    });
    const json = (await res.json()) as { retcode: number; data?: { role?: BirthdayRole[] } };

    return json.data?.role ?? [];
  } catch {
    return [];
  }
};

/** 领取生日卡片 */
export const claimBirthdayDraw = async (uid: string, token: string, cookie: string, region: string, gameBiz: string, roleId: number): Promise<string> => {
  try {
    const params = new URLSearchParams({
      lang: 'zh-cn',
      badge_uid: uid,
      badge_region: region,
      game_biz: gameBiz,
      activity_id: ACTIVITY_ID
    });
    const url = `https://hk4e-api.mihoyo.com/event/birthdaystar/account/post_my_draw?${params.toString()}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Cookie: `e_hk4e_token=${token};${cookie}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role_id: roleId })
    });
    const json = (await res.json()) as { retcode: number; message: string };

    return json.retcode === 0 ? 'success' : json.message;
  } catch {
    return '请求失败';
  }
};
