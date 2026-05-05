import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "AIBizHub TW · 全方位 AI 商業整合平台";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c1428 100%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              background:
                "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AIBizHub
          </div>
          <span style={{ fontSize: 22, color: "#94a3b8", fontWeight: 600 }}>
            TW
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            台灣中小企業
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
              background: "linear-gradient(90deg, #60a5fa 0%, #c084fc 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            一站式 AI 商業工具
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 28,
          }}
        >
          <span>📋 報價</span>
          <span>📑 簽約</span>
          <span>📇 CRM</span>
          <span>💇 預約</span>
          <span>🏡 訂房</span>
          <span>📈 投資</span>
        </div>
      </div>
    ),
    size
  );
}
