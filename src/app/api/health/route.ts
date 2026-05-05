import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Lightweight health check for uptime monitoring (e.g. Mike's daily
 * web-perf-audit cron). Reports basic environment status without leaking
 * secrets — auth providers configured (yes/no), recent inquiry count,
 * partner registry size, build timestamp.
 */

const INQUIRY_PATH =
  process.env.AIBIZHUB_INQUIRY_LOG ??
  path.join(process.cwd(), ".local", "enterprise-inquiries.jsonl");
const PARTNER_PATH =
  process.env.AIBIZHUB_PARTNER_LOG ??
  path.join(process.cwd(), ".local", "partner-registry.jsonl");

async function fileLineCount(p: string): Promise<number> {
  try {
    const raw = await fs.readFile(p, "utf8");
    return raw.split("\n").filter((l) => l.trim() !== "").length;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return 0;
    return -1;
  }
}

export async function GET() {
  const [inquiryCount, partnerCount] = await Promise.all([
    fileLineCount(INQUIRY_PATH),
    fileLineCount(PARTNER_PATH),
  ]);

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    auth: {
      googleConfigured: !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
      demoEnabled: process.env.AIBIZHUB_DEMO_LOGIN !== "0",
      secretSet: !!process.env.AUTH_SECRET,
    },
    notifications: {
      telegramConfigured: !!(
        process.env.AIBIZHUB_NOTIFY_TG_TOKEN && process.env.AIBIZHUB_NOTIFY_TG_CHAT
      ),
    },
    api: {
      inquiriesEndpointSecured: (process.env.AIBIZHUB_INQUIRY_API_KEYS ?? "").trim().length > 0,
    },
    storage: {
      inquiryCount,
      partnerCount,
    },
    runtime: {
      node: process.version,
      uptimeSeconds: Math.round(process.uptime()),
    },
  });
}
