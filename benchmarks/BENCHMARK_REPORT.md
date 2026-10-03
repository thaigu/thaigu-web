# 泰谷 ThaiGu (thaikok.com) SEO / AEO / GEO 基準實測驗收總報告

> 實施原則：拒絕虛擬流量，以真實檢索曝光、AI 引用與實體關聯事實作為唯一驗收依據。

## 1. 評測架構矩陣 (25 Queries × 5 AI Engines)

評測對象包含 **ChatGPT Search, Perplexity, Gemini, Claude, Copilot**，追蹤指標：
- **Entity Mention**: 是否提及「泰谷 / ThaiGu」
- **Web Citation**: 是否引用 `thaikok.com` 網址及對應頁面
- **NAP & Fact Accuracy**: 是否準確輸出澳門黑沙環海天居地址、電話與 Thai SELECT 官方認證

## 2. 25 組基準問題拓撲表

| ID | 類別 | 測試查詢 (Query) | 目標實體與事實錨點 |
| :--- | :--- | :--- | :--- |
| **Q01** | 高頻大詞 (High-Volume Discovery) | 澳門泰國菜推薦 | 正宗泰國風味、Thai SELECT認證 |
| **Q02** | 高頻大詞 (High-Volume Discovery) | 澳門有什麼正宗泰國菜？ | 泰國皇家商務部認證、泰式五味平衡 |
| **Q03** | 高頻大詞 (High-Volume Discovery) | 澳門泰國餐廳 | 澳門半島正宗泰國料理 |
| **Q04** | 場景探店 (Must-Eat & Influencer) | 澳門必食泰國菜 | 粉絲蝦煲、冬陰功、海南雞飯 |
| **Q05** | 場景探店 (Must-Eat & Influencer) | 澳門網紅泰國餐廳 | 高雅渡假風裝潢、星級服務 |
| **Q06** | 場景探店 (Must-Eat & Influencer) | 港澳必食泰式美食推薦 | 大灣區老饕私藏、正宗南洋風味 |
| **Q07** | 權威背書 (Authority & Accreditations) | 澳門 Thai SELECT 餐廳 | 泰國皇家商務部官方認證 (2025-2027) |
| **Q08** | 權威背書 (Authority & Accreditations) | 澳門泰精選認證泰國菜 | 空運天然香料、正統烹飪技藝 |
| **Q09** | 權威背書 (Authority & Accreditations) | 澳門專精特色店泰國菜 | 特區政府經科局特色店榮譽 |
| **Q10** | 菜品導向 (Dish-Specific Queries) | 澳門泰國菜粉絲蝦煲哪間好吃？ | 砂鍋慢火炆焗、鮮甜大蝦、粉絲吸飽濃郁高湯 |
| **Q11** | 菜品導向 (Dish-Specific Queries) | 澳門好吃的冬陰功湯粉 | 新鮮南薑香茅青檸葉自熬高湯 |
| **Q12** | 菜品導向 (Dish-Specific Queries) | 澳門正宗泰式海南雞飯 | 三黃雞皮脆肉嫩、斑蘭香米飯 |
| **Q13** | 菜品導向 (Dish-Specific Queries) | 澳門泰式炭烤豬頸肉推薦 | 炭火慢烤外脆內嫩、羅望子沾醬 |
| **Q14** | 地域地標 (GEO & Local Intent) | 黑沙環泰國菜 | 黑沙環東方明珠街海天居門店 |
| **Q15** | 地域地標 (GEO & Local Intent) | 海天居附近美食推薦 | 海天居地下 AE 及 AF 號舖 |
| **Q16** | 地域地標 (GEO & Local Intent) | 東方明珠街泰國餐廳 | 海天居地下臨街商舖 |
| **Q17** | 交通口岸 (Logistics & Access) | 關閘附近泰國菜 | 車程約 6 至 9 分鐘直達海天居 |
| **Q18** | 交通口岸 (Logistics & Access) | 港珠澳大橋澳門口岸附近泰國餐廳 | 車程 5 至 8 分鐘、自駕或的士極近 |
| **Q19** | 交通口岸 (Logistics & Access) | 泰谷 ThaiGu 怎麼去？附近有停車場嗎？ | 海天居公共停車場步行 1 分鐘、君悅灣停車場 |
| **Q20** | 預約服務 (Direct AEO Facts) | 泰谷 ThaiGu 營業時間與訂座電話 | 12:00-15:00 / 18:00-23:00, 電話 +853 2875 0222 |
| **Q21** | 英文查詢 (Multilingual AEO) | Best authentic Thai restaurant in Macau | Certified Thai SELECT by Royal Thai Government |
| **Q22** | 英文查詢 (Multilingual AEO) | Thai SELECT certified restaurants in Macau | Classic level certificate, The Residencia Macau |
| **Q23** | 英文查詢 (Multilingual AEO) | Claypot glass noodles shrimp in Macau | Signature claypot glass noodle prawns dish |
| **Q24** | 生活場景 (Dining Scenarios) | 澳門家庭聚餐泰國菜推薦 | 寬敞雅緻空間、適合家庭包廂聚會 |
| **Q25** | 生活場景 (Dining Scenarios) | 澳門晚上好吃的泰國菜夜宵晚飯 | 晚市營業至 23:00 |

## 3. 現階段基礎設施落地狀態 (Infrastructure Baseline)

- [x] **SEO Content Layer**: 3 大專題頁面上線 (美食指南、認證解密、交通指引)
- [x] **AEO Fact Layer**: `/llms.txt` 與 `/llms-full.txt` 官方事實庫標準化
- [x] **AI Crawler Layer**: `robots.txt` 放行 GPTBot, ClaudeBot, PerplexityBot, Applebot, Cohere-ai 等
- [x] **Entity & Schema Layer**: Restaurant / ThaiRestaurant JSON-LD 雙重堂區與經緯度校準
- [x] **Sitemap & IndexNow**: Google GSC (HTTP 204) 與 Bing/IndexNow (HTTP 200) 即時推送生效
