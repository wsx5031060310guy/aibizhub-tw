# AIBizHub TW · 全方位 AI 商業整合平台

> 台灣中小企業專用的 AI 商業工具入口：報價、簽約、CRM、預約、訂房、投資自動化 ── 6 個獨立工具，一個帳號。

## 專案簡介

AIBizHub TW 是整個產品組合的**入口與導購站台（hub）**。它本身不重複實作各工具的功能，而是負責統一的形象展示、定價說明、企業洽詢收單、介紹分潤與後台管理；6 個實際工具（報價單、預約系統、合約電子簽署、迷你 CRM、民宿訂房、投資日記）各自獨立部署、由本站的產品型錄（`src/lib/products.ts`）串接與導流。

技術上採 Next.js 16 App Router + React 19 + Auth.js v5，洽詢資料目前以 JSONL 檔案（`.local/`）落地，並提供對外的 inquiries API、健康檢查、以及透過 Smart Router 的洽詢自動分類，後續可平滑換成資料庫（程式碼註解已標示遷移點）。

## 核心功能

依實際路由與程式碼：

- **產品型錄與導購**（`/`、`/products`、`/products/[slug]`）：展示 6 個工具的定位、受眾、功能亮點、技術棧與方案價格，並導向各工具的 live / GitHub 連結。
- **方案與套組定價**（`/pricing`）：單品方案與 4 種組合包（接案者 / 美業 / 民宿 / 企業全方位），資料源同樣來自 `products.ts`。
- **選工具精靈**（`/help/choose`）：互動式 wizard，協助訪客挑選適合的工具或套組。
- **企業洽詢收單**（`/enterprise`）：Server Action（`actions.ts`）驗證必填欄位、產生 `AIB-XXXX` 參考碼、落地成 JSONL，並（best-effort）推送 Telegram 通知。
- **對外 Inquiries API**（`POST /api/inquiries`）：供 chatbot / 嵌入式 widget / 聯盟夥伴程式化送單；支援 `Authorization: Bearer` API key（未設定時開放但以 IP 限流 30 次/小時）。`GET` 會回傳欄位與認證規格。
- **洽詢自動分類**（`POST /api/inquiry-triage`）：透過 Smart Router 免費 tier 將來訊分類成 `sales/partner/support/spam/other` 並給出緊急度與建議回覆。
- **登入與權限**（`/login`、Auth.js v5）：Google OAuth（憑證存在時才註冊）+ Demo 登入（任意 email、密碼 `demo`，可用 `AIBIZHUB_DEMO_LOGIN=0` 關閉）；`/dashboard` 路徑受保護。
- **介紹分潤後台**（`/dashboard/partner`）：每位登入者由 user id 雜湊出一組穩定的 8 碼介紹碼，訪客帶 `?ref=CODE` 進站後寫入 90 天 cookie（`src/proxy.ts`），成交時歸戶。
- **管理後台**（`/admin/inquiries`）：以 `AIBIZHUB_ADMIN_EMAILS` 白名單控管，檢視所有企業洽詢。
- **健康檢查**（`GET /api/health`）：回報 auth / 通知 / API 設定狀態與洽詢、夥伴筆數，供 uptime 監控，不洩漏密鑰。

### 串接的 6 個工具

| 工具 | 定位 | 狀態 |
|---|---|---|
| QuoteKit TW | 5 分鐘出專業報價單，PDF 自動生成 | live |
| BeautySchedule TW | 美業／教練預約系統，自助排程＋提醒 | live |
| DocGen TW | 合約／NDA 產生＋兩造電子簽署 | beta |
| TinyCRM TW | 打開就會用的迷你 CRM | beta |
| StayMini | 輕量民宿／短租訂房，雙重訂房阻擋 | beta |
| Crypto Diary | 投資日記＋自動化機器人 | live |

## 技術棧

來自 `package.json`：

- **框架**：Next.js 16.2.4（App Router）
- **UI**：React 19.2.4 / React DOM 19.2.4
- **認證**：next-auth（Auth.js）v5 beta，JWT session
- **樣式**：Tailwind CSS v4（`@tailwindcss/postcss`）
- **語言／工具**：TypeScript 5、ESLint 9（`eslint-config-next`）
- **字型**：`next/font` 載入 Geist / Geist Mono
- **資料落地**：Node `fs`（JSONL 檔，`.local/`）；註解已標示未來改用 Prisma 的遷移點
- **AI 串接**：自架 Smart Router（OpenAI 相容 `/v1/chat/completions`）

> 本站僅是 hub，型錄中列出的 Prisma / PostgreSQL / Supabase / Streamlit 等為**各別工具**的技術棧，非本 repo 依賴。

## 目錄結構

