import Link from "next/link";
import { COMPANY } from "@/lib/company";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-zinc-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>
            © 2026 AIBizHub TW · {COMPANY.name} ·{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {COMPANY.email}
            </a>
          </span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              首頁
            </Link>
            <Link href="/enterprise" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              企業洽詢
            </Link>
            <a
              href="https://github.com/wsx5031060310guy"
              target="_blank"
              rel="noopener"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="mt-4 text-xs text-zinc-400">
          {COMPANY.phone} · {COMPANY.address}
        </div>
      </div>
    </footer>
  );
}
