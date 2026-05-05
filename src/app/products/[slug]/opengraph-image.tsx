import { ImageResponse } from "next/og";
import { getProduct, PRODUCTS } from "@/lib/products";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT_TO_GRADIENT: Record<string, [string, string, string]> = {
  blue: ["#0c1428", "#1e3a8a", "#3b82f6"],
  rose: ["#0c1428", "#831843", "#f43f5e"],
  indigo: ["#0c1428", "#312e81", "#6366f1"],
  emerald: ["#0c1428", "#064e3b", "#10b981"],
  amber: ["#0c1428", "#78350f", "#f59e0b"],
  violet: ["#0c1428", "#4c1d95", "#8b5cf6"],
};

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return new ImageResponse(<div>Product Not Found</div>, size);
  }

  const [c1, c2, c3] = ACCENT_TO_GRADIENT[product.accent] ?? ACCENT_TO_GRADIENT.blue;

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
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
          color: "#fff",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.9 }}
        >
          <div style={{ fontSize: 28, fontWeight: 700 }}>AIBizHub TW</div>
          <span style={{ fontSize: 18, opacity: 0.7 }}>· 產品介紹</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 160, lineHeight: 1 }}>{product.emoji}</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.1 }}>
            {product.name}
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.92,
              maxWidth: 1000,
              lineHeight: 1.3,
            }}
          >
            {product.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
          }}
        >
          <span style={{ opacity: 0.85 }}>適合：{product.audience}</span>
          <span style={{ fontWeight: 700 }}>
            {product.plans[product.plans.length - 1].price}
            <span style={{ fontSize: 18, opacity: 0.7, marginLeft: 8 }}>
              {product.plans[product.plans.length - 1].cadence === "month"
                ? "/ 月"
                : product.plans[product.plans.length - 1].cadence === "once"
                  ? "/ 份"
                  : ""}
            </span>
          </span>
        </div>
      </div>
    ),
    size
  );
}
