import { Suspense } from "react";
import EnterpriseInquiryForm from "./EnterpriseInquiryForm";

export const metadata = {
  title: "企業洽詢 | AIBizHub TW",
  description: "為連鎖門市 / 加盟總部 / SaaS 經銷商提供白標 AI 商業工具。30 天 PoC 試營運。",
};

export default function EnterprisePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <a href="/" className="text-sm text-blue-600 hover:underline">
        ← 回首頁
      </a>
      <h1 className="mt-6 text-3xl font-bold">企業洽詢</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        告訴我們您的需求，48 小時內專人回覆並提供 30 天 PoC 試營運額度。
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-zinc-500">載入中...</p>}>
          <EnterpriseInquiryForm />
        </Suspense>
      </div>
      <section className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">常見問題</h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="font-medium">白標版授權費怎麼計算？</dt>
            <dd className="mt-1 text-zinc-600 dark:text-zinc-400">
              基本授權 NT$ 4,999/月，每超過 100 終端用戶加收 NT$ 500/月。源碼授權另議。
            </dd>
          </div>
          <div>
            <dt className="font-medium">支援哪些金流？</dt>
            <dd className="mt-1 text-zinc-600 dark:text-zinc-400">
              台灣：綠界 ECPay（信用卡 / WebATM / 超商）；國際：Stripe（信用卡訂閱、Apple/Google Pay）。
            </dd>
          </div>
          <div>
            <dt className="font-medium">資料儲存在哪裡？</dt>
            <dd className="mt-1 text-zinc-600 dark:text-zinc-400">
              預設 Vercel + Neon（台灣節點），企業客戶可選擇 GCP 台北 / AWS 東京 / 自架 Postgres。
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
