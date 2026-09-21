export async function onRequest(context) {
  const payload = {
    host: "thaikok.com",
    key: "thaikok2026seoindexnowkey",
    keyLocation: "https://thaikok.com/thaikok2026seoindexnowkey.txt",
    urlList: [
      "https://thaikok.com/",
      "https://thaikok.com/main-dishes.html",
      "https://thaikok.com/awards.html",
      "https://thaikok.com/about.html",
      "https://thaikok.com/drinks.html",
      "https://thaikok.com/contact-us.html"
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
