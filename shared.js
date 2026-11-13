// 金手指证券交易所 · 共享数据层
// 深水城五方势力各有「上市产业」。价格按随机游走 + 事件冲击推进。
// 注意：字符串里不要出现未转义的英文双引号，否则整个模块语法错误。

export const NS = "com.gilded.exchange";
export const MKT_KEY = NS + "/market";
export const ACC_KEY = NS + "/account";

export const TICK_MS = 5000;      // 默认一跳 5 秒
export const SPEED_MIN = 1000;    // 最快 1 秒一跳
export const SPEED_MAX = 60000;   // 最慢 60 秒一跳
export const BAR_TICKS = 6;
// K 线周期：以 2 秒/跳 为基准，30 秒 = 15 跳/根，5 秒 = 2.5 跳/根
export const SEC_PER_TICK = 2;
export const DEFAULT_BAR_SEC = 30;
export const BAR_SEC_CHOICES = [5, 30, 60, 300, 900];       // 6 跳 = 1 根 K
export const MAX_BARS = 60;       // 保留 K 线根数（可左右回看）
export const FEE_RATE = 0.01;     // 佣金 1%（费伦的钱庄抽得狠）
export const FEE_MIN = 0.1;       // 最低佣金 1 银
export const LOT = 10;            // 一手 10 股（费伦的钱小，一手别太贵）
export const LIMIT = 0.10;        // 涨跌停 ±10%
export const TICKS_PER_DAY = 480; // 一天 480 跳
export const SETTLE_TICKS = 6;    // 卖出后 6 跳（一根 K）才交收
export const CROWD_NEUTRAL = 50;  // 拥挤度中性值

// ── 六个「上市产业」──────────────────────────────────────────────
export const STOCKS = [
  { id: "KSLT", code: "600101", name: "卡萨兰特银行", sector: "金融", p0: 6.40, dp: 2, vol: 0.0058, drift: 0.00002, float: 20000, trust: 50 },
  { id: "SNSA", code: "600102", name: "黑帆航运",   sector: "物流", p0: 1.25, dp: 2, vol: 0.0170, drift: 0.00004, float: 60000, trust: 50 },
  { id: "MNSN", code: "600103", name: "星歌商会",     sector: "贸易", p0: 2.80, dp: 2, vol: 0.0105, drift: 0.00001, float: 30000, trust: 50 },
  { id: "JLRS", code: "600104", name: "贾拉索船务",   sector: "航运", p0: 0.85, dp: 2, vol: 0.0190, drift: -0.00002, float: 50000, trust: 50 },
  { id: "GLHD", code: "600105", name: "格拉汉德置业", sector: "地产", p0: 1.95, dp: 2, vol: 0.0135, drift: 0.00005, float: 40000, trust: 50 },
  { id: "WDPA", code: "600106", name: "深水城港务",   sector: "公用", p0: 5.10, dp: 2, vol: 0.0068, drift: 0.00001, float: 25000, trust: 50 }
];

export const stockById = id => STOCKS.find(s => s.id === id);export const clampSpeed = v => Math.min(SPEED_MAX, Math.max(SPEED_MIN, Math.round(Number(v) || TICK_MS)));
export const stockLabel = s => s.name;
export const fmt = (v, dp) => Number(v).toFixed(dp);

// ── 事件预设：跟战役章节挂钩，GM 一点就砸/拉 ─────────────────────
export const PRESETS = [
  { id: "fireball", title: "火球炸城", desc: "巨魔颅骨巷一声巨响，半条街化为焦土。", imp: { GLHD: -9, KSLT: 2, WDPA: -1.5 }, ticks: 18 },
  { id: "bankrun", title: "卡萨兰特银行挤兑", desc: "兑付窗口排起长队，贵族们连夜转移金库。", imp: { KSLT: -8, GLHD: -3, WDPA: -2 }, ticks: 24 },
  { id: "fishbowl", title: "珊娜萨的鱼缸被抢", desc: "有人闯进巢穴，把希尔加连鱼带缸搬走了。", imp: { SNSA: -7, MNSN: 1 }, ticks: 18 },
  { id: "shipwreck", title: "星歌的货船沉了", desc: "三艘商船在风暴中失踪，货主们堵在商会门口。", imp: { MNSN: -6, JLRS: 3 }, ticks: 24 },
  { id: "blockade", title: "贾拉索封锁港口", desc: "船队横在防波堤外，进出港的船都得交买路钱。", imp: { JLRS: 5, WDPA: -4, MNSN: -2 }, ticks: 24 },
  { id: "caravan", title: "商队节开幕", desc: "全城放假三天，码头和酒馆的流水翻了一倍。", imp: { WDPA: 2, MNSN: 2, GLHD: 1 }, ticks: 30 },
  { id: "strike", title: "公会日大罢工", desc: "码头工人封了栈桥，货栈的银子晒在太阳底下。", imp: { GLHD: -4, WDPA: -3, JLRS: 2 }, ticks: 24 },
  { id: "taxcut", title: "蒙面领主议会减税", desc: "港口税下调，消息比传令官跑得还快。", imp: { KSLT: 3, MNSN: 2, WDPA: 3 }, ticks: 30 },
  { id: "gangwar", title: "散塔林火并", desc: "两派在码头区当街开打，银条信用跟着抖。", imp: { SNSA: -5, JLRS: -2, KSLT: 1 }, ticks: 18 },
  { id: "goldflow", title: "金龙大量流入", desc: "前领主的金库传闻坐实，全城都在找买家。", imp: { KSLT: 4, GLHD: 3, MNSN: 2 }, ticks: 30 },

  // ── 大事件：绑剧情用的重锤，幅度大、不封板 ──────────────────
  { id: "eyes_lost", title: "第三只眼不见了", desc: "戈罗尔之石的三只眼同一天失窃，几家商号的保险柜连夜换了锁。", imp: { SNSA: -16, MNSN: -6, KSLT: -4 }, ticks: 24 },
  { id: "sansa_rampage", title: "珊娜萨血洗码头", desc: "鱼缸空了之后，珊娜萨的打手把整条码头街掀了一遍。", imp: { SNSA: -24, JLRS: -10, WDPA: -8, KSLT: -4 }, ticks: 18 },
  { id: "manshoon_leak", title: "星歌的名字上了头版", desc: "《深水城之眼》头版印着星歌的真名，商会股价当场崩了。", imp: { MNSN: -26, KSLT: 8, GLHD: 6 }, ticks: 24 },
  { id: "cassalanter_due", title: "卡萨兰特的契约到期", desc: "九十九万九千九百九十九金币的账单摆在桌上，午夜之前必须清。", imp: { KSLT: -30, GLHD: -12, WDPA: -7 }, ticks: 18 },
  { id: "jarlaxle_sails", title: "贾拉索的船队离港", desc: "二十艘船同时起锚，港口只剩下空泊位和押金的传说。", imp: { JLRS: -22, WDPA: -10, MNSN: -5 }, ticks: 30 },
  { id: "dragon_wakes", title: "红龙醒了", desc: "宝库深处的呼吸声传到了街上，所有人同时想起自己欠了谁的钱。", imp: { KSLT: -18, MNSN: -20, GLHD: -25, SNSA: -15, JLRS: -12, WDPA: -10 }, ticks: 18 },
  { id: "hoard_found", title: "五十万龙金见光", desc: "前领主的金库被搬上街，搬运工从早上排到第二天凌晨。", imp: { KSLT: 14, GLHD: 18, MNSN: 10, WDPA: 8 }, ticks: 36 },
  { id: "masked_raid", title: "蒙面领主全城戒严", desc: "城门落锁，巡逻队挨家挨户敲门，生意全停。", imp: { GLHD: -18, SNSA: -14, JLRS: -12, KSLT: 4 }, ticks: 24 },
  { id: "harper_audit", title: "竖琴手抄了账房", desc: "账本被一页页摊在桌上，几家商号的名字被红笔圈了出来。", imp: { KSLT: -12, MNSN: -10, SNSA: 6 }, ticks: 18 },
  { id: "nimblewright", title: "灵巧莱特连环案", desc: "第五起爆炸之后，北区的房租和地价一起塌了。", imp: { GLHD: -14, KSLT: -6, SNSA: 4 }, ticks: 24 },

  // ── 中小事件：日常插曲，幅度温和 ────────────────────────────
  { id: "trollskull_open", title: "巨魔颅骨酒馆开张", desc: "新酒馆第一晚就把半条街的客人吸走了。", imp: { GLHD: 9, WDPA: 3 }, ticks: 30 },
  { id: "gold_ship", title: "金龙船进港", desc: "三桅船压着吃水线进港，甲板上全是箱子。", imp: { WDPA: 12, JLRS: 9, MNSN: 6 }, ticks: 30 },
  { id: "shipwrights_ball", title: "造船匠舞会", desc: "全城的船长和寡妇挤在同一个舞厅，订单签到了明年。", imp: { JLRS: 7, WDPA: 5, KSLT: 3 }, ticks: 36 },
  { id: "double_festival", title: "双塞节双游行", desc: "两场游行撞在同一天，酒馆、马车和赌坊一起爆满。", imp: { WDPA: 6, MNSN: 5, JLRS: 4, GLHD: 3 }, ticks: 36 }
];

// 每个预设自带的拥挤度冲击：恐慌、丑闻压拥挤，利好、抢购推拥挤
const PRESET_CROWD = {
  fireball: -35, bankrun: -50, fishbowl: -30, shipwreck: -25, blockade: -20,
  caravan: 20, strike: -30, taxcut: 25, gangwar: -25, goldflow: 40,
  eyes_lost: -30, sansa_rampage: -50, manshoon_leak: -45, cassalanter_due: -55,
  jarlaxle_sails: -35, dragon_wakes: -60, hoard_found: 35, masked_raid: -30,
  harper_audit: -20, nimblewright: -15, trollskull_open: 10, gold_ship: 20,
  shipwrights_ball: 10, double_festival: 15
};
for (const p of PRESETS) p.crowd = PRESET_CROWD[p.id] ?? 0;