```
src/
├── auth.ts                       # Auth.js v5 設定（Google + Demo provider）
├── proxy.ts                      # ?ref= 介紹碼 → 90 天 cookie
├── app/
│   ├── layout.tsx                # 全站 layout / metadata / Nav / FloatingCta
│   ├── page.tsx                  # 首頁
│   ├── products/                 # 產品型錄、[slug] 動態頁、OG image
│   ├── pricing/ about/ login/    # 定價、關於、登入
│   ├── enterprise/               # 企業洽詢表單 + Server Action
│   ├── help/choose/              # 選工具精靈 wizard
│   ├── dashboard/                # 受保護儀表板 + partner/ 分潤後台
│   ├── admin/inquiries/          # 管理後台（email 白名單）
│   └── api/
│       ├── auth/[...nextauth]/   # Auth.js handler
│       ├── inquiries/            # 對外送單 API（key + 限流）
│       ├── inquiry-triage/       # LLM 洽詢分類
│       └── health/               # 健康檢查
├── components/                   # Nav, FloatingCta
└── lib/
    ├── products.ts               # 產品 / 套組型錄（單一資料源）
    ├── partner.ts                # 介紹碼產生與登錄
    └── router-client.ts          # Smart Router LLM client
```

## 本機開發

需求：Node.js（建議 20+）。依 `package.json` scripts：

```bash
# 安裝相依
npm install

# 啟動開發伺服器（http://localhost:3000）
npm run dev

# 正式建置 / 啟動
npm run build
npm run start

# Lint
npm run lint
```

未設定任何環境變數也能跑：Google OAuth 在無憑證時自動跳過，Demo 登入預設開啟，洽詢資料會寫入專案下的 `.local/`（已被 `.gitignore` 忽略）。

## 環境變數

本 repo 無 `.env.example`；以下由原始碼 `process.env.*` 實際掃出。全部皆為**選填**——缺漏時對應功能會優雅降級（停用該 provider、跳過通知、或落地到預設檔案路徑）。正式環境建議至少設定 `AUTH_SECRET` 與 Google OAuth。

| 變數 | 說明 | 備註 |
|---|---|---|
| `AUTH_SECRET` | Auth.js JWT 簽章密鑰 | 正式環境**強烈建議**設定 |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | 與 secret 同時存在才註冊 Google 登入 |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | 同上 |
| `AIBIZHUB_DEMO_LOGIN` | 設 `0` 關閉 Demo 登入 | 預設開啟（密碼 `demo`） |
| `AIBIZHUB_ADMIN_EMAILS` | 可進 `/admin/inquiries` 的 email（逗號分隔） | 預設 `wsx5031060310guy@gmail.com` |
| `AIBIZHUB_NOTIFY_TG_TOKEN` | Telegram Bot token（洽詢通知） | 與 chat 同時設定才推播 |
| `AIBIZHUB_NOTIFY_TG_CHAT` | Telegram chat id | 同上 |
| `AIBIZHUB_INQUIRY_API_KEYS` | `/api/inquiries` 允許的 API key（逗號分隔） | 留空＝開放但限流 30/hr/IP |
| `AIBIZHUB_INQUIRY_LOG` | 洽詢 JSONL 落地路徑 | 預設 `.local/enterprise-inquiries.jsonl` |
| `AIBIZHUB_PARTNER_LOG` | 介紹碼登錄 JSONL 路徑 | 預設 `.local/partner-registry.jsonl` |
| `AIBIZHUB_PARTNER_SECRET` | 介紹碼雜湊用 salt | 未設則回退 `AUTH_SECRET` |
| `SMART_ROUTER_URL` | Smart Router base URL | 預設 `http://127.0.0.1:8765` |
| `NEXT_PUBLIC_SITE_URL` | 站台對外網址 | 用於產生絕對連結 |

## 部署（Vercel）

最簡單的方式是部署到 [Vercel](https://vercel.com/new)：

1. 於 Vercel 匯入此 GitHub repo，框架會自動辨識為 Next.js。
2. 在 **Settings → Environment Variables** 依需求設定上表變數（正式環境至少 `AUTH_SECRET` 與 Google OAuth；如要 Telegram 通知再加兩個 TG 變數）。
3. 設定 `NEXT_PUBLIC_SITE_URL` 為正式網域，確保 OG image 與絕對連結正確。
4. Deploy 後可呼叫 `GET /api/health` 確認 auth / 通知 / API 的設定狀態。

> 注意：洽詢與介紹碼目前以本機 JSONL 檔落地，Vercel 等 serverless 環境的檔案系統為**短暫且不共享**。正式上線前建議將 `lib/partner.ts`、`enterprise/actions.ts`、`api/inquiries` 的儲存層改接資料庫（程式碼註解已標示 Prisma 遷移點），或將 `AIBIZHUB_*_LOG` 指向持久化儲存。

## 授權

本專案為私有專案，未隨附 LICENSE 檔案。All rights reserved.
