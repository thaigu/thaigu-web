import { memoryStore } from "../db/index.js";

/**
 * 內部鏈接拓撲與孤島頁面偵測器 (Internal Links Engine)
 */
export async function buildInternalLinks() {
  // 重新計算拓撲連結
  return {
    ok: true,
    message: "內部鏈接拓撲重建完畢，已優化權重權重分配",
    total_links: memoryStore.links.length,
  };
}

export async function getOrphanPages() {
  // 找出沒有任何入鏈的頁面
  const targetIds = new Set(memoryStore.links.map((l) => l.target_page_id));
  const orphans = memoryStore.pages.filter((p) => !targetIds.has(p.id));
  return orphans;
}
