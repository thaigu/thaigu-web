import React from "react";
import SeoDashboard from "./components/SeoDashboard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 頂部全局導航 */}
      <header className="border-b border-border/80 bg-card/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-black text-sm">
              SEO
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-lg tracking-tight text-foreground">openSEO</span>
              <span className="text-xs text-muted-foreground font-mono">Template v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://github.com/whypuss/openSEO"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="系統健康運行中" />
          </div>
        </div>
      </header>

      {/* 主內容區 */}
      <main className="flex-1 pb-12">
        <SeoDashboard />
      </main>

      {/* 頁尾 */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        openSEO — Open-source, Self-hosted, Deterministic SEO Growth Engine & Control Panel Template.
      </footer>
    </div>
  );
}
