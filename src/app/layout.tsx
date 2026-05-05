import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import FloatingCta from "@/components/FloatingCta";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIBizHub TW · 全方位 AI 商業整合平台",
  description:
    "台灣中小企業專用 AI 商業工具：報價、簽約、CRM、預約、訂房、投資自動化 ── 6 個獨立工具一個帳號。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Nav />
        <div className="flex-1">{children}</div>
        <FloatingCta />
      </body>
    </html>
  );
}
