import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config.js";
import { registerSeoRoutes } from "./routes/seo.js";

const app = Fastify({
  logger: {
    level: config.isDev ? "info" : "warn",
  },
});

// 跨域支援
await app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
});

// 健康檢查
app.get("/api/health", async () => ({
  status: "ok",
  app: "openSEO",
  version: "1.0.0",
  site: config.siteName,
  demoMode: config.demoMode,
  timestamp: new Date().toISOString(),
}));

// 註冊所有 SEO 引擎路由
registerSeoRoutes(app);

// 啟動監聽
const start = async () => {
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
    console.log(`
🚀 ========================================================
   openSEO Engine & Control Panel Backend Started!
   • Local URL:  http://localhost:${config.port}
   • Target:     ${config.siteName} (${config.siteUrl})
   • Mode:       ${config.demoMode ? "Demo / Realistic Mock" : "Production Database"}
========================================================
`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
