const urls = [
  "https://www.thaikok.com/",
  "https://www.thaikok.com/macau-thai-food-guide.html",
  "https://www.thaikok.com/thai-select-certification.html",
  "https://www.thaikok.com/transportation-guide.html",
  "https://www.thaikok.com/main-dishes.html",
  "https://www.thaikok.com/awards.html",
  "https://www.thaikok.com/about.html",
  "https://www.thaikok.com/drinks.html",
  "https://www.thaikok.com/contact-us.html"
];

const payload = {
  host: "thaikok.com",
  key: "thaikok2026seoindexnowkey",
  keyLocation: "https://www.thaikok.com/thaikok2026seoindexnowkey.txt",
  urlList: urls
};

async function main() {
  console.log("正在向 IndexNow 協議推送全站 9 個主要 URL (Bing / Yandex / Seznam)...");
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ IndexNow 推送成功！狀態碼: HTTP ${res.status}`);
      console.log("已推送網址列表:\n" + urls.map(u => ` - ${u}`).join("\n"));
    } else {
      const text = await res.text();
      console.error(`❌ IndexNow 推送異常 (HTTP ${res.status}):`, text);
    }
  } catch (err) {
    console.error("❌ 網路請求失敗:", err.message);
  }
}

main().catch(console.error);
