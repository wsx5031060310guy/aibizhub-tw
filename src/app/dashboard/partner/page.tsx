import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrIssuePartnerCode } from "@/lib/partner";

export const metadata = {
  title: "介紹分潤後台 | AIBizHub",
};

const STORAGE_PATH =
  process.env.AIBIZHUB_INQUIRY_LOG ?? path.join(process.cwd(), ".local", "enterprise-inquiries.jsonl");

type InquiryRecord = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  industry: string;
  userScale: string;
  bundle: string | null;
  products: string[];
  referralCode: string | null;
  createdAt: string;
};

async function loadInquiriesByCode(code: string): Promise<InquiryRecord[]> {
  try {
    const raw = await fs.readFile(STORAGE_PATH, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as InquiryRecord;
        } catch {
          return null;
        }
      })
      .filter((r): r is InquiryRecord => r !== null && r.referralCode === code)
      .reverse();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export default async function PartnerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/partner");

  const userId = session.user.id ?? "anonymous";
  const { code: partnerCode } = await getOrIssuePartnerCode({
    userId,
    email: session.user.email ?? null,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aibizhub.tw";
  const partnerLink = `${siteUrl}/?ref=${partnerCode}`;

  const referrals = await loadInquiriesByCode(partnerCode);
  const last30Days = referrals.filter((r) => {
    const ageMs = Date.now() - new Date(r.createdAt).getTime();
    return ageMs <= 30 * 24 * 60 * 60 * 1000;
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
        ← 儀表板
      </Link>
      <h1 className="mt-6 text-3xl font-bold">介紹分潤後台</h1>
      <p className="mt-2 text-sm text-zinc-500">
        20% 持續分潤（首年），每月結算。透過您的連結進來的洽詢都會出現在這裡。
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="您的介紹碼" value={partnerCode} mono />
        <Stat label="總 leads" value={referrals.length} />
        <Stat label="近 30 天" value={last30Days.length} />
      </section>

      <section className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40">
        <h3 className="font-semibold">分享連結</h3>
        <p className="mt-3 break-all rounded bg-white p-3 font-mono text-sm dark:bg-zinc-950">
          {partnerLink}
        </p>
        <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
          訪客從這個連結進站後，cookie 會記住您的代碼 90 天。在這段期間內送出的企業洽詢都算您的介紹。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">您介紹的 leads</h2>
        {referrals.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <p className="text-zinc-500">尚未有介紹來的 leads。</p>
            <p className="mt-2 text-xs text-zinc-400">
              開始分享您的連結到 LinkedIn / 客戶群組吧。
            </p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {referrals.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{r.company}</h3>
                  <span className="text-xs text-zinc-400">
                    {new Date(r.createdAt).toLocaleString("zh-TW", {
                      timeZone: "Asia/Taipei",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {r.industry} · {r.userScale} · {r.contactName}
                </p>
                {(r.bundle || r.products.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                    {r.bundle && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        📦 {r.bundle}
                      </span>
                    )}
                    {r.products.map((p) => (
                      <span
                        key={p}
                        className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="font-semibold">分潤條款</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>· <strong>分潤比例</strong>：訂閱金額 20%（首年）/ 5%（次年起續約）</li>
          <li>· <strong>結算週期</strong>：每月 1 日結算上月，匯款至您指定的帳戶（需先完成 KYC）</li>
          <li>· <strong>歸屬視窗</strong>：訪客點擊您的連結後 90 天內成交皆算入</li>
          <li>· <strong>退款扣抵</strong>：客戶退款時對應分潤會自下次撥款扣回</li>
        </ul>
        <p className="mt-4 text-xs text-zinc-400">
          完整法律條款於 PoC 簽約時提供。如需特殊安排（白標經銷、企業批量），請洽企業窗口。
        </p>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs text-zinc-500">{label}</div>
      <div
        className={`mt-1 text-2xl font-bold ${mono ? "font-mono tracking-wider" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
