/**
 * 兑换码使用
 * 命令: #兑换码使用XXXX / #原神兑换码使用XXXX / #cdk-uXXXX
 */
import { getUserCookie, getUserMainUid } from '@src/model/mihoyo/account';
import { resolveMihoyoRegion } from '@src/model/mihoyo/region';
import type { MihoyoGame } from '@src/model/mihoyo/types';

const CDK_URLS: Record<MihoyoGame, string> = {
  gs: 'https://sg-hk4e-api.hoyolab.com/common/apicdkey/api/webExchangeCdkeyHyl',
  sr: 'https://sg-hkrpg-api.hoyolab.com/common/apicdkey/api/webExchangeCdkeyHyl',
  zzz: 'https://public-operation-nap.hoyolab.com/common/apicdkey/api/webExchangeCdkeyHyl'
};

const GAME_BIZ: Record<MihoyoGame, Record<string, string>> = {
  gs: { cn: 'hk4e_cn', global: 'hk4e_global' },
  sr: { cn: 'hkrpg_cn', global: 'hkrpg_global' },
  zzz: { cn: 'nap_cn', global: 'nap_global' }
};

const GAME_NAMES: Record<MihoyoGame, string> = {
  gs: '原神',
  sr: '星穹铁道',
  zzz: '绝区零'
};

export async function redeemCode(userId: string, game: MihoyoGame, cdkCode: string): Promise<string> {
  const cookieData = await getUserCookie(userId);

  if (!cookieData) {
    return '尚未绑定Cookie';
  }
  const uid = await getUserMainUid(userId, game);

  if (!uid) {
    return '尚未绑定游戏UID';
  }
  const region = resolveMihoyoRegion(uid, game);
  const gameBiz = GAME_BIZ[game][region.type];
  const baseUrl = CDK_URLS[game];
  const params = new URLSearchParams({
    cdkey: cdkCode,
    game_biz: gameBiz,
    lang: 'zh-cn',
    region: region.server,
    t: String(Date.now()),
    uid
  });

  let text = '';

  try {
    const res = await fetch(`${baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        Cookie: cookieData.ck,
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/2.40.1'
      }
    });

    const json = (await res.json()) as { retcode: number; message: string; data?: { msg?: string } };

    if (json.retcode === 0) {
      text = `[${GAME_NAMES[game]}] ${json.data?.msg ?? '兑换成功'}`;
    } else {
      text = `[${GAME_NAMES[game]}] 兑换失败: ${json.message}`;
    }
  } catch {
    text = '兑换码使用失败，请稍后重试';
  }

  return text;
}
