"use server";

import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

export type InquiryState = {
  ok?: boolean;
  error?: string;
  referenceId?: string;
};

type EnterpriseInquiryRecord = {
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

const STORAGE_PATH =
  process.env.AIBIZHUB_INQUIRY_LOG ?? path.join(process.cwd(), ".local", "enterprise-inquiries.jsonl");

async function persistInquiry(record: EnterpriseInquiryRecord): Promise<void> {
  await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
  await fs.appendFile(STORAGE_PATH, JSON.stringify(record) + "\n", "utf8");
}

async function notifyTelegram(record: EnterpriseInquiryRecord): Promise<void> {
  const token = process.env.AIBIZHUB_NOTIFY_TG_TOKEN;
  const chatId = process.env.AIBIZHUB_NOTIFY_TG_CHAT;
  if (!token || !chatId) return;

  const text = [
    "🆕 *AIBizHub 企業洽詢*",
    `🏢 ${record.company}`,
    `👤 ${record.contactName} (${record.email})`,
    record.phone ? `📞 ${record.phone}` : null,
    `🏷 ${record.industry} / 規模 ${record.userScale}`,
    record.bundle ? `📦 套裝：${record.bundle}` : null,
    record.products.length > 0 ? `🛠 工具：${record.products.join(", ")}` : null,
    record.message ? `📝 ${record.message.slice(0, 200)}` : null,
    record.referralCode ? `🤝 介紹碼：${record.referralCode}` : null,
    `🆔 ${record.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });
  } catch {
    // notification is best-effort; persistence is the source of truth
  }
}

export async function submitEnterpriseInquiry(
  _prev: InquiryState | undefined,
  formData: FormData
): Promise<InquiryState> {
  const company = (formData.get("company") as string | null)?.trim() ?? "";
  const contactName = (formData.get("contactName") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const messenger = (formData.get("messenger") as string | null)?.trim() ?? "";
  const industry = (formData.get("industry") as string | null)?.trim() ?? "";
  const userScale = (formData.get("userScale") as string | null)?.trim() ?? "";
  const bundle = (formData.get("bundle") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";
  const products = formData.getAll("products").map((v) => String(v));

  if (!company || !contactName || !email) {
    return { error: "公司名稱、聯絡人、Email 為必填欄位" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Email 格式不正確" };
  }
  if (!industry || !userScale) {
    return { error: "請選擇產業與規模" };
  }

  const referralCode = (await cookies()).get("aib_ref")?.value ?? null;

  const referenceId = "AIB-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const record: EnterpriseInquiryRecord = {
    id: referenceId,
    company,
    contactName,
    email,
    phone: phone || null,
    messenger: messenger || null,
    industry,
    products,
    bundle: bundle || null,
    userScale,
    message: message || null,
    referralCode,
    createdAt: new Date().toISOString(),
  };

  try {
    await persistInquiry(record);
  } catch (e) {
    console.error("[aibizhub] persist failed", e);
    return { error: "暫時無法儲存洽詢資料，請稍後再試或來信 contact@aibizhub.tw" };
  }

  // Best-effort notification (Telegram). Doesn't block success path.
  notifyTelegram(record).catch(() => {});

  return { ok: true, referenceId };
}
