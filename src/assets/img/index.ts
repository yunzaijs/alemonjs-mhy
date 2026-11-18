// ─── 元素图标 ────────────────────────────────────────
import anemo from './element/anemo.png';
import cryo from './element/cryo.png';
import dendro from './element/dendro.png';
import electro from './element/electro.png';
import geo from './element/geo.png';
import hydro from './element/hydro.png';
import multi from './element/multi.png';
import pyro from './element/pyro.png';

/** 元素名称 → 图标路径 (中文 key) */
export const ELEMENT_ICONS: Record<string, string> = {
  风: anemo,
  冰: cryo,
  草: dendro,
  雷: electro,
  岩: geo,
  水: hydro,
  火: pyro,
  物理: multi
};

/** 元素名称 → 图标路径 (英文 key) */
export const ELEMENT_ICONS_EN: Record<string, string> = {
  Anemo: anemo,
  Cryo: cryo,
  Dendro: dendro,
  Electro: electro,
  Geo: geo,
  Hydro: hydro,
  Pyro: pyro,
  Physical: multi
};

// ─── UI 图标 ─────────────────────────────────────────
import iconAbyss from './icon/abyss.png';
import iconLedger from './icon/ledger.png';
import iconPaimon from './icon/paimon.png';
import iconRole from './icon/role.png';
import iconSign from './icon/sign.png';
import iconTeam from './icon/team.png';
import iconWeapon from './icon/weapon.png';
import iconTcg from './icon/七圣召唤.png';
import iconPrimogem from './icon/原石.png';
import iconCheckin from './icon/打卡.png';
import iconGuide from './icon/攻略.png';
import iconStarglitter from './icon/星辉.png';
import iconResin from './icon/树脂.png';
import iconMiyoushe from './icon/米游社.png';
import iconFate from './icon/纠缠之缘.png';
import iconBind from './icon/绑定账号.png';
import iconStats from './icon/统计.png';
import iconRecord from './icon/记录.png';
import iconHelp from './icon/问号.png';
import iconKeqing from './icon/刻晴.png';

export const UI_ICONS = {
  abyss: iconAbyss,
  ledger: iconLedger,
  paimon: iconPaimon,
  role: iconRole,
  sign: iconSign,
  team: iconTeam,
  weapon: iconWeapon,
  resin: iconResin,
  primogem: iconPrimogem,
  starglitter: iconStarglitter,
  fate: iconFate,
  miyoushe: iconMiyoushe,
  help: iconHelp,
  bind: iconBind,
  record: iconRecord,
  stats: iconStats,
  guide: iconGuide,
  checkin: iconCheckin,
  keqing: iconKeqing,
  tcg: iconTcg
} as const;

// ─── 星铁图标 ────────────────────────────────────────
import srAbyss from './sr/abyss.png';
import srAccount from './sr/account.png';
import srActivity from './sr/activity.png';
import srAvatar from './sr/avatar.png';
import srDaily from './sr/daily.png';
import srFiction from './sr/fiction.png';
import srFriend from './sr/friend.png';
import srHelp from './sr/help.png';
import srJade from './sr/jade.png';
import srLogo from './sr/logo.png';
import srMail from './sr/mail.png';
import srNews from './sr/news.png';
import srNotice from './sr/notice.png';
import srPower from './sr/power.png';
import srShop from './sr/shop.png';
import srUnbind from './sr/unbind.png';

// ─── 角色头像 ────────────────────────────────────────
import charMarch7 from './character/march7.png';
import charPaimon from './character/paimon.png';
import charZzz from './character/zzz.png';

export const CHARACTER_ICONS = {
  paimon: charPaimon,
  march7: charMarch7,
  zzz: charZzz
} as const;

export const SR_ICONS = {
  logo: srLogo,
  power: srPower,
  avatar: srAvatar,
  abyss: srAbyss,
  fiction: srFiction,
  jade: srJade,
  daily: srDaily,
  notice: srNotice,
  news: srNews,
  activity: srActivity,
  account: srAccount,
  friend: srFriend,
  unbind: srUnbind,
  shop: srShop,
  mail: srMail,
  help: srHelp
} as const;

// ─── 绝区零 ──────────────────────────────────────────
import zzzPower from './zzz/power.png';
import zzzAgent from './zzz/agent.png';
import zzzExplore from './zzz/explore.png';
import zzzBangboo from './zzz/bangboo.png';
import zzzNotice from './zzz/notice.png';
import zzzNews from './zzz/news.png';
import zzzEvent from './zzz/event.png';
import zzzHelp from './zzz/help.png';
import zzzBind from './zzz/bind.png';
import zzzMyid from './zzz/myid.png';
import zzzUnbind from './zzz/unbind.png';
import zzzCode from './zzz/code.png';
import zzzCodeUse from './zzz/codeuse.png';

export const ZZZ_ICONS = {
  power: zzzPower,
  agent: zzzAgent,
  explore: zzzExplore,
  bangboo: zzzBangboo,
  notice: zzzNotice,
  news: zzzNews,
  event: zzzEvent,
  help: zzzHelp,
  bind: zzzBind,
  myid: zzzMyid,
  unbind: zzzUnbind,
  code: zzzCode,
  codeuse: zzzCodeUse
} as const;

// ─── 背景与装饰 ──────────────────────────────────────
import bgWebp from './other/bg.webp';
import bgGs from './other/bg-gs.webp';
import bgZzz from './other/bg-zzz.webp';
import bgSr from './other/bg-sr.webp';
import bg105 from './other/bg105.png';
import bg3 from './other/bg3.png';
import bg4 from './other/bg4.png';
import bg5 from './other/bg5.png';
import fill from './other/fill.png';
import genshinLogo from './other/原神.png';
import zzzLogo from './other/zzz-logo.png';

export const BG_IMAGES = {
  bg: bgWebp,
  bgGs,
  bgSr,
  bgZzz,
  bg3,
  bg4,
  bg5,
  bg105,
  fill,
  genshinLogo,
  zzzLogo
} as const;

// ─── 世界探索地图 ────────────────────────────────────
import chasm from './other/层岩巨渊.png';
import nodKalei from './other/挪德卡莱.png';
import oldSea from './other/旧日之海.png';
import fontaine from './other/枫丹.png';
import chenyu from './other/沉玉谷.png';
import enkanomiya from './other/渊下宫.png';
import liyue from './other/璃月.png';
import inazuma from './other/稻妻.png';
import natlan from './other/纳塔.png';
import mondstadt from './other/蒙德.png';
import ancientMountain from './other/远古圣山.png';
import dragonspine from './other/雪山.png';
import sumeru from './other/须弥.png';

/** 地区中文名 → 图标路径 */
export const REGION_ICONS: Record<string, string> = {
  蒙德: mondstadt,
  璃月: liyue,
  稻妻: inazuma,
  须弥: sumeru,
  枫丹: fontaine,
  纳塔: natlan,
  雪山: dragonspine,
  龙脊雪山: dragonspine,
  渊下宫: enkanomiya,
  层岩巨渊: chasm,
  层岩巨渊·地下矿区: chasm,
  沉玉谷: chenyu,
  旧日之海: oldSea,
  挪德卡莱: nodKalei,
  远古圣山: ancientMountain
};
