# openSEO

> **Open-source, Self-hosted, Deterministic SEO Growth Engine & Control Panel Template.**  
> 確定性驅動、自託管、開箱即用的 SEO 增長控制台與引擎開源模板。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/frontend-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev/)
[![Fastify](https://img.shields.io/badge/backend-Fastify-000000.svg)](https://fastify.dev/)

---

## 🌟 為什麼選擇 openSEO？ (The Philosophy)

多數團隊的 SEO 陷入兩個極端：
1. **黑盒 AI 批量生成垃圾水文**：堆疊大量無意義文字，浪費爬蟲配額，最終被搜尋引擎判定為 Thin Content 降權。
2. **盲盒摸黑運作**：雖然有上萬個頁面，但從未釐清「**關鍵詞 ➔ 目標落地頁**」的映射關係，造成嚴重的 **Gap (有需求無頁面)**、**自相殘殺 (Cannibalization)** 與 **錯配 (Misalignment)**。

**openSEO** 徹底打破上述常規，採用 **確定性規則 (Deterministic Scoring) + GSC 真實數據迴路 + 拓撲圖譜**，專注於產生真實商業增長的資產管理平台：

- 🎯 **今日最值得做 (Deterministic Priority Engine)**：每日只推薦當天 ROI 最高的唯一行動（#1 Action），附帶實證依據、風控限制與科學實驗假說（Primary, Secondary, Guardrail Metrics）。
- ⚡ **近在咫尺關鍵詞突圍 (Striking Distance)**：自動挖掘排名第 4~15 位、曝光基數高的高潛力關鍵詞，精準輔助推上首頁 Top 3。
- 📚 **關鍵詞資產層 (Keyword Asset Inventory)**：完整解決 Gap、Cannibalization 與 Misalignment，支援全站落地頁智能自動配對。
- 🛡️ **五維健康度成熟度矩陣 (5-Pillar SEO Readiness)**：從 Technical、Content、Internal Links、Coverage 到 GSC Loop 全維度防護。
- 👥 **轉化與渠道歸因 (User Attribution)**：將自然搜尋表現與用戶註冊轉化深度綁定。
- 🚀 **零配置極速開箱 (Zero-config Quickstart)**：內建 Realistic Mock Mode，即使未配置資料庫與 GSC 憑證，也能秒級體驗全功能控制台！

---

## 🏗️ 系統架構 (Architecture)

```
┌────────────────────────────────────────────────────────┐
│             openSEO Web UI (React + Tailwind)          │
│  [Priority Engine] [GSC Metrics] [Keyword Asset Mgmt]  │
└───────────────────────────┬────────────────────────────┘
                            │ RESTful APIs (/api/seo/*)
┌───────────────────────────▼────────────────────────────┐
│               openSEO Backend (Node.js/Fastify)        │
├────────────────────────────────────────────────────────┤
│  • Priority Engine (確定性計分、冷卻防護、實驗假說)      │
│  • Opportunity Miner (Striking Distance、CTR 搶救)     │
│  • Keyword Asset Engine (意圖分類、Gap 診斷、智能配對) │
│  • Internal Link Topology & Orphan Detector            │
│  • Google Search Console API Adapter                   │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
   Embedded / SQLite              PostgreSQL (Production)
   (零配置開箱即用)               (高並發大型站點)
```

---

## 🚀 5 分鐘極速上手 (Quick Start)

### 方式一：本地開發啟動 (Local Dev)

```bash
# 1. 複製專案
git clone https://github.com/whypuss/openSEO.git
cd openSEO

# 2. 複製環境變數
cp .env.example .env

# 3. 安裝依賴 (建議 Node.js >= 20)
npm install

# 4. 一鍵啟動 (前後端同步運行，預設啟用 Demo Mock 模式)
npm run dev
```

啟動後即可在瀏覽器開啟：
- 前端控制台：`http://localhost:3000`
- 後端 API 服務：`http://localhost:8790/api/seo/dashboard`

---

### 方式二：Docker Compose 容器化部署

```bash
docker compose up -d
```
瀏覽器直接訪問 `http://localhost:3000` 即可使用！

---

## ⚙️ 核心配置 (Configuration)

編輯 `.env` 檔案以自定義站點屬性或串接生產環境：

```env
# 站點名稱與 URL
SITE_NAME="My Cool Store"
SITE_URL="https://example.com"
SITE_DOMAIN="example.com"
PORT=8790

# 資料庫 (若留空則自動使用內嵌模式，配置即切換至 PostgreSQL)
DATABASE_URL=postgres://user:password@localhost:5432/openseo

# Google Search Console (選填，用於自動每日數據同步)
GSC_SITE_URL=https://example.com/
GSC_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Demo / Mock 模式切換
DEMO_MODE=false
```

---

## 📊 7 大核心模組功能導覽

| 模組編號 | 模組名稱 | 核心功能說明 |
| :--- | :--- | :--- |
| **模組 0** | **今日最值得做 (Priority Engine)** | 依實證數據排出唯一 #1 行動，內建防左右互搏冷卻期與 4 欄科學實驗指標 |
| **模組 1** | **Google Search Performance** | 自然曝光、點擊、平均排名、CTR 趨勢，過濾品牌詞反映真實自然增長 |
| **模組 1.5** | **會員註冊與途徑歸因** | 串聯 SEO 流量與業務轉換（Google、Email、Apple 渠道分佈與流水） |
| **模組 2** | **排名分佈階梯與趨勢** | Top 3、4-10、11-20、21+ 階梯可視化，直觀掌握站點權重分佈 |
| **模組 3** | **SEO Opportunities 機會池** | 自動標記 Striking Distance、CTR 嚴重偏低與缺失落地頁機會 |
| **模組 4** | **Top Queries 搜尋詞對帳** | 盤點高曝光搜尋詞在 Google 實際排位的頁面，防範錯配 |
| **模組 5** | **SEO Readiness 成熟度矩陣** | Technical、Content、Internal Links、Coverage、GSC Loop 5 維度守護 |
| **模組 6** | **關鍵詞資產庫與 Gap 診斷** | 意圖自動分類（商業/交易/資訊/導航），智能配對落地頁，消除 Gap |

---

## 📚 開發與集成文檔

- 📖 [架構設計與底層哲學 (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)
- 🔌 [如何將 openSEO 整合至現有專案 (docs/INTEGRATION_GUIDE.md)](docs/INTEGRATION_GUIDE.md)
- 🔑 [Google Search Console 憑證配置手冊 (docs/GSC_SETUP.md)](docs/GSC_SETUP.md)

---

## 📄 開源授權 (License)

本專案基於 [MIT License](LICENSE) 條款開源，歡迎社群自由分叉、二次開發或整合進商業產品中！
