/**
 * 兑换码查询
 * 命令: #兑换码 / #原神兑换码 / #星铁兑换码 / #绝区零兑换码
 */
import type { MihoyoGame } from '@src/model/mihoyo/types';

// 米游社官方账户 UID (用于搜索直播帖)
const MIYOLIVE_UIDS: Record<MihoyoGame, string> = {
  gs: '75276539',
  sr: '80823548',
  zzz: '152039148'
};

const GAME_GIDS: Record<MihoyoGame, string> = {
  gs: '2',
  sr: '6',
  zzz: '8'
};

/** 从官方帖子中提取直播 act_id */
export const getActIdFromPosts = async (game: MihoyoGame): Promise<string | null> => {
  try {
    const uid = MIYOLIVE_UIDS[game];
    const url = `https://bbs-api.mihoyo.com/painter/api/user_instant/list?offset=0&size=20&uid=${uid}`;
    const res = await fetch(url);
    const json = (await res.json()) as {
      retcode: number;
      data?: { list?: Array<{ post?: { post?: { structured_content?: string } } }> };
    };

    if (json.retcode !== 0) {
      return null;
    }

    for (const p of json.data?.list ?? []) {
      const sc = p?.post?.post?.structured_content;

      if (!sc) {
        continue;
      }

      const match = sc.match(/act_id=([a-zA-Z0-9]+)/);

      if (match) {
        return match[1];
      }
    }

    return null;
  } catch {
    return null;
  }
};

/** 从导航栏获取 act_id (备选) */
export const getActIdFromNav = async (game: MihoyoGame): Promise<string | null> => {
  try {
    const gid = GAME_GIDS[game];
    const url = `https://bbs-api.miyoushe.com/apihub/api/home/new?gids=${gid}&parts=1%2C3%2C4`;
    const res = await fetch(url);
    const json = (await res.json()) as {
      retcode: number;
      data?: { navigator?: Array<{ name: string; app_path: string }> };
    };

    if (json.retcode !== 0) {
      return null;
    }

    const nav = json.data?.navigator?.find(item => /前瞻|特别节目/.test(item.name) && item.app_path.includes('act_id='));

    if (nav) {
      const match = nav.app_path.match(/act_id=([a-zA-Z0-9]+)/);

      if (match) {
        return match[1];
      }
    }

    return null;
  } catch {
    return null;
  }
};

/** 通过 miyolive API 获取兑换码 */
export const fetchCodesFromMiyolive = async (actId: string): Promise<{ codes: string[]; title: string; deadline: string }> => {
  try {
    // 1. 获取 index 信息
    const indexRes = await fetch('https://api-takumi.mihoyo.com/event/miyolive/index', {
      headers: { 'x-rpc-act_id': actId }
    });
    const indexJson = (await indexRes.json()) as {
      retcode: number;
      data?: { live?: { title: string; code_ver: number; remain: number } };
    };

    if (indexJson.retcode !== 0 || !indexJson.data?.live) {
      return { codes: [], title: '', deadline: '' };
    }

    const { title, code_ver: codeVer, remain } = indexJson.data.live;

    if (remain > 0) {
      return { codes: [], title, deadline: '' };
    }

    // 2. 获取兑换码列表
    const now = Math.floor(Date.now() / 1000);
    const codeRes = await fetch(`https://api-takumi-static.mihoyo.com/event/miyolive/refreshCode?version=${codeVer}&time=${now}`, {
      headers: { 'x-rpc-act_id': actId }
    });
    const codeJson = (await codeRes.json()) as {
      retcode: number;
      data?: { code_list?: Array<{ code: string; to_get_time?: number }> };
    };

    const codeList = codeJson.data?.code_list ?? [];
    const codes = codeList.map(c => c.code).filter(Boolean);

    // 计算过期时间
    let deadline = '';

    if (codeList.length > 0 && codeList[0].to_get_time) {
      const date = new Date(codeList[0].to_get_time * 1000);

      date.setDate(date.getDate() + 3);

      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');

      deadline = `${y}-${m}-${d} 23:59:59`;
    }

    return { codes, title, deadline };
  } catch {
    return { codes: [], title: '', deadline: '' };
  }
};

// ─── 入口 ────────────────────────────────────────────
