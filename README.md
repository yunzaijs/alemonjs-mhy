# 米哈游

## 指令一览

[README_COMMAND](./README_COMMAND.md)

### 导出 API

```typescript
import {
  // 类型
  type MihoyoGame,
  type StoredCookieData,
  type StokenData,
  type QueryResult,

  // 游戏检测
  resolveGame,

  // 账号操作
  getUserCookie,
  getUserMainUid,
  bindUserCookie,

  // Stoken
  getUserStoken,
  bindStoken,

  // 签到
  performGameSign,
  performBbsSign,

  // 统一查询（推荐）
  queryMihoyoApi,

  // 底层 API
  mysApiFetch,
  fetchGameRoles
} from 'alemonjs-mhy';
```

#### `queryMihoyoApi` — 统一查询

大多数查询场景推荐使用此方法，自动处理 Cookie 读取、UID 获取、区服识别：

```typescript
const result = await queryMihoyoApi({
  userId: '用户ID',
  game: 'gs',
  api: 'dailyNote'
});

if (result.success) {
  console.log(result.data); // API 返回数据
  console.log(result.uid); // 使用的 UID
}
```

#### `mysApiFetch` — 底层调用

需要自行传入 Cookie 和 UID，适合定制化场景：

```typescript
const res = await mysApiFetch({
  uid: '100000001',
  cookie: 'ltoken=xxx;ltuid=xxx;',
  api: 'dailyNote',
  game: 'gs'
});
```

## 免责声明

- 勿用于以盈利为目的的场景

- 代码开放，无需征得特殊同意，可任意使用。能备注来源最好，但不强求

- 图片与其他素材均来自于网络，仅供交流学习使用，如有侵权请联系，会立即删除

## 引用

|                          Nickname                          | Contribution         |
| :--------------------------------------------------------: | -------------------- |
|       [Yunzai](https://gitee.com/le-niao/Yunzai-Bot)       | 米游社API来源        |
|   [miao](https://github.com/yoimiya-kokomi/miao-plugin)    | 米游社API部分来源    |
|    [cvs](https://github.com/ctrlcvs/xiaoyao-cvs-plugin)    | 米游社SToken来源     |
|  [Hamster](https://github.com/GardenHamster/GenshinPray)   | 模拟抽卡背景素材来源 |
|  [西风驿站](https://bbs.mihoyo.com/ys/collection/839181)   | 角色攻略图来源       |
| [米游社友人A](https://bbs.mihoyo.com/ys/collection/428421) | 角色突破素材图来源   |
