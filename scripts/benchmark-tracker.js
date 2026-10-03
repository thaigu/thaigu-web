import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const queriesPath = path.resolve(__dirname, "../benchmarks/geo-aeo-queries.json");
const resultsPath = path.resolve(__dirname, "../benchmarks/results.json");

const queries = JSON.parse(fs.readFileSync(queriesPath, "utf8"));
let results = [];
if (fs.existsSync(resultsPath)) {
  results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
}

function printSummary() {
  console.log("=======================================================");
  console.log("  泰谷 (thaikok.com) SEO / AEO / GEO 三軌實測驗收矩陣  ");
  console.log("=======================================================");
  console.log(`總測試問題數: ${queries.length} 題`);
  console.log(`已記錄實測結果數: ${results.length} 筆`);

  if (results.length === 0) {
    console.log("\n目前尚無手動/自動錄入的 AI Engine 評測記錄。");
    console.log("基準問題集已就緒，可使用此工具產出測試表單進行評測。");
  } else {
    const engines = [...new Set(results.map(r => r.engine))];
    console.log(`覆蓋引擎: ${engines.join(", ")}`);

    const mentionedCount = results.filter(r => r.mentioned_thaigu).length;
    const citedCount = results.filter(r => r.cited_website).length;
    const correctFactCount = results.filter(r => r.accurate_facts).length;

    console.log(`- 泰谷提及率: ${((mentionedCount / results.length) * 100).toFixed(1)}% (${mentionedCount}/${results.length})`);
    console.log(`- 官網引用率 (Citation): ${((citedCount / results.length) * 100).toFixed(1)}% (${citedCount}/${results.length})`);
    console.log(`- 事實正確率 (NAP & 認證): ${((correctFactCount / results.length) * 100).toFixed(1)}% (${correctFactCount}/${results.length})`);
  }

  console.log("\n--- 基準問題集預覽 (前 5 題) ---");
  console.table(queries.slice(0, 5).map(q => ({
    ID: q.id,
    類別: q.category,
    測試問題: q.query,
    目標事實: q.target_fact
  })));
}

function generateReportMarkdown() {
  const mdPath = path.resolve(__dirname, "../benchmarks/BENCHMARK_REPORT.md");
  let content = `# 泰谷 ThaiGu (thaikok.com) SEO / AEO / GEO 基準實測驗收總報告\n\n`;
  content += `> 實施原則：拒絕虛擬流量，以真實檢索曝光、AI 引用與實體關聯事實作為唯一驗收依據。\n\n`;
  content += `## 1. 評測架構矩陣 (25 Queries × 5 AI Engines)\n\n`;
  content += `評測對象包含 **ChatGPT Search, Perplexity, Gemini, Claude, Copilot**，追蹤指標：\n`;
  content += `- **Entity Mention**: 是否提及「泰谷 / ThaiGu」\n`;
  content += `- **Web Citation**: 是否引用 \`thaikok.com\` 網址及對應頁面\n`;
  content += `- **NAP & Fact Accuracy**: 是否準確輸出澳門黑沙環海天居地址、電話與 Thai SELECT 官方認證\n\n`;

  content += `## 2. 25 組基準問題拓撲表\n\n`;
  content += `| ID | 類別 | 測試查詢 (Query) | 目標實體與事實錨點 |\n`;
  content += `| :--- | :--- | :--- | :--- |\n`;
  queries.forEach(q => {
    content += `| **${q.id}** | ${q.category} | ${q.query} | ${q.target_fact} |\n`;
  });

  content += `\n## 3. 現階段基礎設施落地狀態 (Infrastructure Baseline)\n\n`;
  content += `- [x] **SEO Content Layer**: 3 大專題頁面上線 (美食指南、認證解密、交通指引)\n`;
  content += `- [x] **AEO Fact Layer**: \`/llms.txt\` 與 \`/llms-full.txt\` 官方事實庫標準化\n`;
  content += `- [x] **AI Crawler Layer**: \`robots.txt\` 放行 GPTBot, ClaudeBot, PerplexityBot, Applebot, Cohere-ai 等\n`;
  content += `- [x] **Entity & Schema Layer**: Restaurant / ThaiRestaurant JSON-LD 雙重堂區與經緯度校準\n`;
  content += `- [x] **Sitemap & IndexNow**: Google GSC (HTTP 204) 與 Bing/IndexNow (HTTP 200) 即時推送生效\n`;

  fs.writeFileSync(mdPath, content, "utf8");
  console.log(`\n✅ 基準報告已生成至: ${mdPath}`);
}

printSummary();
generateReportMarkdown();
