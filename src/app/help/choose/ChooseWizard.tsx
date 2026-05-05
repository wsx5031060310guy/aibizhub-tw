"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, BUNDLES } from "@/lib/products";

type Industry =
  | "freelancer"
  | "beauty"
  | "host"
  | "law"
  | "saas-reseller"
  | "startup"
  | "other";
type Scale = "solo" | "small" | "medium" | "large";
type Need = "quote" | "contract" | "crm" | "booking" | "stay" | "all";

type Recommendation = {
  bundleSlug?: string;
  productSlugs: string[];
  reason: string;
  monthlyEstimate: number;
};

const INDUSTRY_OPTIONS: { value: Industry; label: string; emoji: string }[] = [
  { value: "freelancer", label: "自由接案 / 設計工作室", emoji: "🎨" },
  { value: "beauty", label: "美業 / 健身 / 教練", emoji: "💇" },
  { value: "host", label: "民宿 / 短租 / 旅宿", emoji: "🏡" },
  { value: "law", label: "律師 / 會計師事務所", emoji: "⚖️" },
  { value: "saas-reseller", label: "SaaS 經銷 / 連鎖加盟", emoji: "🏢" },
  { value: "startup", label: "新創 / 顧問公司", emoji: "🚀" },
  { value: "other", label: "其他 / 我想自由組合", emoji: "🧩" },
];

const SCALE_OPTIONS: { value: Scale; label: string }[] = [
  { value: "solo", label: "個人 (1 人)" },
  { value: "small", label: "小型 (2-10 人)" },
  { value: "medium", label: "中型 (11-50 人)" },
  { value: "large", label: "大型 (50+ 人，含加盟)" },
];

const NEED_OPTIONS: { value: Need; label: string }[] = [
  { value: "quote", label: "報價" },
  { value: "contract", label: "合約 / 簽約" },
  { value: "crm", label: "客戶管理" },
  { value: "booking", label: "預約排程" },
  { value: "stay", label: "訂房 / 短租" },
  { value: "all", label: "整套都需要" },
];

function recommend(industry: Industry, scale: Scale, needs: Need[]): Recommendation {
  // Large or chain → enterprise bundle regardless
  if (scale === "large" || industry === "saas-reseller") {
    return {
      bundleSlug: "enterprise",
      productSlugs: ["quotekit", "docgen", "tinycrm", "beautyschedule", "staymini"],
      reason: "大型團隊或 SaaS 經銷商，建議直接用企業全方位套組獲得白標 + 優先客服。",
      monthlyEstimate: 4999,
    };
  }
  // Industry-led primary recommendation
  if (industry === "beauty") {
    return {
      bundleSlug: "beauty",
      productSlugs: ["beautyschedule", "tinycrm", "docgen"],
      reason: "美業老闆首選：預約系統 + 客戶 CRM + 服務同意書三件一起導入。",
      monthlyEstimate: 1599,
    };
  }
  if (industry === "host") {
    return {
      bundleSlug: "host",
      productSlugs: ["staymini", "docgen", "tinycrm"],
      reason: "民宿主套組：訂房系統 + 入住合約 + 房客 CRM。",
      monthlyEstimate: 1499,
    };
  }
  if (industry === "freelancer" || industry === "startup") {
    return {
      bundleSlug: "freelancer",
      productSlugs: ["quotekit", "docgen", "tinycrm"],
      reason: "接案者 / 新創顧問：報價 → 簽約 → 客戶管理一條龍，比單買省 NT$ 248/月。",
      monthlyEstimate: 549,
    };
  }
  // Need-led for law/other
  const slugs: string[] = [];
  if (needs.includes("quote") || needs.includes("all")) slugs.push("quotekit");
  if (needs.includes("contract") || needs.includes("all")) slugs.push("docgen");
  if (needs.includes("crm") || needs.includes("all")) slugs.push("tinycrm");
  if (needs.includes("booking") || needs.includes("all")) slugs.push("beautyschedule");
  if (needs.includes("stay") || needs.includes("all")) slugs.push("staymini");
  if (slugs.length === 0) slugs.push("docgen", "tinycrm");

  // sum recommended-tier prices
  const monthlyEstimate = slugs.reduce((sum, slug) => {
    const p = PRODUCTS.find((x) => x.slug === slug);
    if (!p) return sum;
    const top = p.plans[p.plans.length - 1];
    if (top.cadence !== "month") return sum;
    const price = parseInt(top.price.replace(/[^\d]/g, ""), 10);
    return sum + (Number.isFinite(price) ? price : 0);
  }, 0);

  return {
    productSlugs: slugs,
    reason: `依您勾選的需求自由組合 ${slugs.length} 個工具。如想要套裝優惠可改選預設套裝。`,
    monthlyEstimate,
  };
}

export default function ChooseWizard() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [scale, setScale] = useState<Scale | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);

  const recommendation =
    step === 3 && industry && scale ? recommend(industry, scale, needs) : null;

  return (
    <div>
      <ProgressBar step={step} />

      {step === 0 && (
        <Step title="您是哪種類型的客戶？">
          <div className="grid gap-3 sm:grid-cols-2">
            {INDUSTRY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setIndustry(opt.value);
                  setStep(1);
                }}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </Step>
      )}

      {step === 1 && (
        <Step title="團隊規模？">
          <div className="grid gap-3 sm:grid-cols-2">
            {SCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setScale(opt.value);
                  setStep(2);
                }}
                className="rounded-xl border border-zinc-200 bg-white p-4 text-left transition hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title="主要需求是什麼？（可複選）">
          <div className="grid gap-2 sm:grid-cols-2">
            {NEED_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 transition hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <input
                  type="checkbox"
                  checked={needs.includes(opt.value)}
                  onChange={(e) => {
                    setNeeds(
                      e.target.checked
                        ? [...needs, opt.value]
                        : needs.filter((n) => n !== opt.value)
                    );
                  }}
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            查看推薦 →
          </button>
        </Step>
      )}

      {step === 3 && recommendation && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-500 bg-blue-50 p-6 dark:bg-blue-950/30">
            <h3 className="text-lg font-bold">推薦方案</h3>
            <p className="mt-2 text-sm">{recommendation.reason}</p>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                NT$ {recommendation.monthlyEstimate.toLocaleString()}
              </span>
              <span className="text-sm text-zinc-500"> / 月</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recommendation.productSlugs.map((slug) => {
              const p = PRODUCTS.find((x) => x.slug === slug);
              if (!p) return null;
              return (
                <Link
                  key={slug}
                  href={`/products/${slug}`}
                  className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="font-medium">{p.name}</span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">{p.tagline}</p>
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={
                recommendation.bundleSlug
                  ? `/enterprise?bundle=${recommendation.bundleSlug}`
                  : `/enterprise?${recommendation.productSlugs.map((s) => `product=${s}`).join("&")}`
              }
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              送出洽詢，48 小時內聯絡
            </Link>
            <button
              onClick={() => {
                setStep(0);
                setIndustry(null);
                setScale(null);
                setNeeds([]);
              }}
              className="rounded-lg border border-zinc-300 px-6 py-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              重新挑選
            </button>
          </div>

          {!recommendation.bundleSlug && (
            <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
              💡 想省錢嗎？看看
              <Link href="/pricing" className="ml-1 underline">
                套裝方案
              </Link>
              ，組合購買通常比自由組合便宜 15-30%。
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center gap-2 text-xs text-zinc-500">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-1 items-center gap-2">
          <div
            className={`h-1.5 flex-1 rounded ${
              i <= step ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-800"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
