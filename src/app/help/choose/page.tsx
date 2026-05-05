import Link from "next/link";
import { Suspense } from "react";
import ChooseWizard from "./ChooseWizard";

export const metadata = {
  title: "如何選擇方案 | AIBizHub TW",
  description: "依產業 + 規模 + 需求三個問題，幫您挑出最划算的工具組合。",
};

export default function ChoosePlanPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← 回首頁
      </Link>
      <h1 className="mt-6 text-3xl font-bold">挑出最適合的方案</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        回答 3 個問題，60 秒內拿到推薦工具組合與預估月費。
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-sm text-zinc-500">載入中...</p>}>
          <ChooseWizard />
        </Suspense>
      </div>
    </main>
  );
}
