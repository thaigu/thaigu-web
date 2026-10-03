import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 嘗試從專案多個位置尋找憑證
const possiblePaths = [
  path.resolve(__dirname, "../../../openseo/gsc-key.json"),
  path.resolve(__dirname, "../../openseo/gsc-key.json"),
  path.resolve(__dirname, "../gsc-key.json")
];

const keyPath = possiblePaths.find(p => fs.existsSync(p));
if (!keyPath) {
  console.error("❌ 找不到 GSC Service Account 憑證 (gsc-key.json)！");
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

async function main() {
  console.log("==========================================");
  console.log("  泰谷 (thaikok.com) Google 官方檢驗診斷  ");
  console.log("==========================================");

  const tokenData = await getAccessToken(["https://www.googleapis.com/auth/webmasters"]);
  if (!tokenData.access_token) {
    console.error("無法取得 Google Access Token:", tokenData);
    return;
  }
  const token = tokenData.access_token;
  const siteUrl = "sc-domain:thaikok.com";

  // 1. 查詢過去 28 天關鍵字曝光表現
  console.log("\n[1] 過去 28 天關鍵字搜尋數據 (Search Analytics):");
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
        rowLimit: 15
      })
    }
  );

  const analyticsData = await analyticsRes.json();
  if (analyticsData.rows && analyticsData.rows.length > 0) {
    console.table(analyticsData.rows.map(r => ({
      關鍵詞: r.keys[0],
      點擊次數: r.clicks,
      展示次數: r.impressions,
      點擊率: `${(r.ctr * 100).toFixed(1)}%`,
      平均排名: r.position.toFixed(1)
    })));
  } else {
    console.log("ℹ️ 過去 28 天尚無關鍵字數據積累。");
  }

  // 2. 檢驗首頁覆蓋率
  console.log("\n[2] Google 官方索引審批狀態:");
  const inspectRes = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inspectionUrl: "https://www.thaikok.com/",
      siteUrl: siteUrl
    })
  });
  const inspectData = await inspectRes.json();
  const status = inspectData.inspectionResult?.indexStatusResult;
  if (status) {
    console.log(`- 首頁收錄審批: ${status.verdict}`);
    console.log(`- 覆蓋狀態: ${status.coverageState}`);
    console.log(`- 機器人爬取狀態: ${status.robotsTxtState}`);
    console.log(`- 上次爬取時間: ${status.lastCrawlTime}`);
    console.log(`- 規範網址: ${status.googleCanonical}`);
  }

  // 3. Sitemap 狀態
  console.log("\n[3] 網站地圖 (Sitemap) 下載狀態:");
  const smRes = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const smData = await smRes.json();
  if (smData.sitemap) {
    smData.sitemap.forEach(s => {
      console.log(`- Sitemap: ${s.path}`);
      console.log(`  最後下載: ${s.lastDownloaded || "待處理"}`);
      console.log(`  解析警告: ${s.warnings} 筆, 錯誤: ${s.errors} 筆`);
    });
  }
}

main().catch(console.error);