// 事件时长（按真实分钟算，触发时按当时速度换算成跳数）与信心冲击
// 参照现实：丑闻 = 长期信用受损；救市/公开账本/白衣骑士 = 信心修复
const PRESET_META = {
  fireball:         { durMin: 12, trust: { GLHD: -8 } },
  bankrun:          { durMin: 15, trust: { KSLT: -12 } },
  fishbowl:         { durMin: 10, trust: { SNSA: -6 } },
  shipwreck:        { durMin: 12, trust: { MNSN: -5 } },
  blockade:         { durMin: 20, trust: { JLRS: -8, WDPA: -4 } },
  caravan:          { durMin: 8,  trust: { WDPA: 2, MNSN: 2 } },
  strike:           { durMin: 15, trust: { GLHD: -3, WDPA: -2 } },
  taxcut:           { durMin: 10, trust: { KSLT: 3, MNSN: 2 } },
  gangwar:          { durMin: 12, trust: { SNSA: -5 } },
  goldflow:         { durMin: 12, trust: { KSLT: 4 } },

  eyes_lost:        { durMin: 20, trust: { SNSA: -8, MNSN: -4 } },
  sansa_rampage:    { durMin: 25, trust: { SNSA: -25, JLRS: -6, WDPA: -4 } },
  manshoon_leak:    { durMin: 30, trust: { MNSN: -30, KSLT: 4 } },
  cassalanter_due:  { durMin: 30, trust: { KSLT: -30 } },
  jarlaxle_sails:   { durMin: 30, trust: { JLRS: -15, WDPA: -6 } },
  dragon_wakes:     { durMin: 30, trust: { KSLT: -20, MNSN: -18, GLHD: -18, SNSA: -15, JLRS: -12, WDPA: -10 } },
  hoard_found:      { durMin: 30, trust: { KSLT: 12, GLHD: 10, MNSN: 8 } },
  masked_raid:      { durMin: 25, trust: { GLHD: -12, SNSA: -8 } },
  harper_audit:     { durMin: 20, trust: { KSLT: -6, MNSN: -6 } },
  nimblewright:     { durMin: 20, trust: { GLHD: -10 } },
  trollskull_open:  { durMin: 8,  trust: { GLHD: 3 } },
  gold_ship:        { durMin: 8,  trust: { WDPA: 4, JLRS: 3 } },
  shipwrights_ball: { durMin: 8,  trust: { JLRS: 3, WDPA: 2 } },
  double_festival:  { durMin: 10, trust: { WDPA: 3, MNSN: 2 } }
};

// 自救 / 利好大事件：现实中「公开账本、财团接盘、监管注资」那一套
const EXTRA_PRESETS = [
  { id: "cassalanter_bailout", title: "卡萨兰特公开账本并注资", desc: "账本摊在广场上，家族当场掏钱补窟窿，挤兑的人慢慢散了。", imp: { KSLT: 16, GLHD: 6 }, trust: { KSLT: 22, GLHD: 4 }, durMin: 30, crowd: 40 },
  { id: "masked_rescue", title: "蒙面领主救市基金", desc: "议会连夜通过救市案，金库的车队开进了银行街。", imp: { KSLT: 9, MNSN: 8, GLHD: 7, SNSA: 5, JLRS: 5, WDPA: 6 }, trust: { KSLT: 10, MNSN: 8, GLHD: 8, WDPA: 8 }, durMin: 30, crowd: 45 },
  { id: "white_knight", title: "白衣骑士收购格拉汉德", desc: "一个不肯露面的财团溢价接走了全部债务，地价止跌。", imp: { GLHD: 18 }, trust: { GLHD: 16 }, durMin: 20, crowd: 35 },
  { id: "harbor_bond", title: "港口重建债券发行", desc: "城主担保、商会认购，码头在三个月里重新立了起来。", imp: { WDPA: 12, JLRS: 5 }, trust: { WDPA: 12, JLRS: 4 }, durMin: 20, crowd: 30 },
  { id: "guild_pact", title: "商会互保联盟", desc: "几家商号签了互保契，谁倒下其他人兜底——至少纸面上如此。", imp: { MNSN: 10, SNSA: 8, JLRS: 4 }, trust: { MNSN: 8, SNSA: 6 }, durMin: 20, crowd: 25 },
  { id: "dragon_slain", title: "红龙被逐出宝库", desc: "一队不要命的冒险者把龙引出了地道，全城放了一夜烟花。", imp: { KSLT: 8, MNSN: 9, GLHD: 10, SNSA: 8, JLRS: 7, WDPA: 8 }, trust: { KSLT: 8, MNSN: 8, GLHD: 10, SNSA: 6, JLRS: 6, WDPA: 8 }, durMin: 30, crowd: 40 },
  { id: "sansa_reform", title: "珊娜萨换了掌柜", desc: "新掌柜第一件事是把账目钉在门上，血洗码头那页被撕了。", imp: { SNSA: 10 }, trust: { SNSA: 10 }, durMin: 15, crowd: 20 },
  { id: "jarlaxle_contract", title: "贾拉索与城主签约", desc: "船队挂上了深水城的旗，走私泊位一次洗白。", imp: { JLRS: 12, WDPA: 4 }, trust: { JLRS: 12 }, durMin: 20, crowd: 30 }
];
for (const p of PRESETS) {
  const meta = PRESET_META[p.id];
  if (meta) Object.assign(p, { durMin: meta.durMin, trust: meta.trust });
}
// 大事件（1 小时）：好坏都补足，方便城主按「谁干的」挑
const BIG_EVENTS = [
  // ── 坏事 · 1 小时 ──
  { id: "goldheist_exposed", side: "bad", owner: "KSLT", title: "金龙劫案曝光", desc: "五十万龙金的账被捅到街上，全城银行门口排起长队。", imp: { KSLT: -24, GLHD: -12, MNSN: -8, WDPA: -6 }, trust: { KSLT: -26, GLHD: -14, MNSN: -8 }, durMin: 60, crowd: -60 },
  { id: "fishbowl_smashed", side: "bad", owner: "SNSA", title: "珊娜萨的鱼缸被砸", desc: "有人把希尔加的金鱼缸从三楼扔了下来，珊娜萨疯了。", imp: { SNSA: -30, MNSN: -8 }, trust: { SNSA: -32 }, durMin: 60, crowd: -55 },
  { id: "black_ledger_leaked", side: "bad", owner: "MNSN", title: "星歌的黑账本落到竖琴手手里", desc: "账本上每一个名字都被念了出来，商会的门一整天没开。", imp: { MNSN: -28, KSLT: -6 }, trust: { MNSN: -32, KSLT: -4 }, durMin: 60, crowd: -50 },
  { id: "cassalanter_fire", side: "bad", owner: "KSLT", title: "卡萨兰特庄园起火", desc: "火从书房烧到宴会厅，救火的人说看见有人往里泼油。", imp: { KSLT: -25, GLHD: -10 }, trust: { KSLT: -24, GLHD: -8 }, durMin: 60, crowd: -45 },
  { id: "jarlaxle_seized", side: "bad", owner: "JLRS", title: "贾拉索的船队被扣", desc: "城防以走私为由扣了整支船队，泊位上全是空缆绳。", imp: { JLRS: -26, WDPA: -10 }, trust: { JLRS: -22, WDPA: -6 }, durMin: 60, crowd: -40 },
  { id: "glhd_tower_collapse", side: "bad", owner: "GLHD", title: "格拉汉德的塔塌了", desc: "新盖的塔在验收当天塌了半边，压死了三个工匠。", imp: { GLHD: -30, SNSA: -6 }, trust: { GLHD: -30 }, durMin: 60, crowd: -50 },
  { id: "dock_strike_big", side: "bad", owner: "WDPA", title: "码头大罢工", desc: "搬运工把吊机锁了，货船在湾里排了三天。", imp: { WDPA: -24, SNSA: -12, MNSN: -8 }, trust: { WDPA: -20, SNSA: -8 }, durMin: 60, crowd: -45 },
  { id: "masked_infight", side: "bad", owner: "WDPA", title: "蒙面领主内斗", desc: "议会里有人把另一派的账本摔在桌上，会议开了通宵。", imp: { KSLT: -10, MNSN: -10, GLHD: -10, WDPA: -10, SNSA: -8, JLRS: -8 }, trust: { KSLT: -10, MNSN: -10, GLHD: -10, WDPA: -10 }, durMin: 60, crowd: -35 },
  { id: "zhentarim_massacre", side: "bad", owner: "MNSN", title: "散塔林会血洗商会", desc: "商会夜宴上死了七个人，血从门缝流到街上。", imp: { MNSN: -22, SNSA: -10, JLRS: -6 }, trust: { MNSN: -24, SNSA: -10 }, durMin: 60, crowd: -45 },
  { id: "plague", side: "bad", owner: "WDPA", title: "深水城瘟疫", desc: "码头区先病倒的，然后是整个北区；城门关了。", imp: { KSLT: -12, MNSN: -14, GLHD: -16, SNSA: -12, JLRS: -14, WDPA: -18 }, trust: { KSLT: -12, MNSN: -14, GLHD: -16, SNSA: -12, JLRS: -12, WDPA: -18 }, durMin: 60, crowd: -60 },

  // ── 好事 · 1 小时 ──
  { id: "hoard_deposited", side: "good", owner: "KSLT", title: "五十万龙金入库", desc: "金库的门开了一条缝，全城的债主突然都不急了。", imp: { KSLT: 14, GLHD: 10, MNSN: 8, SNSA: 6, JLRS: 6, WDPA: 8 }, trust: { KSLT: 16, GLHD: 12, MNSN: 8 }, durMin: 60, crowd: 55 },
  { id: "city_audit", side: "good", owner: "WDPA", title: "城主公开审计", desc: "审计官把账本一页页念完，街上的谣言反而少了。", imp: { KSLT: 10, MNSN: 8, GLHD: 8, WDPA: 10 }, trust: { KSLT: 14, MNSN: 10, GLHD: 10, WDPA: 14 }, durMin: 60, crowd: 35 },
  { id: "sansa_peace", side: "good", owner: "SNSA", title: "珊娜萨与商会和解", desc: "两家人坐在同一张桌子上签了字，码头上的刀收了起来。", imp: { SNSA: 14, MNSN: 8, WDPA: 4 }, trust: { SNSA: 14, MNSN: 6 }, durMin: 60, crowd: 35 },
  { id: "manshoon_fall", side: "good", owner: "MNSN", title: "星歌倒台", desc: "商会连夜换了掌柜，旧账一把火烧了个干净。", imp: { MNSN: 18, KSLT: 4 }, trust: { MNSN: 20, KSLT: 4 }, durMin: 60, crowd: 40 },
  { id: "cassalanter_peace", side: "good", owner: "KSLT", title: "卡萨兰特与竖琴手和解", desc: "双方在码头仓库见了面，出来时都没有带武器。", imp: { KSLT: 15, MNSN: 5 }, trust: { KSLT: 18, MNSN: 4 }, durMin: 60, crowd: 35 },
  { id: "jarlaxle_pardon", side: "good", owner: "JLRS", title: "贾拉索获赦", desc: "城主签了赦令，船队挂旗的那天码头挤满了人。", imp: { JLRS: 16, WDPA: 6 }, trust: { JLRS: 14, WDPA: 4 }, durMin: 60, crowd: 40 },
  { id: "harbor_expansion", side: "good", owner: "WDPA", title: "港口扩建竣工", desc: "新栈桥能同时停十二艘大船，第一艘进港时全城去看。", imp: { WDPA: 15, JLRS: 8, MNSN: 5 }, trust: { WDPA: 14, JLRS: 6 }, durMin: 60, crowd: 45 },
  { id: "north_rebuild", side: "good", owner: "GLHD", title: "北区重建完成", desc: "烧掉的街区重新立了起来，房租却还没涨。", imp: { GLHD: 16, WDPA: 4 }, trust: { GLHD: 15 }, durMin: 60, crowd: 40 },
  { id: "dragon_insurance", side: "good", owner: "KSLT", title: "龙金保险基金成立", desc: "银行街凑了一笔钱，专门赔给被龙和火灾祸害的商户。", imp: { KSLT: 8, MNSN: 6, GLHD: 6, WDPA: 6, SNSA: 4, JLRS: 4 }, trust: { KSLT: 10, MNSN: 8, GLHD: 8, WDPA: 8 }, durMin: 60, crowd: 35 },
  { id: "festival_amnesty", side: "good", owner: "WDPA", title: "双塞节大赦", desc: "城主下令大赦，欠债的、逃税的、打架的都回家过节了。", imp: { KSLT: 6, MNSN: 5, GLHD: 5, WDPA: 6, SNSA: 5, JLRS: 5 }, trust: { KSLT: 8, MNSN: 6, GLHD: 6, WDPA: 8, SNSA: 6, JLRS: 6 }, durMin: 60, crowd: 40 }
];
PRESETS.push(...BIG_EVENTS);

