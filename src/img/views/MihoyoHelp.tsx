import { BG_IMAGES, CHARACTER_ICONS, SR_ICONS, UI_ICONS, ZZZ_ICONS } from '@src/assets/img/index.js';
import React from 'react';
import HTML from './HTML.js';

/** 指令条目 */
interface CmdItem {
  /** 图标 emoji */
  icon: string;
  /** 指令文本 */
  cmd: string;
  /** 简要说明 */
  desc: string;
}

/** 帮助分类 */
interface HelpCategory {
  title: string;
  items: CmdItem[];
}

/** 米游社帮助分类 — 参照 Miao-Yunzai help.yaml 布局 */
const MHY_HELP: HelpCategory[] = [
  {
    title: '原神查询',
    items: [
      { icon: UI_ICONS.resin, cmd: '/原神体力', desc: '实时树脂与每日委托' },
      { icon: UI_ICONS.role, cmd: '/原神角色', desc: '角色面板概览（等级/命座）' },
      { icon: UI_ICONS.abyss, cmd: '/原神深渊', desc: '深境螺旋数据' },
      { icon: UI_ICONS.guide, cmd: '/原神探索', desc: '宝箱·神瞳·世界探索度' },
      { icon: UI_ICONS.weapon, cmd: '/原神武器', desc: '武器列表与装备情况' },
      { icon: UI_ICONS.primogem, cmd: '/原神札记', desc: '原石收入月度统计' },
      { icon: UI_ICONS.team, cmd: '/原神剧诗', desc: '幻想真境剧诗阵容' },
      { icon: UI_ICONS.tcg, cmd: '/原神七圣召唤查询', desc: '七圣召唤牌组/卡牌查询' }
    ]
  },
  {
    title: '原神签到与福利',
    items: [
      { icon: UI_ICONS.checkin, cmd: '/原神签到', desc: '游戏每日签到' },
      { icon: UI_ICONS.keqing, cmd: '/原神生日卡', desc: '留影叙佳期领取卡片' },
      { icon: UI_ICONS.primogem, cmd: '/原神兑换码', desc: '查询直播兑换码' },
      { icon: UI_ICONS.fate, cmd: '/原神兑换码使用 <CDK>', desc: '使用CDK兑换码' }
    ]
  },
  {
    title: '原神资讯',
    items: [
      { icon: UI_ICONS.miyoushe, cmd: '/原神公告', desc: '米游社官方公告' },
      { icon: UI_ICONS.miyoushe, cmd: '/原神资讯', desc: '最新活动资讯' },
      { icon: UI_ICONS.miyoushe, cmd: '/原神活动', desc: '进行中的活动列表' }
    ]
  },
  {
    title: '原神账号',
    items: [
      { icon: UI_ICONS.bind, cmd: '/原神绑定uid <UID>', desc: '绑定原神UID' },
      { icon: UI_ICONS.record, cmd: '/原神我的uid', desc: '查看已绑定的UID列表' },
      { icon: UI_ICONS.record, cmd: '/原神删除uid <序号>', desc: '解绑指定UID' },
      { icon: UI_ICONS.help, cmd: '/原神帮助', desc: '查看本帮助图' }
    ]
  },
  {
    title: '其他帮助',
    items: [
      { icon: SR_ICONS.avatar, cmd: '/星铁帮助', desc: '星穹铁道全部指令' },
      { icon: UI_ICONS.miyoushe, cmd: '/米游社帮助', desc: '账号与绑定指令' }
    ]
  }
];

