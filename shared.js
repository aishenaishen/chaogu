// 金手指证券交易所 · 共享数据层
// 深水城五方势力各有「上市产业」。价格按随机游走 + 事件冲击推进。
// 注意：字符串里不要出现未转义的英文双引号，否则整个模块语法错误。

export const NS = "com.gilded.exchange";
export const MKT_KEY = NS + "/market";
export const ACC_KEY = NS + "/account";

export const TICK_MS = 5000;      // 一跳 5 秒
export const BAR_TICKS = 6;       // 6 跳 = 1 根 K
export const MAX_BARS = 40;       // 保留 K 线根数
export const FEE_RATE = 0.00055;  // 佣金 0.055%
export const FEE_MIN = 5;         // 最低佣金 5 金
export const LOT = 100;           // 一手 100 股
export const LIMIT = 0.10;        // 涨跌停 ±10%
export const TICKS_PER_DAY = 480; // 一天 480 跳

// ── 六个「上市产业」──────────────────────────────────────────────
export const STOCKS = [
  { id: "KSLT", code: "600101", name: "卡萨兰特银行", sector: "金融", p0: 24.80, dp: 2, vol: 0.0058, drift: 0.00002 },
  { id: "SNSA", code: "600102", name: "珊娜萨货运",   sector: "物流", p0: 9.35,  dp: 2, vol: 0.0170, drift: 0.00004 },
  { id: "MNSN", code: "600103", name: "曼松商会",     sector: "贸易", p0: 17.60, dp: 2, vol: 0.0105, drift: 0.00001 },
  { id: "JLRS", code: "600104", name: "贾拉索船务",   sector: "航运", p0: 6.72,  dp: 2, vol: 0.0190, drift: -0.00002 },
  { id: "GLHD", code: "600105", name: "格拉汉德置业", sector: "地产", p0: 11.20, dp: 2, vol: 0.0135, drift: 0.00005 },
  { id: "WDPA", code: "600106", name: "深水城港务",   sector: "公用", p0: 31.40, dp: 2, vol: 0.0068, drift: 0.00001 }
];

export const stockById = id => STOCKS.find(s => s.id === id);
export const stockLabel = s => s.name;
export const fmt = (v, dp) => Number(v).toFixed(dp);

// ── 事件预设：跟战役章节挂钩，GM 一点就砸/拉 ─────────────────────
export const PRESETS = [
  { id: "fireball", title: "火球炸城", desc: "巨魔颅骨巷一声巨响，半条街化为焦土。", imp: { GLHD: -9, KSLT: 2, WDPA: -1.5 }, ticks: 6 },
  { id: "bankrun", title: "卡萨兰特银行挤兑", desc: "兑付窗口排起长队，贵族们连夜转移金库。", imp: { KSLT: -8, GLHD: -3, WDPA: -2 }, ticks: 8 },
  { id: "fishbowl", title: "珊娜萨的鱼缸被抢", desc: "有人闯进巢穴，把希尔加连鱼带缸搬走了。", imp: { SNSA: -7, MNSN: 1 }, ticks: 6 },
  { id: "shipwreck", title: "曼松的货船沉了", desc: "三艘商船在风暴中失踪，货主们堵在商会门口。", imp: { MNSN: -6, JLRS: 3 }, ticks: 8 },
  { id: "blockade", title: "贾拉索封锁港口", desc: "船队横在防波堤外，进出港的船都得交买路钱。", imp: { JLRS: 5, WDPA: -4, MNSN: -2 }, ticks: 8 },
  { id: "caravan", title: "商队节开幕", desc: "全城放假三天，码头和酒馆的流水翻了一倍。", imp: { WDPA: 2, MNSN: 2, GLHD: 1 }, ticks: 10 },
  { id: "strike", title: "公会日大罢工", desc: "码头工人封了栈桥，货栈的银子晒在太阳底下。", imp: { GLHD: -4, WDPA: -3, JLRS: 2 }, ticks: 8 },
  { id: "taxcut", title: "蒙面领主议会减税", desc: "港口税下调，消息比传令官跑得还快。", imp: { KSLT: 3, MNSN: 2, WDPA: 3 }, ticks: 10 },
  { id: "gangwar", title: "散塔林火并", desc: "两派在码头区当街开打，银条信用跟着抖。", imp: { SNSA: -5, JLRS: -2, KSLT: 1 }, ticks: 6 },
  { id: "goldflow", title: "金龙大量流入", desc: "前领主的金库传闻坐实，全城都在找买家。", imp: { KSLT: 4, GLHD: 3, MNSN: 2 }, ticks: 10 }
];