// 每个预设的「好坏 · 哪个势力」标签，GM 下拉按这个分组
const PRESET_TAG = {
  fireball: ["bad","GLHD"], bankrun: ["bad","KSLT"], fishbowl: ["bad","SNSA"], shipwreck: ["bad","MNSN"],
  blockade: ["bad","JLRS"], caravan: ["good","WDPA"], strike: ["bad","WDPA"], taxcut: ["good","KSLT"],
  gangwar: ["bad","SNSA"], goldflow: ["good","KSLT"], eyes_lost: ["bad","SNSA"], sansa_rampage: ["bad","SNSA"],
  manshoon_leak: ["bad","MNSN"], cassalanter_due: ["bad","KSLT"], jarlaxle_sails: ["bad","JLRS"],
  dragon_wakes: ["bad","GLHD"], hoard_found: ["good","KSLT"], masked_raid: ["bad","GLHD"], harper_audit: ["bad","KSLT"],
  nimblewright: ["bad","GLHD"], trollskull_open: ["good","GLHD"], gold_ship: ["good","WDPA"],
  shipwrights_ball: ["good","JLRS"], double_festival: ["good","WDPA"],
  cassalanter_bailout: ["good","KSLT"], masked_rescue: ["good","WDPA"], white_knight: ["good","GLHD"],
  harbor_bond: ["good","WDPA"], guild_pact: ["good","MNSN"], dragon_slain: ["good","GLHD"],
  sansa_reform: ["good","SNSA"], jarlaxle_contract: ["good","JLRS"]
};
for (const p of PRESETS) {
  const tag = PRESET_TAG[p.id];
  if (tag) { p.side = tag[0]; p.owner = tag[1]; }
  if (!p.side) p.side = "bad";
  if (!p.owner) p.owner = "WDPA";
}

// 补齐各势力的「好事」：之前偏科，珊娜萨/星歌/贾拉索/格拉汉德的好消息太少
const BALANCE_EVENTS = [
  // 黑帆航运
  { id: "sansa_truce", side: "good", owner: "SNSA", title: "珊娜萨与竖琴手停战", desc: "两边在码头仓库划了界，刀口朝下。", imp: { SNSA: 12, MNSN: 3 }, trust: { SNSA: 12 }, durMin: 30, crowd: 30 },
  { id: "sansa_orphanage", side: "good", owner: "SNSA", title: "珊娜萨捐建孤儿院", desc: "码头区最破的那条街上，新院子挂起了珊娜萨的旗。", imp: { SNSA: 8, WDPA: 3 }, trust: { SNSA: 14 }, durMin: 20, crowd: 25 },
  { id: "sansa_landmark", side: "good", owner: "SNSA", title: "珊娜萨的鱼缸成了城标", desc: "那条金鱼上了明信片，游客排队来看。", imp: { SNSA: 10, WDPA: 4 }, trust: { SNSA: 10 }, durMin: 30, crowd: 30 },
  { id: "sansa_warehouse", side: "good", owner: "SNSA", title: "珊娜萨开放码头仓储", desc: "空了三年的仓库重新堆满货，搬运工有了活干。", imp: { SNSA: 9, WDPA: 4, MNSN: 3 }, trust: { SNSA: 10, WDPA: 4 }, durMin: 30, crowd: 25 },

  // 星歌商会
  { id: "manshoon_tender", side: "good", owner: "MNSN", title: "星歌商会公开招标", desc: "标书贴满了公告栏，连小商号也领到了份额。", imp: { MNSN: 10, GLHD: 3 }, trust: { MNSN: 10 }, durMin: 20, crowd: 25 },
  { id: "guild_apprentice", side: "good", owner: "MNSN", title: "商会设立学徒基金", desc: "第一批学徒进了账房，街上少了些闲汉。", imp: { MNSN: 7, WDPA: 3 }, trust: { MNSN: 12 }, durMin: 20, crowd: 20 },
  { id: "manshoon_reorg", side: "good", owner: "MNSN", title: "星歌商会改组", desc: "新章程把旧掌柜的亲信全清了出去。", imp: { MNSN: 14, KSLT: 3 }, trust: { MNSN: 14 }, durMin: 30, crowd: 30 },
  { id: "guild_harbor_deal", side: "good", owner: "MNSN", title: "商会与港务签长期仓储协议", desc: "十年的租约，码头和商会各让了一步。", imp: { MNSN: 9, WDPA: 4 }, trust: { MNSN: 8, WDPA: 6 }, durMin: 20, crowd: 20 },

  // 贾拉索船务
  { id: "jarlaxle_route", side: "good", owner: "JLRS", title: "船队开辟新航线", desc: "第一艘船从南边回来时，舱里全是没见过的货。", imp: { JLRS: 12, WDPA: 5, MNSN: 4 }, trust: { JLRS: 10, WDPA: 4 }, durMin: 30, crowd: 30 },
  { id: "jarlaxle_relief", side: "good", owner: "JLRS", title: "贾拉索捐船赈灾", desc: "三艘船改运粮食，船长骂了一路，货还是送到了。", imp: { JLRS: 9, WDPA: 5 }, trust: { JLRS: 14, WDPA: 6 }, durMin: 20, crowd: 25 },
  { id: "jarlaxle_seat", side: "good", owner: "JLRS", title: "航运公会承认船队席位", desc: "挂了三十年的黑船，第一次有了正式席位。", imp: { JLRS: 10, MNSN: 3 }, trust: { JLRS: 12 }, durMin: 30, crowd: 25 },

  // 格拉汉德置业
  { id: "glhd_school", side: "good", owner: "GLHD", title: "格拉汉德捐地建学堂", desc: "北区最贵的那块地，划给了学堂。", imp: { GLHD: 10, WDPA: 3 }, trust: { GLHD: 14 }, durMin: 20, crowd: 25 },
  { id: "glhd_compensation", side: "good", owner: "GLHD", title: "塌塔事故赔偿到位", desc: "死伤工匠的家眷领到了钱，没有再上街。", imp: { GLHD: 8, SNSA: 2 }, trust: { GLHD: 12 }, durMin: 30, crowd: 20 },
  { id: "glhd_market", side: "good", owner: "GLHD", title: "北区新市场开业", desc: "空地上支起两百个摊位，租金头三个月免了。", imp: { GLHD: 11, WDPA: 3, MNSN: 3 }, trust: { GLHD: 10 }, durMin: 30, crowd: 30 },

  // 贾拉索的坏消息也补一条，免得坏事偏少
  { id: "jarlaxle_reef", side: "bad", owner: "JLRS", title: "船队触礁", desc: "领航员把暗礁看成了浪花，三艘船的货全泡了。", imp: { JLRS: -20, WDPA: -5 }, trust: { JLRS: -14 }, durMin: 30, crowd: -35 }
];
PRESETS.push(...BALANCE_EVENTS);

