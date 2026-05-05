"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDE_ON_PATHS = [
  "/login",
  "/dashboard",
  "/admin",
  "/enterprise",
  "/api",
];

/**
 * Floating "免費諮詢" CTA. Client component so we can read the current
 * pathname and skip routes where the button would be redundant or noisy
 * (auth flows, the inquiry form itself, admin/api surfaces).
 */
export default function FloatingCta() {
  const pathname = usePathname();
  if (HIDE_ON_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <Link
      href="/enterprise"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-xl shadow-blue-500/30 transition hover:bg-blue-700 hover:shadow-2xl"
      aria-label="開啟企業洽詢表單"
    >
      <span aria-hidden>💬</span>
      <span>免費諮詢</span>
    </Link>
  );
}
