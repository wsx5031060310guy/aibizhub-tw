import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { COMPANY } from "@/lib/company";

export const metadata = {
  title: "關於 AIBizHub | 我們是誰",
  description:
    "AIBizHub TW 由台灣團隊獨立開發，6 個 SaaS 工具皆基於真實的台灣中小企業需求設計，使用 Next.js 16、Prisma、台灣常用金流。",
};

const TIMELINE: { date: string; title: string; body: string }[] = [
  {
    date: "2026 Q2",
    title: "AIBizHub 正式上線",
    body: "整合 6 個既有 SaaS 工具於統一帳號之下，並開放企業洽詢 + 介紹分潤計畫。",
  },
  {
    date: "2026 Q1",
    title: "DocGen TW + 兩造電子簽約",
    body: "符合電子簽章法的雙方分簽流程上線；綠界 + Stripe 雙金流。",
  },
  {
    date: "2025 Q4",
    title: "BeautySchedule TW + QuoteKit TW 公測",
    body: "美業預約系統與報價單產生器同步上線，累積首批付費客戶。",
  },
  {
    date: "2025 Q3",
    title: "投資自動化機器人",
    body: "個人投資日記 + 每日自動化交易系統，與 Google Sheets 雙向同步。",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-zinc-950">
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← 回首頁
          </Link>
          <h1 className="mt-6 text-4xl font-bold">為台灣中小企業設計</h1>
          <p className="mt-6 text-lg text-zinc-700 dark:text-zinc-300">
            台灣的 SaaS 市場長期被「美國同類產品的中文版」與「過度本土但難用」夾擊。
            AIBizHub 是另一條路：把每個工具都做到能解決一個具體問題，再把它們組合起來。
          </p>

          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            我們不做大平台，做的是 <strong>6 個能獨立販售的小型 SaaS</strong>，每個都針對特定產業
            的固定流程（接案、美業、民宿、律所），確保上線當天就能用。
          </p>

          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            背後同一批工程師、同一個技術棧（Next.js 16、Prisma、TypeScript），同樣的安全合規（綠界、電子簽章法、個資法）。
            企業客戶可以白標訂閱整套，加盟總部可以一次導入到所有分店；獨立工作室可以挑一個用就好。
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold">技術選擇與堅持</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card title="開源優先">
              所有產品代碼公開於 GitHub，企業客戶可審查或自架。我們不藏黑盒。
            </Card>
            <Card title="台灣首選金流">
              預設綠界 ECPay 處理信用卡、ATM、超商代碼；Stripe 處理國際訂閱。已踩過藍新加密簽章的坑，封裝後給企業客戶直接用。
            </Card>
            <Card title="符合台灣法規">
              電子簽章法、個資法、洗錢防制法。律師事務所合作維持條款最新。
            </Card>
            <Card title="不鎖定">
              即使停用 AIBizHub，所有客戶資料、合約 PDF、報價單皆可一鍵匯出 CSV / PDF。
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-bold">里程碑</h2>
          <ol className="mt-8 space-y-6 border-l border-zinc-200 pl-6 dark:border-zinc-800">
            {TIMELINE.map((item) => (
              <li key={item.title} className="relative">
                <span className="absolute -left-[31px] top-1 inline-block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-zinc-950" />
                <p className="text-xs font-medium text-zinc-500">{item.date}</p>
                <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold">已上線部署案例</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Case
              title="citizen-law.com"
              role="律師事務所網站"
              note="每日 AI 自動產出法律新知文章，發佈到 WordPress；2026 年 5 月起穩定運行。"
            />
            <Case
              title="kidosim.com"
              role="海外旅遊 eSIM 購買站"
              note="藍新金流正式串接、世界移動 eSIM API、LINE 登入、Mailgun 信件、Admin 批次定價、自動部落格 cron。"
            />
            <Case
              title="個人投資機器人"
              role="自動化系統"
              note="每日 09:00 執行交易策略，狀態同步至 Google Sheets，Telegram 即時通知。"
            />
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">準備好了嗎？</h2>
          <p className="mt-4 text-zinc-300">
            選一個工具開始用，或聊聊您的需求 — 我們 48 小時內會聯絡。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/help/choose"
              className="rounded-lg bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-100"
            >
              幫我挑方案 →
            </Link>
            <Link
              href="/enterprise"
              className="rounded-lg border border-zinc-700 px-6 py-3 font-medium hover:bg-zinc-900"
            >
              企業洽詢
            </Link>
          </div>
          <p className="mt-12 text-xs text-zinc-500">
            目前在線產品：{PRODUCTS.filter((p) => p.status === "live").length} live ／
            {PRODUCTS.filter((p) => p.status === "beta").length} beta
          </p>
        </div>
      </section>

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-bold">聯絡我們</h2>
          <p className="mt-2 text-sm text-zinc-500">本服務由 {COMPANY.name}（{COMPANY.nameEn}）營運。</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-zinc-500">公司</dt>
              <dd>{COMPANY.name}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-zinc-500">Email</dt>
              <dd>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {COMPANY.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-zinc-500">電話</dt>
              <dd>{COMPANY.phone}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-16 shrink-0 text-zinc-500">地址</dt>
              <dd>{COMPANY.address}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{children}</p>
    </article>
  );
}

function Case({ title, role, note }: { title: string; role: string; note: string }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-zinc-500">{role}</p>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{note}</p>
    </article>
  );
}
