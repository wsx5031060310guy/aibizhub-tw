import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aibizhub.tw";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/enterprise`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/help/choose`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticRoutes, ...productRoutes];
}
