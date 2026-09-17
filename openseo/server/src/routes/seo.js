import { memoryStore } from "../db/index.js";
import { config } from "../config.js";
import {
  getTodayPriorityAction,
  executePriorityAction,
  dismissPriorityAction,
} from "../engine/priority-engine.js";
import {
  getKeywords,
  addKeyword,
  deleteKeyword,
  updateKeywordTarget,
  autoAssignKeywords,
  seedKeywords,
} from "../engine/keyword.js";
import {
  mineOpportunities,
  applyOpportunity,
  dismissOpportunity,
} from "../engine/opportunity.js";
import { buildInternalLinks } from "../engine/links.js";
import { syncGscData } from "../engine/gsc-client.js";

export function registerSeoRoutes(app) {
  // 1. 全量儀表板資料聚合 API
  app.get("/api/seo/dashboard", async (req, reply) => {
    const days = parseInt(req.query?.days || "28", 10);
    const priority = await getTodayPriorityAction(days);
    const kwSummary = await getKeywords();

    // 依天數切片 trends
    const trends = memoryStore.gscAnalytics.slice(-days);
    const totalImpressions = trends.reduce((acc, cur) => acc + cur.impressions, 0);
    const totalClicks = trends.reduce((acc, cur) => acc + cur.clicks, 0);
    const avgPosition = trends.length > 0 ? (trends.reduce((acc, cur) => acc + cur.position, 0) / trends.length).toFixed(1) : 0;
    const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

    // 頂部高價值查詢清單 (Top Queries)
    const topQueries = memoryStore.keywords.map((k) => ({
      query: k.term,
      best_url: k.target_url || "/",
      impressions: k.impressions || Math.floor(Math.random() * 2000 + 500),
      clicks: k.clicks || Math.floor(Math.random() * 100 + 20),
      ctr: k.impressions ? Number(((k.clicks / k.impressions) * 100).toFixed(2)) : 3.5,
      position: k.position || 5.4,
      is_brand: k.is_brand,
      has_target: !!k.target_url,
    })).sort((a, b) => b.impressions - a.impressions);

    return {
      performance: {
        impressions: totalImpressions,
        clicks: totalClicks,
        ctr: parseFloat(avgCtr),
        position: parseFloat(avgPosition),
        brand_clicks: Math.floor(totalClicks * 0.15),
        non_brand_clicks: Math.floor(totalClicks * 0.85),
        pages_with_clicks: 18,
      },
      ranking_distribution: {
        total: 120,
        top3: 24,
        p4_10: 48,
        p11_20: 32,
        p21_50: 12,
        p50_plus: 4,
      },
      trends,
      top_queries: topQueries,
      top_opportunities: memoryStore.opportunities,
      priority_action: priority,
      gsc_health: memoryStore.syncStatus,
      readiness_matrix: memoryStore.readinessMatrix,
      user_stats: memoryStore.userStats,
      indexing: {
        total_pages: memoryStore.pages.length,
        indexed_pages: memoryStore.pages.filter((p) => p.indexable).length,
        orphan_pages: memoryStore.auditResults.filter((a) => a.audit_type === "ORPHAN_PAGE" && !a.resolved).length,
      },
      summary: {
        site_name: config.siteName,
        site_url: config.siteUrl,
        demo_mode: config.demoMode,
      },
    };
  });

  // 2. 確定性優先級決策 API
  app.get("/api/seo/priority-action", async (req) => {
    const days = parseInt(req.query?.days || "28", 10);
    return getTodayPriorityAction(days);
  });

  app.post("/api/seo/priority-action/execute", async (req) => {
    return executePriorityAction(req.body || {});
  });

  app.post("/api/seo/priority-action/dismiss", async (req) => {
    return dismissPriorityAction(req.body || {});
  });

  // 3. 關鍵詞資產層 API
  app.get("/api/seo/keywords", async () => {
    return getKeywords();
  });

  app.post("/api/seo/keywords", async (req) => {
    const { term, target_url, note } = req.body || {};
    return addKeyword(term, target_url, note);
  });

  app.delete("/api/seo/keywords/:id", async (req) => {
    const success = await deleteKeyword(req.params.id);
    return { ok: success };
  });

  app.patch("/api/seo/keywords/:id", async (req) => {
    const { target_url } = req.body || {};
    const updated = await updateKeywordTarget(req.params.id, target_url);
    return { ok: true, keyword: updated };
  });

  app.post("/api/seo/keywords/auto-assign", async () => {
    return autoAssignKeywords();
  });

  app.post("/api/seo/keywords/seed", async () => {
    return seedKeywords();
  });

  app.post("/api/seo/keywords/sync-gsc", async () => {
    return syncGscData();
  });

  // 4. 機會挖掘 API
  app.get("/api/seo/opportunities", async () => {
    return mineOpportunities();
  });

  app.post("/api/seo/opportunities/mine", async () => {
    return mineOpportunities();
  });

  app.post("/api/seo/opportunities/:id/apply", async (req) => {
    return applyOpportunity(req.params.id);
  });

  app.post("/api/seo/opportunities/:id/dismiss", async (req) => {
    return dismissOpportunity(req.params.id);
  });

  // 5. 內部鏈接與整體同步 API
  app.post("/api/seo/build-links", async () => {
    return buildInternalLinks();
  });

  app.post("/api/seo/sync", async () => {
    await syncGscData();
    await buildInternalLinks();
    return { ok: true, message: "全量 SEO 數據與拓撲更新同步成功！" };
  });
}
