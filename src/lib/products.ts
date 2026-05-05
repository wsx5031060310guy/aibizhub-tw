// Product catalog for the AIBizHub portfolio. Each entry maps to one of the
// independently-deployed Next.js apps and is referenced from the landing page,
// pricing page, and enterprise inquiry form.

export type Plan = {
  name: string;
  price: string;
  cadence: "once" | "month" | "commission";
  features: string[];
  highlight?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  features: string[];
  techHighlights: string[];
  plans: Plan[];
  liveUrl?: string;
  githubUrl?: string;
  status: "live" | "beta" | "preview";
  emoji: string;
  accent: string; // tailwind color token, e.g. "blue", "rose"
};

export const PRODUCTS: Product[] = [
  {
    slug: "quotekit",
    name: "QuoteKit TW",
    tagline: "5 分鐘出一份專業報價單，PDF 自動生成、一鍵分享",
    audience: "自由接案、設計工作室、顧問",
    features: [
      "拖拉式項目 + 自動小計、含稅",
      "中文字型 PDF 輸出（不踩字型坑）",
      "報價單連結直接分享給客戶",
      "歷史報價搜尋與複製",
    ],
    techHighlights: ["Next.js 15", "React PDF", "Supabase", "Vercel"],
    plans: [
      { name: "免費", price: "NT$ 0", cadence: "month", features: ["5 份報價/月", "基礎模板"] },
      {
        name: "Pro",
        price: "NT$ 199",
        cadence: "month",
        features: ["無限份報價", "多語系", "公司 Logo 浮水印", "Excel 匯出"],
        highlight: true,
      },
    ],
    liveUrl: "https://quote-kit-tw.vercel.app",
    githubUrl: "https://github.com/wsx5031060310guy/QuoteKit-TW",
    status: "live",
    emoji: "📋",
    accent: "blue",
  },
  {
    slug: "beautyschedule",
    name: "BeautySchedule TW",
    tagline: "美業/教練專用預約系統，客戶自助排程、自動提醒",
    audience: "美髮、美容、健身教練、瑜伽老師",
    features: [
      "客戶自助選時段、無需來電",
      "Google Calendar / iCal 雙向同步",
      "SMS / LINE 提醒，降低 No-show",
      "後台看排班、客戶名單、消費紀錄",
    ],
    techHighlights: ["Next.js 16", "Prisma", "PostgreSQL", "Docker"],
    plans: [
      { name: "Starter", price: "NT$ 599", cadence: "month", features: ["1 位老師", "100 預約/月"] },
      {
        name: "Studio",
        price: "NT$ 1,299",
        cadence: "month",
        features: ["3 位老師", "無限預約", "SMS 提醒包", "客戶 CRM"],
        highlight: true,
      },
    ],
    liveUrl: "https://beauty-schedule-tw.vercel.app",
    githubUrl: "https://github.com/wsx5031060310guy/BeautySchedule-TW",
    status: "live",
    emoji: "💇",
    accent: "rose",
  },
  {
    slug: "docgen",
    name: "DocGen TW",
    tagline: "合約 / NDA / 委任書產生 + 兩造電子簽署，符合台灣法規",
    audience: "接案者、新創、HR、律師事務所",
    features: [
      "台灣法律標準模板（接案/NDA/委任）",
      "兩造分開簽署：寄件方先簽，收件方拿到一次性連結",
      "IP / SHA-256 / 時間戳完整 audit trail",
      "綠界 / Stripe 雙金流",
    ],
    techHighlights: ["Next.js 16", "React Signature Canvas", "Prisma", "ECPay + Stripe"],
    plans: [
      {
        name: "單份",
        price: "NT$ 99",
        cadence: "once",
        features: ["1 份合約", "PDF 下載", "30 天簽署期"],
      },
      {
        name: "Pro",
        price: "NT$ 299",
        cadence: "month",
        features: ["無限合約", "雙方簽署", "自有品牌", "API"],
        highlight: true,
      },
    ],
    githubUrl: "https://github.com/wsx5031060310guy/docgen-tw",
    status: "beta",
    emoji: "📑",
    accent: "indigo",
  },
  {
    slug: "tinycrm",
    name: "TinyCRM TW",
    tagline: "打開就會用的迷你 CRM，標籤、互動歷史、Excel 匯出",
    audience: "業務、房仲、保險、補習班、自由工作者",
    features: [
      "聯絡人管道 + 標籤 + 來源追蹤",
      "互動時間軸（電話/訊息/會議/Email/LINE）",
      "Excel 一鍵匯出做提案",
      "Mobile-first，手機直接記錄",
    ],
    techHighlights: ["Next.js 16", "Prisma", "Tailwind", "App Router"],
    plans: [
      { name: "Lite", price: "NT$ 0", cadence: "month", features: ["50 聯絡人", "基本互動紀錄"] },
      {
        name: "Pro",
        price: "NT$ 499",
        cadence: "month",
        features: ["無限聯絡人", "團隊共用", "API 整合", "自訂欄位"],
        highlight: true,
      },
    ],
    githubUrl: "https://github.com/wsx5031060310guy/tinycrm-tw",
    status: "beta",
    emoji: "📇",
    accent: "emerald",
  },
  {
    slug: "staymini",
    name: "StayMini",
    tagline: "輕量級民宿/短租訂房系統，含雙重訂房自動阻擋",
    audience: "Airbnb 房東、小型民宿、短租管理者",
    features: [
      "公開房型展示 + 設施清單",
      "預約詢問 + 自動雙重訂房阻擋",
      "iCal 雙向同步 (Booking.com / Airbnb)",
      "後台看 inquiry / confirmed 列表",
    ],
    techHighlights: ["Next.js", "Prisma", "Tailwind", "Server Actions"],
    plans: [
      {
        name: "抽成",
        price: "3% 訂單",
        cadence: "commission",
        features: ["無月費", "依成交收費", "適合輕量管理"],
      },
      {
        name: "Pro",
        price: "NT$ 1,299",
        cadence: "month",
        features: ["免抽成", "iCal 多通路同步", "自動結算", "多房源"],
        highlight: true,
      },
    ],
    githubUrl: "https://github.com/wsx5031060310guy/StayMini",
    status: "beta",
    emoji: "🏡",
    accent: "amber",
  },
  {
    slug: "investjournal",
    name: "Crypto Diary",
    tagline: "個人投資日記 + 自動化機器人，雙向 Google Sheets 同步",
    audience: "個人投資者、Web3 玩家、量化新手",
    features: [
      "每日 09:00 自動分析 + 排程交易",
      "Google Sheets 為單一真實資料源",
      "Streamlit 視覺化儀表板",
      "Telegram 即時通知",
    ],
    techHighlights: ["Streamlit", "Python", "Google Sheets API", "Telegram Bot"],
    plans: [
      { name: "個人版", price: "NT$ 0", cadence: "month", features: ["免費開源", "需自架"] },
    ],
    githubUrl: "https://github.com/wsx5031060310guy/crypto-diary",
    status: "live",
    emoji: "📈",
    accent: "violet",
  },
];

export const BUNDLES = [
  {
    slug: "freelancer",
    name: "接案者套組",
    monthlyPrice: 549,
    saving: 248,
    includes: ["quotekit", "docgen", "tinycrm"],
    description: "報價 → 簽約 → 客戶管理 一條龍。Pro 版三件合購省 NT$ 248/月。",
    highlight: true,
  },
  {
    slug: "beauty",
    name: "美業老闆套組",
    monthlyPrice: 1599,
    saving: 199,
    includes: ["beautyschedule", "tinycrm", "docgen"],
    description: "預約 + 客戶 CRM + 簽約授權，一次到位。",
  },
  {
    slug: "host",
    name: "民宿主套組",
    monthlyPrice: 1499,
    saving: 0,
    includes: ["staymini", "docgen", "tinycrm"],
    description: "訂房 + 入住合約 + 房客 CRM，含 3% 抽成轉月費的優惠路徑。",
  },
  {
    slug: "enterprise",
    name: "企業全方位",
    monthlyPrice: 4999,
    saving: 1500,
    includes: ["quotekit", "docgen", "tinycrm", "beautyschedule", "staymini"],
    description: "整套全用 + 白標客製 + 優先客服。連鎖門市、加盟主、SaaS 經銷適用。",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
