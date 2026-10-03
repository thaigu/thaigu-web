import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function getCloudflareToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return process.env.CLOUDFLARE_API_TOKEN;
  }
  // 自動從使用者的 ~/.zshrc 讀取環境變數
  const zshrcPath = path.join(os.homedir(), ".zshrc");
  if (fs.existsSync(zshrcPath)) {
    const content = fs.readFileSync(zshrcPath, "utf8");
    const match = content.match(/export\s+CLOUDFLARE_API_TOKEN=([^\s#]+)/);
    if (match && match[1]) {
      return match[1].replace(/['"]/g, "").trim();
    }
  }
  return null;
}

const CLOUDFLARE_API_TOKEN = getCloudflareToken();
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "3ad34ebf361e3354ff0044e01bc43aff";
const PROJECT_NAME = "thaigu";

console.log("=================================================");
console.log("   泰谷 ThaiGu (thaikok.com) Cloudflare Pages 部署   ");
console.log("=================================================");
console.log(`專案名稱: ${PROJECT_NAME}`);
console.log(`部署目錄: ${rootDir}`);
console.log("-------------------------------------------------");

if (!CLOUDFLARE_API_TOKEN) {
  console.error("❌ 找不到 CLOUDFLARE_API_TOKEN！請先設定環境變數或確保 ~/.zshrc 中有定義。");
  process.exit(1);
}

try {
  const env = {
    ...process.env,
    CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ACCOUNT_ID
  };

  console.log("🚀 正在執行 Cloudflare Pages 生產環境部署...");
  execSync(`npx --yes wrangler pages deploy "${rootDir}" --project-name ${PROJECT_NAME} --branch main --commit-dirty=true`, {
    env,
    stdio: "inherit"
  });

  console.log("\n✅ 恭喜！最新代碼已成功發布至 Cloudflare Pages！");
  console.log("正式線上站點: https://thaikok.com/");
} catch (error) {
  console.error("\n❌ 部署過程發生錯誤:", error.message);
  process.exit(1);
}
