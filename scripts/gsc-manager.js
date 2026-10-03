import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.resolve(__dirname, "../openseo/gsc-key.json");

if (!fs.existsSync(keyPath)) {
  console.error("找不到 GSC Service Account Key:", keyPath);
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));

function getJwt(scopes) {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: key.client_email,
    scope: scopes.join(" "),
    aud: key.token_uri,
    exp: now + 3600,
    iat: now
  };
  const b64 = obj => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const unsigned = `${b64(header)}.${b64(claim)}`;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  const signature = sign.sign(key.private_key, "base64url");
  return `${unsigned}.${signature}`;
}

async function getAccessToken(scopes) {
  const jwt = getJwt(scopes);
  const res = await fetch(key.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  return await res.json();
}

async function run() {
  console.log("==========================================");
  console.log("   泰谷 ThaiGu (thaikok.com) SEO 引擎監控   ");
  console.log("==========================================");

  const tokenData = await getAccessToken(["https://www.googleapis.com/auth/webmasters"]);
  if (!tokenData.access_token) {
    console.error("無法取得 Google Access Token:", tokenData);
    return;
  }
  const token = tokenData.access_token;
  const siteUrl = "sc-domain:thaikok.com";

  // 1. 查詢近 28 天搜索表現數據 (Search Analytics)
  console.log("\n[1] 正在查詢 Google Search Console 近期搜索關鍵字與表現...");
  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  const startDate = new Date(today.getTime() - 28 * 24 * 3600 * 1000).toISOString().split("T")[0];

  const analyticsRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        dimensions: ["query"],
        rowLimit: 10
      })
    }
  );

  const analyticsData = await analyticsRes.json();
  if (analyticsData.rows && analyticsData.rows.length > 0) {
    console.log(`找到 ${analyticsData.rows.length} 組搜索曝光關鍵詞：`);
    console.table(analyticsData.rows.map(r => ({
      關鍵詞: r.keys[0],
      點擊次數: r.clicks,
      展示次數: r.impressions,
      點擊率: `${(r.ctr * 100).toFixed(1)}%`,
      平均排名: r.position.toFixed(1)
    })));
  } else {
    console.log("ℹ️ 過去 28 天內尚未積累足夠的點擊/展示數據（因新站剛收錄且標題未包含澳門核心詞）。");
  }

  // 2. 檢查首頁在 Google 索引的覆蓋狀態
  console.log("\n[2] 正在檢查核心頁面在 Google 的即時索引狀態...");
  const inspectRes = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inspectionUrl: "https://thaikok.com/",
      siteUrl: siteUrl
    })
  });
  const inspectData = await inspectRes.json();
  const status = inspectData.inspectionResult?.indexStatusResult;
  if (status) {
    console.log(`- 首頁收錄審批: ${status.verdict}`);
    console.log(`- 覆蓋狀態: ${status.coverageState}`);
    console.log(`- 機器人狀態: ${status.robotsTxtState}`);
    console.log(`- 上次爬取時間: ${status.lastCrawlTime}`);
    console.log(`- Google 規範網址: ${status.googleCanonical}`);
  } else {
    console.log("檢查回應:", inspectData);
  }

  // 3. 檢查 Sitemap 提交狀態
  console.log("\n[3] 正在驗證 Sitemap 提交健康狀態...");
  const smListRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const smList = await smListRes.json();
  if (smList.sitemap) {
    smList.sitemap.forEach(s => {
      console.log(`- 站點地圖: ${s.path}`);
      console.log(`  最後下載: ${s.lastDownloaded || "處理中"}`);
      console.log(`  警告/錯誤: ${s.warnings} 警告, ${s.errors} 錯誤`);
    });
  }

  console.log("\n✅ SEO 監控診斷完成！");
}

run().catch(console.error);