// 信心恢复档位：k 是每跳向目标回归的比例，ceil 是“污点上限”（恶性事件后回不到 50）
export const TRUST_TIERS = {
  light: { k: 0.0018, ceil: 50 },
  heavy: { k: 0.0005, ceil: 50 },
  evil:  { k: 0.00007, ceil: 32 }
};
export function trustTier(shock, title) {
  const d = Number(shock) || 0;
  const bad = d < 0;
  if (bad && (Math.abs(d) >= 25 || /操控|邪教|血洗|黑账|内斗|灭口|栽赃|洗钱|勾结/.test(String(title || "")))) return "evil";
  if (!bad) return "light";
  return Math.abs(d) >= 12 ? "heavy" : "light";
}
export const clampTrust = v => Math.max(0, Math.min(100, Number(v) || 0));

export const clampCrowd = v => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));

// 直接给某几只股票加拥挤度（事件、玩家交易都走这里）
export function addCrowd(m, ids, delta) {
  for (const id of ids) {
    const st = m.stocks && m.stocks[id];
    if (st) st.crowd = clampCrowd((Number(st.crowd) || CROWD_NEUTRAL) + delta);
  }
  return m;
}

export const NEWS_FLAVOR = [
  { imp: { WDPA: 1.2 }, t: "【港口】海之少女嘉年华宣布驻留一季，码头生意火爆。" },
  { imp: { MNSN: -1.5 }, t: "【商会】星歌商会否认与散塔林有往来，记者被请出门。" },
  { imp: { SNSA: 1.8 }, t: "【码头区】夜里有三十辆无标记货车进城，没人敢问装的是什么。" },
  { imp: { KSLT: -1.2 }, t: "【金融】卡萨兰特银行上调储备金率，小商户怨声载道。" },
  { imp: { JLRS: 1.6 }, t: "【航运】卢斯坎私掠船连截三艘商船，保费上调。" },
  { imp: { GLHD: 1.2 }, t: "【地产】北区两块地皮被匿名买家拍走，价格高得离谱。" },
  { imp: { KSLT: 1.0 }, t: "【金融】卡萨兰特银行公布季度储备，数字比传闻好看。" },
  { imp: { SNSA: -1.4 }, t: "【码头区】珊娜萨的货舱进了水，湿了三成香料。" },
  { imp: { MNSN: 1.2 }, t: "【商会】星歌商会拿下北区军械订单。" },
  { imp: { JLRS: -1.6 }, t: "【航运】贾拉索的一艘快船在迷雾中失联。" },
  { imp: { GLHD: -1.1 }, t: "【地产】北区地契查出伪造，交易被叫停。" },
  { imp: { WDPA: -1.3 }, t: "【港口】防波堤塌了一段，大船排队等泊位。" },
  { imp: { KSLT: -1.8 }, t: "【金融】卡萨兰特银行的兑付窗口提前关门。" },
  { imp: { SNSA: 1.5 }, t: "【码头区】珊娜萨包下整条鲸油街的仓库。" },
  { imp: { MNSN: -1.0 }, t: "【商会】星歌商会的账房先生连夜辞职。" },
  { imp: { JLRS: 1.7 }, t: "【航运】卢斯坎的私掠船退回了外海。" },
  { imp: { GLHD: 1.4 }, t: "【地产】巨魔颅骨巷的地价被一笔匿名买盘抬高。" },
  { imp: { WDPA: 1.9 }, t: "【港口】深水城港务宣布加开夜班泊位。" },
  { imp: { WDPA: 0.8 }, t: "【港口】海关换了个新关长，报关单多盖一个章。" },
  { imp: { WDPA: -1.5 }, t: "【港口】三桅船「海之少女」撞断栈桥，码头封了半天。" },
  { imp: { JLRS: 1.1 }, t: "【航运】灯塔修好了，夜航保费下调一成。" },
  { imp: { MNSN: -1.7 }, t: "【商会】星歌商会的仓库半夜起火，烧掉半仓丝绸。" },
  { imp: { KSLT: 0.9 }, t: "【金融】卡萨兰特银行发行新一期城债券，半天售罄。" },
  { imp: { GLHD: 1.6 }, t: "【地产】南区新桥动工，桥头地价先涨为敬。" },
  { imp: { SNSA: -1.2 }, t: "【码头区】鱼市查出掺假，珊娜萨的冷库被封了三天。" },
  { imp: { JLRS: -0.9 }, t: "【航运】外海连着三天大雾，船期全乱。" },
  { imp: { MNSN: 1.3 }, t: "【商会】星歌包下整场拍卖会，槌声一响黄金万两。" },
  { imp: { WDPA: 1.4 }, t: "【港口】捕鲸船队满载回港，鲸油价格应声下跌。" },
  { imp: { KSLT: -0.8 }, t: "【金融】有个兑付窗口排起长队，保安加了双岗。" },
  { imp: { GLHD: -1.5 }, t: "【地产】北区一栋旧楼塌了半边，住户堵在门口。" },
  { imp: { SNSA: 1.6 }, t: "【码头区】珊娜萨接了笔大单，连夜招了三百个搬运工。" },
  { imp: { JLRS: 1.2 }, t: "【航运】贾拉索的船队换了新帆，速度传闻快了半成。" },
  { imp: { MNSN: -0.9 }, t: "【商会】商队在城郊被劫，商会悬赏五百金。" },
  { imp: { WDPA: -1.1 }, t: "【港口】罢工的搬运工堵了闸口，货堆在太阳底下。" },
  { imp: { KSLT: 1.2 }, t: "【金融】蒙面领主议会通过减税案，银行股先涨。" },
  { imp: { GLHD: 0.9 }, t: "【地产】巨魔颅骨巷整修完毕，房租涨了一截。" },
  { imp: { SNSA: -0.8 }, t: "【码头区】码头区查出一批无主货，珊娜萨急着撇清。" },
  { imp: { JLRS: -1.3 }, t: "【航运】卢斯坎私掠船又出现了，商船绕道。" },
  { imp: { MNSN: 1.5 }, t: "【商会】星歌和北区铁匠行会签了长约。" },
  { imp: { WDPA: 1.0 }, t: "【港口】新泊位启用，大船不用再排队。" },
  { imp: { KSLT: -1.4 }, t: "【金融】卡萨兰特的一位大客户突然提空了金库。" },
  { imp: { GLHD: 1.3 }, t: "【地产】匿名买家一口气买下三条街的铺面。" },

  // ── 以下为扩充版快讯：单只股票、幅度 0.6%～2.0%、只当背景噪音 ──
  { imp: { KSLT: 1.1 }, t: "【金融】卡萨兰特延长营业至午夜，兑付长队散了。" },
  { imp: { KSLT: -1.3 }, t: "【金融】一位蒙面贵族提走三十箱银币。" },
  { imp: { KSLT: 0.7 }, t: "【金融】新账房总管上任，据说是竖琴手举荐。" },
  { imp: { KSLT: -1.6 }, t: "【金融】城南分行遭劫，损失清单未公开。" },
  { imp: { KSLT: 1.4 }, t: "【金融】战争债券开售，贵族抢着认购。" },
  { imp: { KSLT: -0.9 }, t: "【金融】匿名信指控银行挪用孤儿基金。" },
  { imp: { KSLT: 1.2 }, t: "【金融】贷款利率下调，小商户排队签约。" },
  { imp: { KSLT: -1.8 }, t: "【金融】大客户把存款转去散塔林的银号。" },
  { imp: { KSLT: 0.9 }, t: "【金融】银行公开金库储备，谣言自破。" },
  { imp: { KSLT: -1.1 }, t: "【金融】合伙人卷款潜逃，通缉令贴满码头。" },
  { imp: { KSLT: 1.5 }, t: "【金融】城库业务转交卡萨兰特打理。" },
  { imp: { KSLT: -1.2 }, t: "【金融】巨额汇票被拒付，商户围了柜台。" },
  { imp: { KSLT: 0.8 }, t: "【金融】新储蓄计划半天售罄。" },
  { imp: { KSLT: -1.4 }, t: "【金融】审计官进驻，账本封存。" },
  { imp: { KSLT: 1.0 }, t: "【金融】赞助双塞节游行，口碑回暖。" },
  { imp: { KSLT: -0.7 }, t: "【金融】柜台兑换价被指不公。" },
  { imp: { KSLT: 1.3 }, t: "【金融】与港务签下结算协议。" },
  { imp: { KSLT: -1.5 }, t: "【金融】传言说金库其实是空的。" },
  { imp: { SNSA: 1.2 }, t: "【码头区】珊娜萨的冷库新装了冰魔法。" },
  { imp: { SNSA: -1.3 }, t: "【码头区】一船腌鱼在港外翻了。" },
  { imp: { SNSA: 0.9 }, t: "【码头区】新开的鱼市归珊娜萨抽成。" },
  { imp: { SNSA: -1.7 }, t: "【码头区】海关扣了珊娜萨三船货。" },
  { imp: { SNSA: 1.5 }, t: "【码头区】珊娜萨买下鲸油街两间铺面。" },
  { imp: { SNSA: -0.8 }, t: "【码头区】有搬运工在货舱里失踪。" },
  { imp: { SNSA: 1.1 }, t: "【码头区】珊娜萨给码头工人加了工钱。" },
  { imp: { SNSA: -1.2 }, t: "【码头区】鱼干里查出以次充好。" },
  { imp: { SNSA: 1.4 }, t: "【码头区】珊娜萨包下北堤的卸货权。" },
  { imp: { SNSA: -0.9 }, t: "【码头区】夜里有人往冷库扔火把。" },
  { imp: { SNSA: 0.7 }, t: "【码头区】珊娜萨赞助鱼市节。" },
  { imp: { SNSA: -1.5 }, t: "【码头区】三艘驳船在雾里撞成一团。" },
  { imp: { SNSA: 1.3 }, t: "【码头区】珊娜萨接下水城的下水道清淤。" },
  { imp: { SNSA: -1.1 }, t: "【码头区】账房发现有人做假账。" },
  { imp: { SNSA: 1.0 }, t: "【码头区】新冷库启用，损耗降了三成。" },
  { imp: { SNSA: -0.6 }, t: "【码头区】码头区抱怨鱼价太贵。" },
  { imp: { SNSA: 0.8 }, t: "【码头区】珊娜萨和盐商签了长约。" },
  { imp: { SNSA: -1.4 }, t: "【码头区】一仓咸鱼被查出有毒。" },
  { imp: { MNSN: 1.2 }, t: "【商会】星歌签下北区军械的大单。" },
  { imp: { MNSN: -1.4 }, t: "【商会】商会仓库盘点少了两成货。" },
  { imp: { MNSN: 0.9 }, t: "【商会】星歌赞助工匠行会的学徒赛。" },
  { imp: { MNSN: -1.1 }, t: "【商会】商会拒绝赔付沉船的货主。" },
  { imp: { MNSN: 1.5 }, t: "【商会】星歌拿下城北的粮道。" },
  { imp: { MNSN: -0.8 }, t: "【商会】账房先生带着账本跑了。" },
  { imp: { MNSN: 1.0 }, t: "【商会】商会开仓平抑粮价，口碑大好。" },
  { imp: { MNSN: -1.6 }, t: "【商会】一列车队在城郊被劫。" },
  { imp: { MNSN: 1.3 }, t: "【商会】星歌与矮人铁匠签了长约。" },
  { imp: { MNSN: -0.9 }, t: "【商会】商会会馆的屋顶塌了。" },
  { imp: { MNSN: 0.7 }, t: "【商会】星歌捐了一笔修城墙的钱。" },
  { imp: { MNSN: -1.2 }, t: "【商会】有人揭发商会以次充好。" },
  { imp: { MNSN: 1.4 }, t: "【商会】商会的拍卖会拍出天价。" },
  { imp: { MNSN: -1.5 }, t: "【商会】三间分号同时起火。" },
  { imp: { MNSN: 1.1 }, t: "【商会】星歌包下商队节的主展位。" },
  { imp: { MNSN: -0.6 }, t: "【商会】商会的秤被指做了手脚。" },
  { imp: { MNSN: 0.8 }, t: "【商会】商会雇了新的护卫队。" },
  { imp: { MNSN: -1.3 }, t: "【商会】货主集体上门讨说法。" },
  { imp: { JLRS: 1.3 }, t: "【航运】贾拉索的船队多挂了两面帆。" },
  { imp: { JLRS: -1.2 }, t: "【航运】一艘快船在礁石上搁浅。" },
  { imp: { JLRS: 0.9 }, t: "【航运】船务拿下北往卢斯坎的航线。" },
  { imp: { JLRS: -1.6 }, t: "【航运】私掠船劫了贾拉索的货。" },
  { imp: { JLRS: 1.5 }, t: "【航运】贾拉索包下半个船坞修船。" },
  { imp: { JLRS: -0.8 }, t: "【航运】水手罢工，船期延误。" },
  { imp: { JLRS: 1.1 }, t: "【航运】新航线开通，运费降了一成。" },
  { imp: { JLRS: -1.3 }, t: "【航运】海关查出一船走私。" },
  { imp: { JLRS: 1.4 }, t: "【航运】贾拉索与港务谈妥泊位。" },
  { imp: { JLRS: -0.9 }, t: "【航运】有船在雾里失踪。" },
  { imp: { JLRS: 0.7 }, t: "【航运】船队换了新船长。" },
  { imp: { JLRS: -1.5 }, t: "【航运】三艘商船被截。" },
  { imp: { JLRS: 1.2 }, t: "【航运】贾拉索接下一笔急单。" },
  { imp: { JLRS: -1.1 }, t: "【航运】船坞着火，烧了两条船。" },
  { imp: { JLRS: 1.0 }, t: "【航运】船队带回一批南方香料。" },
  { imp: { JLRS: -0.6 }, t: "【航运】水手抱怨伙食太差。" },
  { imp: { JLRS: 0.8 }, t: "【航运】贾拉索捐了灯塔的油钱。" },
  { imp: { JLRS: -1.4 }, t: "【航运】一艘船在港口沉了。" },
  { imp: { GLHD: 1.4 }, t: "【地产】北区新宅开盘，半天卖光。" },
  { imp: { GLHD: -1.3 }, t: "【地产】一栋出租楼塌了半边。" },
  { imp: { GLHD: 0.9 }, t: "【地产】格拉汉德整修巨魔颅骨巷。" },
  { imp: { GLHD: -1.6 }, t: "【地产】地契查出伪造，交易叫停。" },
  { imp: { GLHD: 1.5 }, t: "【地产】南区新桥动工，桥头地价飞涨。" },
  { imp: { GLHD: -0.8 }, t: "【地产】租户集体拒交涨租。" },
  { imp: { GLHD: 1.1 }, t: "【地产】格拉汉德买下三间临街铺面。" },
  { imp: { GLHD: -1.2 }, t: "【地产】一场火烧了半条街。" },
  { imp: { GLHD: 1.3 }, t: "【地产】新宅地开售，贵族抢购。" },
  { imp: { GLHD: -0.9 }, t: "【地产】有租户告上法庭。" },
  { imp: { GLHD: 0.7 }, t: "【地产】格拉汉德修好了下水道。" },
  { imp: { GLHD: -1.5 }, t: "【地产】北区地基下沉，房子裂了。" },
  { imp: { GLHD: 1.0 }, t: "【地产】匿名买家扫货。" },
  { imp: { GLHD: -1.1 }, t: "【地产】租房广告被指虚假。" },
  { imp: { GLHD: 1.2 }, t: "【地产】格拉汉德与商会合建仓库。" },
  { imp: { GLHD: -0.6 }, t: "【地产】巷子里垃圾成堆，住户投诉。" },
  { imp: { GLHD: 0.8 }, t: "【地产】新桥通车的消息传开。" },
  { imp: { GLHD: -1.4 }, t: "【地产】一栋宅子被查出闹鬼，租不出去。" },
  { imp: { WDPA: 1.2 }, t: "【港口】港务加开两个夜班泊位。" },
  { imp: { WDPA: -1.4 }, t: "【港口】防波堤又塌了一段。" },
  { imp: { WDPA: 0.9 }, t: "【港口】捕鲸船队回港，码头忙翻。" },
  { imp: { WDPA: -1.6 }, t: "【港口】海关罢工，货船排队。" },
  { imp: { WDPA: 1.5 }, t: "【港口】新码头启用，吞吐涨了两成。" },
  { imp: { WDPA: -0.8 }, t: "【港口】一艘货船堵在闸口。" },
  { imp: { WDPA: 1.1 }, t: "【港口】港务下调停泊费。" },
  { imp: { WDPA: -1.2 }, t: "【港口】大雾封港半天。" },
  { imp: { WDPA: 1.3 }, t: "【港口】港务与商会签了长约。" },
  { imp: { WDPA: -0.9 }, t: "【港口】搬运工要求涨工钱。" },
  { imp: { WDPA: 0.7 }, t: "【港口】港务修好了灯塔。" },
  { imp: { WDPA: -1.5 }, t: "【港口】仓库区着火，烧了三间。" },
  { imp: { WDPA: 1.0 }, t: "【港口】新航线带来一批南方货。" },
  { imp: { WDPA: -1.1 }, t: "【港口】检疫官封了一船货。" },
  { imp: { WDPA: 1.2 }, t: "【港口】港务办了一场船赛。" },
  { imp: { WDPA: -0.6 }, t: "【港口】码头区的路被压坏了。" },
  { imp: { WDPA: 0.8 }, t: "【港口】港务雇了新的领航员。" },
  { imp: { WDPA: -1.3 }, t: "【港口】一艘船在入口搁浅。" },

  // ── 300 条版：再扩 150 条，仍然是单股、±0.6%～2.0% ──────────
  { imp: { KSLT: 0.8 }, t: "【金融】卡萨兰特把兑换窗口从三个加到五个。" },
  { imp: { KSLT: -1.2 }, t: "【金融】一枚成色不足的金币在柜台被验出。" },
  { imp: { KSLT: 1.1 }, t: "【金融】银行给城卫队垫付了三个月军饷。" },
  { imp: { KSLT: -1.7 }, t: "【金融】金库的第二把钥匙丢了，全城换锁。" },
  { imp: { KSLT: 0.6 }, t: "【金融】柜员换上统一马甲，排队快了不少。" },
  { imp: { KSLT: -0.9 }, t: "【金融】一位男爵指控银行私吞了他的抵押庄园。" },
  { imp: { KSLT: 1.3 }, t: "【金融】银行推出农贷，乡下人赶着驴车来签约。" },
  { imp: { KSLT: -1.4 }, t: "【金融】南区分号被查出账目对不上三千金。" },
  { imp: { KSLT: 0.7 }, t: "【金融】银行给孤儿院捐了二百金。" },
  { imp: { KSLT: -1.1 }, t: "【金融】有人用假名开了三十个户头。" },
  { imp: { KSLT: 1.5 }, t: "【金融】银行拿到港口的汇兑专营权。" },
  { imp: { KSLT: -1.3 }, t: "【金融】抵押的货船沉了，贷款成了坏账。" },
  { imp: { KSLT: 0.9 }, t: "【金融】小额银票在码头通用，商贩抢着收。" },
  { imp: { KSLT: -1.6 }, t: "【金融】金库盘点少了一箱金条。" },
  { imp: { KSLT: 1.2 }, t: "【金融】卡萨兰特给商会做保，抽了一笔佣金。" },
  { imp: { KSLT: -0.8 }, t: "【金融】柜员私吞储户零钱被抓。" },
  { imp: { KSLT: 1.0 }, t: "【金融】赎当期限延长，穷人叫好。" },
  { imp: { KSLT: -1.5 }, t: "【金融】城里七家银号联手挤兑卡萨兰特。" },
  { imp: { KSLT: 0.8 }, t: "【金融】银行开了夜间金库窗口。" },
  { imp: { KSLT: -0.7 }, t: "【金融】有人往银行大门泼红漆。" },
  { imp: { KSLT: 1.4 }, t: "【金融】卡萨兰特承销城债券，赚得盆满。" },
  { imp: { KSLT: -1.2 }, t: "【金融】旧账翻出来，利息算错了三成。" },
  { imp: { KSLT: 1.1 }, t: "【金融】银行请矮人锁匠重做金库门。" },
  { imp: { KSLT: -0.9 }, t: "【金融】客户投诉兑换时短了秤。" },
  { imp: { KSLT: 1.6 }, t: "【金融】蒙面领主把一笔秘密款项存进卡萨兰特。" },
  { imp: { SNSA: 1.0 }, t: "【码头区】珊娜萨的驳船队添了两条新船。" },
  { imp: { SNSA: -1.1 }, t: "【码头区】一仓咸鱼被老鼠啃掉半仓。" },
  { imp: { SNSA: 0.8 }, t: "【码头区】码头帮新收了三十个弟兄。" },
  { imp: { SNSA: -1.5 }, t: "【码头区】有人往珊娜萨的货里掺石头。" },
  { imp: { SNSA: 1.3 }, t: "【码头区】珊娜萨拿下鱼市独家摊位。" },
  { imp: { SNSA: -0.9 }, t: "【码头区】冷库的冰魔法阵坏了，鱼开始发臭。" },
  { imp: { SNSA: 1.2 }, t: "【码头区】夜班搬运工拿到双薪。" },
  { imp: { SNSA: -1.6 }, t: "【码头区】海关在珊娜萨的货里查出禁品。" },
  { imp: { SNSA: 0.7 }, t: "【码头区】塌掉的栈桥修好了。" },
  { imp: { SNSA: -1.3 }, t: "【码头区】一船鲸油在港外漏了。" },
  { imp: { SNSA: 1.4 }, t: "【码头区】珊娜萨包下北码头的夜班。" },
  { imp: { SNSA: -0.8 }, t: "【码头区】搬运工告珊娜萨克扣工钱。" },
  { imp: { SNSA: 1.1 }, t: "【码头区】珊娜萨和鱼贩签了长约。" },
  { imp: { SNSA: -1.2 }, t: "【码头区】珊娜萨的账房被人偷了。" },
  { imp: { SNSA: 0.9 }, t: "【码头区】新冷库开张，鱼价降了一成。" },
  { imp: { SNSA: -1.4 }, t: "【码头区】码头区失火，珊娜萨烧掉三间仓。" },
  { imp: { SNSA: 1.5 }, t: "【码头区】珊娜萨接下水道清淤的大单。" },
  { imp: { SNSA: -0.7 }, t: "【码头区】有人看见珊娜萨的人半夜卸货。" },
  { imp: { SNSA: 1.0 }, t: "【码头区】珊娜萨出钱修了码头区的路。" },
  { imp: { SNSA: -1.1 }, t: "【码头区】一船腌菜被退货。" },
  { imp: { SNSA: 1.2 }, t: "【码头区】珊娜萨雇了新的打手。" },
  { imp: { SNSA: -1.5 }, t: "【码头区】珊娜萨的船在雾里撞了。" },
  { imp: { SNSA: 0.8 }, t: "【码头区】鱼市节办得热闹，珊娜萨抽成不少。" },
  { imp: { SNSA: -0.9 }, t: "【码头区】冷库的电费涨了。" },
  { imp: { SNSA: 1.3 }, t: "【码头区】珊娜萨买下鲸油街的仓库。" },
  { imp: { MNSN: 1.0 }, t: "【商会】星歌包下北区的粮仓。" },
  { imp: { MNSN: -1.2 }, t: "【商会】一车丝绸在城门口被雨淋了。" },
  { imp: { MNSN: 0.8 }, t: "【商会】商会给工匠行会捐了奖学金。" },
  { imp: { MNSN: -1.5 }, t: "【商会】商队在山口被劫，护卫跑了。" },
  { imp: { MNSN: 1.4 }, t: "【商会】星歌拿下军械的独家供货。" },
  { imp: { MNSN: -0.8 }, t: "【商会】分号的招牌掉下来砸了人。" },
  { imp: { MNSN: 1.2 }, t: "【商会】商会和矮人签了矿石长约。" },
  { imp: { MNSN: -1.6 }, t: "【商会】商会仓库的地契出了问题。" },
  { imp: { MNSN: 0.7 }, t: "【商会】星歌包下商队节的摊位。" },
  { imp: { MNSN: -1.1 }, t: "【商会】货主投诉商会短斤少两。" },
  { imp: { MNSN: 1.5 }, t: "【商会】商会接下了城卫队的冬装订单。" },
  { imp: { MNSN: -1.2 }, t: "【商会】账房查出一笔糊涂账。" },
  { imp: { MNSN: 1.0 }, t: "【商会】星歌在拍卖会上捡了个大漏。" },
  { imp: { MNSN: -0.9 }, t: "【商会】商会的护卫队集体辞职。" },
  { imp: { MNSN: 1.3 }, t: "【商会】商会开通了北区的新商路。" },
  { imp: { MNSN: -1.4 }, t: "【商会】一车香料翻进了河里。" },
  { imp: { MNSN: 0.8 }, t: "【商会】星歌请全城工匠喝了酒。" },
  { imp: { MNSN: -1.3 }, t: "【商会】商会会馆被人泼了粪。" },
  { imp: { MNSN: 1.2 }, t: "【商会】商会给孤儿院送了冬衣。" },
  { imp: { MNSN: -0.7 }, t: "【商会】有人冒用商会的名号收货。" },
  { imp: { MNSN: 1.1 }, t: "【商会】星歌和港务签了仓储协议。" },
  { imp: { MNSN: -1.5 }, t: "【商会】商会的银库被撬了。" },
  { imp: { MNSN: 0.9 }, t: "【商会】商会新雇的账房很得力。" },
  { imp: { MNSN: -1.0 }, t: "【商会】商队节上商会的摊位被砸。" },
  { imp: { MNSN: 1.4 }, t: "【商会】星歌低价收了一批抛售的货。" },
  { imp: { JLRS: 1.1 }, t: "【航运】贾拉索的船队添了一条新快船。" },
  { imp: { JLRS: -1.2 }, t: "【航运】一艘货船在浅滩搁浅。" },
  { imp: { JLRS: 0.9 }, t: "【航运】船务开通了夜航。" },
  { imp: { JLRS: -1.5 }, t: "【航运】私掠船抢了贾拉索的货。" },
  { imp: { JLRS: 1.3 }, t: "【航运】贾拉索包下船坞赶工。" },
  { imp: { JLRS: -0.8 }, t: "【航运】水手在酒馆闹事被抓。" },
  { imp: { JLRS: 1.1 }, t: "【航运】新航线省了两天航程。" },
  { imp: { JLRS: -1.4 }, t: "【航运】海关扣了船务的一批货。" },
  { imp: { JLRS: 0.7 }, t: "【航运】贾拉索给灯塔捐了油。" },
  { imp: { JLRS: -1.2 }, t: "【航运】又有一条船在雾里失联。" },
  { imp: { JLRS: 1.4 }, t: "【航运】船务拿下卢斯坎的货运权。" },
  { imp: { JLRS: -1.6 }, t: "【航运】三条船在风暴里受损。" },
  { imp: { JLRS: 1.0 }, t: "【航运】贾拉索雇了新的领航员。" },
  { imp: { JLRS: -0.9 }, t: "【航运】船员抱怨伙食太差。" },
  { imp: { JLRS: 1.2 }, t: "【航运】船队带回一批南方货。" },
  { imp: { JLRS: -1.1 }, t: "【航运】船坞失了火。" },
  { imp: { JLRS: 0.8 }, t: "【航运】贾拉索和商会签了运价协议。" },
  { imp: { JLRS: -1.3 }, t: "【航运】一条船被查出走私。" },
  { imp: { JLRS: 1.5 }, t: "【航运】贾拉索接下一笔急单，连夜装船。" },
  { imp: { JLRS: -0.7 }, t: "【航运】一艘小艇在港内翻了。" },
  { imp: { JLRS: 1.1 }, t: "【航运】船务添了两条驳船。" },
  { imp: { JLRS: -1.4 }, t: "【航运】水手罢工要求加薪。" },
  { imp: { JLRS: 0.9 }, t: "【航运】贾拉索修好了旧码头。" },
  { imp: { JLRS: -1.0 }, t: "【航运】货主投诉货物受潮。" },
  { imp: { JLRS: 1.3 }, t: "【航运】船队挂上了新帆。" },
  { imp: { GLHD: 1.2 }, t: "【地产】格拉汉德买下码头旁的一排旧仓。" },
  { imp: { GLHD: -1.1 }, t: "【地产】北区一栋公寓的楼板塌了。" },
  { imp: { GLHD: 0.9 }, t: "【地产】新宅地开卖，半天订完。" },
  { imp: { GLHD: -1.5 }, t: "【地产】地契官司打输了，赔了一笔。" },
  { imp: { GLHD: 1.4 }, t: "【地产】南桥通车在即，沿街铺面涨价。" },
  { imp: { GLHD: -0.8 }, t: "【地产】租户联合起来要求降租。" },
  { imp: { GLHD: 1.1 }, t: "【地产】格拉汉德把旧戏院改成了公寓。" },
  { imp: { GLHD: -1.2 }, t: "【地产】一场小火熏黑了半条巷子。" },
  { imp: { GLHD: 1.3 }, t: "【地产】城北的荒地拍出了高价。" },
  { imp: { GLHD: -0.9 }, t: "【地产】有租客在屋里养了头猪。" },
  { imp: { GLHD: 0.7 }, t: "【地产】格拉汉德出钱修了街灯。" },
  { imp: { GLHD: -1.5 }, t: "【地产】地基渗水，墙裂了。" },
  { imp: { GLHD: 1.0 }, t: "【地产】一个匿名的矮人买家扫了半条街。" },
  { imp: { GLHD: -1.1 }, t: "【地产】招租告示被人半夜撕了。" },
  { imp: { GLHD: 1.2 }, t: "【地产】和商会合建的货栈开工。" },
  { imp: { GLHD: -0.6 }, t: "【地产】巷口的垃圾堆了三天。" },
  { imp: { GLHD: 0.8 }, t: "【地产】新桥的名字定下来了。" },
  { imp: { GLHD: -1.4 }, t: "【地产】一栋宅子闹鬼，降价也没人要。" },
  { imp: { GLHD: 1.1 }, t: "【地产】格拉汉德买下旧粮仓改仓库。" },
  { imp: { GLHD: -1.3 }, t: "【地产】拆迁的住户堵了门。" },
  { imp: { GLHD: 0.9 }, t: "【地产】北区通了自来水。" },
  { imp: { GLHD: -1.2 }, t: "【地产】房租涨得太凶，被议会问话。" },
  { imp: { GLHD: 1.3 }, t: "【地产】新盘开盘，贵族抢购。" },
  { imp: { GLHD: -1.0 }, t: "【地产】一栋楼被查出是违建。" },
  { imp: { GLHD: 0.7 }, t: "【地产】格拉汉德修了条便道。" },
  { imp: { WDPA: 1.1 }, t: "【港口】港务疏浚了主航道。" },
  { imp: { WDPA: -1.3 }, t: "【港口】防波堤被浪打塌一角。" },
  { imp: { WDPA: 0.8 }, t: "【港口】北堤新泊位提前完工。" },
  { imp: { WDPA: -1.6 }, t: "【港口】海关的秤被查出做了手脚。" },
  { imp: { WDPA: 1.4 }, t: "【港口】本季吞吐量创了新高。" },
  { imp: { WDPA: -0.9 }, t: "【港口】一条运煤船堵住了闸口。" },
  { imp: { WDPA: 1.0 }, t: "【港口】港务把停泊费降了一成。" },
  { imp: { WDPA: -1.2 }, t: "【港口】浓雾封港，船排到防波堤外。" },
  { imp: { WDPA: 1.3 }, t: "【港口】港务和商队签了卸货长约。" },
  { imp: { WDPA: -0.8 }, t: "【港口】搬运工推选代表，要求涨工钱。" },
  { imp: { WDPA: 0.7 }, t: "【港口】灯塔换了新灯，夜航稳当。" },
  { imp: { WDPA: -1.5 }, t: "【港口】仓库区又起火，这回烧了五间。" },
  { imp: { WDPA: 1.0 }, t: "【港口】南方新航线首航，带回一船蔗糖。" },
  { imp: { WDPA: -1.1 }, t: "【港口】检疫官在船上查出热病，整船隔离。" },
  { imp: { WDPA: 1.2 }, t: "【港口】港务办了一场船赛，人山人海。" },
  { imp: { WDPA: -0.6 }, t: "【港口】码头区的路被重车压坏了。" },
  { imp: { WDPA: 0.8 }, t: "【港口】港务从卢斯坎挖来一位老领航员。" },
  { imp: { WDPA: -1.3 }, t: "【港口】一艘船在入口搁浅，堵了半天。" },
  { imp: { WDPA: 1.1 }, t: "【港口】港务给码头加了十盏灯。" },
  { imp: { WDPA: -1.0 }, t: "【港口】有船主投诉引水费太贵。" },
  { imp: { WDPA: 0.9 }, t: "【港口】南码头新铺了石板。" },
  { imp: { WDPA: -1.4 }, t: "【港口】一批货在卸货时掉进海里。" },
  { imp: { WDPA: 1.2 }, t: "【港口】港务和海军签了补给合同。" },
  { imp: { WDPA: -0.7 }, t: "【港口】闸口的绞盘坏了。" },
  { imp: { WDPA: 1.5 }, t: "【港口】深水城港务接到一笔大额泊位预付。" }
];

