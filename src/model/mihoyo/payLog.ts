/**
 * 充值记录
 * 命令: #充值记录 / #消费记录 / #充值统计 / #消费统计 / #充值帮助
 *       #更新充值记录
 *       (私聊) 发送含 authkey 的米游社链接
 */
import { getIoRedis } from '@alemonjs/db';
import { mihoyoKeys } from '@src/model/keys';

const AUTHKEY_EXPIRY = 86400; // 1 天
const PAYDATA_EXPIRY = 86400 * 30; // 30 天

interface PayRecord {
  id: string;
  add_num: string;
  datetime: string;
}

export interface PayLogData {
  uid: string;
  crystal: number;
  totalRmb: number;
  records: number;
}

const BASE_URL = 'https://hk4e-api.mihoyo.com/common/hk4e_self_help_query/User';

const HEADERS: Record<string, string> = {
  accept: 'application/json, text/plain, */*',
  'accept-language': 'zh-CN,zh;q=0.9',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site'
};

const buildQueryUrl = (api: string, authkey: string, endId = ''): string => {
  const pathMap: Record<string, string> = {
    getUserInfo: '/GetUserInfo',
    getPrimogemLog: '/GetPrimogemLog',
    getCrystalLog: '/GetCrystalLog'
  };
  const path = pathMap[api] ?? '/GetCrystalLog';
  const params = new URLSearchParams({
    selfquery_type: '1',
    sign_type: '2',
    auth_appid: 'csc',
    authkey_ver: '1',
    game_biz: 'hk4e_cn',
    win_direction: 'portrait',
    bbs_auth_required: 'true',
    bbs_game_role_required: 'hk4e_cn',
    app_client: 'bbs',
    lang: 'zh-cn',
    csc_authkey_required: 'true',
    authkey
  });

  if (api !== 'getUserInfo') {
    params.set('add_type', 'produce');
    params.set('size', '20');
    params.set('end_id', endId);
    params.set('page_id', '1');
  }

  return `${BASE_URL}${path}?${params.toString()}`;
};

/** 获取用户信息 */
const getUserInfo = async (authkey: string): Promise<{ uid?: string; errorMsg?: string }> => {
  try {
    const res = await fetch(buildQueryUrl('getUserInfo', authkey), { headers: HEADERS });
    const json = (await res.json()) as { retcode: number; message: string; data?: { uid?: string } };

    if (json.retcode === -101) {
      return { errorMsg: '链接已过期，请重新获取' };
    }
    if (json.retcode === -100) {
      return { errorMsg: '链接不正确，请重新获取' };
    }
    if (/unknown auth appid/.test(json.message)) {
      return { errorMsg: '该链接无法获取充值记录，请使用客服页面链接' };
    }
    if (json.data?.uid) {
      return { uid: json.data.uid };
    }

    return { errorMsg: `获取失败 (${json.retcode})` };
  } catch {
    return { errorMsg: '请求失败' };
  }
};

/** 分页获取结晶记录 */
const fetchCrystalLog = async (authkey: string): Promise<{ records: PayRecord[]; errorMsg?: string }> => {
  const allRecords: PayRecord[] = [];
  let endId = '';

  for (let page = 0; page < 50; page++) {
    try {
      const res = await fetch(buildQueryUrl('getCrystalLog', authkey, endId), { headers: HEADERS });
      const json = (await res.json()) as { retcode: number; data?: { list?: PayRecord[] } };

      if (json.retcode === -101 || json.retcode === -100) {
        return { records: allRecords, errorMsg: '链接已过期' };
      }

      const list = json.data?.list ?? [];

      allRecords.push(...list);

      if (list.length < 20) {
        break;
      }

      endId = list[list.length - 1].id;
    } catch {
      break;
    }
  }

  return { records: allRecords };
};

/** 处理记录数据 */
const processPayData = (records: PayRecord[], uid: string): PayLogData => {
  // 原晶数 -> 人民币
  const priceMap: Record<number, number> = {
    8080: 648,
    3880: 328,
    2240: 198,
    1090: 98,
    330: 30,
    60: 6,
    300: 30, // 大月卡
    680: 68 // 小月卡
  };

  let crystal = 0;
  let totalRmb = 0;

  for (const r of records) {
    const num = Number(r.add_num);

    if (num <= 0) {
      continue;
    }

    crystal += num;
    totalRmb += priceMap[num] ?? 0;
  }

  return { uid, crystal, totalRmb, records: records.length };
};

/** 使用 authkey 获取并保存数据 */
export const fetchAndSavePayData = async (authkey: string, userId: string, sendMsg: (text: string) => void): Promise<PayLogData | null> => {
  const redis = getIoRedis();

  const userInfo = await getUserInfo(authkey);

  if (userInfo.errorMsg) {
    sendMsg(`获取失败: ${userInfo.errorMsg}`);

    return null;
  }

  const { records, errorMsg } = await fetchCrystalLog(authkey);

  if (errorMsg && records.length === 0) {
    sendMsg(`获取失败: ${errorMsg}`);

    return null;
  }

  const payData = processPayData(records, userInfo.uid!);

  // 保存
  await redis.setex(mihoyoKeys.authKeyByUser(userId), AUTHKEY_EXPIRY, authkey);
  await redis.setex(mihoyoKeys.authKeyByUid(payData.uid), AUTHKEY_EXPIRY, authkey);
  await redis.setex(mihoyoKeys.payLogByUser(userId), PAYDATA_EXPIRY, JSON.stringify(payData));

  return payData;
};

export const formatPayData = (data: PayLogData): string => {
  return [`【充值统计】 UID:${data.uid}`, '', `总结晶: ${data.crystal}`, `预估消费: ￥${data.totalRmb}`, `充值记录数: ${data.records}条`].join('\n');
};
