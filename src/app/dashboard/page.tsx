import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { PRODUCTS } from "@/lib/products";
import { getOrIssuePartnerCode } from "@/lib/partner";

export const metadata = {
  title: "儀表板 | AIBizHub TW",
};

const STATUS_LABEL: Record<string, string> = {
  live: "可立即使用",
  beta: "Beta 試用中",
  preview: "即將上線",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const isDemo = session.user.id?.startsWith("demo-");
  const { code: partnerCode } = await getOrIssuePartnerCode({
    userId: session.user.id ?? "anonymous",
    email: session.user.email ?? null,
  });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aibizhub.tw";
  const partnerLink = `${siteUrl}/?ref=${partnerCode}`;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">您的儀表板</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {session.user.email ?? session.user.name ?? "—"}
            {isDemo && (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Demo 模式
              </span>
            )}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            登出
          </button>
        </form>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">您的工具</h2>
        <p className="mt-2 text-sm text-zinc-500">
          {isDemo
            ? "Demo 帳號可預覽所有產品入口（未實際串接 SSO，請點外部連結試用）。"
            : "點擊任一工具直接跳轉。SSO 將自動帶入您的身份。"}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article
              key={p.slug}
              className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{p.emoji}</span>
                <span className="text-xs text-zinc-500">{STATUS_LABEL[p.status]}</span>
              </div>
              <h3 className="mt-3 font-semibold">{p.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{p.tagline.slice(0, 50)}...</p>
              {p.liveUrl ? (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-block w-full rounded bg-blue-600 py-2 text-center text-sm text-white hover:bg-blue-700"
                >
                  開啟工具 →
                </a>
              ) : (
                <Link
                  href={`/products/${p.slug}`}
                  className="mt-4 inline-block w-full rounded border border-zinc-300 py-2 text-center text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  尚未上線 / 查看細節
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="font-semibold">訂閱狀態</h3>
          <p className="mt-2 text-sm text-zinc-500">
            目前方案：{isDemo ? "Demo（不會被計費）" : "尚未啟動付費訂閱"}
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            升級方案 →
          </Link>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="font-semibold">您的介紹分潤</h3>
          <p className="mt-2 text-sm text-zinc-500">
            分享下方連結，每筆訂閱獲得 20% 持續分潤（首年）。
          </p>
          <div className="mt-3 space-y-2">
            <div>
              <span className="text-xs text-zinc-500">介紹碼</span>
              <p className="rounded bg-zinc-100 p-2 font-mono text-sm tracking-wider dark:bg-zinc-900">
                {partnerCode}
              </p>
            </div>
            <div>
              <span className="text-xs text-zinc-500">完整連結（複製分享）</span>
              <p className="break-all rounded bg-zinc-100 p-2 font-mono text-xs dark:bg-zinc-900">
                {partnerLink}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/partner"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            查看介紹後台 →
          </Link>
        </div>
      </section>
    </main>
  );
}
