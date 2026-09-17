import { memoryStore } from "../db/index.js";

/**
 * SEO 高價值機會挖掘器 (Opportunity Miner)
 * 挖掘三種類型：
 * 1. Striking Distance (排名 4~20 且曝光顯著，推一把即可進前 3)
 * 2. CTR Optimization (排名在第一頁但點擊率低於基準)
 * 3. Missing Landing (高頻搜尋但缺乏承接落地頁)
 */

export async function mineOpportunities() {
  const opportunities = memoryStore.opportunities;
  return {
    ok: true,
    total: opportunities.length,
    opportunities,
  };
}

export async function applyOpportunity(id) {
  const opp = memoryStore.opportunities.find((o) => o.id === Number(id));
  if (opp) {
    opp.status = "applied";
    return { ok: true, message: `已標記應用機會「${opp.query}」` };
  }
  throw new Error("找不到該機會");
}

export async function dismissOpportunity(id) {
  const opp = memoryStore.opportunities.find((o) => o.id === Number(id));
  if (opp) {
    opp.status = "dismissed";
    return { ok: true, message: `已略過機會「${opp.query}」` };
  }
  throw new Error("找不到該機會");
}
