/**
 * openSEO 初始演示與種子數據集 (Realistic Mock Data)
 * 涵蓋全套 7 大模組的完整業務數據結構
 */
export function getInitialSeedData() {
  const today = new Date();
  const dateStr = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().split("T")[0];
  };

  // 生成過去 28 天的每日搜尋趨勢
  const trends = [];
  for (let i = 28; i >= 0; i--) {
    const date = dateStr(i);
    // 模擬真實波動
    const baseImp = 1800 + Math.floor(Math.sin(i / 3) * 400) + Math.floor(Math.random() * 200);
    const baseClicks = Math.floor(baseImp * (0.038 + Math.random() * 0.015));
    const avgPos = (8.4 + Math.cos(i / 4) * 1.5).toFixed(1);
    trends.push({
      date,
      impressions: baseImp,
      clicks: baseClicks,
      ctr: Number(((baseClicks / baseImp) * 100).toFixed(2)),
      position: parseFloat(avgPos),
    });
  }

  return {
    pages: [
      { id: 1, page_type: "landing", slug: "compare", canonical_url: "/compare", title: "即時規格與價格比較對決 | openSEO", seo_score: 95, indexable: true, robots: "index,follow" },
      { id: 2, page_type: "landing", slug: "shopping-guide", canonical_url: "/shopping-guide", title: "全方位智能購物指南與選購評測", seo_score: 88, indexable: true, robots: "index,follow" },
      { id: 3, page_type: "category", slug: "smartphones", canonical_url: "/category/smartphones", title: "熱門智慧型手機比價清單", seo_score: 92, indexable: true, robots: "index,follow" },
      { id: 4, page_type: "category", slug: "laptops", canonical_url: "/category/laptops", title: "高效能筆記型電腦推薦排行", seo_score: 84, indexable: true, robots: "index,follow" },
      { id: 5, page_type: "product", slug: "pro-laptop-16", canonical_url: "/product/pro-laptop-16", title: "Pro Laptop 16 吋旗艦規格與各商戶最低價", seo_score: 78, indexable: true, robots: "index,follow" },
      { id: 6, page_type: "product", slug: "wireless-earbuds-x", canonical_url: "/product/wireless-earbuds-x", title: "Wireless Earbuds X 主動降噪真無線耳機", seo_score: 65, indexable: false, robots: "noindex,follow" },
    ],

    links: [
      { source_page_id: 1, target_page_id: 3, link_type: "contextual", weight: 90 },
      { source_page_id: 1, target_page_id: 4, link_type: "contextual", weight: 85 },
      { source_page_id: 3, target_page_id: 5, link_type: "category_to_product", weight: 95 },
    ],

    opportunities: [
      {
        id: 101,
        query: "旗艦降噪耳機評測推薦",
        suggested_page_type: "striking_distance",
        suggested_slug: "/shopping-guide#audio",
        impressions: 4250,
        clicks: 168,
        position: 7.8,
        opportunity_score: 89,
        status: "pending",
        reason: "目前排名第 7.8 位 (Striking Distance)，具有極高曝光量，增強 H2 標籤與規格表格可躍升至首頁前 3 位！",
      },
      {
        id: 102,
        query: "輕薄筆電價格比較 2026",
        suggested_page_type: "ctr_optimization",
        suggested_slug: "/category/laptops",
        impressions: 6890,
        clicks: 142,
        position: 4.2,
        opportunity_score: 94,
        status: "pending",
        reason: "排名第 4.2 位但 CTR 僅 2.06% (低於同排位 5.2% 均值)，急需優化 Title Meta 加入具吸引力的省錢與現貨比價標籤！",
      },
      {
        id: 103,
        query: "二手機翻新驗機指南",
        suggested_page_type: "missing_landing",
        suggested_slug: "/guides/refurbished-phones",
        impressions: 2980,
        clicks: 45,
        position: 14.5,
        opportunity_score: 76,
        status: "pending",
        reason: "檢測到高頻商業意圖搜尋詞，但站內尚無專屬落地頁，建議新建 Hub 頁面承接流量。",
      },
    ],

    keywords: [
      { id: 1, term: "智慧型手機價格比較", locale: "zh-Hant", intent: "commercial", is_brand: false, target_url: "/category/smartphones", source: "seed", priority: 10, impressions: 8450, clicks: 320, position: 4.5 },
      { id: 2, term: "輕薄筆電推薦排行", locale: "zh-Hant", intent: "commercial", is_brand: false, target_url: "/category/laptops", source: "seed", priority: 9, impressions: 6200, clicks: 195, position: 5.8 },
      { id: 3, term: "哪裡買耳機便宜", locale: "zh-Hant", intent: "transactional", is_brand: false, target_url: null, source: "gsc", priority: 8, impressions: 3890, clicks: 88, position: 11.2 }, // Gap!
      { id: 4, term: "如何挑選適合的顯示卡", locale: "zh-Hant", intent: "informational", is_brand: false, target_url: "/shopping-guide", source: "seed", priority: 7, impressions: 2450, clicks: 112, position: 8.1 },
      { id: 5, term: "openSEO 官方網站", locale: "zh-Hant", intent: "navigational", is_brand: true, target_url: "/", source: "gsc", priority: 5, impressions: 1800, clicks: 420, position: 1.1 },
      { id: 6, term: "2026 最省電變頻冷氣", locale: "zh-Hant", intent: "commercial", is_brand: false, target_url: null, source: "manual", priority: 8, impressions: 1950, clicks: 42, position: 16.4 }, // Gap!
    ],

    keywordDaily: [
      { keyword_id: 1, date: dateStr(0), best_url: "/category/smartphones", position: 4.5, impressions: 310, clicks: 12 },
      { keyword_id: 2, date: dateStr(0), best_url: "/category/laptops", position: 5.8, impressions: 220, clicks: 7 },
    ],

    gscAnalytics: trends,

    syncStatus: {
      aggregate: {
        track: "aggregate",
        last_attempt_at: new Date(Date.now() - 3600000).toISOString(),
        last_success_at: new Date(Date.now() - 3600000).toISOString(),
        last_rows: 480,
        last_error: null,
      },
      query: {
        track: "query",
        last_attempt_at: new Date(Date.now() - 3600000).toISOString(),
        last_success_at: new Date(Date.now() - 3600000).toISOString(),
        last_rows: 1250,
        last_error: null,
        state: "available",
      },
    },

    auditResults: [
      { id: 1, audit_type: "ORPHAN_PAGE", page_id: 6, severity: "warning", details: { slug: "/product/wireless-earbuds-x", reason: "全站無內部鏈接指向該商品頁" }, resolved: false },
      { id: 2, audit_type: "CANONICAL_AUDIT", page_id: 2, severity: "info", details: { slug: "/shopping-guide", status: "100% 正確規範化" }, resolved: true },
    ],

    readinessMatrix: [
      { key: "technical", name: "Technical SEO", status: "PASS", progress: 100, color: "bg-emerald-500", detail: "Sitemap 分片, Canonical, Robots, JSON-LD, SSR 100% 通過" },
      { key: "content", name: "Content & Thin Page", status: "PASS", progress: 95, color: "bg-emerald-500", detail: "零死品、零假陽性軟 404、規格表覆蓋率 95%" },
      { key: "internal_links", name: "Internal Linking", status: "WARN", progress: 78, color: "bg-amber-500", detail: "站內尚存 1 個孤島頁面，拓撲權重聚集良好" },
      { key: "coverage", name: "Coverage & Indexing", status: "PASS", progress: 88, color: "bg-emerald-500", detail: "有效索引率 88%，核心落地頁 100% 覆蓋" },
      { key: "gsc_loop", name: "GSC Data Loop", status: "PASS", progress: 100, color: "bg-emerald-500", detail: "GSC 雙軌每日同步正常，28 天數據迴路通暢" },
    ],

    userStats: {
      overview: {
        total_users: 1248,
        period_new: 186,
        today_new: 12,
        seven_days_new: 58,
        active_30d: 942,
      },
      providers: [
        { provider: "google", label: "Google 一鍵登入", count: 686, period_count: 104, pct: 55.0 },
        { provider: "email", label: "Email 密碼註冊", count: 424, period_count: 62, pct: 34.0 },
        { provider: "apple", label: "Apple ID 快速登入", count: 138, period_count: 20, pct: 11.0 },
      ],
      regions: [
        { region: "Taipei / HK / Macau", count: 860, pct: 68.9 },
        { region: "North America", count: 240, pct: 19.2 },
        { region: "Other Regions", count: 148, pct: 11.9 },
      ],
      recent: [
        { id: 1, email_masked: "al***@gmail.com", name: "Alex C.", provider: "google", region: "Taipei", created_at: new Date(Date.now() - 15 * 60000).toISOString() },
        { id: 2, email_masked: "sa***@hotmail.com", name: "Sarah K.", provider: "email", region: "Hong Kong", created_at: new Date(Date.now() - 45 * 60000).toISOString() },
        { id: 3, email_masked: "ke***@icloud.com", name: "Kevin W.", provider: "apple", region: "Macau", created_at: new Date(Date.now() - 120 * 60000).toISOString() },
      ],
    },
  };
}
