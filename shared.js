export const NS = "com.gilded.exchange";
export const MKT_KEY = NS + "/market";
export const ACC_KEY = NS + "/account";

export const TICK_MS = 5000;        // 每跳秒数
export const BAR_TICKS = 6;         // 6 跳 = 1 根 K
export const MAX_BARS = 30;         // 保留 K 线数
export const FEE_RATE = 0.00055;    // 开仓手续费 = 名义仓位 × 0.055%
export const LIQ_AT = -0.98;        // 保证金亏掉 98% 强制平仓
export const LOAN_STEP = 500;       // 每次借款额
export const LOAN_RATE_PER_DAY = 0.08;
export const TICKS_PER_DAY = 480;

export const CUR = {
  WDS: { name: "金龙", full: "深水城金龙" },
  LSK: { name: "海票", full: "卢斯坎海票" },
  NVR: { name: "王票", full: "无冬王票" },
  ZNT: { name: "银条", full: "黑网银条" }
};

export const PAIRS = [
  { id: "WDSLSK", a: "WDS", b: "LSK", dp: 5, p0: 1.10715, vol: 0.0072, drift: 0.00010 },
  { id: "WDSNVR", a: "WDS", b: "NVR", dp: 5, p0: 0.86795, vol: 0.0064, drift: -0.00008 },
  { id: "WDSZNT", a: "WDS", b: "ZNT", dp: 4, p0: 10.2040, vol: 0.0105, drift: 0.00012 },
  { id: "LSKZNT", a: "LSK", b: "ZNT", dp: 4, p0: 9.2150, vol: 0.0090, drift: 0.00005 }
];

// 注意：字符串里不要出现未转义的英文双引号，否则整个模块语法错误。
export const NEWS = [
  { id: "WDSLSK", d: -0.030, t: "【领主联盟】卢斯坎入盟申请再遭驳回——市场同时押注「游说终将成功」，价格先跌后回。" },
  { id: "WDSLSK", d: 0.024, t: "【航运】卢斯坎私掠船连截三艘商船，海上保费上调，海票需求升温。" },
  { id: "WDSLSK", d: 0.017, t: "【港口】「海之少女嘉年华」宣布驻留一季，码头生意火爆。" },
  { id: "WDSNVR", d: -0.026, t: "【无冬】银矿塌方，王票兑付延迟，北方商队改走海路。" },
  { id: "WDSNVR", d: 0.021, t: "【北地】无烬大人旧部抛售地产，王票回流深水城。" },
  { id: "WDSZNT", d: 0.025, t: "【码头区】散塔林两派火并，银条信用受疑，金龙走高。" },
  { id: "WDSZNT", d: -0.031, t: "【黑网】宣布「账目重整」，暂停对外兑付，银条被抢兑。" },
  { id: "ALL", d: 0.006, t: "【银行】卡萨兰特银行上调储备金率，全盘小幅走高。" }
];

export const pairById = id => PAIRS.find(p => p.id === id);
export const pairLabel = p => CUR[p.a].name + " / " + CUR[p.b].name;
export const fmt = (v, dp) => Number(v).toFixed(dp);

function gauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function newMarket() {
  const pairs = {};
  for (const p of PAIRS) {
    const q = Number(p.p0.toFixed(p.dp));
    pairs[p.id] = { price: q, cur: { o: q, h: q, l: q, c: q }, bars: [], bt: 0 };
  }
  return { v: 1, tick: 0, running: true, news: "", newsPair: "", newsLeft: 0, pairs };
}

export function stepMarket(m) {
  const tick = (m.tick || 0) + 1;
  const out = {
    v: 1, tick, running: m.running,
    news: m.news || "", newsPair: m.newsPair || "",
    newsLeft: Math.max(0, (m.newsLeft || 0) - 1),
    pairs: {}
  };
  if (out.newsLeft === 0) { out.news = ""; out.newsPair = ""; }

  let shockId = "", shockD = 0;
  if (Math.random() < 0.035) {
    const n = NEWS[Math.floor(Math.random() * NEWS.length)];
    out.news = n.t; out.newsPair = n.id; out.newsLeft = 8;
    shockId = n.id; shockD = n.d;
  }

  for (const p of PAIRS) {
    const st = m.pairs[p.id];
    let s = p.vol * gauss() + p.drift;
    if (shockId === p.id || shockId === "ALL") s += shockD;
    const price = Math.max(0.0001, Number((st.price * Math.exp(s)).toFixed(p.dp)));

    let cur = { ...st.cur };
    cur.c = price;
    cur.h = Math.max(cur.h, price);
    cur.l = Math.min(cur.l, price);

    let bt = (st.bt || 0) + 1;
    let bars = st.bars || [];
    if (bt >= BAR_TICKS) {
      bars = bars.concat([cur]).slice(-MAX_BARS);
      cur = { o: price, h: price, l: price, c: price };
      bt = 0;
    }
    out.pairs[p.id] = { price, cur, bars, bt };
  }
  return out;
}

export function newAccount() {
  return { balance: 0, deposited: 0, realized: 0, positions: {}, loan: 0, loanTick: 0 };
}

export function unrealized(pos, price) {
  if (!pos) return 0;
  return pos.stake * pos.lev * (price / pos.entry - 1) * pos.side;
}

export function loanOwed(acc, tick) {
  if (!acc.loan) return 0;
  const d = Math.max(0, tick - (acc.loanTick || 0)) / TICKS_PER_DAY;
  return Math.round(acc.loan * (1 + LOAN_RATE_PER_DAY * d) * 100) / 100;
}

export function equityOf(acc, mkt, tick) {
  let eq = acc.balance;
  for (const id in acc.positions) {
    const pr = mkt?.pairs?.[id]?.price;
    if (pr) {
      const pos = acc.positions[id];
      eq += pos.stake + unrealized(pos, pr);
    }
  }
  return eq - loanOwed(acc, tick);
}
