import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Public inquiries API. Lets external partners (chatbots, embedded widgets,
 * affiliate sites) submit a lead programmatically. Same persistence and
 * notification path as the on-site /enterprise form so leads end up in the
 * same admin dashboard regardless of source.
 *
 * Authentication: optional API key via `Authorization: Bearer <key>` header
 * matched against AIBIZHUB_INQUIRY_API_KEYS (comma-separated). When the env
 * is empty the endpoint accepts unauthenticated POSTs but rate-limits by IP
 * to a generous default.
 */

const STORAGE_PATH =
  process.env.AIBIZHUB_INQUIRY_LOG ?? path.join(process.cwd(), ".local", "enterprise-inquiries.jsonl");

const API_KEYS = (process.env.AIBIZHUB_INQUIRY_API_KEYS ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

// In-memory rate limit: 30 inquiries/hour/IP. Survives only as long as the
// server stays up — fine for a public form, swap to Redis when scale calls.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const requestLog: Map<string, number[]> = (
  globalThis as unknown as { __aibInquiryRateLog?: Map<string, number[]> }
).__aibInquiryRateLog ?? new Map();
(globalThis as unknown as { __aibInquiryRateLog?: Map<string, number[]> }).__aibInquiryRateLog =
  requestLog;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

function checkApiKey(req: Request): { ok: true } | { ok: false; reason: string } {
  if (API_KEYS.length === 0) return { ok: true };
  const auth = req.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return { ok: false, reason: "Missing Authorization: Bearer header" };
  if (!API_KEYS.includes(match[1])) return { ok: false, reason: "Invalid API key" };
  return { ok: true };
}

type ExternalInquiryPayload = {
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  industry?: string;
  userScale?: string;
  bundle?: string;
  products?: string[];
  message?: string;
  referralCode?: string;
  source?: string; // e.g. "chatbot:linebot-1", "partner:agency-x"
};

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded (30/hr per IP)" },
      { status: 429 }
    );
  }

  const keyCheck = checkApiKey(req);
  if (!keyCheck.ok) {
    return NextResponse.json({ error: keyCheck.reason }, { status: 401 });
  }

  let body: ExternalInquiryPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const company = body.company?.trim();
  const contactName = body.contactName?.trim();
  const email = body.email?.trim();
  if (!company || !contactName || !email) {
    return NextResponse.json(
      { error: "company, contactName, email are required" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  const referenceId = "AIB-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const record = {
    id: referenceId,
    company,
    contactName,
    email,
    phone: body.phone?.trim() || null,
    messenger: null,
    industry: body.industry?.trim() || "via-api",
    products: Array.isArray(body.products) ? body.products : [],
    bundle: body.bundle?.trim() || null,
    userScale: body.userScale?.trim() || "unspecified",
    message: body.message?.trim() || null,
    referralCode: body.referralCode?.trim() || null,
    source: body.source?.trim() || "api",
    createdAt: new Date().toISOString(),
  };

  try {
    await fs.mkdir(path.dirname(STORAGE_PATH), { recursive: true });
    await fs.appendFile(STORAGE_PATH, JSON.stringify(record) + "\n", "utf8");
  } catch (e) {
    console.error("[aibizhub] api persist failed", e);
    return NextResponse.json(
      { error: "Could not persist inquiry, please retry" },
      { status: 503 }
    );
  }

  // Best-effort Telegram notify
  const tgToken = process.env.AIBIZHUB_NOTIFY_TG_TOKEN;
  const tgChat = process.env.AIBIZHUB_NOTIFY_TG_CHAT;
  if (tgToken && tgChat) {
    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tgChat,
        text: `🔌 *AIBizHub API 洽詢*\n🏢 ${record.company}\n👤 ${record.contactName} (${record.email})\n📡 來源：${record.source}\n${record.referralCode ? `🤝 ${record.referralCode}\n` : ""}🆔 ${record.id}`,
        parse_mode: "Markdown",
      }),
    }).catch(() => {});
  }

  return NextResponse.json(
    {
      ok: true,
      referenceId,
      message: "我們已收到您的洽詢，48 小時內專人聯絡。",
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/inquiries",
    contentType: "application/json",
    requiredFields: ["company", "contactName", "email"],
    optionalFields: [
      "phone",
      "industry",
      "userScale",
      "bundle",
      "products",
      "message",
      "referralCode",
      "source",
    ],
    auth: API_KEYS.length > 0 ? "Bearer token (set in AIBIZHUB_INQUIRY_API_KEYS)" : "open (rate-limited 30/hr/IP)",
    rateLimit: `${RATE_LIMIT} requests / hour / IP`,
  });
}