// ── 行情 ────────────────────────────────────────────────────────
function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clampToLimit = (price, prevClose) => {
  const hi = prevClose * (1 + LIMIT), lo = prevClose * (1 - LIMIT);
  return Math.max(lo, Math.min(hi, price));
};

// 把「一共 pct%」摊成每跳的对数收益：复利走完 total 跳，正好等于 pct%
const logDrift = (pct, total) => {
  const p = Number(pct);
  if (!Number.isFinite(p)) return 0;
  return Math.log(Math.max(0.05, 1 + p / 100)) / Math.max(1, Number(total) || 1);
};

export function indexOf(m) {
  if (!m || !m.stocks) return 1000;
  let sum = 0, n = 0;
  for (const s of STOCKS) {
    const st = m.stocks[s.id];
    if (!st) continue;
    sum += (st.price / s.p0) * 1000;
    n++;
  }
  return n ? Math.round(sum / n * 100) / 100 : 1000;
}

export function newMarket() {
  const stocks = {}, prevClose = {};
  for (const s of STOCKS) {
    const q = Number(s.p0.toFixed(s.dp));
    const v0 = Math.max(2, Math.round(s.float / 200 * (0.5 + Math.random())));
    stocks[s.id] = {
      price: q, prevClose: q, halt: false, crowd: CROWD_NEUTRAL, flow: 0, float: s.float, trust: s.trust ?? 50,
      cur: { o: q, h: q, l: q, c: q, v: v0 },
      bars: [], bt: 0
    };
    prevClose[s.id] = q;
  }
  const m = {
    v: 5, econ: 27, barSec: DEFAULT_BAR_SEC, tick: 0, running: true, vol: 1, autoNews: true, speed: TICK_MS, limit: true,
    news: "", newsLeft: 0, events: [], stocks, steppedAt: Date.now()
  };
  m.index = indexOf(m); m.indexPrev = m.index;
  return m;
}

