import Link from "next/link";
import { auth } from "@/auth";

export default async function Nav() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            AIBizHub
          </span>
          <span className="text-xs font-medium text-zinc-400">TW</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <Link
            href="/products"
            className="hidden rounded px-3 py-1.5 hover:bg-zinc-100 sm:inline-block dark:hover:bg-zinc-900"
          >
            產品
          </Link>
          <Link
            href="/pricing"
            className="hidden rounded px-3 py-1.5 hover:bg-zinc-100 sm:inline-block dark:hover:bg-zinc-900"
          >
            定價
          </Link>
          <Link
            href="/enterprise"
            className="hidden rounded px-3 py-1.5 hover:bg-zinc-100 sm:inline-block dark:hover:bg-zinc-900"
          >
            企業
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="ml-2 rounded-lg bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
            >
              儀表板
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-lg bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
            >
              登入
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
