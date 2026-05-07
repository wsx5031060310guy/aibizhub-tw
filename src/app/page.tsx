import Link from "next/link";
import { PRODUCTS, BUNDLES, getProduct } from "@/lib/products";

export default function HomePage() {
  return (
    <div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Hero />
      <ProductGrid />
      <BundleSection />
      <EnterpriseCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
          AIBizHub TW · 全方位人工智能商業平台
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          台灣中小企業<br />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            一站式 AI 商業工具
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          報價、簽約、客戶管理、預約、訂房、投資自動化 ── 6 個獨立工具整合在一個帳號下。
          適合接案者、美業老闆、民宿主、新創、SaaS 經銷與連鎖加盟。
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="#products"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700"
          >
            查看所有工具
          </Link>
          <Link
            href="/enterprise"
            className="rounded-lg border border-zinc-300 px-6 py-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            企業洽詢
          </Link>
        </div>
        <dl className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <Stat label="獨立工具" value="6" />
          <Stat label="付款方式" value="2" detail="綠界 + Stripe" />
          <Stat label="台灣法律模板" value="3+" />
          <Stat label="自動化排程" value="3" detail="效能/投資/法律新知" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div>
      <dd className="text-3xl font-bold">{value}</dd>
      <dt className="mt-1 text-sm text-zinc-500">{label}</dt>
      {detail && <p className="text-xs text-zinc-400">{detail}</p>}
    </div>
  );
}

const ACCENT_RING: Record<string, string> = {
  blue: "ring-blue-500/20",
  rose: "ring-rose-500/20",
  indigo: "ring-indigo-500/20",
  emerald: "ring-emerald-500/20",
  amber: "ring-amber-500/20",
  violet: "ring-violet-500/20",
};
const ACCENT_BG: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-950/40",
  rose: "bg-rose-50 dark:bg-rose-950/40",
  indigo: "bg-indigo-50 dark:bg-indigo-950/40",
  emerald: "bg-emerald-50 dark:bg-emerald-950/40",
  amber: "bg-amber-50 dark:bg-amber-950/40",
  violet: "bg-violet-50 dark:bg-violet-950/40",
};
const STATUS_BADGE: Record<string, string> = {
  live: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  beta: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  preview: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};
const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  preview: "Preview",
};

function ProductGrid() {
  return (
    <section id="products" className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">產品線</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          每個工具都是獨立可訂閱的 SaaS，也可組合套裝享優惠。
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article
              key={p.slug}
              className={`rounded-2xl ring-1 ${ACCENT_RING[p.accent]} ${ACCENT_BG[p.accent]} p-6 transition hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{p.emoji}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${STATUS_BADGE[p.status]}`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{p.tagline}</p>
              <p className="mt-3 text-xs text-zinc-500">適合：{p.audience}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{p.plans[p.plans.length - 1].price}</span>
                <span className="text-xs text-zinc-500">
                  {p.plans[p.plans.length - 1].cadence === "month"
                    ? "/ 月"
                    : p.plans[p.plans.length - 1].cadence === "once"
                      ? "/ 份"
                      : ""}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/products/${p.slug}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  查看詳情 →
                </Link>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  >
                    試用
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BundleSection() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">套裝方案</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          按產業組合工具，比單買省更多。
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {BUNDLES.map((b) => (
            <article
              key={b.slug}
              className={`rounded-2xl border p-6 ${
                b.highlight
                  ? "border-blue-500 bg-white dark:bg-zinc-950 shadow-lg"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              {b.highlight && (
                <span className="inline-block rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                  最熱門
                </span>
              )}
              <h3 className="mt-2 text-lg font-semibold">{b.name}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{b.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">NT$ {b.monthlyPrice.toLocaleString()}</span>
                <span className="text-sm text-zinc-500"> / 月</span>
                {b.saving > 0 && (
                  <p className="mt-1 text-xs text-emerald-600">
                    省 NT$ {b.saving.toLocaleString()}/月
                  </p>
                )}
              </div>
              <ul className="mt-4 space-y-1 text-xs">
                {b.includes.map((slug) => {
                  const p = getProduct(slug);
                  return p ? (
                    <li key={slug} className="flex items-center gap-2">
                      <span>{p.emoji}</span>
                      <span>{p.name}</span>
                    </li>
                  ) : null;
                })}
              </ul>
              <Link
                href={`/enterprise?bundle=${b.slug}`}
                className="mt-5 inline-block w-full rounded bg-zinc-900 py-2 text-center text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
              >
                洽詢此方案
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnterpriseCTA() {
  return (
    <section className="bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">企業客戶？我們提供白標版</h2>
            <p className="mt-4 text-zinc-300">
              連鎖門市、加盟總部、SaaS 經銷商：把這些工具用您的 logo 與網域提供給您的客戶，由我們處理基礎設施、合規與更新。
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>✓ 自有網域 + 自有品牌（白標）</li>
              <li>✓ 多租戶隔離、權限管控</li>
              <li>✓ 訂閱由您收，平台僅收技術授權費</li>
              <li>✓ 30 天 PoC 試營運</li>
            </ul>
            <Link
              href="/enterprise"
              className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-100"
            >
              填寫洽詢表單 →
            </Link>
          </div>
          <div className="rounded-2xl bg-zinc-900 p-6 ring-1 ring-zinc-800">
            <h3 className="font-semibold">已合作 / 部署中</h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>• <strong>citizen-law.com</strong> — 律師事務所網站，每日自動法律新知文章</li>
              <li>• <strong>kidosim.com</strong> — 海外旅遊 eSIM 購買站，藍新金流 + LINE 登入 + 自動部落格</li>
              <li>• <strong>個人投資機器人</strong> — 每日 09:00 自動執行 + Google Sheets 同步</li>
              <li>• <strong>QuoteKit / BeautySchedule</strong> — 已上線，企業可直接體驗</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-zinc-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© 2026 AIBizHub TW · 由 wsx5031060310guy 維護</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              首頁
            </Link>
            <Link href="/enterprise" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              企業洽詢
            </Link>
            <a
              href="https://github.com/wsx5031060310guy"
              target="_blank"
              rel="noopener"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
