import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, PRODUCTS, BUNDLES } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  return {
    title: p ? `${p.name} | AIBizHub TW` : "找不到產品",
    description: p?.tagline,
  };
}

const ACCENT_BG: Record<string, string> = {
  blue: "from-blue-50 to-white dark:from-blue-950/40 dark:to-zinc-950",
  rose: "from-rose-50 to-white dark:from-rose-950/40 dark:to-zinc-950",
  indigo: "from-indigo-50 to-white dark:from-indigo-950/40 dark:to-zinc-950",
  emerald: "from-emerald-50 to-white dark:from-emerald-950/40 dark:to-zinc-950",
  amber: "from-amber-50 to-white dark:from-amber-950/40 dark:to-zinc-950",
  violet: "from-violet-50 to-white dark:from-violet-950/40 dark:to-zinc-950",
};

const STATUS_BADGE: Record<string, string> = {
  live: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  beta: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  preview: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};
const STATUS_LABEL: Record<string, string> = {
  live: "已上線",
  beta: "Beta",
  preview: "預覽",
};

const CADENCE_LABEL: Record<string, string> = {
  once: "/ 份",
  month: "/ 月",
  commission: "",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const relatedBundles = BUNDLES.filter((b) => b.includes.includes(product.slug));

  return (
    <main className="bg-white dark:bg-zinc-950">
      <section
        className={`bg-gradient-to-b ${ACCENT_BG[product.accent]} border-b border-zinc-200 dark:border-zinc-800`}
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Link href="/products" className="text-sm text-blue-600 hover:underline">
            ← 所有產品
          </Link>
          <div className="mt-6 flex items-start gap-6">
            <div className="text-6xl">{product.emoji}</div>
            <div>
              <div className="flex items-baseline gap-3">
                <h1 className="text-4xl font-bold">{product.name}</h1>
                <span className={`rounded px-2 py-0.5 text-xs ${STATUS_BADGE[product.status]}`}>
                  {STATUS_LABEL[product.status]}
                </span>
              </div>
              <p className="mt-3 text-lg text-zinc-700 dark:text-zinc-300">{product.tagline}</p>
              <p className="mt-2 text-sm text-zinc-500">適合：{product.audience}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {product.liveUrl && (
                  <a
                    href={product.liveUrl}
                    target="_blank"
                    rel="noopener"
                    className="rounded bg-blue-600 px-5 py-2.5 text-sm text-white hover:bg-blue-700"
                  >
                    立即試用 →
                  </a>
                )}
                <Link
                  href={`/enterprise?product=${product.slug}`}
                  className="rounded border border-zinc-300 px-5 py-2.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  企業洽詢
                </Link>
                {product.githubUrl && (
                  <a
                    href={product.githubUrl}
                    target="_blank"
                    rel="noopener"
                    className="rounded px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold">完整功能</h2>
            <ul className="mt-6 space-y-3">
              {product.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-0.5 text-blue-600">✓</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">技術棧</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {product.techHighlights.map((t) => (
                <li
                  key={t}
                  className="inline-block rounded border border-zinc-200 bg-zinc-50 px-2 py-1 mr-1.5 mb-1.5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold">定價方案</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {product.plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-blue-500 bg-white shadow-lg dark:bg-zinc-950"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                }`}
              >
                {plan.highlight && (
                  <span className="inline-block rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                    推薦
                  </span>
                )}
                <h3 className="mt-2 text-xl font-semibold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-zinc-500">{CADENCE_LABEL[plan.cadence]}</span>
                </div>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-blue-600">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {relatedBundles.length > 0 && (
        <section className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-bold">包含本產品的套裝</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              組合購買比單買省更多。
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBundles.map((b) => (
                <Link
                  key={b.slug}
                  href={`/enterprise?bundle=${b.slug}`}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <h3 className="font-semibold">{b.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{b.description}</p>
                  <p className="mt-3 text-lg font-bold">
                    NT$ {b.monthlyPrice.toLocaleString()}
                    <span className="text-sm font-normal text-zinc-500"> / 月</span>
                  </p>
                  {b.saving > 0 && (
                    <p className="text-xs text-emerald-600">省 NT$ {b.saving.toLocaleString()}/月</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">準備好導入 {product.name} 了嗎？</h2>
          <p className="mt-3 text-zinc-300">
            企業客戶提供白標版、優先客服、30 天 PoC 試營運。
          </p>
          <Link
            href={`/enterprise?product=${product.slug}`}
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-100"
          >
            企業洽詢 →
          </Link>
        </div>
      </section>
    </main>
  );
}
