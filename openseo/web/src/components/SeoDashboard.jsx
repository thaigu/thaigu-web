import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Input } from "./ui.jsx";

export default function SeoDashboard() {
  const [days, setDays] = useState(28);
  const [data, setData] = useState(null);
  const [kwData, setKwData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [oppFilter, setOppFilter] = useState("all");
  const [showKeywords, setShowKeywords] = useState(true);
  const [newTerm, setNewTerm] = useState("");
  const [newTargetUrl, setNewTargetUrl] = useState("");
  const [editingKwId, setEditingKwId] = useState(null);
  const [editingUrl, setEditingUrl] = useState("");
  const [showRunnerUps, setShowRunnerUps] = useState(false);
  const [lastCompletedAction, setLastCompletedAction] = useState(null);

  const loadData = (d = days) => {
    fetch(`/api/seo/dashboard?days=${d}`)
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error("加載 SEO 儀表板失敗:", err));
  };

  const loadKwData = () => {
    fetch("/api/seo/keywords")
      .then((r) => r.json())
      .then(setKwData)
      .catch((err) => console.error("加載關鍵詞失敗:", err));
  };

  useEffect(() => {
    loadData(days);
  }, [days]);

  useEffect(() => {
    if (showKeywords) {
      loadKwData();
    }
  }, [showKeywords]);

  const triggerAction = async (endpoint, name) => {
    setLoading(true);
    setActionMsg(`正在執行 ${name}...`);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const json = await res.json();
      setActionMsg(`${name} 完成！${json.message || ""}`);
      loadData(days);
      if (showKeywords) loadKwData();
    } catch (err) {
      setActionMsg(`${name} 失敗: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setActionMsg(""), 5000);
    }
  };

  const handleExecutePriorityAction = async (actionItem) => {
    if (!actionItem) return;
    setLoading(true);
    setActionMsg(`正在執行：${actionItem.action_name}...`);
    try {
      const res = await fetch("/api/seo/priority-action/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionItem.action,
          targetIdentifier: actionItem.target_page || actionItem.query,
          pageUrl: actionItem.target_page,
          score: actionItem.score,
          opportunityId: actionItem.opportunity_id,
        }),
      });
      const json = await res.json();
      setActionMsg(`✅ ${json.message || "執行成功！"}`);
      setLastCompletedAction({
        name: actionItem.action_name,
        time: new Date().toLocaleTimeString(),
        details: json.execution?.details || "已實質更新並進入防震盪冷卻名單",
      });
      loadData(days);
    } catch (err) {
      setActionMsg(`執行失敗: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setActionMsg(""), 5000);
    }
  };

  const handleDismissPriorityAction = async (actionItem) => {
    if (!actionItem) return;
    setLoading(true);
    setActionMsg(`正在暫緩：${actionItem.action_name}...`);
    try {
      const res = await fetch("/api/seo/priority-action/dismiss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionItem.action,
          targetIdentifier: actionItem.target_page || actionItem.query,
          score: actionItem.score,
        }),
      });
      const json = await res.json();
      setActionMsg(`⏸️ ${json.message || "已加入冷卻名單"}`);
      loadData(days);
    } catch (err) {
      setActionMsg(`操作失敗: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setActionMsg(""), 5000);
    }
  };

  const handleApplyOpportunity = async (id) => {
    await fetch(`/api/seo/opportunities/${id}/apply`, { method: "POST" });
    loadData(days);
  };

  const handleDismissOpportunity = async (id) => {
    await fetch(`/api/seo/opportunities/${id}/dismiss`, { method: "POST" });
    loadData(days);
  };

  const handleAddKeyword = async (e) => {
    e.preventDefault();
    if (!newTerm.trim()) return;
    try {
      await fetch("/api/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: newTerm.trim(), target_url: newTargetUrl.trim() || undefined }),
      });
      setNewTerm("");
      setNewTargetUrl("");
      loadKwData();
      setActionMsg("已成功加入關鍵詞！");
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      setActionMsg(`新增失敗: ${err.message}`);
    }
  };

  const handleDeleteKeyword = async (id) => {
    try {
      await fetch(`/api/seo/keywords/${id}`, { method: "DELETE" });
      loadKwData();
      setActionMsg("已刪除關鍵詞");
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      setActionMsg(`刪除失敗: ${err.message}`);
    }
  };

  const handleAssignTargetUrl = async (id, targetUrl) => {
    try {
      const res = await fetch(`/api/seo/keywords/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_url: targetUrl }),
      });
      const json = await res.json();
      if (json.ok) {
        setEditingKwId(null);
        setEditingUrl("");
        loadKwData();
        setActionMsg("✅ 已成功指派落地頁！");
        setTimeout(() => setActionMsg(""), 3000);
      }
    } catch (err) {
      setActionMsg(`指派失敗: ${err.message}`);
    }
  };

  const handleAutoAssign = async () => {
    setLoading(true);
    setActionMsg("🔍 正在智能掃描站內頁面並自動配對關鍵詞...");
    try {
      const res = await fetch("/api/seo/keywords/auto-assign", { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setActionMsg(`🎉 智能配對完成！掃描 ${json.scanned} 個頁面，成功配對 ${json.matched} 個關鍵詞落地頁！`);
        loadKwData();
      }
    } catch (err) {
      setActionMsg(`配對失敗: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setActionMsg(""), 5000);
    }
  };

  if (!data) {
    return (
      <div className="space-y-4 animate-pulse p-6 max-w-7xl mx-auto">
        <div className="h-16 rounded-xl bg-muted/40 border border-border/40" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/40 border border-border/40" />
          ))}
        </div>
      </div>
    );
  }

  const {
    performance = {},
    user_stats = {},
    ranking_distribution = {},
    top_opportunities = [],
    trends = [],
    top_queries = [],
    readiness_matrix = [],
    priority_action = {},
    summary = {},
  } = data;

  const todayAction = priority_action?.today || null;
  const runnerUps = priority_action?.runner_ups || [];
  const userOverview = user_stats?.overview || {};
  const userProviders = user_stats?.providers || [];
  const recentUsers = user_stats?.recent || [];

  const filteredOpportunities = top_opportunities.filter((opp) => {
    if (oppFilter === "all") return true;
    return opp.suggested_page_type === oppFilter;
  });

  const distTotal = Math.max(ranking_distribution.total || 1, 1);
  const maxImp = Math.max(...trends.map((t) => t.impressions || 0), 10);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* 頂部操作與時段切換欄 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-foreground">openSEO 增長控制台</h1>
            <Badge variant="secondary" className="text-xs font-mono">
              {summary.site_name || "openSEO Demo"}
            </Badge>
            {summary.demo_mode && (
              <Badge variant="warning" className="text-[10px] font-mono">
                DEMO 模式
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            確定性優先級決策 · 關鍵詞資產對齊 · 拓撲圖譜 · GSC 數據雙軌迴路 (延遲 2-3 日)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/70 bg-muted/40 p-0.5 text-xs font-medium">
            {[7, 28, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`rounded-md px-3 py-1 transition-colors cursor-pointer ${
                  days === d ? "bg-primary text-primary-foreground font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d} 天
              </button>
            ))}
          </div>

          <Button size="sm" variant="outline" disabled={loading} onClick={() => triggerAction("/api/seo/opportunities/mine", "挖掘機會")}>
            🔍 挖掘機會
          </Button>
          <Button size="sm" variant="outline" disabled={loading} onClick={() => triggerAction("/api/seo/build-links", "重建鏈接")}>
            🔗 重建鏈接
          </Button>
          <Button size="sm" variant="outline" disabled={loading} onClick={() => triggerAction("/api/seo/keywords/sync-gsc", "同步 GSC")}>
            📡 同步 GSC
          </Button>
          <Button size="sm" disabled={loading} onClick={() => triggerAction("/api/seo/sync", "全量同步")}>
            🔄 全量同步
          </Button>
        </div>
      </div>

      {actionMsg && (
        <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-2.5 text-xs text-primary font-medium">
          {actionMsg}
        </div>
      )}

      {/* 🎯 模組 0: 今日最值得做 (Deterministic SEO Priority Engine) */}
      {todayAction && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🎯</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                今日最值得做 (Today's #1 Action)
              </h2>
              {todayAction.action !== "DO_NOTHING" ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    {todayAction.opportunity_tier || "HIGH_ROI"}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-mono font-bold">
                    Action ROI: {todayAction.action_roi_score || todayAction.score}/100
                  </Badge>
                </div>
              ) : (
                <Badge variant="success" className="text-[10px] font-mono">
                  狀態平穩
                </Badge>
              )}
            </div>
            {runnerUps.length > 0 && (
              <button
                type="button"
                onClick={() => setShowRunnerUps(!showRunnerUps)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                {showRunnerUps ? "收合其他儲備機會" : `查看其他儲備機會 (${runnerUps.length})`}
                <span>{showRunnerUps ? "▲" : "▼"}</span>
              </button>
            )}
          </div>

          {lastCompletedAction && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold">🎉 已成功執行「{lastCompletedAction.name}」：</div>
                <div className="text-[11px] opacity-90 font-mono">{lastCompletedAction.details}</div>
              </div>
              <button type="button" onClick={() => setLastCompletedAction(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                ✕
              </button>
            </div>
          )}

          {todayAction.action === "DO_NOTHING" ? (
            <Card className="p-5 border-emerald-500/40 bg-emerald-500/5">
              <div className="flex items-start gap-4">
                <span className="text-3xl">🟢</span>
                <div>
                  <h3 className="text-base font-bold text-foreground">今日無需 SEO 修改</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    GSC 無重大異常，各項頁面索引健康度良好，建議保持現狀，繼續觀察數據累積。
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-5 border-primary/40 bg-card hover:border-primary/70 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold uppercase bg-muted text-muted-foreground">
                      ACTION: {todayAction.action}
                    </span>
                    {todayAction.target_page && (
                      <span className="text-xs font-mono font-medium text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
                        {todayAction.target_page}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-foreground tracking-tight">
                    {todayAction.action_name}
                  </h3>

                  {todayAction.rationale && (
                    <div className="rounded-lg bg-muted/30 border border-border/70 p-3 text-xs space-y-2">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <span>💡</span>
                        <span>為什麼推薦此行動？(Rationale & Evidence)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        <div className="space-y-1">
                          <span className="text-emerald-400 font-semibold">實證訊號：</span>
                          {todayAction.rationale.positives?.map((p, idx) => (
                            <div key={idx} className="flex items-start gap-1 text-foreground">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <span className="text-amber-400 font-semibold">限制與風控：</span>
                          {todayAction.rationale.cautions?.map((c, idx) => (
                            <div key={idx} className="flex items-start gap-1 text-muted-foreground">
                              <span className="text-amber-500 font-bold">⚠</span>
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {todayAction.rationale.recommendations && (
                        <div className="pt-2 border-t border-border/50 text-[11px]">
                          <span className="text-primary font-bold">建議執行路徑：</span>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-foreground">
                            {todayAction.rationale.recommendations.map((rec, idx) => (
                              <div key={idx} className="flex items-center gap-1 font-medium">
                                <span className="text-primary font-bold">→</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {todayAction.metrics && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-muted/30 p-3 rounded-xl border border-border/60 text-center min-w-[280px]">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">Google 排名</div>
                      <div className="text-base font-black font-mono text-foreground">
                        {todayAction.metrics.position != null ? Number(todayAction.metrics.position).toFixed(1) : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">{days}日曝光</div>
                      <div className="text-base font-black font-mono text-foreground">
                        {todayAction.metrics.impressions != null ? Number(todayAction.metrics.impressions).toLocaleString() : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">CTR 點擊率</div>
                      <div className="text-base font-black font-mono text-foreground">
                        {todayAction.metrics.ctr != null ? `${Number(todayAction.metrics.ctr).toFixed(1)}%` : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">站內入鏈</div>
                      <div className="text-base font-black font-mono text-foreground">
                        {todayAction.metrics.internal_links || 0}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 科學實驗假說與核心指標 */}
              {todayAction.experiment_baseline && (
                <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <span>🧪</span>
                      <span>科學實驗假說與指標體系 (Experiment Baseline)</span>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
                      觀測期：{todayAction.experiment_baseline.review_window || "7–14 天"}
                    </Badge>
                  </div>

                  <div className="text-[11px] text-foreground bg-background/80 p-2.5 rounded border border-border/60 space-y-1">
                    <div>
                      <span className="font-bold text-primary mr-1">🔬 實驗假說：</span>
                      <span>{todayAction.experiment_baseline.hypothesis}</span>
                    </div>
                    {todayAction.experiment_baseline.baseline_summary && (
                      <div className="text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                        📊 對照基準：{todayAction.experiment_baseline.baseline_summary}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-background/70 p-2 rounded border border-border/50">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase mb-0.5">🎯 Primary Metric</div>
                      <div className="text-foreground font-medium">{todayAction.experiment_baseline.primary_metric}</div>
                    </div>
                    <div className="bg-background/70 p-2 rounded border border-border/50">
                      <div className="text-[10px] font-bold text-blue-400 uppercase mb-0.5">📈 Secondary Metric</div>
                      <div className="text-foreground font-medium">{todayAction.experiment_baseline.secondary_metric}</div>
                    </div>
                    <div className="bg-background/70 p-2 rounded border border-border/50">
                      <div className="text-[10px] font-bold text-amber-400 uppercase mb-0.5">🛡️ Guardrail Metric</div>
                      <div className="text-muted-foreground font-medium">{todayAction.experiment_baseline.guardrail_metric}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 執行按鈕列 */}
              <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-end gap-2">
                <Button size="sm" variant="ghost" disabled={loading} onClick={() => handleDismissPriorityAction(todayAction)}>
                  暫緩此操作
                </Button>
                <Button size="sm" disabled={loading} onClick={() => handleExecutePriorityAction(todayAction)}>
                  ⚡ 立即自動執行並記錄
                </Button>
              </div>
            </Card>
          )}

          {/* 儲備機會列表 */}
          {showRunnerUps && runnerUps.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-bold text-muted-foreground">儲備機會候選清單：</div>
              {runnerUps.map((action, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground">{action.action_name}</span>
                    <span className="ml-2 text-muted-foreground font-mono">ROI: {action.action_roi_score || action.score}</span>
                  </div>
                  <Button size="sm" variant="outline" disabled={loading} onClick={() => handleExecutePriorityAction(action)}>
                    執行
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 模組 1: Google Search Performance */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          模組 1: Google Search Performance (近 {days} 天概況)
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">自然搜尋曝光</div>
            <div className="text-2xl font-black font-mono text-foreground mt-1">
              {(performance.impressions || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">GSC 實際展示次數</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">點擊帶來造訪</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              {(performance.clicks || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              非品牌詞佔比 {performance.clicks ? Math.round(((performance.non_brand_clicks || 0) / performance.clicks) * 100) : 0}%
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">平均點擊率 (CTR)</div>
            <div className="text-2xl font-black font-mono text-primary mt-1">
              {performance.ctr || 0}%
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">搜尋結果點入比例</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">整體平均排名</div>
            <div className="text-2xl font-black font-mono text-foreground mt-1">
              {performance.position || 0}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">全站關鍵詞平均位次</div>
          </Card>
        </div>
      </div>

      {/* 模組 1.5: 會員註冊與途徑統計 (SEO 轉化歸因) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          模組 1.5: 會員註冊與途徑統計 (SEO 轉化成果)
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">累計註冊會員</div>
            <div className="text-2xl font-black font-mono text-foreground mt-1">
              {(userOverview.total_users || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">全站自然累積</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">近 {days} 天新增會員</div>
            <div className="text-2xl font-black font-mono text-primary mt-1">
              +{(userOverview.period_new || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">當期獲客轉化</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">今日新增會員</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              +{(userOverview.today_new || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">今日實時增量</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground">30 天活躍會員</div>
            <div className="text-2xl font-black font-mono text-foreground mt-1">
              {(userOverview.active_30d || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">回訪與留存黏度</div>
          </Card>
        </div>

        {userProviders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="text-xs font-bold text-foreground mb-2">註冊渠道分佈</div>
              <div className="space-y-2">
                {userProviders.map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{p.label}</span>
                      <span className="font-mono text-muted-foreground">{p.count} 人 ({p.pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs font-bold text-foreground mb-2">最新註冊審計流水</div>
              <div className="divide-y divide-border/40 text-xs">
                {recentUsers.map((u, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-foreground">{u.email_masked}</span>
                      <span className="ml-2 text-muted-foreground">{u.region}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {u.provider}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* 模組 2: 排名分佈矩陣 與 曝光趨勢圖 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">
            排名分佈階梯 (Position Distribution)
          </div>
          <div className="space-y-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">Top 3 (黃金席位)</span>
                <span className="font-mono">{ranking_distribution.top3 || 0} 詞 ({Math.round(((ranking_distribution.top3 || 0) / distTotal) * 100)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${((ranking_distribution.top3 || 0) / distTotal) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-400 font-bold">第 4 ~ 10 位 (首頁展示)</span>
                <span className="font-mono">{ranking_distribution.p4_10 || 0} 詞 ({Math.round(((ranking_distribution.p4_10 || 0) / distTotal) * 100)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${((ranking_distribution.p4_10 || 0) / distTotal) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-amber-400 font-bold">第 11 ~ 20 位 (Striking Distance)</span>
                <span className="font-mono">{ranking_distribution.p11_20 || 0} 詞 ({Math.round(((ranking_distribution.p11_20 || 0) / distTotal) * 100)}%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${((ranking_distribution.p11_20 || 0) / distTotal) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-bold">第 21+ 位 (長尾儲備)</span>
                <span className="font-mono">{(ranking_distribution.p21_50 || 0) + (ranking_distribution.p50_plus || 0)} 詞</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-muted-foreground/50" style={{ width: `${(((ranking_distribution.p21_50 || 0) + (ranking_distribution.p50_plus || 0)) / distTotal) * 100}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">
            每日自然曝光趨勢 (Impressions Trend)
          </div>
          <div className="h-36 flex items-end gap-1 pt-4">
            {trends.slice(-21).map((t, idx) => {
              const hPct = Math.max(Math.round(((t.impressions || 0) / maxImp) * 100), 5);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-primary/70 hover:bg-primary rounded-t transition-all cursor-pointer"
                    style={{ height: `${hPct}%` }}
                  />
                  <div className="hidden group-hover:block absolute -top-8 bg-card border border-border px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap z-10 shadow-lg">
                    {t.date}: {t.impressions} 曝光 ({t.clicks} 點擊)
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>{trends[0]?.date || "開始"}</span>
            <span>{trends[trends.length - 1]?.date || "今日"}</span>
          </div>
        </Card>
      </div>

      {/* 模組 3: SEO Opportunities (高價值機會挖掘) */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <h3 className="text-sm font-bold text-foreground">
              SEO Opportunities (高價值機會池)
            </h3>
            <Badge variant="secondary" className="text-xs font-mono">
              {filteredOpportunities.length} 個待推進項目
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {["all", "striking_distance", "ctr_optimization", "missing_landing"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setOppFilter(f)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  oppFilter === f ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {f === "all" ? "全部" : f === "striking_distance" ? "排名突圍" : f === "ctr_optimization" ? "CTR 優化" : "缺失落地頁"}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-border/50 text-xs">
          {filteredOpportunities.map((opp) => (
            <div key={opp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{opp.query}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {opp.suggested_page_type}
                  </Badge>
                  <span className="text-muted-foreground font-mono">排位 #{opp.position}</span>
                </div>
                <div className="text-muted-foreground">{opp.reason}</div>
                <div className="text-[11px] font-mono text-primary">推薦落地頁: {opp.suggested_slug}</div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button size="sm" variant="ghost" onClick={() => handleDismissOpportunity(opp.id)}>
                  略過
                </Button>
                <Button size="sm" onClick={() => handleApplyOpportunity(opp.id)}>
                  標記落實
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 模組 4: Top Queries (高價值搜尋詞與最高排位頁) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Top Queries (高價值搜尋詞與落地頁對帳)
          </h3>
          <span className="text-xs text-muted-foreground">依過去 {days} 天曝光降序</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground text-left">
                <th className="pb-2 font-medium">搜尋關鍵詞</th>
                <th className="pb-2 font-medium">當前對應落地頁</th>
                <th className="pb-2 font-medium text-center">平均排名</th>
                <th className="pb-2 font-medium text-right">曝光量</th>
                <th className="pb-2 font-medium text-right">點擊數</th>
                <th className="pb-2 font-medium text-right">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {top_queries.map((q, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-foreground">
                    {q.query}
                    {q.is_brand && (
                      <span className="ml-1.5 text-[10px] text-muted-foreground border px-1 rounded">品牌詞</span>
                    )}
                  </td>
                  <td className="py-2.5 text-primary max-w-xs truncate">{q.best_url}</td>
                  <td className="py-2.5 text-center">{q.position}</td>
                  <td className="py-2.5 text-right font-bold text-foreground">{(q.impressions || 0).toLocaleString()}</td>
                  <td className="py-2.5 text-right text-emerald-400">{(q.clicks || 0).toLocaleString()}</td>
                  <td className="py-2.5 text-right">{q.ctr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 模組 5: Indexing & SEO Health (5-Pillar SEO 成熟度矩陣) */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <h3 className="text-sm font-bold text-foreground">
              SEO Readiness Matrix (五維成熟度矩陣)
            </h3>
          </div>
          <Badge variant="success" className="text-xs font-mono">
            Audit Passed
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {readiness_matrix.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">{item.name}</span>
                <Badge variant={item.status === "PASS" ? "success" : "warning"} className="text-[10px]">
                  {item.status} ({item.progress}%)
                </Badge>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full ${item.color || "bg-primary"}`} style={{ width: `${item.progress}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 模組 6: 關鍵詞資產庫與 Gap 診斷 */}
      <Card className="p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">📚</span>
            <h3 className="text-sm font-bold text-foreground">
              關鍵詞資產庫與 Gap 診斷 (Keyword Asset Inventory)
            </h3>
            {kwData?.summary && (
              <span className="text-xs text-muted-foreground font-mono">
                共 {kwData.summary.total} 詞 · {kwData.summary.gaps} 個 Gap (無專屬頁)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleAutoAssign}>
              ⚡ 智能自動配對落地頁
            </Button>
            <Button size="sm" variant="outline" onClick={() => triggerAction("/api/seo/keywords/seed", "注入種子詞")}>
              🌱 注入種子詞庫
            </Button>
          </div>
        </div>

        <form onSubmit={handleAddKeyword} className="flex gap-2">
          <Input
            placeholder="輸入新關鍵詞（例如：2026 高性價比顯示器推薦）"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
          />
          <Input
            placeholder="指定落地頁 URL（可留空為 Gap）"
            value={newTargetUrl}
            onChange={(e) => setNewTargetUrl(e.target.value)}
          />
          <Button size="sm" type="submit" disabled={!newTerm.trim()}>
            加入詞庫
          </Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground text-left">
                <th className="pb-2 font-medium">關鍵詞</th>
                <th className="pb-2 font-medium">搜尋意圖</th>
                <th className="pb-2 font-medium">專屬落地頁 (Target URL)</th>
                <th className="pb-2 font-medium text-center">狀態</th>
                <th className="pb-2 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {kwData?.keywords?.map((k) => (
                <tr key={k.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-medium text-foreground">{k.term}</td>
                  <td className="py-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted font-mono uppercase text-muted-foreground">
                      {k.intent}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono">
                    {editingKwId === k.id ? (
                      <div className="flex items-center gap-1.5">
                        <Input
                          className="h-7 text-xs"
                          value={editingUrl}
                          onChange={(e) => setEditingUrl(e.target.value)}
                          placeholder="/category/..."
                        />
                        <Button size="sm" className="h-7 px-2" onClick={() => handleAssignTargetUrl(k.id, editingUrl)}>
                          儲存
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setEditingKwId(null)}>
                          取消
                        </Button>
                      </div>
                    ) : k.target_url ? (
                      <span className="text-primary">{k.target_url}</span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <span>⚠️</span>
                        <span>GAP (無落地頁)</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-center">
                    {k.target_url ? (
                      <Badge variant="success" className="text-[10px]">已指派</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">待建頁</Badge>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingKwId(k.id);
                          setEditingUrl(k.target_url || "");
                        }}
                        className="text-primary hover:underline text-[11px] cursor-pointer"
                      >
                        修改
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteKeyword(k.id)}
                        className="text-rose-400 hover:underline text-[11px] cursor-pointer"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
