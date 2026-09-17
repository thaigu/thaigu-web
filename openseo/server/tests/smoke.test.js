import test from "node:test";
import assert from "node:assert/strict";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerSeoRoutes } from "../src/routes/seo.js";

async function buildApp() {
  const app = Fastify();
  await app.register(cors);
  app.get("/api/health", async () => ({ status: "ok" }));
  registerSeoRoutes(app);
  return app;
}

test("openSEO API Smoke Tests", async (t) => {
  const app = await buildApp();

  await t.test("GET /api/health", async () => {
    const res = await app.inject({ method: "GET", url: "/api/health" });
    assert.equal(res.statusCode, 200);
    const json = res.json();
    assert.equal(json.status, "ok");
  });

  await t.test("GET /api/seo/dashboard?days=28", async () => {
    const res = await app.inject({ method: "GET", url: "/api/seo/dashboard?days=28" });
    assert.equal(res.statusCode, 200);
    const json = res.json();
    assert.ok(json.performance, "應包含 performance 統計");
    assert.ok(json.ranking_distribution, "應包含 ranking_distribution");
    assert.ok(Array.isArray(json.trends), "trends 應為陣列");
    assert.ok(json.priority_action, "應包含 priority_action");
    assert.ok(json.user_stats, "應包含 user_stats");
    assert.ok(json.readiness_matrix, "應包含 readiness_matrix");
  });

  await t.test("GET /api/seo/priority-action", async () => {
    const res = await app.inject({ method: "GET", url: "/api/seo/priority-action?days=28" });
    assert.equal(res.statusCode, 200);
    const json = res.json();
    assert.ok(json.today, "應包含 today #1 行動");
  });

  await t.test("GET /api/seo/keywords & POST new keyword", async () => {
    const listRes = await app.inject({ method: "GET", url: "/api/seo/keywords" });
    assert.equal(listRes.statusCode, 200);
    const listJson = listRes.json();
    assert.ok(Array.isArray(listJson.keywords));

    const postRes = await app.inject({
      method: "POST",
      url: "/api/seo/keywords",
      payload: { term: "自動化測試關鍵詞", target_url: "/guides/test" },
    });
    assert.equal(postRes.statusCode, 200);
    const postJson = postRes.json();
    assert.equal(postJson.term, "自動化測試關鍵詞");
    assert.equal(postJson.target_url, "/guides/test");
  });

  await t.test("POST /api/seo/priority-action/execute", async () => {
    const execRes = await app.inject({
      method: "POST",
      url: "/api/seo/priority-action/execute",
      payload: {
        action: "OPTIMIZE_STRIKING_DISTANCE",
        targetIdentifier: "/guides/test",
        pageUrl: "/guides/test",
        score: 90,
      },
    });
    assert.equal(execRes.statusCode, 200);
    const execJson = execRes.json();
    assert.equal(execJson.ok, true);
  });
});
