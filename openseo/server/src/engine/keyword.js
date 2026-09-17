import { config } from "../config.js";
import { memoryStore } from "../db/index.js";

/**
 * 關鍵詞資產層 (Keyword Asset Management)
 * 解決三項核心問題：
 * 1. Gap: 有使用者搜尋但無專屬落地頁承接
 * 2. Cannibalization: 兩頁互搶同一個關鍵詞權重
 * 3. Misalignment: 實際排上去的頁面與預期推廣落地頁不符
 */

/**
 * 意圖分類器
 */
export function classifyIntent(term) {
  for (const { regex, intent } of config.intentRules) {
    if (regex.test(term)) return intent;
  }
  return "commercial"; // 預設為比較/評估商業意圖
}

/**
 * 是否為品牌詞
 */
export function isBrandTerm(term) {
  return config.brandKeywordsRegex.test(term);
}

/**
 * 取得所有關鍵詞及其診斷狀態
 */
export async function getKeywords() {
  const keywords = memoryStore.keywords.map((k) => {
    // 檢查是否有 Gap
    const isGap = !k.target_url;
    return {
      ...k,
      is_gap: isGap,
    };
  });

  const gapCount = keywords.filter((k) => k.is_gap).length;
  const totalCount = keywords.length;

  return {
    keywords,
    summary: {
      total: totalCount,
      gaps: gapCount,
      assigned: totalCount - gapCount,
      brand_count: keywords.filter((k) => k.is_brand).length,
      commercial_count: keywords.filter((k) => k.intent === "commercial").length,
    },
  };
}

/**
 * 新增關鍵詞
 */
export async function addKeyword(term, targetUrl = null, note = "") {
  const cleanTerm = String(term).trim();
  const existing = memoryStore.keywords.find((k) => k.term.toLowerCase() === cleanTerm.toLowerCase());
  if (existing) {
    throw new Error(`關鍵詞「${cleanTerm}」已存在`);
  }

  const newKw = {
    id: Date.now(),
    term: cleanTerm,
    locale: "zh-Hant",
    intent: classifyIntent(cleanTerm),
    is_brand: isBrandTerm(cleanTerm),
    target_url: targetUrl || null,
    source: "manual",
    priority: 5,
    note,
    impressions: 0,
    clicks: 0,
    position: null,
    created_at: new Date().toISOString(),
  };

  memoryStore.keywords.unshift(newKw);
  return newKw;
}

/**
 * 刪除關鍵詞
 */
export async function deleteKeyword(id) {
  const index = memoryStore.keywords.findIndex((k) => k.id === Number(id));
  if (index !== -1) {
    memoryStore.keywords.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * 指派或更新落地頁
 */
export async function updateKeywordTarget(id, targetUrl) {
  const kw = memoryStore.keywords.find((k) => k.id === Number(id));
  if (!kw) throw new Error("關鍵詞不存在");
  kw.target_url = targetUrl || null;
  kw.updated_at = new Date().toISOString();
  return kw;
}

/**
 * 智能自動配對 (Auto-assign Target URLs)
 * 掃描關鍵詞與現有頁面 slug / title 進行相似度配對
 */
export async function autoAssignKeywords() {
  const pages = memoryStore.pages;
  let matched = 0;

  for (const kw of memoryStore.keywords) {
    if (!kw.target_url) {
      // 尋找最佳契合頁面
      const bestMatch = pages.find((p) => {
        const slugClean = p.slug.toLowerCase().replace(/-/g, " ");
        const titleClean = (p.title || "").toLowerCase();
        const termClean = kw.term.toLowerCase();
        return slugClean.includes(termClean) || titleClean.includes(termClean) || termClean.includes(slugClean);
      });

      if (bestMatch) {
        kw.target_url = bestMatch.canonical_url;
        matched++;
      }
    }
  }

  return {
    ok: true,
    scanned: pages.length,
    matched,
  };
}

/**
 * 注入種子詞庫
 */
export async function seedKeywords() {
  const sampleSeeds = [
    { term: "2026 旗艦降噪耳機選購推薦", intent: "commercial", target_url: "/shopping-guide" },
    { term: "4K 智慧聯網電視評測與價格", intent: "commercial", target_url: null },
    { term: "掃拖機器人哪款好用", intent: "informational", target_url: null },
    { term: "輕薄商務筆電現貨比價", intent: "transactional", target_url: "/category/laptops" },
  ];

  let added = 0;
  for (const item of sampleSeeds) {
    const exists = memoryStore.keywords.some((k) => k.term === item.term);
    if (!exists) {
      memoryStore.keywords.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        term: item.term,
        locale: "zh-Hant",
        intent: item.intent,
        is_brand: false,
        target_url: item.target_url,
        source: "seed",
        priority: 7,
        impressions: 1200 + Math.floor(Math.random() * 800),
        clicks: 45 + Math.floor(Math.random() * 30),
        position: 6.5,
      });
      added++;
    }
  }

  return { ok: true, added };
}
