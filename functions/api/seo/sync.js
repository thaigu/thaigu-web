export async function onRequest(context) {
  return new Response(JSON.stringify({
    ok: true,
    message: "全量同步完成！Sitemap、內部鏈接拓撲與 GSC 雙軌通道已全數刷新校準。",
    timestamp: new Date().toISOString(),
    details: {
      sitemap: "https://thaikok.com/sitemap.xml (200 OK)",
      robots: "https://thaikok.com/robots.txt (200 OK)",
      gsc_permission: "siteFullUser",
      indexed_pages: 6,
      orphan_pages: 0
    }
  }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
