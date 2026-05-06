import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/router-client";

// POST /api/inquiry-triage
// Body: { name?: string, message: string }
// Returns: { category: string, urgency: 'low'|'medium'|'high', suggestedReply: string }
//
// Triages an incoming partner / customer inquiry into a routing label
// + a one-paragraph suggested reply. Uses Smart Router free tier so
// every inquiry can be auto-classified without paid quota.
export async function POST(req: NextRequest) {
  const { name, message } = (await req.json()) as { name?: string; message?: string };
  if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

  const system =
    "你是商業諮詢分類助手。讀完訊息後，用繁體中文回覆 JSON：" +
    '{"category":"sales|partner|support|spam|other","urgency":"low|medium|high","suggestedReply":"≤80字回覆"}。' +
    "只輸出 JSON。";

  try {
    const text = await chat(
      [
        { role: "system", content: system },
        { role: "user", content: `寄件人：${name || "(未填)"}\n訊息：${message}` },
      ],
      { tier: "free" }
    );
    const cleaned = text.replace(/```json|```/g, "").trim();
    let parsed: { category?: string; urgency?: string; suggestedReply?: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { category: "other", urgency: "low", suggestedReply: cleaned.slice(0, 80) };
    }
    return NextResponse.json({
      category: parsed.category || "other",
      urgency: parsed.urgency || "low",
      suggestedReply: parsed.suggestedReply || "",
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
