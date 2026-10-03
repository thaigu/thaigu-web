import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  console.log("正在透過 Google Search Console API 提交 Sitemap...");
  const tokenData = await getAccessToken(["https://www.googleapis.com/auth/webmasters"]);
  if (!tokenData.access_token) {
    console.error("無法取得 Google Access Token:", tokenData);
    return;
  }
  const token = tokenData.access_token;
  const siteUrl = encodeURIComponent("sc-domain:thaikok.com");
  const feedpath = encodeURIComponent("https://thaikok.com/sitemap.xml");

  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (res.status === 204 || res.status === 200) {
    console.log("✅ Sitemap 成功提交至 Google Search Console (HTTP 204 No Content)！");
  } else {
    const text = await res.text();
    console.error(`❌ 提交失敗 (HTTP ${res.status}):`, text);
  }
}

main().catch(console.error);
