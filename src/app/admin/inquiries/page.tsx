import { promises as fs } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "企業洽詢列表 | AIBizHub Admin",
};

const STORAGE_PATH =
  process.env.AIBIZHUB_INQUIRY_LOG ?? path.join(process.cwd(), ".local", "enterprise-inquiries.jsonl");

const ADMIN_EMAILS = (process.env.AIBIZHUB_ADMIN_EMAILS ?? "wsx5031060310guy@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

type InquiryRecord = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string | null;
  messenger: string | null;
  industry: string;
  products: string[];
  bundle: string | null;
  userScale: string;
  message: string | null;
  referralCode: string | null;
  createdAt: string;
};

async function loadInquiries(): Promise<InquiryRecord[]> {
  try {
    const raw = await fs.readFile(STORAGE_PATH, "utf8");
    return raw
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        try {
          return JSON.parse(line) as InquiryRecord;
        } catch {
          return null;
        }
      })
      .filter((r): r is InquiryRecord => r !== null)
      .reverse();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export default async function AdminInquiriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin/inquiries");

  const userEmail = session.user.email?.toLowerCase();
  const isAdmin = userEmail && ADMIN_EMAILS.includes(userEmail);
  const isDemo = session.user.id?.startsWith("demo-");

  if (!isAdmin && !isDemo) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold">無存取權限</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          您的帳號（{session.user.email ?? "—"}）不在 admin 名單內。
          管理員請至 Vercel 設定 <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">AIBIZHUB_ADMIN_EMAILS</code>{" "}
          環境變數加入您的 email。
        </p>
        <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
          ← 回儀表板
        </Link>
      </main>
    );
  }

  const inquiries = await loadInquiries();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-bold">企業洽詢列表</h1>
          <p className="mt-1 text-sm text-zinc-500">
            共 {inquiries.length} 筆 · 來源：{STORAGE_PATH}
            {isDemo && (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Demo 帳號預覽
              </span>
            )}
          </p>
        </div>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← 儀表板
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 p-16 text-center">
          <p className="text-zinc-500">目前還沒有企業洽詢。</p>
          <p className="mt-2 text-xs text-zinc-400">
            企業客戶從 /enterprise 表單送出後會自動出現在這裡。
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <Filters total={inquiries.length} inquiries={inquiries} />
          {inquiries.map((r) => (
            <InquiryCard key={r.id} record={r} />
          ))}
        </div>
      )}
    </main>
  );
}

function Filters({ total, inquiries }: { total: number; inquiries: InquiryRecord[] }) {
  const byIndustry = inquiries.reduce<Record<string, number>>((acc, r) => {
    acc[r.industry] = (acc[r.industry] ?? 0) + 1;
    return acc;
  }, {});
  const byScale = inquiries.reduce<Record<string, number>>((acc, r) => {
    acc[r.userScale] = (acc[r.userScale] ?? 0) + 1;
    return acc;
  }, {});
  const withReferral = inquiries.filter((r) => r.referralCode).length;

  return (
    <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-3">
      <Stat label="總洽詢數" value={total} />
      <Stat label="帶介紹碼" value={withReferral} sub={`${total > 0 ? Math.round((withReferral / total) * 100) : 0}%`} />
      <Stat label="主要產業" value={Object.entries(byIndustry).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"} />
      {Object.keys(byScale).length > 0 && (
        <div className="sm:col-span-3 mt-2 flex flex-wrap gap-2 text-xs">
          {Object.entries(byScale).map(([scale, n]) => (
            <span
              key={scale}
              className="rounded-full bg-white px-3 py-1 text-zinc-600 dark:bg-zinc-950 dark:text-zinc-300"
            >
              {scale}: {n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-zinc-400">{sub}</div>}
    </div>
  );
}

function InquiryCard({ record }: { record: InquiryRecord }) {
  const created = new Date(record.createdAt);
  const ageHours = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60));
  const isHot = ageHours < 24;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{record.company}</h3>
            {isHot && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900 dark:text-red-200">
                🔥 24h 內
              </span>
            )}
            {record.referralCode && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                🤝 {record.referralCode}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {record.contactName} · {record.industry} · {record.userScale}
          </p>
        </div>
        <div className="text-right text-xs text-zinc-400">
          <div className="font-mono">{record.id}</div>
          <div>{created.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}</div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <a href={`mailto:${record.email}`} className="text-blue-600 hover:underline">
          ✉️ {record.email}
        </a>
        {record.phone && (
          <a href={`tel:${record.phone}`} className="text-blue-600 hover:underline">
            📞 {record.phone}
          </a>
        )}
        {record.messenger && <span className="text-zinc-600 dark:text-zinc-400">💬 {record.messenger}</span>}
      </div>

      {(record.bundle || record.products.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {record.bundle && (
            <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              📦 {record.bundle}
            </span>
          )}
          {record.products.map((p) => (
            <span
              key={p}
              className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      {record.message && (
        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {record.message}
        </p>
      )}
    </article>
  );
}
