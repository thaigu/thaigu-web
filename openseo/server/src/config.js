import dotenv from "dotenv";
dotenv.config();

export const config = {
  // 應用基礎資訊
  siteName: process.env.SITE_NAME || "openSEO Demo Site",
  siteUrl: process.env.SITE_URL || "https://example.com",
  siteDomain: process.env.SITE_DOMAIN || "example.com",
  port: parseInt(process.env.PORT || "8790", 10),
  isDev: process.env.NODE_ENV !== "production",
  demoMode: process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL,

  // 資料庫
  databaseUrl: process.env.DATABASE_URL || "",

  // Google Search Console (GSC) API 憑證
  gsc: {
    siteUrl: process.env.GSC_SITE_URL || process.env.SITE_URL || "https://example.com/",
    clientEmail: process.env.GSC_CLIENT_EMAIL || "",
    privateKey: process.env.GSC_PRIVATE_KEY ? process.env.GSC_PRIVATE_KEY.replace(/\\n/g, "\n") : "",
    keyFile: process.env.GSC_KEY_FILE || "./config/gsc-service-account.json",
  },

  // 品牌詞過濾規則 (剔除品牌自帶流量，專注非品牌自然增長)
  brandKeywordsRegex: new RegExp(
    process.env.BRAND_KEYWORDS_REGEX || "openseo|myplatform|example",
    "i"
  ),

  // 搜尋意圖分類正則 (四類搜尋意圖)
  intentRules: [
    { regex: /buy|price|cost|shop|store|order|discount|cheap|在哪買|哪裡買|價格|費用|多少錢|購買|優惠/i, intent: "transactional" },
    { regex: /vs|versus|compare|comparison|review|best|top|評測|比較|評價|哪家好|哪個好|排名/i, intent: "commercial" },
    { regex: /how to|what is|guide|tutorial|tips|why|如何|怎麼|攻略|教學|指南|是什麼|原因/i, intent: "informational" },
    { regex: /login|signin|official|website|app|contact|官網|登入|登錄|官方|客服/i, intent: "navigational" },
  ],

  // 常用落地頁快捷選項
  quickTargetUrls: [
    { label: "首頁 (Landing)", url: "/" },
    { label: "產品比較 (Compare)", url: "/compare" },
    { label: "特惠專案 (Deals)", url: "/deals" },
    { label: "購物/導購指南 (Guide)", url: "/shopping-guide" },
    { label: "熱門分類 (Category)", url: "/category/featured" },
  ],

  // 行動冷卻期配置 (毫秒)，避免短期內對同一頁面反覆調整造成排名震盪
  cooldownConfig: {
    FIX_INDEXING: 1 * 24 * 60 * 60 * 1000,             // 1 天
    OPTIMIZE_TITLE_CTR: 7 * 24 * 60 * 60 * 1000,       // 7 天 (等待搜尋引擎抓取並累積樣本)
    TEST_INTERNAL_LINKS: 7 * 24 * 60 * 60 * 1000,      // 7 天
    IMPROVE_HUB: 7 * 24 * 60 * 60 * 1000,              // 7 天
    REBUILD_INTERNAL_LINKS: 3 * 24 * 60 * 60 * 1000,   // 3 天
    INVESTIGATE_RANKING_DROP: 1 * 24 * 60 * 60 * 1000, // 1 天
  }
};
