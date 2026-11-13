// 金手指证券交易所 · 共享数据层
// 深水城五方势力各有「上市产业」。价格按随机游走 + 事件冲击推进。
// 注意：字符串里不要出现未转义的英文双引号，否则整个模块语法错误。

export const NS = "com.gilded.exchange";
export const MKT_KEY = NS + "/market";
export const ACC_KEY = NS + "/account";

export const TICK_MS = 5000;      // 默认一跳 5 秒
export const SPEED_MIN = 1000;    // 最快 1 秒一跳
export const SPEED_MAX = 60000;   // 最慢 60 秒一跳
export const BAR_TICKS = 6;       // 6 跳 = 1 根 K
export const MAX_BARS = 30;       // 保留 K 线根数
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
export const clampSpeed = v => Math.min(SPEED_MAX, Math.max(SPEED_MIN, Math.round(Number(v) || TICK_MS)));
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
  { id: "goldflow", title: "金龙大量流入", desc: "前领主的金库传闻坐实，全城都在找买家。", imp: { KSLT: 4, GLHD: 3, MNSN: 2 }, ticks: 10 },

  // ── 大事件：绑剧情用的重锤，幅度大、不封板 ──────────────────
  { id: "eyes_lost", title: "第三只眼不见了", desc: "戈罗尔之石的三只眼同一天失窃，几家商号的保险柜连夜换了锁。", imp: { SNSA: -16, MNSN: -6, KSLT: -4 }, ticks: 8 },
  { id: "sansa_rampage", title: "珊娜萨血洗码头", desc: "鱼缸空了之后，珊娜萨的打手把整条码头街掀了一遍。", imp: { SNSA: -24, JLRS: -10, WDPA: -8, KSLT: -4 }, ticks: 6 },
  { id: "manshoon_leak", title: "曼松的名字上了头版", desc: "《深水城之眼》头版印着曼松的真名，商会股价当场崩了。", imp: { MNSN: -26, KSLT: 8, GLHD: 6 }, ticks: 8 },
  { id: "cassalanter_due", title: "卡萨兰特的契约到期", desc: "九十九万九千九百九十九金币的账单摆在桌上，午夜之前必须清。", imp: { KSLT: -30, GLHD: -12, WDPA: -7 }, ticks: 6 },
  { id: "jarlaxle_sails", title: "贾拉索的船队离港", desc: "二十艘船同时起锚，港口只剩下空泊位和押金的传说。", imp: { JLRS: -22, WDPA: -10, MNSN: -5 }, ticks: 10 },
  { id: "dragon_wakes", title: "红龙醒了", desc: "宝库深处的呼吸声传到了街上，所有人同时想起自己欠了谁的钱。", imp: { KSLT: -18, MNSN: -20, GLHD: -25, SNSA: -15, JLRS: -12, WDPA: -10 }, ticks: 6 },
  { id: "hoard_found", title: "五十万龙金见光", desc: "前领主的金库被搬上街，搬运工从早上排到第二天凌晨。", imp: { KSLT: 14, GLHD: 18, MNSN: 10, WDPA: 8 }, ticks: 12 },
  { id: "masked_raid", title: "蒙面领主全城戒严", desc: "城门落锁，巡逻队挨家挨户敲门，生意全停。", imp: { GLHD: -18, SNSA: -14, JLRS: -12, KSLT: 4 }, ticks: 8 },
  { id: "harper_audit", title: "竖琴手抄了账房", desc: "账本被一页页摊在桌上，几家商号的名字被红笔圈了出来。", imp: { KSLT: -12, MNSN: -10, SNSA: 6 }, ticks: 6 },
  { id: "nimblewright", title: "灵巧莱特连环案", desc: "第五起爆炸之后，北区的房租和地价一起塌了。", imp: { GLHD: -14, KSLT: -6, SNSA: 4 }, ticks: 8 },

  // ── 中小事件：日常插曲，幅度温和 ────────────────────────────
  { id: "trollskull_open", title: "巨魔颅骨酒馆开张", desc: "新酒馆第一晚就把半条街的客人吸走了。", imp: { GLHD: 9, WDPA: 3 }, ticks: 10 },
  { id: "gold_ship", title: "金龙船进港", desc: "三桅船压着吃水线进港，甲板上全是箱子。", imp: { WDPA: 12, JLRS: 9, MNSN: 6 }, ticks: 10 },
  { id: "shipwrights_ball", title: "造船匠舞会", desc: "全城的船长和寡妇挤在同一个舞厅，订单签到了明年。", imp: { JLRS: 7, WDPA: 5, KSLT: 3 }, ticks: 12 },
  { id: "double_festival", title: "双塞节双游行", desc: "两场游行撞在同一天，酒馆、马车和赌坊一起爆满。", imp: { WDPA: 6, MNSN: 5, JLRS: 4, GLHD: 3 }, ticks: 12 }
];