const SR_HELP: HelpCategory[] = [
  {
    title: '常用查询',
    items: [
      { icon: SR_ICONS.power, cmd: '/星铁体力', desc: '开拓力与每日实训' },
      { icon: SR_ICONS.avatar, cmd: '/星铁角色', desc: '角色面板与星魂等级' },
      { icon: SR_ICONS.abyss, cmd: '/星铁深渊', desc: '忘却之庭数据' },
      { icon: SR_ICONS.fiction, cmd: '/星铁虚构叙事', desc: '虚构叙事数据' },
      { icon: SR_ICONS.jade, cmd: '/星铁星琼', desc: '星琼收入月度统计' },
      { icon: SR_ICONS.daily, cmd: '/星铁签到', desc: '游戏每日签到' }
    ]
  },
  {
    title: '资讯 · 账号',
    items: [
      { icon: SR_ICONS.notice, cmd: '/星铁公告', desc: '官方公告' },
      { icon: SR_ICONS.news, cmd: '/星铁资讯', desc: '版本资讯' },
      { icon: SR_ICONS.activity, cmd: '/星铁活动', desc: '活动列表' },
      { icon: SR_ICONS.account, cmd: '/星铁绑定uid', desc: '绑定星铁UID' },
      { icon: SR_ICONS.friend, cmd: '/星铁我的uid', desc: '查看已绑定UID' },
      { icon: SR_ICONS.unbind, cmd: '/星铁删除uid', desc: '解绑指定UID' }
    ]
  },
  {
    title: '兑换 · 帮助',
    items: [
      { icon: SR_ICONS.shop, cmd: '/星铁兑换码', desc: '查询直播兑换码' },
      { icon: SR_ICONS.mail, cmd: '/星铁兑换码使用', desc: '使用CDK兑换' },
      { icon: SR_ICONS.help, cmd: '/星铁帮助', desc: '查看本帮助图' }
    ]
  },
  {
    title: '其他帮助',
    items: [
      { icon: UI_ICONS.role, cmd: '/原神帮助', desc: '原神全部指令' },
      { icon: UI_ICONS.miyoushe, cmd: '/米游社帮助', desc: '账号与绑定指令' }
    ]
  }
];

const ACCOUNT_HELP: HelpCategory[] = [
  {
    title: 'Cookie 管理',
    items: [
      { icon: UI_ICONS.bind, cmd: '/米游社绑定ck', desc: '绑定米游社Cookie（私聊）' },
      { icon: UI_ICONS.record, cmd: '/米游社我的ck', desc: '查看Cookie绑定状态' },
      { icon: UI_ICONS.record, cmd: '/米游社删除ck', desc: '删除已绑定的Cookie' },
      { icon: UI_ICONS.checkin, cmd: '/米游社检查ck', desc: '验证Cookie是否有效' },
      { icon: UI_ICONS.help, cmd: '/米游社ck帮助', desc: 'Cookie获取教程' },
      { icon: UI_ICONS.miyoushe, cmd: '/米游社扫码登录', desc: '扫码绑定Cookie+Stoken' }
    ]
  },
  {
    title: 'Stoken 与社区',
    items: [
      { icon: UI_ICONS.bind, cmd: '/米游社绑定stoken', desc: '手动绑定Stoken（私聊）' },
      { icon: UI_ICONS.record, cmd: '/米游社我的stoken', desc: '查看Stoken绑定状态' },
      { icon: UI_ICONS.record, cmd: '/米游社删除stoken', desc: '删除已绑定的Stoken' },
      { icon: UI_ICONS.checkin, cmd: '/米游社签到', desc: '米游币社区签到' },
      { icon: UI_ICONS.ledger, cmd: '/米游社充值记录', desc: '充值/消费记录统计' }
    ]
  },
  {
    title: '游戏帮助',
    items: [
      { icon: UI_ICONS.role, cmd: '/原神帮助', desc: '原神全部指令' },
      { icon: SR_ICONS.avatar, cmd: '/星铁帮助', desc: '星穹铁道全部指令' }
    ]
  }
];

/** 总页数（不分页，一页展示全部） */
export const MHY_TOTAL_PAGES = 1;

/** 组件 Props */
interface MihoyoHelpProps {
  data?: { page?: number; totalPages?: number; game?: 'gs' | 'sr' | 'mhy' | 'zzz' };
}

