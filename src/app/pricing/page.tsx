import Link from "next/link";
import { PRODUCTS, BUNDLES } from "@/lib/products";

export const metadata = {
  title: "定價 | AIBizHub TW",
  description: "6 件 AI 商業工具與 4 種套裝方案的完整定價對照",
};

const CADENCE_LABEL: Record<string, string> = {
  once: "/ 份",
  month: "/ 月",
  commission: "（抽成制）",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← 回首頁
      </Link>
      <h1 className="mt-6 text-4xl font-bold">定價</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        所有方案皆無綁約、隨時可調整。企業版另談。
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">單品方案</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left">產品</th>
                <th className="px-4 py-3 text-left">免費 / 入門</th>
                <th className="px-4 py-3 text-left">推薦方案</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {PRODUCTS.map((p) => {
                const cheapest = p.plans[0];
                const top = p.plans[p.plans.length - 1];
                return (
                  <tr key={p.slug}>
                    <td className="px-4 py-3 align-top">
                      <Link href={`/products/${p.slug}`} className="font-medium hover:underline">
                        {p.emoji} {p.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-zinc-500">{p.audience}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{cheapest.price}</div>
                      <div className="text-xs text-zinc-500">{CADENCE_LABEL[cheapest.cadence]}</div>
                      <div className="mt-1 text-xs">{cheapest.features[0]}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-bold">
                        {top.price}{" "}
                        <span className="text-xs text-zinc-500 font-normal">
                          {CADENCE_LABEL[top.cadence]}
                        </span>
                      </div>
                      <ul className="mt-1 space-y-0.5 text-xs">
                        {top.features.slice(0, 3).map((f) => (
                          <li key={f}>· {f}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">套裝方案</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          按產業組合，比單買省更多。所有套裝皆按月計算、可隨時取消。
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {BUNDLES.map((b) => (
            <article
              key={b.slug}
              className={`rounded-2xl border p-6 ${
                b.highlight
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{b.name}</h3>
                {b.highlight && (
                  <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                    最熱門
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{b.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold">NT$ {b.monthlyPrice.toLocaleString()}</span>
                <span className="text-sm text-zinc-500"> / 月</span>
                {b.saving > 0 && (
                  <p className="mt-1 text-xs text-emerald-600">
                    比單買省 NT$ {b.saving.toLocaleString()}/月
                  </p>
                )}
              </div>
              <Link
                href={`/enterprise?bundle=${b.slug}`}
                className="mt-5 inline-block w-full rounded bg-zinc-900 py-2 text-center text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
              >
                洽詢此方案
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-zinc-950 p-10 text-white">
        <div className="grid items-center gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">企業 / 加盟總部 / SaaS 經銷</h2>
            <p className="mt-3 text-zinc-300">
              年付 8 折、白標版 + 自有網域、多租戶權限、優先客服、SLA 99.9%、30 天 PoC。
            </p>
            <ul className="mt-4 space-y-1 text-sm text-zinc-400">
              <li>· 基本授權 NT$ 4,999/月（含 100 終端用戶）</li>
              <li>· 每超過 100 用戶 +NT$ 500/月</li>
              <li>· 源碼授權、私有部署皆可另議</li>
            </ul>
          </div>
          <Link
            href="/enterprise"
            className="rounded-lg bg-white px-6 py-3 text-center font-medium text-zinc-900 hover:bg-zinc-100"
          >
            企業洽詢 →
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">介紹分潤</h2>
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            您是顧問、行銷夥伴或既有客戶？分享您的介紹連結（
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
              ?ref=您的代碼
            </code>
            ）即可獲得首年訂閱 <strong>20% 持續分潤</strong>。我們會自動透過 cookie 將該推廣與訂閱關聯。
          </p>
          <p className="mt-3 text-sm">
            尚無介紹碼？請至{" "}
            <Link href="/enterprise" className="text-blue-600 hover:underline">
              企業洽詢
            </Link>{" "}
            並備註「介紹計畫」即可由專人開通。
          </p>
        </div>
      </section>
    </main>
  );
}
