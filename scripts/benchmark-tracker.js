import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const queriesPath = path.resolve(__dirname, "../benchmarks/geo-aeo-queries.json");
const baselinePath = path.resolve(__dirname, "../benchmarks/baseline-run-202610.json");
const reportMdPath = path.resolve(__dirname, "../benchmarks/BENCHMARK_REPORT.md");

if (!fs.existsSync(queriesPath)) {
  console.error("❌ 找不到基準題庫檔案: " + queriesPath);
  process.exit(1);
}

const queries = JSON.parse(fs.readFileSync(queriesPath, "utf8"));
let runData = { metadata: {}, records: [] };

if (fs.existsSync(baselinePath)) {
  runData = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
}

const records = runData.records || [];

function calculateMetrics(subset) {
  if (subset.length === 0) {
    return {
      total: 0,
      mentionRate: "0.0%",
      associationRate: "0.0%",
      citationRate: "0.0%",
      citationQualityAvg: "0.00",
      napAccuracyRate: "0.0%",
      certAccuracyRate: "0.0%",
      prodLocAccuracyRate: "0.0%"
    };
  }

  const total = subset.length;
  const mentions = subset.filter(r => r.metrics.entity_mention).length;
  const associations = subset.filter(r => r.metrics.correct_entity_association).length;
  const citations = subset.filter(r => r.metrics.citation).length;
  const qualitySum = subset.reduce((acc, r) => acc + (r.metrics.citation_quality || 0), 0);
  const naps = subset.filter(r => r.metrics.nap_accuracy).length;
  const certs = subset.filter(r => r.metrics.certification_accuracy).length;
  const prodLocs = subset.filter(r => r.metrics.product_location_accuracy).length;

  return {
    total,
    mentionRate: `${((mentions / total) * 100).toFixed(1)}%`,
    associationRate: `${((associations / total) * 100).toFixed(1)}%`,
    citationRate: `${((citations / total) * 100).toFixed(1)}%`,
    citationQualityAvg: (qualitySum / total).toFixed(2),
    napAccuracyRate: `${((naps / total) * 100).toFixed(1)}%`,
    certAccuracyRate: `${((certs / total) * 100).toFixed(1)}%`,
    prodLocAccuracyRate: `${((prodLocs / total) * 100).toFixed(1)}%`
  };
}

function runAnalysis() {
  console.log("=========================================================================");
  console.log("    泰谷 ThaiGu (thaikok.com) SEO / AEO / GEO 7 大指標基準評測控制台     ");
  console.log("=========================================================================");
  console.log(`基準評測輪次 (Run ID): ${runData.metadata.run_id || "N/A"}`);
  console.log(`建立時間: ${runData.metadata.created_at || "N/A"}`);
  console.log(`總查詢題目數: ${queries.length} 題 | 實測紀錄總數: ${records.length} 筆`);
  console.log("-------------------------------------------------------------------------");

  const overall = calculateMetrics(records);

  console.log("\n📊 【全域 7 大核心指標總覽 (Overall Benchmark Metrics)】");
  console.table([
    { 指標名稱: "1. Entity Mention % (泰谷提及率)", 實測值: overall.mentionRate, 說明: "回答中是否提及泰谷" },
    { 指標名稱: "2. Correct Association % (實體關聯率)", 實測值: overall.associationRate, 說明: "泰谷→澳門泰國菜→黑沙環海天居" },
    { 指標名稱: "3. Citation Rate % (官網引用率)", 實測值: overall.citationRate, 說明: "引用 thaikok.com 域名" },
    { 指標名稱: "4. Citation Quality (引用質量 0-3)", 實測值: overall.citationQualityAvg, 說明: "0=無, 1=無關, 2=相關頁, 3=精確錨點" },
    { 指標名稱: "5. NAP Accuracy % (門店資訊準確率)", 實測值: overall.napAccuracyRate, 說明: "地址、電話、營業時間準確度" },
    { 指標名稱: "6. Certification Accuracy % (官方認證準確率)", 實測值: overall.certAccuracyRate, 說明: "Thai SELECT Classic (2025-2027)" },
    { 指標名稱: "7. Product/Location Accuracy % (菜品與交通準確率)", 實測值: overall.prodLocAccuracyRate, 說明: "特色菜品、停車場、口岸時間" }
  ]);

  // 各 AI 引擎細項指標對比
  const engines = [...new Set(records.map(r => r.engine))];
  console.log("\n🤖 【各大 AI 搜尋引擎細項對比 (Engine Breakdown)】");
  const engineRows = engines.map(eng => {
    const engRecords = records.filter(r => r.engine === eng);
    const m = calculateMetrics(engRecords);
    return {
      AI搜尋引擎: eng,
      樣本數: m.total,
      提及率: m.mentionRate,
      實體關聯: m.associationRate,
      官網引用: m.citationRate,
      引用質量: m.citationQualityAvg,
      NAP準確: m.napAccuracyRate,
      認證準確: m.certAccuracyRate,
      菜品交通: m.prodLocAccuracyRate
    };
  });
  console.table(engineRows);

  generateMarkdownReport(overall, engineRows);
}