export const NEWS_FLAVOR = [
  { imp: { WDPA: 1.2 }, t: "【港口】海之少女嘉年华宣布驻留一季，码头生意火爆。" },
  { imp: { MNSN: -1.5 }, t: "【商会】曼松商会否认与散塔林有往来，记者被请出门。" },
  { imp: { SNSA: 1.8 }, t: "【码头区】夜里有三十辆无标记货车进城，没人敢问装的是什么。" },
  { imp: { KSLT: -1.2 }, t: "【金融】卡萨兰特银行上调储备金率，小商户怨声载道。" },
  { imp: { JLRS: 1.6 }, t: "【航运】卢斯坎私掠船连截三艘商船，保费上调。" },
  { imp: { GLHD: 1.2 }, t: "【地产】北区两块地皮被匿名买家拍走，价格高得离谱。" }
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
    const v0 = 4000 + Math.floor(Math.random() * 6000);
    stocks[s.id] = {
      price: q, prevClose: q, halt: false,
      cur: { o: q, h: q, l: q, c: q, v: v0 },
      bars: [], bt: 0
    };
    prevClose[s.id] = q;
  }
  const m = {
    v: 3, tick: 0, running: true, vol: 1, autoNews: true,
    news: "", newsLeft: 0, events: [], stocks
  };
  m.index = indexOf(m); m.indexPrev = m.index;
  return m;
}

export function stepMarket(m) {
  const tick = (m.tick || 0) + 1;
  const volMul = m.vol || 1;

  // 事件：总冲击按持续跳数摊平，逐跳施加
  const events = [];
  const drift = {};
  for (const e of (m.events || [])) {
    const left = (e.left ?? e.ticks ?? 1) - 1;
    const total = e.ticks || 1;
    for (const id in (e.imp || {})) {
      drift[id] = (drift[id] || 0) + (e.imp[id] / 100) / total;
    }
    if (left > 0) events.push({ ...e, left });
  }

  let news = m.news || "", newsLeft = Math.max(0, (m.newsLeft || 0) - 1);
  if (newsLeft === 0) news = "";
  if (m.autoNews && Math.random() < 0.03) {
    const n = NEWS_FLAVOR[Math.floor(Math.random() * NEWS_FLAVOR.length)];
    news = n.t; newsLeft = 6;
    events.push({ id: "news-" + tick, title: n.t, desc: "", imp: n.imp, ticks: 4, left: 4 });
    for (const id in n.imp) drift[id] = (drift[id] || 0) + (n.imp[id] / 100) / 4;
  }

  const stocks = {};
  for (const s of STOCKS) {
    const st = m.stocks[s.id];
    if (st.halt) {
      stocks[s.id] = { ...st, bt: (st.bt || 0) + 1 };
      continue;
    }
    let ret = s.vol * volMul * gauss() + s.drift + (drift[s.id] || 0);
    let price = st.price * Math.exp(ret);
    price = clampToLimit(price, st.prevClose || st.price);
    price = Math.max(0.01, Number(price.toFixed(s.dp)));

    // 每 TICKS_PER_DAY 跳滚动一次昨收，涨跌停重新计算
    const newDay = tick % TICKS_PER_DAY === 0;
    const vol = 500 + Math.floor(Math.random() * 4500);
    let cur = { ...st.cur };
    cur.c = price;
    cur.h = Math.max(cur.h, price);
    cur.l = Math.min(cur.l, price);
    cur.v = (cur.v || 0) + vol;

    let bt = (st.bt || 0) + 1;
    let bars = st.bars || [];
    if (bt >= BAR_TICKS) {
      bars = bars.concat([cur]).slice(-MAX_BARS);
      cur = { o: price, h: price, l: price, c: price, v: 0 };
      bt = 0;
    }
    stocks[s.id] = { price, prevClose: newDay ? price : st.prevClose, halt: false, cur, bars, bt };
  }

  const out = {
    v: 3, tick, running: m.running !== false, vol: volMul,
    autoNews: m.autoNews !== false,
    news, newsLeft, events, stocks,
    indexPrev: m.indexPrev ?? m.index ?? 1000
  };
  out.index = indexOf(out);
  return out;
}

// ── 账户：做多股票，T+0，佣金万 0.55、最低 5 金 ────────────────
export function newAccount(cash = 0) {
  return { cash, deposited: cash, realized: 0, positions: {} };
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
  return (acc.cash || 0) + positionValue(acc, m);
}

export function feeOf(notional) {
  return Math.max(FEE_MIN, Math.round(notional * FEE_RATE * 100) / 100);
}
