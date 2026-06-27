# 操作與業務流程

## 流程 1：產品探索到企業洽詢

```mermaid
flowchart TD
  A["訪客進入 /"] --> B["src/app/page.tsx<br/>Hero / ProductGrid / BundleSection"]
  B --> C["/products<br/>所有產品"]
  C --> D["/products/[slug]<br/>產品詳情"]
  B --> E["/pricing<br/>單品與套裝方案"]
  D --> F["/enterprise?product=slug"]
  E --> G["/enterprise?bundle=slug"]
  F --> H["EnterpriseInquiryForm<br/>預填 product checkbox"]
  G --> H
```

`src/lib/products.ts` 是首頁、產品頁、定價頁與企業洽詢預填選項的共同資料來源。`/products/[slug]` 只接受 `PRODUCTS` 內的 slug；找不到時呼叫 `notFound()`。

## 流程 2：站內企業洽詢收單

```mermaid
sequenceDiagram
  participant User as 訪客
  participant Page as /enterprise
  participant Form as EnterpriseInquiryForm
  participant Action as submitEnterpriseInquiry
  participant Cookie as aib_ref cookie
  participant File as AIBIZHUB_INQUIRY_LOG JSONL
  participant TG as Telegram Bot API

  User->>Page: 開啟企業洽詢頁
  Page->>Form: render form, 讀取 query product/bundle
  User->>Form: 填寫 company/contactName/email/industry/userScale
  Form->>Action: useActionState submit FormData
  Action->>Action: 驗證必填欄位與 email 格式
  Action->>Cookie: 讀取 referralCode
  Action->>Action: 產生 AIB-XXXXXXXX referenceId
  Action->>File: append EnterpriseInquiryRecord
  Action-->>TG: best-effort sendMessage
  Action-->>Form: ok + referenceId
  Form-->>User: 顯示收件成功與參考編號
```

必填欄位為公司名稱、聯絡人、Email、產業與使用者規模。Telegram 通知失敗不會阻擋成功路徑，JSONL 檔案才是此流程的主要資料來源。

## 流程 3：外部送單 API

```mermaid
sequenceDiagram
  participant Ext as 外部系統
  participant API as POST /api/inquiries
  participant Rate as in-memory rate limit
  participant Key as AIBIZHUB_INQUIRY_API_KEYS
  participant File as AIBIZHUB_INQUIRY_LOG JSONL
  participant TG as Telegram Bot API

  Ext->>API: JSON body + optional Authorization Bearer
  API->>Rate: 依 x-forwarded-for 檢查 30/hr/IP
  API->>Key: 若有設定 API keys，驗證 Bearer token
  API->>API: parse JSON + 驗證 company/contactName/email
  API->>API: 補預設 industry=userScale/source
  API->>File: append record
  API-->>TG: best-effort API 洽詢通知
  API-->>Ext: 201 ok + referenceId
```

`GET /api/inquiries` 會回傳欄位規格、認證狀態與 rate limit 說明。若 `AIBIZHUB_INQUIRY_API_KEYS` 未設定，POST 仍開放，但會用 process-global in-memory Map 做 IP 限流。

## 流程 4：登入與儀表板

```mermaid
flowchart TD
  A["使用者開啟 /login"] --> B{"已有 session?"}
  B -- yes --> C["redirect callbackUrl<br/>預設 /dashboard"]
  B -- no --> D{"Google OAuth env 存在?"}
  D -- yes --> E["signIn('google')"]
  D -- no --> F["顯示 Google 未設定提示"]
  A --> G{"AIBIZHUB_DEMO_LOGIN != 0?"}
  G -- yes --> H["signIn('demo')<br/>email 任意，password=demo"]
  E --> I["Auth.js JWT session"]
  H --> I
  I --> J["/dashboard"]
  J --> K["getOrIssuePartnerCode"]
  K --> L["AIBIZHUB_PARTNER_LOG JSONL"]
  J --> M["顯示產品入口 / 訂閱狀態 / 介紹連結"]
```

`/dashboard` 與 `/dashboard/partner` 會在頁面內呼叫 `auth()`，沒有 session 時導向對應的 `/login?callbackUrl=...`。`src/auth.ts` 的 `authorized` callback 也以 `/dashboard` 為 protected path 判定；`/admin/inquiries` 則在頁面內另做登入與 email 白名單檢查。

## 流程 5：介紹碼歸因與夥伴後台

```mermaid
sequenceDiagram
  participant Partner as 登入夥伴
  participant Dash as /dashboard/partner
  participant Lib as src/lib/partner.ts
  participant Registry as AIBIZHUB_PARTNER_LOG JSONL
  participant Visitor as 訪客
  participant Proxy as src/proxy.ts
  participant Inquiry as submitEnterpriseInquiry
  participant Leads as AIBIZHUB_INQUIRY_LOG JSONL

  Partner->>Dash: 開啟介紹分潤後台
  Dash->>Lib: getOrIssuePartnerCode(userId,email)
  Lib->>Registry: 若尚未註冊則 append code/userId/email
  Dash-->>Partner: 顯示 /?ref=CODE 分享連結
  Visitor->>Proxy: 進站 URL 含 ?ref=CODE
  Proxy-->>Visitor: 設定 aib_ref httpOnly cookie, 90 天
  Visitor->>Inquiry: 在 /enterprise 送出表單
  Inquiry->>Leads: append referralCode=CODE
  Partner->>Dash: 查看 referralCode 符合 CODE 的 leads
```

介紹碼由 `userId` 與 `AIBIZHUB_PARTNER_SECRET` / `AUTH_SECRET` 以 HMAC 產生 8 碼字串。歸因目前靠 cookie 與 JSONL 查詢，沒有付款或佣金自動撥款實作。

## 流程 6：洽詢自動分類

```mermaid
sequenceDiagram
  participant Client as 呼叫端
  participant API as POST /api/inquiry-triage
  participant Chat as src/lib/router-client.ts
  participant Router as SMART_ROUTER_URL

  Client->>API: { name?, message }
  API->>API: message required 檢查
  API->>Chat: chat(system,user), tier=free
  Chat->>Router: GET /route?tier=free
  Router-->>Chat: model
  Chat->>Router: POST /v1/chat/completions
  Router-->>Chat: assistant text
  Chat-->>API: text
  API->>API: JSON parse，失敗則 fallback other/low
  API-->>Client: category + urgency + suggestedReply
```

此流程只做分類與建議回覆，不會寫入 inquiry JSONL。Smart Router 失敗時 API 回傳 `502` 與錯誤訊息。
