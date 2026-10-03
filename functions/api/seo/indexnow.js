export async function onRequest(context) {
  const payload = {
    host: "thaikok.com",
    key: "thaikok2026seoindexnowkey",
    keyLocation: "https://www.thaikok.com/thaikok2026seoindexnowkey.txt",
    urlList: [
      "https://www.thaikok.com/",
      "https://www.thaikok.com/macau-thai-food-guide.html",
      "https://www.thaikok.com/thai-select-certification.html",
      "https://www.thaikok.com/transportation-guide.html",
      "https://www.thaikok.com/main-dishes.html",
      "https://www.thaikok.com/awards.html",
      "https://www.thaikok.com/about.html",
      "https://www.thaikok.com/drinks.html",
      "https://www.thaikok.com/contact-us.html"
    ]
  };

  let bingStatus = "unknown";
  let yandexStatus = "unknown";

  try {
    const bingRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });
    bingStatus = `${bingRes.status} ${bingRes.statusText}`;
  } catch (err) {
    bingStatus = `error: ${err.message}`;
  }

  return new Response(JSON.stringify({
    ok: true,
    message: "IndexNow 全網搜尋引擎即時推送已成功送出！",
    timestamp: new Date().toISOString(),
    endpoints: {
      indexnow_org: bingStatus
    },
    submitted_urls: payload.urlList
  }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
