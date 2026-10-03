import { onRequest as __api_seo_keywords_sync_gsc_js_onRequest } from "/Users/my/thaigu-web/functions/api/seo/keywords/sync-gsc.js"
import { onRequest as __api_seo_indexnow_js_onRequest } from "/Users/my/thaigu-web/functions/api/seo/indexnow.js"
import { onRequest as __api_seo_sync_js_onRequest } from "/Users/my/thaigu-web/functions/api/seo/sync.js"

export const routes = [
    {
      routePath: "/api/seo/keywords/sync-gsc",
      mountPath: "/api/seo/keywords",
      method: "",
      middlewares: [],
      modules: [__api_seo_keywords_sync_gsc_js_onRequest],
    },
  {
      routePath: "/api/seo/indexnow",
      mountPath: "/api/seo",
      method: "",
      middlewares: [],
      modules: [__api_seo_indexnow_js_onRequest],
    },
  {
      routePath: "/api/seo/sync",
      mountPath: "/api/seo",
      method: "",
      middlewares: [],
      modules: [__api_seo_sync_js_onRequest],
    },
  ]