interface HelpTheme {
  bg: string | null;
  bgSize: string;
  bgPos: string;
  flip: boolean;
  veilTop: string;
  veilSide: string;
  character: string | null;
  caption: string;
  logo: string | null;
  logoText: string;
  logoWidth: number;
  title: string;
  en: string;
  tag: string;
  footLeft: string;
  footRight: string;
  tip: string;
  note: string;
}

const THEMES: Record<'gs' | 'sr' | 'mhy' | 'zzz', HelpTheme> = {
  gs: {
    bg: BG_IMAGES.bgGs,
    bgSize: '100% auto',
    bgPos: 'center top',
    flip: false,
    veilTop:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0px, rgba(255, 255, 255, 0.2) 185px, rgba(255, 255, 255, 0.62) 315px, rgba(255, 255, 255, 0.9) 425px, rgba(255, 255, 255, 0.96) 100%)',
    veilSide:
      'radial-gradient(62% 30% at 100% 0%, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.6) 55%, rgba(255, 255, 255, 0) 100%), linear-gradient(100deg, rgba(255, 255, 255, 0.62) 0%, rgba(255, 255, 255, 0.34) 38%, rgba(255, 255, 255, 0.08) 72%, rgba(255, 255, 255, 0) 100%)',
    character: CHARACTER_ICONS.paimon,
    caption: 'UNIFIED COMMAND',
    logo: BG_IMAGES.genshinLogo,
    logoText: 'GS',
    logoWidth: 112,
    title: '原神助手',
    en: 'Genshin Impact Assistant',
    tag: '常用指令',
    footLeft: '/原神绑定uid',
    footRight: '/原神帮助',
    tip: '所有指令统一以 /原神 开头 · 示例：/原神体力',
    note: 'Cookie 绑定是 /米游社绑定ck'
  },
  sr: {
    bg: BG_IMAGES.bgSr,
    bgSize: 'cover',
    bgPos: '34% 6%',
    flip: true,
    veilTop:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0px, rgba(255, 255, 255, 0.5) 205px, rgba(255, 255, 255, 0.9) 445px, rgba(255, 255, 255, 0.97) 100%)',
    veilSide:
      'radial-gradient(130% 95% at 82% 2%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.74) 46%, rgba(255, 255, 255, 0.9) 100%)',
    character: CHARACTER_ICONS.march7,
    caption: 'UNIFIED COMMAND',
    logo: SR_ICONS.logo,
    logoText: 'SR',
    logoWidth: 152,
    title: '星铁助手',
    en: 'Honkai Star Rail Assistant',
    tag: '常用指令',
    footLeft: '/星铁绑定uid',
    footRight: '/星铁帮助',
    tip: '星铁指令统一以 /星铁 开头 · 示例：/星铁体力',
    note: 'Cookie 绑定是 /米游社绑定ck'
  },
  zzz: {
    bg: BG_IMAGES.bgZzz,
    bgSize: '106% auto',
    bgPos: '44% top',
    flip: false,
    veilTop:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0px, rgba(255, 255, 255, 0.3) 165px, rgba(255, 255, 255, 0.7) 315px, rgba(255, 255, 255, 0.9) 425px, rgba(255, 255, 255, 0.96) 100%)',
    veilSide:
      'radial-gradient(62% 30% at 100% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.55) 55%, rgba(255, 255, 255, 0) 100%), linear-gradient(100deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.26) 36%, rgba(255, 255, 255, 0.04) 68%, rgba(255, 255, 255, 0) 100%)',
    character: CHARACTER_ICONS.zzz,
    caption: 'HOLLOW COMMAND',
    logo: BG_IMAGES.zzzLogo,
    logoText: 'ZZZ',
    logoWidth: 150,
    title: '绝区零助手',
    en: 'Zenless Zone Zero Assistant',
    tag: '常用指令',
    footLeft: '/绝区零绑定uid',
    footRight: '/绝区零帮助',
    tip: '所有指令统一以 /绝区零 开头 · 示例：/绝区零体力',
    note: 'Cookie 绑定是 /米游社绑定ck'
  },
  mhy: {
    bg: null,
    bgSize: 'cover',
    bgPos: 'center top',
    flip: false,
    veilTop: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 55%, rgba(255, 255, 255, 0.9) 100%)',
    veilSide:
      'radial-gradient(120% 70% at 50% 0%, rgba(140, 170, 210, 0.22) 0%, rgba(255, 255, 255, 0) 62%)',
    character: null,
    caption: 'UNIFIED COMMAND',
    logo: null,
    logoText: 'MHY',
    logoWidth: 96,
    title: '米游社账号',
    en: 'Miyoushe Account Assistant',
    tag: '账号指令',
    footLeft: '/米游社绑定ck',
    footRight: '/原神帮助',
    tip: '账号指令统一以 /米游社 开头 · 示例：/米游社检查ck',
    note: '一次绑定，原神/星铁通用'
  }
};

