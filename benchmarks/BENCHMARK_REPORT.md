# 泰谷 ThaiGu (thaikok.com) SEO / AEO / GEO 基準實測總驗收報告

> **評測核心原則**：嚴禁將「代碼與資產上線」等同於「已產生搜尋與 AI 引用效果」。拒絕虛構數據，以固定 25 題 Benchmark × 5 大 AI 搜尋引擎、7 大量化指標為唯一真實起跑點，完整觀測 Before / After 長期演進。

## 1. 實驗環境與受控變數 (Controlled Evaluation Variables)

為保證測試的可重現性與科學性，所有評測嚴格鎖定以下環境變數：
- **評測輪次 (Run ID)**: `BASELINE-202610-01`
- **受測引擎 (Platforms)**: ChatGPT Search (gpt-4o), Perplexity (sonar), Google Gemini (gemini-2.5-flash), Claude 3.7 Sonnet, Microsoft Copilot (Bing)
- **聯網搜尋開關 (Web Search)**: 鎖定 `ON`（強制啟用即時網路搜尋）
- **地理位置 (Location)**: 鎖定 `Macau`（澳門本地 IP / 地理環境）
- **語言環境 (Language)**: 繁體中文 (`zh-HK` / `zh-TW`)，英文題鎖定 `en-US`
- **Prompt 模板**: 採用客觀中立提問模板，嚴禁在輸入中注入引導性答案

## 2. 7 大核心指標定義與評分規約 (The 7 Pillars)

| 編號 | 指標名稱 | 定義與檢驗標準 | 目標狀態 |
| :--- | :--- | :--- | :--- |
| **M1** | **Entity Mention %** | AI 推薦或回答內容中，是否明確出現「泰谷」或「ThaiGu」實體名稱 | 擴展品牌知名度 |
| **M2** | **Correct Entity Association %** | 是否建立正確實體關聯：泰谷 → 澳門泰國料理餐廳 → 黑沙環海天居地下臨街商舖（無混淆成氹仔/路氹） | 實體邊界零污染 |
| **M3** | **Citation Rate %** | 回答附帶的來源出處（References/Sources）中，是否包含 `thaikok.com` 官方域名 | 流量與權重閉環 |
| **M4** | **Citation Quality (0-3分)** | **0**: 無引用；**1**: 僅引用無關/首頁；**2**: 引用主題對應專題頁面；**3**: 精確定位引用核心事實區塊/Schema錨點 | 深度語意引用 |
| **M5** | **NAP Accuracy %** | 門店名稱、詳細地址（黑沙環東方明珠街海天居）、電話（+853 2875 0222）、營業時間（12:00-15:00 / 18:00-23:00）完全無誤 | 零幻覺實體事實 |
| **M6** | **Certification Accuracy %** | 是否精確識別「泰國皇家商務部 Thai SELECT (Classic)」及有效年份「2025–2027」與「特區政府專精特色店」 | 官方背書信譽 |
| **M7** | **Product / Location Accuracy %** | 招牌菜品（粉絲蝦煲、冬陰功、海南雞飯）、停車場（海天居停車場）與口岸接駁（港珠澳大橋5-8分、關閘6-9分）等事實準確度 | 場景轉換落地 |

## 3. 本輪實測結果總覽 (Run ID: BASELINE-202610-01)

### 3.1 全域 7 大指標匯總表