export function stepMarket(m) {
  const tick = (m.tick || 0) + 1;
  const volMul = Number.isFinite(Number(m.vol)) ? Number(m.vol) : 1;

  // 事件：总冲击按持续跳数摊平，逐跳施加
  // free=true 的是城主投放的事件：不受涨跌停限制（黑天鹅）；随机快讯照常受限
  const events = [];
  const finished = [];
  const driftN = {}, driftF = {};
  const crowdTarget = {};   // 事件持续期间，把拥挤度往这个值拉
  for (const e of (m.events || [])) {
    const total = Math.max(1, Number(e.ticks) || 1);
    let left = Number(e.left);
    if (!Number.isFinite(left)) left = total;
    left -= 1;
    const bucket = e.free ? driftF : driftN;
    for (const id in (e.imp || {})) {
      bucket[id] = (bucket[id] || 0) + logDrift(e.imp[id], total);
    }
    // 事件的拥挤冲击不再是一次性的：整段事件期间持续把拥挤度往目标拉
    if (e.crowd) {
      const tgt = Math.max(0, Math.min(100, CROWD_NEUTRAL + Number(e.crowd) * 0.9));
      for (const id in (e.imp || {})) crowdTarget[id] = tgt;
    }
    if (left > 0) events.push({ ...e, ticks: total, left });
    else if (e.free) finished.push({ ...e, total });
  }

  let news = m.news || "", newsLeft = Math.max(0, (m.newsLeft || 0) - 1);
  if (newsLeft === 0) news = "";
  if (m.autoNews && Math.random() < 0.03) {
    const n = NEWS_FLAVOR[Math.floor(Math.random() * NEWS_FLAVOR.length)];
    news = n.t; newsLeft = 6;
    events.push({ id: "news-" + tick, title: n.t, desc: "", imp: n.imp, ticks: 4, left: 4 });
    for (const id in n.imp) driftN[id] = (driftN[id] || 0) + logDrift(n.imp[id], 4);
  }

  const stocks = {};
  for (const s of STOCKS) {
    // 防御：房间里如果残留半截行情，按初始价补齐，别让整个推进抛错卡死
    const st = m.stocks[s.id] || {
      price: s.p0, prevClose: s.p0, halt: false, crowd: CROWD_NEUTRAL, flow: 0,
      cur: { o: s.p0, h: s.p0, l: s.p0, c: s.p0, v: 0 }, bars: [], bt: 0
    };
    if (!Number.isFinite(st.price) || st.price <= 0) st.price = s.p0;
    if (!Number.isFinite(st.prevClose) || st.prevClose <= 0) st.prevClose = st.price;

    // 拥挤度：玩家净买入推高；没有外力时缓慢回落到 50；事件期间被拉向事件目标
    const flow = Number(st.flow) || 0;
    let crowd = Number.isFinite(Number(st.crowd)) ? Number(st.crowd) : CROWD_NEUTRAL;
    const fl0 = Number(st.float) > 0 ? Number(st.float) : s.float;
    crowd += (CROWD_NEUTRAL - crowd) * 0.004 + (flow / fl0) * 240;
    if (crowdTarget[s.id] != null) crowd += (crowdTarget[s.id] - crowd) * 0.05;
    crowd = Math.max(0, Math.min(100, crowd));

    if (st.halt) {
      stocks[s.id] = { ...st, crowd, flow: 0, bt: (st.bt || 0) + 1 };
      continue;
    }
    const crowdPush = ((crowd - CROWD_NEUTRAL) / CROWD_NEUTRAL) * 0.0012;
    const volBoost = 1 + Math.max(0, crowd - CROWD_NEUTRAL) / 120;
    // 信心（trust）：丑闻会长期压低估值和波动的恢复力；0～100，50 为中性
    let trust = Number(st.trust);
    if (!Number.isFinite(trust)) trust = 50;
    // 恢复速度按事件性质走：轻伤一天缓过来，恶性(操控股市/勾连邪教)整场难翻身
    const trustK = Number.isFinite(Number(st.trustK)) ? Number(st.trustK) : TRUST_TIERS.heavy.k;
    const trustCeil = Number.isFinite(Number(st.trustCeil)) ? Number(st.trustCeil) : 50;
    const trustTarget = Math.min(50, trustCeil);
    const trustPush = ((trust - 50) / 50) * 0.0005;   // 信誉差 → 长期阴跌；信誉好 → 长期溢价
    const trustVol = 1 + Math.max(0, 50 - trust) / 120; // 不被信任的股票更容易暴涨暴跌
    let ret = s.vol * volMul * volBoost * trustVol * gauss() + s.drift + crowdPush + trustPush + (driftN[s.id] || 0);
    // 信誉会缓慢回归中性：每天（480 跳）约回 4 点，所以一次丑闻要养好几天
    trust = Math.max(0, Math.min(100, trust + (trustTarget - trust) * trustK));
    // 拥挤到 75 以上再遇到下跌：踩踏，跌幅放大
    if (crowd > 75 && ret < 0) ret *= 1.35;
    const free = driftF[s.id] || 0;   // 城主事件：黑天鹅，不封板
    let price = st.price * Math.exp(ret + free);
    if (m.limit !== false && !free) {
      // 只对还在板内的价格封板；已经因黑天鹅跌出板外的，不往回拽
      const pc = st.prevClose || st.price;
      const eps = Math.pow(10, -s.dp) + 1e-9;   // 容许两位小数取整带来的出界
      const lo = pc * (1 - LIMIT), hi = pc * (1 + LIMIT);
      if (st.price >= lo - eps && st.price <= hi + eps) price = clampToLimit(price, pc);
    }
    price = Math.max(0.01, Number(price.toFixed(s.dp)));

    // 每 TICKS_PER_DAY 跳滚动一次昨收，涨跌停重新计算
    const newDay = tick % TICKS_PER_DAY === 0;
    const vol = Math.max(1, Math.round((s.float || 100000) / 200 * (0.4 + Math.random() * 1.2)));
    let cur = { ...st.cur };
    cur.c = price;
    cur.h = Math.max(Number(cur.h) || price, price);
    cur.l = Math.min(Number(cur.l) || price, price);
    cur.v = (Number(cur.v) || 0) + vol;

    const barSec = Number(m.barSec) > 0 ? Number(m.barSec) : DEFAULT_BAR_SEC;
    let bt = (Number(st.bt) || 0) + SEC_PER_TICK;   // 按“市场秒”累计：2 秒 = 1 跳
    // K 线压缩成 [o,h,l,c] 数组：房间 metadata 总共只有 16kB，对象键名太占地方
    let bars = (st.bars || []).map(b => Array.isArray(b) ? b : [b.o, b.h, b.l, b.c]);
    if (bt >= barSec) {
      bars = bars.concat([[cur.o, cur.h, cur.l, cur.c]]).slice(-MAX_BARS);
      cur = { o: price, h: price, l: price, c: price, v: 0 };
      bt -= barSec;
    }
    const fl = Number(st.float) > 0 ? Number(st.float) : s.float;
    stocks[s.id] = { price, prevClose: newDay ? price : st.prevClose, halt: false, crowd, flow: 0, float: fl, trust, trustK, trustCeil, cur, bars, bt };
  }

  // 事件回溯：城主事件走完时，记下持续跳数和各股票的实际涨跌
  let history = Array.isArray(m.history) ? m.history.slice(-19) : [];
  for (const e of finished) {
    const moves = [];
    for (const id in (e.imp || {})) {
      const st = stocks[id], s0 = e.start && Number(e.start[id]);
      if (st && s0 > 0) moves.push([id, Number(((st.price / s0 - 1) * 100).toFixed(2))]);
    }
    if (moves.length) {
      // 紧凑字段：房间 metadata 一共只有 16kB，标题/目标/实际都压成短键
      const mv = moves, pl = {};
      for (const id in (e.imp || {})) pl[id] = Number(e.imp[id]);
      const tr = {};
      for (const id in (e.trust || {})) if (Number(e.trust[id])) tr[id] = Number(e.trust[id]);
      history.push({ a: tick, t: e.title, n: e.total, m: e.mins || 0, p: pl, mv, ...(Object.keys(tr).length ? { tr } : {}) });
    }
  }
  // 不按条数砍，按字节砍：历史最多占 7kB，剩下的留给行情和账户
  while (history.length > 60 || JSON.stringify(history).length > 3500) history.shift();

  const out = {
    v: 5, econ: 27, barSec: Number(m.barSec) > 0 ? Number(m.barSec) : DEFAULT_BAR_SEC, tick, running: m.running !== false, vol: volMul,
    autoNews: m.autoNews !== false, speed: clampSpeed(m.speed),
    limit: m.limit !== false,
    news, newsLeft, events, history, stocks, steppedAt: Date.now(),
    indexPrev: m.indexPrev ?? m.index ?? 1000
  };
  out.index = indexOf(out);
  return out;
}