const ZZZ_HELP: HelpCategory[] = [
  {
    title: '查询 · 资讯',
    items: [
      { icon: ZZZ_ICONS.power, cmd: '/绝区零体力', desc: '实时电量与每日活跃' },
      { icon: ZZZ_ICONS.agent, cmd: '/绝区零角色', desc: '代理人面板与驱动盘' },
      { icon: ZZZ_ICONS.explore, cmd: '/绝区零探索', desc: '委托·成就·探索度' },
      { icon: ZZZ_ICONS.bangboo, cmd: '/邦布', desc: '邦布图鉴与邦布数量' },
      { icon: ZZZ_ICONS.notice, cmd: '/绝区零公告', desc: '米游社官方公告' },
      { icon: ZZZ_ICONS.news, cmd: '/绝区零资讯', desc: '版本资讯与活动前瞻' }
    ]
  },
  {
    title: '账号 · 兑换',
    items: [
      { icon: ZZZ_ICONS.event, cmd: '/绝区零活动', desc: '进行中的活动列表' },
      { icon: ZZZ_ICONS.bind, cmd: '/绝区零绑定uid <UID>', desc: '绑定绝区零UID' },
      { icon: ZZZ_ICONS.myid, cmd: '/绝区零我的uid', desc: '查看已绑定的UID' },
      { icon: ZZZ_ICONS.unbind, cmd: '/绝区零删除uid <序号>', desc: '解绑指定UID' },
      { icon: ZZZ_ICONS.code, cmd: '/绝区零兑换码', desc: '查询直播兑换码' },
      { icon: ZZZ_ICONS.codeuse, cmd: '/绝区零兑换码使用 <CDK>', desc: '使用CDK兑换码' }
    ]
  },
  {
    title: '其他帮助',
    items: [
      { icon: ZZZ_ICONS.help, cmd: '/绝区零帮助', desc: '查看本帮助图' },
      { icon: UI_ICONS.paimon, cmd: '/原神帮助', desc: '原神全部指令' },
      { icon: SR_ICONS.avatar, cmd: '/星铁帮助', desc: '星穹铁道全部指令' },
      { icon: UI_ICONS.miyoushe, cmd: '/米游社帮助', desc: '账号与绑定指令' }
    ]
  }
];

const WAVE_BARS = [5, 9, 13, 7, 11, 6, 12, 8, 4];

const labelOf = (cmd: string) =>
  cmd
    .replace(/^\/(原神|星铁|米游社|绝区零)/, '')
    .replace(/^\//, '')
    .replace(/\s*<.*$/, '')
    .trim();

const pillStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  fontSize: '11.5px',
  fontWeight: 700,
  color: '#453418',
  background: 'linear-gradient(180deg, #f7ecd2, #e0c69b)',
  padding: '2px 9px',
  borderRadius: '3px',
  whiteSpace: 'nowrap'
};

const footPillStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#453418',
  background: 'linear-gradient(180deg, #f7ecd2, #e0c69b)',
  padding: '3px 9px',
  borderRadius: '3px'
};

const CORNERS: React.CSSProperties[] = [
  { top: '9px', left: '9px', borderRight: 0, borderBottom: 0 },
  { top: '9px', right: '9px', borderLeft: 0, borderBottom: 0 },
  { bottom: '9px', left: '9px', borderRight: 0, borderTop: 0 },
  { bottom: '9px', right: '9px', borderLeft: 0, borderTop: 0 }
];

const HELP_LISTS = { gs: MHY_HELP, sr: SR_HELP, mhy: ACCOUNT_HELP, zzz: ZZZ_HELP };

export default function MihoyoHelp({ data }: MihoyoHelpProps) {
  const game = data?.game ?? 'gs';
  const theme = THEMES[game];
  const helpList = HELP_LISTS[game];

  return (
    <HTML style={{ width: '780px' }}>
      <div
        style={{
          position: 'relative',
          width: '780px',
          overflow: 'hidden',
          fontFamily: '"Microsoft YaHei", system-ui, sans-serif',
          color: '#2f3136'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #ffffff 0%, #f4f7fc 42%, #e9eef7 100%)'
          }}
        />
        {theme.bg ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url(${theme.bg}) ${theme.bgPos} / ${theme.bgSize} no-repeat`,
              transform: theme.flip ? 'scaleX(-1)' : undefined
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `${theme.veilTop}, ${theme.veilSide}`
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '300px',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.26) 55%, rgba(255, 255, 255, 0) 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '130px',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.92) 55%, #ffffff 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '9px',
            left: '9px',
            right: '9px',
            bottom: '9px',
            border: '1px solid rgba(198, 168, 110, 0.42)',
            borderRadius: '2px'
          }}
        />
        {CORNERS.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '13px',
              height: '13px',
              border: '1px solid rgba(214, 190, 140, 0.55)',
              ...c
            }}
          />
        ))}

        <div style={{ position: 'relative', padding: '24px 24px 16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {theme.logo ? (
                <img
                  src={theme.logo}
                  style={{
                    width: `${theme.logoWidth}px`,
                    height: 'auto',
                    marginLeft: '-3px',
                    filter: 'invert(1) brightness(0.35)'
                  }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '3px',
                    marginLeft: '-2px',
                    marginBottom: '1px'
                  }}
                >
                  <b
                    style={{
                      fontSize: '30px',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      letterSpacing: '-1px',
                      lineHeight: 0.9,
                      color: '#17191f',
                      transform: 'skewX(-10deg)'
                    }}
                  >
                    {theme.logoText}
                  </b>
                  <i
                    style={{
                      display: 'block',
                      width: '46px',
                      height: '4px',
                      marginLeft: '4px',
                      marginBottom: '4px',
                      background: 'linear-gradient(90deg, #c3a468, rgba(195, 164, 104, 0.15))'
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  fontSize: '9.5px',
                  letterSpacing: '3px',
                  color: '#8c96a6',
                  textTransform: 'uppercase'
                }}
              >
                {theme.en}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                <span
                  style={{
                    fontSize: '42px',
                    fontWeight: 900,
                    letterSpacing: '3px',
                    lineHeight: 1,
                    color: '#3a3121'
                  }}
                >
                  {theme.title}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: '#3d2f18',
                    background: 'linear-gradient(135deg, #f6e7c4, #dcbf8d)',
                    padding: '5px 14px',
                    clipPath: 'polygon(9px 0, 100% 0, calc(100% - 9px) 100%, 0 100%)',
                    boxShadow: '0 0 14px rgba(220, 190, 130, 0.35)'
                  }}
                >
                  {theme.tag}
                </span>
              </div>
            </div>
            {theme.character ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '7px',
                  paddingBottom: '2px'
                }}
              >
                <div
                  style={{
                    width: '126px',
                    height: '126px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(214, 190, 140, 0.55)',
                    boxShadow: '0 0 26px rgba(210, 185, 135, 0.35)',
                    background: 'radial-gradient(circle at 50% 28%, rgba(150, 175, 205, 0.35), rgba(232, 238, 248, 0.92))'
                  }}
                >
                  <img src={theme.character} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '9.5px', letterSpacing: '1.8px', color: '#9aa6b4' }}>{theme.caption}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', paddingBottom: '8px' }}>
                <span style={{ color: '#c3a468', fontSize: '19px', lineHeight: 1 }}>✦</span>
                <span style={{ color: '#c3a468', fontSize: '12px', lineHeight: 1, opacity: 0.55 }}>✦</span>
                <span
                  style={{
                    width: '1px',
                    height: '16px',
                    margin: '0 3px',
                    background: 'linear-gradient(180deg, transparent, rgba(198, 168, 110, 0.55), transparent)'
                  }}
                />
                <span style={{ fontSize: '10px', letterSpacing: '1.6px', color: '#9aa6b4' }}>{theme.caption}</span>
              </div>
            )}
          </div>

          {helpList.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: '17px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 2px 8px' }}>
                <span
                  style={{
                    fontSize: '21px',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '1px',
                    color: 'transparent',
                    WebkitTextStroke: '1.2px #c3a468',
                    lineHeight: 1
                  }}
                >
                  {String(ci + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: '#33302a'
                  }}
                >
                  {cat.title}
                </span>
                <span
                  style={{
                    flex: 1,
                    height: '1px',
                    background: 'linear-gradient(90deg, rgba(198, 168, 110, 0.55), rgba(198, 168, 110, 0.06))'
                  }}
                />
                <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '13px', opacity: 0.7 }}>
                  {WAVE_BARS.map((h, i) => (
                    <span key={i} style={{ width: '2px', height: `${h}px`, background: '#c3a468', borderRadius: '1px' }} />
                  ))}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
                {cat.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      width: 'calc((100% - 18px) / 3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '11px',
                      background: 'rgba(255, 255, 255, 0.72)',
                      backdropFilter: 'blur(2px)',
                      border: '1px solid rgba(214, 190, 140, 0.5)',
                      borderRadius: '5px',
                      textAlign: 'left',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 3px 10px rgba(90, 80, 60, 0.08)'
                    }}
                  >
                    <div
                      style={{
                        flex: 'none',
                        width: '42px',
                        height: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        border: '1px solid rgba(214, 190, 140, 0.22)',
                        background: '#1b2740',
                        boxShadow: '0 2px 6px rgba(120, 100, 60, 0.14)'
                      }}
                    >
                      <img
                        src={item.icon}
                        style={{
                          width: '30px',
                          height: '30px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))'
                        }}
                      />
                    </div>
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          letterSpacing: '0.4px',
                          color: '#2f3136',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {labelOf(item.cmd)}
                      </div>
                      <div style={pillStyle}>{item.cmd}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: '10px',
              paddingTop: '11px',
              borderTop: '1px solid rgba(198, 168, 110, 0.32)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  border: '1px solid #c3a468',
                  borderRadius: '50%',
                  transform: 'rotate(45deg)'
                }}
              />
              私聊绑定
              <span style={footPillStyle}>{theme.footLeft}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6b7280' }}>
              更多指令
              <span style={footPillStyle}>{theme.footRight}</span>
              »
            </div>
          </div>
          <div
            style={{
              marginTop: '9px',
              fontSize: '11px',
              letterSpacing: '0.5px',
              color: '#8b94a3',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>{theme.tip}</span>
            <span>{theme.note}</span>
          </div>
        </div>
      </div>
    </HTML>
  );
}
