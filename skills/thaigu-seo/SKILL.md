---
name: thaigu-seo
description: >-
  泰谷 ThaiGu (thaikok.com) 專屬 SEO/AEO/GEO 與 Google Search Console (GSC) 官方 API 自動化運維技能。
  涵蓋澳門泰國菜關鍵字拓撲、花地瑪堂區地理精確校準、Schema.org 餐飲結構化與 AEO 問答佈局、
  GSC 服務帳號 API 診斷、Sitemap 自動提交與 IndexNow 全網推送標準指南。
---

# 泰谷 ThaiGu (thaikok.com) SEO / AEO / GEO 運維與自動化指南

本技能為後續 Agent 維護、擴展與優化 **澳門泰谷泰國餐廳（ThaiGu / thaikok.com）** 的專屬標準操作規範（SOP），集結了本站實體門店 NAP 規範、搜尋引擎演算法對接、結構化語意、AI 搜尋引擎（AEO）回答優化與 Google Search Console 官方 API 工具鏈。

---

## 🏛️ 1. 實體門店標準資料庫 (NAP & Entity Authority)

在進行任何 SEO、GEO 標籤、Schema.org 或社群資訊修改時，**必須絕對嚴格遵循以下官方 NAP 事實**，不得擅自修改：

| 欄位 | 官方標準值 | 說明 / 注意事項 |
| :--- | :--- | :--- |
| **品牌名稱 (Name)** | 泰谷 ThaiGu (House of Thai) | 簡稱：泰谷、ThaiGu、thaikok |
| **官方域名 (URL)** | `https://www.thaikok.com/` | 規範主網域，Cloudflare Pages 託管 |
| **官方電話 (Phone)** | `+853 2875 0222` / `+853 6865 8838` | 用於電話訂座與 NAP 校準 |
| **中文詳細地址** | 澳門東方明珠街海天居地下 AE 及 AF 號舖 | 位於澳門半島黑沙環東方明珠豪宅區 |
| **葡文/英文地址** | The Residencia, R/C, Lojas AE e AF, Rua da Pérola Oriental, Macau | 國際化 Schema 標準格式 |
| **行政分區 (GEO a1/a3)**| 澳門半島 (Macau Peninsula) / 花地瑪堂區 (Nossa Senhora de Fátima) | **嚴禁標記為氹仔或路氹 (Cotai)** |
| **精確經緯度 (GEO)** | 緯度 `22.2132`, 經度 `113.5552` | 海天居地下門店物理坐標 |
| **營業時間 (Hours)** | 每日 12:00–15:00 及 18:00–23:00 | 全週七天營業，無休 |
| **官方權威認證** | 1. 泰國皇家政府商務部 Thai SELECT 泰精選認證 (2025-2027)<br>2. 澳門特區政府經濟及科技發展局「專精特色店」<br>3. 澳門旅遊局「星級旅遊服務商戶獎」 | AEO 結構化最高權重依據 |

---

## ⚠️ 2. 鐵律與維護紅線 (Hardline Guardrails)

1. **嚴禁標記為路氹城（Cotai）或氹仔**：
   * 泰谷位於澳門半島北區（黑沙環海天居），靠近港珠澳大橋與關閘。若在 Meta、FAQ 或 Schema 寫成 Cotai 或氹仔，會直接被 Google 本地商家演算法判定為地理造假或降權。
2. **禁止添加非同步網頁訂位表單**：
   * 實體餐飲外場繁忙無暇輪詢查看郵件或後台，所有訂位入口一律採用大號顯眼的 `tel:+85328750222` 一鍵撥號即時確認。
3. **Title 與 H1 必須包含「澳門泰國菜」關鍵字**：
   * 搜尋引擎不會憑空關聯大詞。標題若只寫品牌名（如「泰谷」），在「澳門泰國菜」搜尋結果中永遠無法獲得排名。
   * 首頁標準 Title：`泰谷 ThaiGu | 澳門泰國菜推薦・正宗泰式料理・Thai SELECT 官方認證澳門特色店`。

---

## 🔍 3. Google Search Console 服務帳號 API 配置

本站已授權 Google Cloud 服務帳號作為 Search Console 的網域級完整使用者（`siteFullUser`）：
* **機器人 Email**：`thaikok@thaikok.iam.gserviceaccount.com`
* **憑證存放路徑**：`openseo/gsc-key.json`
* **GSC 站點識別碼**：`sc-domain:thaikok.com`

---

## 🛠️ 4. 自動化工具庫與快速指令 (Toolchain)

專案內置自動化腳本，位於 `skills/thaigu-seo/scripts/`（亦可在專案根目錄調用）：

### 4.1 全面診斷 GSC 搜尋表現與收錄狀態
此腳本透過 GSC 官方 API 拉取過去 28 天真實點擊、曝光、關鍵字排名與 Sitemap 狀態：
```bash
node skills/thaigu-seo/scripts/gsc-inspect.js
```

