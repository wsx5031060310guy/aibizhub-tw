import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "所有產品 | AIBizHub TW",
  description: "完整 6 件 AI 商業工具列表 — 報價、簽約、CRM、預約、訂房、投資自動化",
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

export default function ProductsIndex() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← 回首頁
      </Link>
      <h1 className="mt-6 text-4xl font-bold">所有產品</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        每個產品都可獨立訂閱使用，也可組合套裝。點擊查看完整功能與價格。
      </p>
      <div className="mt-12 space-y-6">
        {PRODUCTS.map((p) => (
          <article
            key={p.slug}
            className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950 sm:grid-cols-[auto_1fr_auto] sm:items-start"
          >
            <div className="text-5xl">{p.emoji}</div>
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl font-bold">{p.name}</h2>
                <span className={`rounded px-2 py-0.5 text-xs ${STATUS_BADGE[p.status]}`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </div>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300">{p.tagline}</p>
              <p className="mt-2 text-sm text-zinc-500">適合：{p.audience}</p>
              <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <div className="text-right">
                <span className="text-2xl font-bold">{p.plans[p.plans.length - 1].price}</span>
                <span className="text-xs text-zinc-500">
                  {p.plans[p.plans.length - 1].cadence === "month"
                    ? " / 月"
                    : p.plans[p.plans.length - 1].cadence === "once"
                      ? " / 份"
                      : ""}
                </span>
              </div>
              <Link
                href={`/products/${p.slug}`}
                className="rounded bg-blue-600 px-4 py-2 text-center text-sm text-white hover:bg-blue-700"
              >
                完整介紹
              </Link>
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-center text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  立即試用 →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
