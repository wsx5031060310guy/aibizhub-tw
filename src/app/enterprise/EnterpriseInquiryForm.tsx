"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitEnterpriseInquiry, type InquiryState } from "./actions";
import { BUNDLES, PRODUCTS } from "@/lib/products";

export default function EnterpriseInquiryForm() {
  const params = useSearchParams();
  const presetBundle = params.get("bundle") ?? "";
  const presetProducts = params.getAll("product");

  const [state, formAction, pending] = useActionState<InquiryState | undefined, FormData>(
    submitEnterpriseInquiry,
    undefined
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-emerald-900">
        <h2 className="text-lg font-semibold">✓ 我們已收到您的洽詢</h2>
        <p className="mt-2 text-sm">
          參考編號：<span className="font-mono">{state.referenceId}</span>
        </p>
        <p className="mt-2 text-sm">
          專人會在 48 小時內透過您留下的 Email 與您聯繫。如有急件可加 LINE @aibizhub。
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="公司名稱" name="company" required />
        <Field label="聯絡人姓名" name="contactName" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="電話" name="phone" type="tel" />
      </div>

      <Field label="LINE / 通訊軟體 ID（選填）" name="messenger" />

      <div>
        <label className="block text-sm font-medium">產業 / 業務類型</label>
        <select
          name="industry"
          aria-label="產業 / 業務類型"
          className="mt-1 block w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          defaultValue=""
          required
        >
          <option value="" disabled>
            請選擇
          </option>
          <option>連鎖門市 / 加盟總部</option>
          <option>美業 / 健身 / 教育</option>
          <option>民宿 / 旅宿業</option>
          <option>律師 / 會計師事務所</option>
          <option>SaaS 經銷 / 顧問</option>
          <option>新創 / 接案者</option>
          <option>其他</option>
        </select>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">感興趣的工具（可複選）</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <label key={p.slug} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="products"
                value={p.slug}
                defaultChecked={presetProducts.includes(p.slug)}
                className="rounded"
              />
              <span>
                {p.emoji} {p.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="block text-sm font-medium">套裝方案（選填）</label>
        <select
          name="bundle"
          aria-label="套裝方案（選填）"
          defaultValue={presetBundle}
          className="mt-1 block w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">不選 / 自行組合</option>
          {BUNDLES.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name} (NT$ {b.monthlyPrice.toLocaleString()}/月)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">預估終端使用者數量</label>
        <select
          name="userScale"
          aria-label="預估終端使用者數量"
          defaultValue=""
          className="mt-1 block w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          required
        >
          <option value="" disabled>
            請選擇
          </option>
          <option>1-10 人</option>
          <option>11-50 人</option>
          <option>51-200 人</option>
          <option>201-1000 人</option>
          <option>1000+ 人</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">需求描述（選填）</label>
        <textarea
          name="message"
          rows={4}
          placeholder="例：我們有 5 間美髮分店，想統一導入預約系統 + 客戶 CRM，需要白標版。"
          className="mt-1 block w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      {state?.error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-zinc-400"
      >
        {pending ? "送出中..." : "送出洽詢"}
      </button>

      <p className="text-xs text-zinc-500">
        送出即同意我們依照隱私權政策處理您的資料。我們不會將資料轉售或用於行銷以外用途。
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-1 block w-full rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}