### 4.2 向 Google 提交最新 Sitemap
更新網頁或最後修改日期後，向 Google Search Console 提交即時重新整理：
```bash
node skills/thaigu-seo/scripts/submit-sitemap.js
```

### 4.3 批量推送全站 URL 至 IndexNow (Bing / Yandex)
透過 IndexNow 協議瞬時通知微軟 Bing、Yandex 等搜尋引擎蜘蛛：
```bash
node skills/thaigu-seo/scripts/push-indexnow.js
```

---

## 🤖 5. AEO (AI 搜尋引擎優化) 結構化語意標準

針對 Perplexity、ChatGPT Search、Google Gemini 等 AI 引擎，首頁必須維持以下高密度問答區塊（位於 `index.html` 中的 `FAQPage` JSON-LD）：

1. **澳門正宗泰國菜推介？**
   * 強調：獲泰國商務部 Thai SELECT 官方認證與澳門特色店，招牌粉絲蝦煲、冬陰功、海南雞飯與炭烤豬頸肉。
2. **泰谷位於澳門哪裡？**
   * 強調：澳門半島黑沙環東方明珠街海天居，鄰近港珠澳大橋口岸與關閘，有停車場及巴士站。
3. **營業時間與訂座電話？**
   * 強調：12:00–15:00 / 18:00–23:00，訂座致電 `+853 2875 0222`。

---

## 📋 6. 代碼變更後交付清單 (Deployment Checklist)

每次修改 SEO 相關代碼後，接手 Agent 必須完成以下閉環：
1. 檢查 `git status` 與 `git diff`，確認無多餘破壞性修改。
2. 將 `sitemap.xml` 中的 `<lastmod>` 更新為修改當日（格式：`YYYY-MM-DD`）。
3. 執行 `git commit` 並 `git push origin main` 觸發 Cloudflare Pages 自動構建。
4. 執行 `node skills/thaigu-seo/scripts/submit-sitemap.js` 向 Google 重新提交 Sitemap。
5. 執行 `node skills/thaigu-seo/scripts/push-indexnow.js` 推送 Bing / IndexNow。
6. 使用 `curl -sI https://www.thaikok.com/` 驗證線上響應是否正常（HTTP 200 OK）。

---

## 🔬 7. SEO + AEO + GEO 三軌 7 大指標量化評測體系 (Benchmark Laboratory SOP)

### 7.1 認知鐵律：禁止將「代碼生效」等同於「產生搜尋/AI效果」
接手 Agent 必須恪守科學嚴謹態度：
* **SEO**：工程落盤 ───────➔ 等候 Google/Bing 蜘蛛 Crawl & Index（需數天至數週）
* **AEO**：資產上線 ───────➔ 等候 AI Crawler 消化 `llms.txt` / 結構化語意並納入 Citation
* **GEO**：實體基石 ───────➔ 等候 AI Recommendation 實體錨定與地理防禦實證

### 7.2 固定的 25 題評測基準變數 (Controlled Variables)
所有評測嚴格鎖定受控環境，禁止在測試中任意修改題庫：
* **題庫路徑**：`benchmarks/geo-aeo-queries.json`（固定 25 題拓撲）
* **受測引擎**：ChatGPT Search, Perplexity, Google Gemini, Claude, Copilot
* **強制開關**：Web Search 必須保持 `ON`
* **受測語言**：繁體中文（`zh-HK`/`zh-TW`），英文題 `en-US`
* **地理位置**：鎖定澳門（Macau）本地環境
* **Prompt 模板**：採用客觀中立提問，嚴禁輸入引導性偏見

### 7.3 七大量化驗收指標 (The 7 Metrics)
| 編號 | 指標 | 驗證標準 |
| :--- | :--- | :--- |
| **M1** | **Entity Mention %** | AI 回答或推薦名單中是否提及「泰谷 / ThaiGu」 |
| **M2** | **Correct Association %** | 是否正確關聯為：泰谷 → 澳門泰國料理餐廳 → 黑沙環海天居（非路氹/氹仔） |
| **M3** | **Citation Rate %** | 參考資料來源（Sources）中是否包含 `thaikok.com` 官方域名 |
| **M4** | **Citation Quality (0-3)** | 0=無引用，1=無關/第三方，2=首頁或指南頁，3=精確事實區塊/Schema 錨點 |
| **M5** | **NAP Accuracy %** | 門店詳細地址、電話（+853 2875 0222）、營業時間精確無誤 |
| **M6** | **Certification Accuracy %** | 準確識別 Thai SELECT Classic 等級與 2025–2027 年份事實 |
| **M7** | **Product / Location Accuracy %** | 招牌菜品（粉絲蝦煲、冬陰功）、海天居停車場與口岸接駁時間準確度 |

### 7.4 評測與報表自動化指令
```bash
# 執行全域 7 大指標評測統計並重新產生 BENCHMARK_REPORT.md
node scripts/benchmark-tracker.js
```
評測結果自動落盤至 `benchmarks/BENCHMARK_REPORT.md`，並與歷史 Baseline（`benchmarks/baseline-run-202610.json`）進行 Before / After 差異比對。