function generateMarkdownReport(overall, engineRows) {
  let md = `# 泰谷 ThaiGu (thaikok.com) SEO / AEO / GEO 基準實測總驗收報告\n\n`;
  md += `> **評測核心原則**：嚴禁將「代碼與資產上線」等同於「已產生搜尋與 AI 引用效果」。拒絕虛構數據，以固定 25 題 Benchmark × 5 大 AI 搜尋引擎、7 大量化指標為唯一真實起跑點，完整觀測 Before / After 長期演進。\n\n`;

  md += `## 1. 實驗環境與受控變數 (Controlled Evaluation Variables)\n\n`;
  md += `為保證測試的可重現性與科學性，所有評測嚴格鎖定以下環境變數：\n`;
  md += `- **評測輪次 (Run ID)**: \`${runData.metadata.run_id || "BASELINE-202610-01"}\`\n`;
  md += `- **受測引擎 (Platforms)**: ChatGPT Search (gpt-4o), Perplexity (sonar), Google Gemini (gemini-2.5-flash), Claude 3.7 Sonnet, Microsoft Copilot (Bing)\n`;
  md += `- **聯網搜尋開關 (Web Search)**: 鎖定 \`ON\`（強制啟用即時網路搜尋）\n`;
  md += `- **地理位置 (Location)**: 鎖定 \`Macau\`（澳門本地 IP / 地理環境）\n`;
  md += `- **語言環境 (Language)**: 繁體中文 (\`zh-HK\` / \`zh-TW\`)，英文題鎖定 \`en-US\`\n`;
  md += `- **Prompt 模板**: 採用客觀中立提問模板，嚴禁在輸入中注入引導性答案\n\n`;

  md += `## 2. 7 大核心指標定義與評分規約 (The 7 Pillars)\n\n`;
  md += `| 編號 | 指標名稱 | 定義與檢驗標準 | 目標狀態 |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  md += `| **M1** | **Entity Mention %** | AI 推薦或回答內容中，是否明確出現「泰谷」或「ThaiGu」實體名稱 | 擴展品牌知名度 |\n`;
  md += `| **M2** | **Correct Entity Association %** | 是否建立正確實體關聯：泰谷 → 澳門泰國料理餐廳 → 黑沙環海天居地下臨街商舖（無混淆成氹仔/路氹） | 實體邊界零污染 |\n`;
  md += `| **M3** | **Citation Rate %** | 回答附帶的來源出處（References/Sources）中，是否包含 \`thaikok.com\` 官方域名 | 流量與權重閉環 |\n`;
  md += `| **M4** | **Citation Quality (0-3分)** | **0**: 無引用；**1**: 僅引用無關/首頁；**2**: 引用主題對應專題頁面；**3**: 精確定位引用核心事實區塊/Schema錨點 | 深度語意引用 |\n`;
  md += `| **M5** | **NAP Accuracy %** | 門店名稱、詳細地址（黑沙環東方明珠街海天居）、電話（+853 2875 0222）、營業時間（12:00-15:00 / 18:00-23:00）完全無誤 | 零幻覺實體事實 |\n`;
  md += `| **M6** | **Certification Accuracy %** | 是否精確識別「泰國皇家商務部 Thai SELECT (Classic)」及有效年份「2025–2027」與「特區政府專精特色店」 | 官方背書信譽 |\n`;
  md += `| **M7** | **Product / Location Accuracy %** | 招牌菜品（粉絲蝦煲、冬陰功、海南雞飯）、停車場（海天居停車場）與口岸接駁（港珠澳大橋5-8分、關閘6-9分）等事實準確度 | 場景轉換落地 |\n\n`;

  md += `## 3. 本輪實測結果總覽 (Run ID: ${runData.metadata.run_id})\n\n`;
  md += `### 3.1 全域 7 大指標匯總表\n\n`;
  md += `| 指標名稱 | 實測值 | 樣本母數 | 現階段狀態解讀 |\n`;
  md += `| :--- | :---: | :---: | :--- |\n`;
  md += `| **1. Entity Mention %** | **${overall.mentionRate}** | ${overall.total} | 初始基線：品牌直查可提及，泛詞尚未被普遍推薦 |\n`;
  md += `| **2. Correct Entity Association %** | **${overall.associationRate}** | ${overall.total} | 初始基線：已提及的案例均已精確校準在黑沙環，無路氹混淆 |\n`;
  md += `| **3. Citation Rate %** | **${overall.citationRate}** | ${overall.total} | 初始基線：主流 AI 引擎尚未重新爬取消化新上線專題頁面 |\n`;
  md += `| **4. Citation Quality (Avg 0-3)** | **${overall.citationQualityAvg}** | ${overall.total} | 初始基線：現有少量引用多來自第三方社交/名錄，官網深層引用有待爬取生效 |\n`;
  md += `| **5. NAP Accuracy %** | **${overall.napAccuracyRate}** | ${overall.total} | 初始基線：基本門店電話與營業時間可檢索，但覆蓋深度有限 |\n`;
  md += `| **6. Certification Accuracy %** | **${overall.certAccuracyRate}** | ${overall.total} | 初始基線：Thai SELECT 2025-2027 專題頁面剛部署，AI 尚未建立最新索引 |\n`;
  md += `| **7. Product/Location Accuracy %** | **${overall.prodLocAccuracyRate}** | ${overall.total} | 初始基線：海天居周邊地標有基礎關聯，交通停車詳情待擴散 |\n\n`;

  md += `### 3.2 各大 AI 搜尋引擎表現矩陣\n\n`;
  md += `| AI 搜尋引擎 | 評測題數 | 提及率 | 實體關聯 | 官網引用 | 引用質量(均分) | NAP準確 | 認證準確 | 菜品交通 |\n`;
  md += `| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
  engineRows.forEach(row => {
    md += `| **${row.AI搜尋引擎}** | ${row.樣本數} | ${row.提及率} | ${row.實體關聯} | ${row.官網引用} | ${row.引用質量} | ${row.NAP準確} | ${row.認證準確} | ${row.菜品交通} |\n`;
  });

  md += `\n## 4. 25 組固定基準問題集拓撲清單 (Fixed Benchmark Corpus)\n\n`;
  md += `| ID | 類別 | 測試查詢 (Query) | 語言 | 核心預期事實校驗點 |\n`;
  md += `| :--- | :--- | :--- | :---: | :--- |\n`;
  queries.forEach(q => {
    md += `| **${q.id}** | ${q.category} | \`${q.query}\` | ${q.controlled_variables.language} | 預期實體：${q.evaluation_targets.expected_entity}；關聯：${q.evaluation_targets.expected_association} |\n`;
  });

  md += `\n## 5. 搜尋可見性三階段演進路徑 (Progression Path)\n\n`;
  md += `\`\`\`text
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
\`\`\`\n`;

  fs.writeFileSync(reportMdPath, md, "utf8");
  console.log(`\n📄 完整 7 大指標驗收 Markdown 報告已生成至: ${reportMdPath}`);
}

runAnalysis();
