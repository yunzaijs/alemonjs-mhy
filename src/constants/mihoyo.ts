export const mihoyoConstants = {
  commandPrefixPattern: '(!|！|/|#|＃)',
  gsCommandPrefix: '/原神',
  srCommandPrefix: '/星铁',
  games: {
    gs: { key: 'gs', name: '原神' },
    sr: { key: 'sr', name: '星穹铁道' },
    zzz: { key: 'zzz', name: '绝区零' }
  },
  ckMaskKeepLength: 6,
  requestTimeoutMs: 10000,
  cacheSeconds: 300
} as const;

export const gsRouteRules = {
  help: /^\/原神(帮助|help|模块)$/,
  bindUid: /^\/原神绑定(uid)?(\s|\+)*((1[0-9]|[1-9])[0-9]{8}|[1-9][0-9]{7})$/i,
  showUid: /^\/原神(我的)?uid\d{0,2}$/i,
  delUid: /^\/原神(删除|解绑)uid(\s|\+)*(\d{1,2})?$/i,
  dailyNote: /^\/原神(体力|树脂|查询体力)$/,
  playerIndex: /^\/原神(角色|面板)$/,
  spiralAbyss: /^\/原神(上期|往期|本期)*(深渊|深境螺旋|深境)(上期|往期|本期)*$/,
  roleExplore: /^\/原神(宝箱|成就|尘歌壶|家园|探索|探险|声望|探险度|探索度)\s*\d*$/,
  weapon: /^\/原神(五星|四星|5星|4星)*武器\s*\d*$/,
  roleCombat: /^\/原神(幻想真境剧诗|剧诗)$/,
  ledger: /^\/原神(原石|札记)\s*(\d{1,2}月?|[一二三四五六七八九十]+月?)?$/,
  exchange: /^\/原神兑换码$/,
  useCode: /^\/原神(兑换码使用|cdk-u)\s*.+/i,
  mysNews: /^\/原神(公告|资讯|活动)(列表)?\s*\d*$/,
  gameSign: /^\/原神签到$/,
  sevenSaints: /^\/原神七圣(召唤)?查询/,
  birthday: /^\/原神(留影(叙佳期)?|(领)?(角色)?生日(卡)?)$/
} as const;

export const srRouteRules = {
  help: /^\/星铁(帮助|help|模块)$/,
  bindUid: /^\/星铁绑定(uid)?(\s|\+)*((1[0-9]|[1-9])[0-9]{8}|[1-9][0-9]{7})$/i,
  showUid: /^\/星铁(我的)?uid\d{0,2}$/i,
  delUid: /^\/星铁(删除|解绑)uid(\s|\+)*(\d{1,2})?$/i,
  dailyNote: /^\/星铁(体力|开拓力|查询体力)$/,
  playerIndex: /^\/星铁(角色|面板)$/,
  spiralAbyss: /^\/星铁(上期|往期|本期)*(深渊|忘却之庭|虚构叙事)(上期|往期|本期)*$/,
  ledger: /^\/星铁(星琼|札记)\s*(\d{1,2}月?|[一二三四五六七八九十]+月?)?$/,
  exchange: /^\/星铁兑换码$/,
  useCode: /^\/星铁(兑换码使用|cdk-u)\s*.+/i,
  mysNews: /^\/星铁(公告|资讯|活动)(列表)?\s*\d*$/,
  gameSign: /^\/星铁签到$/
} as const;

export const accountRouteRules = {
  help: /^\/米游社(帮助|help|模块)$/,
  bindCk: /^\/米游社绑定c(oo)?k(ie)?$/i,
  myCk: /^\/米游社(我的|删除|解绑)c(oo)?k(ie)?$/i,
  ckHelp: /^\/米游社(ck|cookie)(帮助|说明|教程)$/i,
  ckCheck: /^\/米游社(检查|验证|测试)c(oo)?k(ie)?$/i,
  bindStoken: /^\/米游社(绑定)?stoken$/i,
  myStoken: /^\/米游社我的stoken$/i,
  delStoken: /^\/米游社删除(我的)?stoken$/i,
  qrLogin: /^\/米游社(扫码|二维码)(登录|绑定|登陆)$/,
  bbsSign: /^\/米游社签到$/,
  payLog: /^\/米游社(更新)?(充值|消费)(记录|统计)(帮助)?$/,
  cookieAccept: /(ltoken|ltoken_v2).*(ltuid|login_uid|ltmid_v2)/,
  stokenAccept: /stoken=.+/,
  payLogAuth: /(user-game-search|bill-record-user|customer-claim|player-log|user\.mihoyo\.com).*authkey=/
} as const;

export const mihoyoRouteRules = {
  help: /^\/绝区零(帮助|help|模块)$/,
  bindUid: /^(!|！|\/|#|＃)(绝区零|zzz)绑定(uid)?(\s|\+)*((1[0-9]|[1-9])[0-9]{8}|[1-9][0-9]{7})$/i,
  showUid: /^(!|！|\/|#|＃)(绝区零|zzz)(我的)?(uid)\d{0,2}$/i,
  delUid: /^(!|！|\/|#|＃)(绝区零|zzz)(删除|解绑)uid(\s|\+)*(\d{1,2})?$/i,
  dailyNote: /^(!|！|\/|#|＃)(绝区零|zzz)(体力|电量|查询体力)$/,
  playerIndex: /^(!|！|\/|#|＃)(绝区零|zzz)(角色|面板)$/,
  roleExplore: /^(!|！|\/|#|＃)(绝区零|zzz)(宝箱|成就|探索|探险|声望|探险度|探索度)\s*\d*$/,
  buddy: /^(!|！|\/|#|＃)(绝区零)?邦布$/,
  exchange: /^(!|！|\/|#|＃)(绝区零|zzz)兑换码$/,
  useCode: /^(!|！|\/|#|＃)(绝区零|zzz)(兑换码使用|cdk-u)\s*.+/i,
  mysNews: /^(!|！|\/|#|＃)(绝区零|崩坏三|崩三)(公告|资讯|活动)(列表)?\s*\d*$/,
  gameSign: /^(!|！|\/|#|＃)(崩坏3|崩三|崩3|全部)签到$/,
} as const;
