# openSEO 專案整合指南 (Integration Guide)

本文檔說明如何將 **openSEO** 無縫嵌入至現有的 Web 應用（如 Next.js、Nuxt、Fastify、Express、Django 或 Rails）。

---

## 方案 A：作為獨立內部微服務 (Micro-frontend / Admin Subdomain) 【最推薦】

將 openSEO 作為獨立的內部控制台運行在 `admin.yourdomain.com` 或 `yourdomain.com/admin/seo`。

### 1. Nginx 反向代理配置範例
```nginx
# 代理 openSEO 前端
location /admin/seo/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# 代理 openSEO 後端 API
location /api/seo/ {
    proxy_pass http://127.0.0.1:8790/api/seo/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 方案 B：嵌入現有 React / Vite 單頁應用 (Component Embedding)

如果你已有現成的 React 後台儀表板，可以直接將 openSEO 的前端元件引入：

1. 將 `web/src/components/SeoDashboard.jsx` 及其依賴複製進你的前端專案元件目錄。
2. 在路由中直接引用：
```jsx
import React from "react";
import SeoDashboard from "@/components/SeoDashboard";

export default function AdminSeoPage() {
  return (
    <div className="p-6">
      <SeoDashboard />
    </div>
  );
}
```
3. 確保你的 API 伺服器代理或實現了相容的 `/api/seo/*` 路由。

---

## 方案 C：後端 API 模組引入 (Node.js / Express / Fastify)

如果你使用的是 Fastify 或 Express，可以直接引入 openSEO 的後端路由處理器：

```javascript
import Fastify from "fastify";
import { registerSeoRoutes } from "./server/src/routes/seo.js";

const app = Fastify();

// 註冊 openSEO API
registerSeoRoutes(app);

app.listen({ port: 8080 });
```

---

## 資料庫同步方案

如果你已有自己的 PostgreSQL 資料庫：
1. 執行 `server/src/db/schema.sql` 建立所需的 `seo_*` 與 `gsc_*` 資料表。
2. 在 `.env` 中填入你的 PostgreSQL 連接字串：
   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/your_database
   ```
3. 重啟 openSEO 服務，系統將自動接管並與你的業務數據進行實時聯動！