// ── 账户：做多股票，T+0，佣金 1%、最低 1 银 ────────────────
export function newAccount(cash = 0) {
  return { cash, deposited: cash, realized: 0, positions: {}, pending: [] };
}

// 卖出后 T+SETTLE_TICKS 跳才交收：把到期的钱放回现金，返回本次解冻金额
export function releasePending(acc, tick) {
  const keep = [];
  let sum = 0;
  for (const p of (acc.pending || [])) {
    if (!p || !Number.isFinite(Number(p.amt))) continue;
    if (tick >= (Number(p.due) || 0)) sum += Number(p.amt);
    else keep.push({ amt: Number(p.amt), due: Number(p.due) || 0 });
  }
  acc.pending = keep;
  acc.cash = (Number(acc.cash) || 0) + sum;
  return sum;
}

export function pendingTotal(acc) {
  return (acc.pending || []).reduce((n, p) => n + (Number(p.amt) || 0), 0);
}

export function positionValue(acc, m) {
  let v = 0;
  for (const id in acc.positions) {
    const pos = acc.positions[id], st = m?.stocks?.[id];
    if (pos && st) v += pos.shares * st.price;
  }
  return v;
}

export function unrealizedOf(acc, m) {
  let v = 0;
  for (const id in acc.positions) {
    const pos = acc.positions[id], st = m?.stocks?.[id];
    if (pos && st) v += pos.shares * (st.price - pos.cost);
  }
  return v;
}

export function equityOf(acc, m) {
  // 待交收的钱也是资产：卖出瞬间不能因为“钱还在路上”就显示权益暴跌
  return (acc.cash || 0) + positionValue(acc, m) + pendingTotal(acc);
}

export function feeOf(notional) {
  return Math.max(FEE_MIN, Math.round(notional * FEE_RATE * 100) / 100);
}

// ── 融券做空 ────────────────────────────────────────────────
export const SHORT_MARGIN = 0.5;   // 开空保证金 = 名义的 50%
export const COVER_LINE = 0.5;     // 浮亏亏光这笔保证金（名义的 50%）自动平仓

export function isShort(pos) {
  return !!pos && pos.shares < 0;
}

export function marginUsed(acc) {
  let m = 0;
  for (const id in acc.positions) {
    const p = acc.positions[id];
    if (p && p.shares < 0) m += (-p.shares) * p.cost * SHORT_MARGIN;
  }
  return m;
}

export function shortLoss(pos, price) {
  return pos && pos.shares < 0 ? (price - pos.cost) * (-pos.shares) : 0;
}

export function needsCover(pos, price) {
  return isShort(pos) && shortLoss(pos, price) >= (-pos.shares) * pos.cost * COVER_LINE;
}