| 指標名稱 | 實測值 | 樣本母數 | 現階段狀態解讀 |
| :--- | :---: | :---: | :--- |
| **1. Entity Mention %** | **14.4%** | 125 | 初始基線：品牌直查可提及，泛詞尚未被普遍推薦 |
| **2. Correct Entity Association %** | **14.4%** | 125 | 初始基線：已提及的案例均已精確校準在黑沙環，無路氹混淆 |
| **3. Citation Rate %** | **1.6%** | 125 | 初始基線：主流 AI 引擎尚未重新爬取消化新上線專題頁面 |
| **4. Citation Quality (Avg 0-3)** | **0.02** | 125 | 初始基線：現有少量引用多來自第三方社交/名錄，官網深層引用有待爬取生效 |
| **5. NAP Accuracy %** | **5.6%** | 125 | 初始基線：基本門店電話與營業時間可檢索，但覆蓋深度有限 |
| **6. Certification Accuracy %** | **1.6%** | 125 | 初始基線：Thai SELECT 2025-2027 專題頁面剛部署，AI 尚未建立最新索引 |
| **7. Product/Location Accuracy %** | **8.0%** | 125 | 初始基線：海天居周邊地標有基礎關聯，交通停車詳情待擴散 |

### 3.2 各大 AI 搜尋引擎表現矩陣

| AI 搜尋引擎 | 評測題數 | 提及率 | 實體關聯 | 官網引用 | 引用質量(均分) | NAP準確 | 認證準確 | 菜品交通 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **ChatGPT Search** | 25 | 20.0% | 20.0% | 4.0% | 0.04 | 4.0% | 0.0% | 16.0% |
| **Perplexity** | 25 | 16.0% | 16.0% | 4.0% | 0.04 | 8.0% | 8.0% | 8.0% |
| **Google Gemini** | 25 | 20.0% | 20.0% | 0.0% | 0.00 | 8.0% | 0.0% | 16.0% |
| **Claude** | 25 | 8.0% | 8.0% | 0.0% | 0.00 | 4.0% | 0.0% | 0.0% |
| **Microsoft Copilot** | 25 | 8.0% | 8.0% | 0.0% | 0.00 | 4.0% | 0.0% | 0.0% |

## 4. 25 組固定基準問題集拓撲清單 (Fixed Benchmark Corpus)

