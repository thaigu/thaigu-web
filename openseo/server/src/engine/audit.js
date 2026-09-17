import { memoryStore } from "../db/index.js";

/**
 * 5 維度 SEO 健康度與成熟度矩陣 (5-Pillar SEO Readiness Matrix)
 */
export async function getReadinessMatrix() {
  return memoryStore.readinessMatrix;
}

export async function runHealthAudit() {
  return {
    ok: true,
    matrix: memoryStore.readinessMatrix,
    audit_results: memoryStore.auditResults,
  };
}
