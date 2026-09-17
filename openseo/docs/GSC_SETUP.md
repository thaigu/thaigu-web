# Google Search Console (GSC) API 串接配置指南

openSEO 支援透過 Google Cloud 服務帳號 (Service Account) 自動定時同步 Google Search Console 的自然搜尋表現數據（點擊、曝光、CTR、排名）。

---

## 步驟 1：建立 Google Cloud 專案並啟用 API

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)。
2. 建立新專案（例如命名為 `openseo-sync`）。
3. 在左側選單進入 **API 和服務** > **資料庫**。
4. 搜尋並啟用 **Google Search Console API**。

---

## 步驟 2：建立服務帳號 (Service Account)

1. 進入 **API 和服務** > **憑證**。
2. 點擊 **建立憑證** > 選擇 **服務帳號**。
3. 填寫名稱（例如 `openseo-crawler`），角色可選 `Viewer` 或略過，點擊完成。
4. 記錄此服務帳號的電子郵件地址（例如 `openseo-crawler@openseo-sync.iam.gserviceaccount.com`）。

---

## 步驟 3：建立並下載 JSON 金鑰

1. 點擊剛建立的服務帳號名稱進入詳情。
2. 切換至 **金鑰 (Keys)** 分頁。
3. 點擊 **新增金鑰** > **建立新金鑰** > 選擇 **JSON**。
4. 下載產生的 JSON 檔案，妥善保存在專案目錄（例如 `server/config/gsc-service-account.json`）。

---

## 步驟 4：授權服務帳號訪問 Google Search Console

1. 前往 [Google Search Console 後台](https://search.google.com/search-console)。
2. 選擇你的目標網站資源（Property）。
3. 進入左下角 **設定 (Settings)** > **使用者與權限 (Users and permissions)**。
4. 點擊 **新增使用者 (Add user)**。
5. 輸入在「步驟 2」中獲得的服務帳號 Email 地址。
6. 權限選擇 **完整 (Full)** 或 **受限制 (Restricted)** 均可（只需讀取權限）。
7. 點擊儲存完成授權！

---

## 步驟 5：配置 openSEO 環境變數

編輯 openSEO 的 `.env` 檔案：

```env
# 填寫你在 GSC 註冊的網址（注意斜線需完全一致）
GSC_SITE_URL=https://example.com/

# 方式 A：直接指定下載的金鑰路徑
GSC_KEY_FILE=./config/gsc-service-account.json

# 方式 B：或者直接以環境變數填入 (適合 Docker 或雲端部署)
GSC_CLIENT_EMAIL=openseo-crawler@openseo-sync.iam.gserviceaccount.com
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
```

完成後，啟動 openSEO 點擊控制台頂部的 **📡 同步 GSC** 按鈕，即可拉取過去 28 天的真實搜尋表現數據！