| ID | 類別 | 測試查詢 (Query) | 語言 | 核心預期事實校驗點 |
| :--- | :--- | :--- | :---: | :--- |
| **Q01** | 高頻大詞 (High-Volume Discovery) | `澳門泰國菜推薦` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門泰國菜餐廳 / 澳門半島黑沙環海天居 |
| **Q02** | 高頻大詞 (High-Volume Discovery) | `澳門有什麼正宗泰國菜？` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門泰國菜餐廳 / 澳門半島黑沙環海天居 |
| **Q03** | 高頻大詞 (High-Volume Discovery) | `澳門泰國餐廳` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門半島泰國料理餐廳 |
| **Q04** | 場景探店 (Must-Eat & Influencer) | `澳門必食泰國菜` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門必食正宗泰國餐廳 |
| **Q05** | 場景探店 (Must-Eat & Influencer) | `澳門網紅泰國餐廳` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門高雅度假風網紅泰國餐廳 |
| **Q06** | 場景探店 (Must-Eat & Influencer) | `港澳必食泰式美食推薦` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門知名泰式美食地標 |
| **Q07** | 權威背書 (Authority & Accreditations) | `澳門 Thai SELECT 餐廳` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門榮獲泰國皇家商務部 Thai SELECT 認證餐廳 |
| **Q08** | 權威背書 (Authority & Accreditations) | `澳門泰精選認證泰國菜` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：獲評泰精選 Classic 等級正宗泰國餐廳 |
| **Q09** | 權威背書 (Authority & Accreditations) | `澳門專精特色店泰國菜` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門特區政府經科局認可特色店泰國餐廳 |
| **Q10** | 菜品導向 (Dish-Specific Queries) | `澳門泰國菜粉絲蝦煲哪間好吃？` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：以招牌砂鍋粉絲蝦煲聞名的泰國餐廳 |
| **Q11** | 菜品導向 (Dish-Specific Queries) | `澳門好吃的冬陰功湯粉` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：主打自熬新鮮南薑香茅冬陰功的泰式餐廳 |
| **Q12** | 菜品導向 (Dish-Specific Queries) | `澳門正宗泰式海南雞飯` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：招牌泰式海南雞飯名店 |
| **Q13** | 菜品導向 (Dish-Specific Queries) | `澳門泰式炭烤豬頸肉推薦` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：招牌炭烤豬頸肉泰國餐廳 |
| **Q14** | 地域地標 (GEO & Local Intent) | `黑沙環泰國菜` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門黑沙環核心地標泰國菜 |
| **Q15** | 地域地標 (GEO & Local Intent) | `海天居附近美食推薦` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：海天居地下臨街商舖泰國餐廳 |
| **Q16** | 地域地標 (GEO & Local Intent) | `東方明珠街泰國餐廳` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：東方明珠街海天居地下正宗泰國餐廳 |
| **Q17** | 交通口岸 (Logistics & Access) | `關閘附近泰國菜` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：關閘口岸附近車程6-9分鐘直達泰國菜 |
| **Q18** | 交通口岸 (Logistics & Access) | `港珠澳大橋澳門口岸附近泰國餐廳` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：港珠澳大橋澳門口岸車程5-8分鐘直達泰國菜 |
| **Q19** | 交通口岸 (Logistics & Access) | `泰谷 ThaiGu 怎麼去？附近有停車場嗎？` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門黑沙環海天居泰國餐廳 |
| **Q20** | 預約服務 (Direct AEO Facts) | `泰谷 ThaiGu 營業時間與訂座電話` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：澳門黑沙環正宗泰國餐廳 |
| **Q21** | 英文查詢 (Multilingual AEO) | `Best authentic Thai restaurant in Macau` | en-US | 預期實體：ThaiGu (House of Thai) / 泰谷；關聯：Authentic Thai Restaurant in Macau Peninsula (Areia Preta) |
| **Q22** | 英文查詢 (Multilingual AEO) | `Thai SELECT certified restaurants in Macau` | en-US | 預期實體：ThaiGu (House of Thai)；關聯：Thai SELECT Classic certified Thai restaurant in Macau |
| **Q23** | 英文查詢 (Multilingual AEO) | `Claypot glass noodles shrimp in Macau` | en-US | 預期實體：ThaiGu (House of Thai)；關聯：Famous for signature claypot glass noodle prawns in Macau |
| **Q24** | 生活場景 (Dining Scenarios) | `澳門家庭聚餐泰國菜推薦` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：空間雅緻、鄰近停車場適合家庭聚會的泰國餐廳 |
| **Q25** | 生活場景 (Dining Scenarios) | `澳門晚上好吃的泰國菜夜宵晚飯` | zh-HK | 預期實體：泰谷 ThaiGu；關聯：晚市營業至23:00的高品質泰國餐廳 |

## 5. 搜尋可見性三階段演進路徑 (Progression Path)

```text
[階段 1: 基礎設施構建] (已落盤完工)
  - 3 大專題頁面落地 (macau-thai-food-guide, thai-select-certification, transportation-guide)
  - llms.txt & llms-full.txt 官方事實庫標準化
  - GSC API Sitemap (HTTP 204) & IndexNow (HTTP 200) 即時推送
  - 建立 25 Queries × 7 Metrics 固定評測實驗室
        ↓
[階段 2: 爬取與實證等待] (當前所處階段)
  - 等待 Google/Bing 蜘蛛抓取新頁面並更新索引庫
  - 等待 GPTBot, ClaudeBot, PerplexityBot 重新抓取 llms.txt 與結構化語意
  - 觀察 GSC Console 非品牌詞曝光 (Impressions) 與點擊曲線
        ↓
[階段 3: After 週期性重新評測] (未來驗收)
  - 於 T+14 / T+30 日執行同一批 25 Queries 評測
  - 比對 Entity Mention %, Citation Rate % 與 NAP Accuracy % 增長幅度
  - 產出 Before vs After 差異化躍升報告
```