export const NEWS_FLAVOR = [
  { imp: { WDPA: 1.2 }, t: "【港口】海之少女嘉年华宣布驻留一季，码头生意火爆。" },
  { imp: { MNSN: -1.5 }, t: "【商会】曼松商会否认与散塔林有往来，记者被请出门。" },
  { imp: { SNSA: 1.8 }, t: "【码头区】夜里有三十辆无标记货车进城，没人敢问装的是什么。" },
  { imp: { KSLT: -1.2 }, t: "【金融】卡萨兰特银行上调储备金率，小商户怨声载道。" },
  { imp: { JLRS: 1.6 }, t: "【航运】卢斯坎私掠船连截三艘商船，保费上调。" },
  { imp: { GLHD: 1.2 }, t: "【地产】北区两块地皮被匿名买家拍走，价格高得离谱。" },
  { imp: { KSLT: 1.0 }, t: "【金融】卡萨兰特银行公布季度储备，数字比传闻好看。" },
  { imp: { SNSA: -1.4 }, t: "【码头区】珊娜萨的货舱进了水，湿了三成香料。" },
  { imp: { MNSN: 1.2 }, t: "【商会】曼松商会拿下北区军械订单。" },
  { imp: { JLRS: -1.6 }, t: "【航运】贾拉索的一艘快船在迷雾中失联。" },
  { imp: { GLHD: -1.1 }, t: "【地产】北区地契查出伪造，交易被叫停。" },
  { imp: { WDPA: -1.3 }, t: "【港口】防波堤塌了一段，大船排队等泊位。" },
  { imp: { KSLT: -1.8 }, t: "【金融】卡萨兰特银行的兑付窗口提前关门。" },
  { imp: { SNSA: 1.5 }, t: "【码头区】珊娜萨包下整条鲸油街的仓库。" },
  { imp: { MNSN: -1.0 }, t: "【商会】曼松商会的账房先生连夜辞职。" },
  { imp: { JLRS: 1.7 }, t: "【航运】卢斯坎的私掠船退回了外海。" },
  { imp: { GLHD: 1.4 }, t: "【地产】巨魔颅骨巷的地价被一笔匿名买盘抬高。" },
  { imp: { WDPA: 1.9 }, t: "【港口】深水城港务宣布加开夜班泊位。" },
  { imp: { WDPA: 0.8 }, t: "【港口】海关换了个新关长，报关单多盖一个章。" },
  { imp: { WDPA: -1.5 }, t: "【港口】三桅船「海之少女」撞断栈桥，码头封了半天。" },
  { imp: { JLRS: 1.1 }, t: "【航运】灯塔修好了，夜航保费下调一成。" },
  { imp: { MNSN: -1.7 }, t: "【商会】曼松商会的仓库半夜起火，烧掉半仓丝绸。" },
  { imp: { KSLT: 0.9 }, t: "【金融】卡萨兰特银行发行新一期城债券，半天售罄。" },
  { imp: { GLHD: 1.6 }, t: "【地产】南区新桥动工，桥头地价先涨为敬。" },
  { imp: { SNSA: -1.2 }, t: "【码头区】鱼市查出掺假，珊娜萨的冷库被封了三天。" },
  { imp: { JLRS: -0.9 }, t: "【航运】外海连着三天大雾，船期全乱。" },
  { imp: { MNSN: 1.3 }, t: "【商会】曼松包下整场拍卖会，槌声一响黄金万两。" },
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
  { imp: { MNSN: 1.5 }, t: "【商会】曼松和北区铁匠行会签了长约。" },
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
  { imp: { MNSN: 1.2 }, t: "【商会】曼松签下北区军械的大单。" },
  { imp: { MNSN: -1.4 }, t: "【商会】商会仓库盘点少了两成货。" },
  { imp: { MNSN: 0.9 }, t: "【商会】曼松赞助工匠行会的学徒赛。" },
  { imp: { MNSN: -1.1 }, t: "【商会】商会拒绝赔付沉船的货主。" },
  { imp: { MNSN: 1.5 }, t: "【商会】曼松拿下城北的粮道。" },
  { imp: { MNSN: -0.8 }, t: "【商会】账房先生带着账本跑了。" },
  { imp: { MNSN: 1.0 }, t: "【商会】商会开仓平抑粮价，口碑大好。" },
  { imp: { MNSN: -1.6 }, t: "【商会】一列车队在城郊被劫。" },
  { imp: { MNSN: 1.3 }, t: "【商会】曼松与矮人铁匠签了长约。" },
  { imp: { MNSN: -0.9 }, t: "【商会】商会会馆的屋顶塌了。" },
  { imp: { MNSN: 0.7 }, t: "【商会】曼松捐了一笔修城墙的钱。" },
  { imp: { MNSN: -1.2 }, t: "【商会】有人揭发商会以次充好。" },
  { imp: { MNSN: 1.4 }, t: "【商会】商会的拍卖会拍出天价。" },
  { imp: { MNSN: -1.5 }, t: "【商会】三间分号同时起火。" },
  { imp: { MNSN: 1.1 }, t: "【商会】曼松包下商队节的主展位。" },
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
  { imp: { MNSN: 1.0 }, t: "【商会】曼松包下北区的粮仓。" },
  { imp: { MNSN: -1.2 }, t: "【商会】一车丝绸在城门口被雨淋了。" },
  { imp: { MNSN: 0.8 }, t: "【商会】商会给工匠行会捐了奖学金。" },
  { imp: { MNSN: -1.5 }, t: "【商会】商队在山口被劫，护卫跑了。" },
  { imp: { MNSN: 1.4 }, t: "【商会】曼松拿下军械的独家供货。" },
  { imp: { MNSN: -0.8 }, t: "【商会】分号的招牌掉下来砸了人。" },
  { imp: { MNSN: 1.2 }, t: "【商会】商会和矮人签了矿石长约。" },
  { imp: { MNSN: -1.6 }, t: "【商会】商会仓库的地契出了问题。" },
  { imp: { MNSN: 0.7 }, t: "【商会】曼松包下商队节的摊位。" },
  { imp: { MNSN: -1.1 }, t: "【商会】货主投诉商会短斤少两。" },
  { imp: { MNSN: 1.5 }, t: "【商会】商会接下了城卫队的冬装订单。" },
  { imp: { MNSN: -1.2 }, t: "【商会】账房查出一笔糊涂账。" },
  { imp: { MNSN: 1.0 }, t: "【商会】曼松在拍卖会上捡了个大漏。" },
  { imp: { MNSN: -0.9 }, t: "【商会】商会的护卫队集体辞职。" },
  { imp: { MNSN: 1.3 }, t: "【商会】商会开通了北区的新商路。" },
  { imp: { MNSN: -1.4 }, t: "【商会】一车香料翻进了河里。" },
  { imp: { MNSN: 0.8 }, t: "【商会】曼松请全城工匠喝了酒。" },
  { imp: { MNSN: -1.3 }, t: "【商会】商会会馆被人泼了粪。" },
  { imp: { MNSN: 1.2 }, t: "【商会】商会给孤儿院送了冬衣。" },
  { imp: { MNSN: -0.7 }, t: "【商会】有人冒用商会的名号收货。" },
  { imp: { MNSN: 1.1 }, t: "【商会】曼松和港务签了仓储协议。" },
  { imp: { MNSN: -1.5 }, t: "【商会】商会的银库被撬了。" },
  { imp: { MNSN: 0.9 }, t: "【商会】商会新雇的账房很得力。" },
  { imp: { MNSN: -1.0 }, t: "【商会】商队节上商会的摊位被砸。" },
  { imp: { MNSN: 1.4 }, t: "【商会】曼松低价收了一批抛售的货。" },
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
    const v0 = 4000 + Math.floor(Math.random() * 6000);
    stocks[s.id] = {
      price: q, prevClose: q, halt: false,
      cur: { o: q, h: q, l: q, c: q, v: v0 },
      bars: [], bt: 0
    };
    prevClose[s.id] = q;
  }
  const m = {
    v: 4, tick: 0, running: true, vol: 1, autoNews: true, speed: TICK_MS, limit: true,
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
  const driftN = {}, driftF = {};
  for (const e of (m.events || [])) {
    const total = Math.max(1, Number(e.ticks) || 1);
    let left = Number(e.left);
    if (!Number.isFinite(left)) left = total;
    left -= 1;
    const bucket = e.free ? driftF : driftN;
    for (const id in (e.imp || {})) {
      bucket[id] = (bucket[id] || 0) + logDrift(e.imp[id], total);
    }
    if (left > 0) events.push({ ...e, ticks: total, left });
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
      price: s.p0, prevClose: s.p0, halt: false,
      cur: { o: s.p0, h: s.p0, l: s.p0, c: s.p0, v: 0 }, bars: [], bt: 0
    };
    if (!Number.isFinite(st.price) || st.price <= 0) st.price = s.p0;
    if (!Number.isFinite(st.prevClose) || st.prevClose <= 0) st.prevClose = st.price;
    if (st.halt) {
      stocks[s.id] = { ...st, bt: (st.bt || 0) + 1 };
      continue;
    }
    let ret = s.vol * volMul * gauss() + s.drift + (driftN[s.id] || 0);
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
    const vol = 500 + Math.floor(Math.random() * 4500);
    let cur = { ...st.cur };
    cur.c = price;
    cur.h = Math.max(Number(cur.h) || price, price);
    cur.l = Math.min(Number(cur.l) || price, price);
    cur.v = (Number(cur.v) || 0) + vol;

    let bt = (st.bt || 0) + 1;
    // K 线压缩成 [o,h,l,c] 数组：房间 metadata 总共只有 16kB，对象键名太占地方
    let bars = (st.bars || []).map(b => Array.isArray(b) ? b : [b.o, b.h, b.l, b.c]);
    if (bt >= BAR_TICKS) {
      bars = bars.concat([[cur.o, cur.h, cur.l, cur.c]]).slice(-MAX_BARS);
      cur = { o: price, h: price, l: price, c: price, v: 0 };
      bt = 0;
    }
    stocks[s.id] = { price, prevClose: newDay ? price : st.prevClose, halt: false, cur, bars, bt };
  }

  const out = {
    v: 4, tick, running: m.running !== false, vol: volMul,
    autoNews: m.autoNews !== false, speed: clampSpeed(m.speed),
    limit: m.limit !== false,
    news, newsLeft, events, stocks, steppedAt: Date.now(),
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
