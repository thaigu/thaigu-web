import { config } from "../config.js";
import { getInitialSeedData } from "./seed-data.js";
import pg from "pg";

const { Pool } = pg;

// 內存 Mock 存儲 (在無 Postgres 或 Demo 模式下即刻提供全套持久/可交互數據)
class InMemoryStore {
  constructor() {
    this.reset();
  }

  reset() {
    const seed = getInitialSeedData();
    this.pages = [...seed.pages];
    this.links = [...seed.links];
    this.opportunities = [...seed.opportunities];
    this.keywords = [...seed.keywords];
    this.keywordDaily = [...seed.keywordDaily];
    this.gscAnalytics = [...seed.gscAnalytics];
    this.syncStatus = { ...seed.syncStatus };
    this.auditResults = [...seed.auditResults];
    this.readinessMatrix = [...seed.readinessMatrix];
    this.userStats = { ...seed.userStats };
    this.completedActions = [];
    this.dismissedActions = [];
  }
}

export const memoryStore = new InMemoryStore();

let pool = null;
if (config.databaseUrl && !config.demoMode) {
  try {
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
  } catch (err) {
    console.warn("⚠️ Postgres 連線初始化失敗，自動降級為 Demo/Memory 模式：", err.message);
  }
}

/**
 * 統一查詢適配器
 */
export async function query(text, params = []) {
  if (pool) {
    const res = await pool.query(text, params);
    return res.rows;
  }
  return [];
}

/**
 * Tagged Template 語法適配器 sql`...`
 */
export async function sql(strings, ...values) {
  if (pool) {
    let queryText = "";
    const queryParams = [];
    for (let i = 0; i < strings.length; i++) {
      queryText += strings[i];
      if (i < values.length) {
        queryParams.push(values[i]);
        queryText += `$${queryParams.length}`;
      }
    }
    const res = await pool.query(queryText, queryParams);
    return res.rows;
  }
  // 在 Demo 模式下，sql 調用返回內存存儲對應數據
  return [];
}

export default { query, sql, memoryStore };
