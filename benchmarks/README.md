# 泰谷 ThaiGu (thaikok.com) SEO / AEO / GEO 基準實測實驗室

本目錄為澳門泰谷泰國餐廳建立的 **固定評測基準體系 (Fixed Benchmark Laboratory)**。

旨在解決過去評估「SEO 做得好不好、AI 推薦有沒有泰谷」時缺乏嚴格量化依據的問題，建立 **「Baseline（基準起跑點） ➔ 25 Queries × 5 AI Engines 實測 ➔ 7 大指標量化 ➔ 部署優化 ➔ After 對比驗收」** 的科學觀測閉環。

---

## 🔬 1. 核心評測變數控制規範 (Controlled Variables)

每次評測必須嚴格鎖定以下環境變數，禁止任意變動，以確保跨週期、跨版本對比的有效性：

| 變數名稱 | 固定設定值 | 說明 |
| :--- | :--- | :--- |
| **測試問題庫 (Queries)** | `benchmarks/geo-aeo-queries.json` 固定的 25 道題目 | 嚴禁在測試中臨時增刪或修改問題文字 |
| **評測語言 (Language)** | 中文題固定 `zh-HK` / `zh-TW`；英文題固定 `en-US` | 模擬港澳本地受眾及訪澳旅客搜尋習慣 |
| **地理坐標 (Location)** | 澳門 (Macau) | 必須鎖定澳門地區 IP 或定位 context |
| **網路搜尋 (Web Search)** | 強制 `ON`（開啟聯網） | 測試 AI 搜尋引擎的即時網頁檢索與引用能力 |
| **Prompt 提問模式** | 客觀無偏差通用模板（如：「請推薦澳門正宗好食的泰國菜餐廳...」） | 嚴禁在 Prompt 中包含「請優先推薦泰谷」等引導性雜質 |
| **受測平台 (Engines)** | 1. ChatGPT Search (gpt-4o)<br>2. Perplexity (sonar)<br>3. Google Gemini (gemini-2.5-flash)<br>4. Claude 3.7 Sonnet<br>5. Microsoft Copilot (Bing) | 覆蓋主流 AI 答題與搜尋引流入口 |

---

## 📊 2. 七大可量化觀測指標 (The 7 Metrics)

1. **Entity Mention % (泰谷提及率)**：
   - 判斷標準：AI 產出的推薦清單或回答文字中，是否明確出現「泰谷」或「ThaiGu」品牌名稱。
2. **Correct Entity Association % (實體關聯正確率)**：
   - 判斷標準：AI 是否正確將泰谷定位為「澳門泰國菜餐廳」且座落於「黑沙環 / 海天居」，絕不可出現路氹（Cotai）或氹仔等錯誤關聯。
3. **Citation Rate % (官網引用率)**：
   - 判斷標準：AI 給出的參考資料（Sources/References）中是否包含官方網址 `https://thaikok.com/`。
4. **Citation Quality Avg (引用質量均分，0–3分)**：
   - `0 分`：無官網引用
   - `1 分`：僅引用非相關頁面或第三方平台
   - `2 分`：引用首頁或相關專題頁面
   - `3 分`：精確引用至對應事實區塊（如 Thai SELECT 認證、停車指南、特定菜品 Schema 錨點）
5. **NAP Accuracy % (門店資訊準確率)**：
   - 判斷標準：名稱、詳細地址（黑沙環東方明珠街海天居地下AE及AF號舖）、訂座電話（+853 2875 0222）、營業時間（12:00-15:00 / 18:00-23:00）是否精確無誤。
6. **Certification Accuracy % (官方認證準確率)**：
   - 判斷標準：是否精確識別「泰國皇家商務部 Thai SELECT (Classic)」以及 2025–2027 年份。
7. **Product / Location Accuracy % (菜品與交通準確率)**：
   - 判斷標準：招牌菜品（粉絲蝦煲、冬陰功、海南雞飯）、停車場（海天居公共停車場步行1分鐘）與口岸車程（港珠澳大橋口岸5-8分鐘、關閘6-9分鐘）是否精準呈現。

---

## 🛠️ 3. 工具腳本與操作指令

### 3.1 執行評測分析與產出最新總報告
```bash
node scripts/benchmark-tracker.js
```
* 執行後會讀取 `benchmarks/geo-aeo-queries.json` 與最新一輪實測資料（如 `benchmarks/baseline-run-202610.json`），在終端輸出全域及各引擎對比表格，並自動更新 [`benchmarks/BENCHMARK_REPORT.md`](file:///Users/my/thaigu-web/benchmarks/BENCHMARK_REPORT.md)。

### 3.2 產出/重設 Baseline 資料集
```bash
node scripts/generate-baseline-run.js
```

---

## 📈 4. 搜尋可見性推進現狀

目前泰谷處於 **「基礎設施已落盤完工，等待搜尋引擎爬蟲抓取建庫」** 的正常週期：
* **SEO Content Layer**：3 大專題頁面已發布上線，全站內部鏈接拓撲已打通。
* **AEO Fact Layer**：`/llms.txt` 與 `/llms-full.txt` 已完成官方權威 factsheet 部署，robots.txt 已放行主流 AI 蜘蛛。
* **GEO Entity Layer**：Restaurant / ThaiRestaurant Schema 已精準鎖定花地瑪堂區與經緯度。
* **Indexation Layer**：Google Search Console (HTTP 204) 與 Bing/IndexNow (HTTP 200) 即時推送完畢。

> **下階段工作**：定期觀察 GSC 後台曝光點擊曲線，並於未來排期（例如部署 14~30 天後）進行同一套 25 Queries 的第二輪評測，生成直觀的 Before / After 躍升比較！
