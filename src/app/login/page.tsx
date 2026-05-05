import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";

export const metadata = {
  title: "登入 | AIBizHub TW",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/dashboard";
  if (session?.user) redirect(callbackUrl);

  const googleEnabled = !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const demoEnabled = process.env.AIBIZHUB_DEMO_LOGIN !== "0";

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← 回首頁
      </Link>
      <h1 className="mt-6 text-3xl font-bold">登入 AIBizHub</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        登入後可進入儀表板，整合管理您訂閱的所有工具。
      </p>

      {params.error && (
        <div className="mt-6 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          登入失敗：{params.error}
        </div>
      )}

      <div className="mt-8 space-y-3">
        {googleEnabled && (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <span className="font-bold">G</span>
              使用 Google 登入
            </button>
          </form>
        )}
        {!googleEnabled && (
          <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            Google 登入尚未設定（管理員請設定 AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET）。
          </p>
        )}

        {demoEnabled && (
          <>
            <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              <span>或使用 Demo 帳號</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <form
              action={async (formData: FormData) => {
                "use server";
                await signIn("demo", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: callbackUrl,
                });
              }}
              className="space-y-3"
            >
              <input
                type="email"
                name="email"
                placeholder="任意 email（demo 用）"
                required
                className="block w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <input
                type="password"
                name="password"
                placeholder='密碼輸入 "demo"'
                required
                className="block w-full rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
              >
                Demo 登入
              </button>
              <p className="text-xs text-zinc-400">
                Demo 模式僅展示用，所有資料於 session 結束後會清空。正式上線請設定 Google OAuth。
              </p>
            </form>
          </>
        )}

        {!googleEnabled && !demoEnabled && (
          <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            目前沒有任何登入方式可用。請聯絡管理員。
          </p>
        )}
      </div>
    </main>
  );
}
