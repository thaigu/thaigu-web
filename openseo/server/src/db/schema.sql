-- ==========================================================
-- openSEO Core Database Schema (PostgreSQL & SQLite Compatible)
-- ==========================================================

-- 1. SEO 頁面資產表
CREATE TABLE IF NOT EXISTS seo_pages (
    id BIGSERIAL PRIMARY KEY,
    page_type VARCHAR(32) NOT NULL,            -- 'product', 'category', 'article', 'landing', 'compare'
    entity_id BIGINT,                          -- 可關聯業務實體 ID
    slug TEXT NOT NULL,                         -- URL slug
    canonical_url TEXT NOT NULL UNIQUE,         -- 唯一規範化 URL

    title TEXT,                                 -- SEO Meta Title
    description TEXT,                           -- Meta Description
    h1 TEXT,                                    -- 頁面主要 H1

    seo_score INTEGER NOT NULL DEFAULT 0,       -- 0 ~ 100 分綜合評分
    indexable BOOLEAN NOT NULL DEFAULT FALSE,   -- 是否符合索引門檻 (Index Eligibility)
    robots VARCHAR(32) NOT NULL DEFAULT 'noindex,follow', -- 'index,follow' / 'noindex,follow'

    content_hash TEXT,                          -- 內容指紋 (用於檢測內容變更)
    data_version BIGINT DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'published', -- 'draft', 'published', 'archived', 'redirect'

    first_seen_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_generated_at TIMESTAMPTZ,
    last_data_change_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_seo_pages_indexable ON seo_pages(indexable, status);
CREATE INDEX IF NOT EXISTS idx_seo_pages_slug ON seo_pages(slug);

-- 2. 內部鏈接拓撲 (Internal Link Graph)
CREATE TABLE IF NOT EXISTS seo_links (
    source_page_id BIGINT REFERENCES seo_pages(id) ON DELETE CASCADE,
    target_page_id BIGINT REFERENCES seo_pages(id) ON DELETE CASCADE,
    link_type VARCHAR(32),                      -- 'parent_to_child', 'related', 'contextual', 'navigation'
    weight INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_page_id, target_page_id)
);

CREATE INDEX IF NOT EXISTS idx_seo_links_target ON seo_links(target_page_id);

-- 3. 工作隊列 (Batch Jobs Queue)
CREATE TABLE IF NOT EXISTS seo_jobs (
    id BIGSERIAL PRIMARY KEY,
    job_type VARCHAR(64) NOT NULL,              -- 'RECALC_SCORE', 'GENERATE_SITEMAP', 'GSC_SYNC', 'AUDIT'
    entity_id BIGINT,
    priority INTEGER DEFAULT 100,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    payload JSONB DEFAULT '{}',
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_seo_jobs_pending ON seo_jobs(status, priority DESC, id ASC);

-- 4. 高價值搜尋機會 (SEO Opportunities)
CREATE TABLE IF NOT EXISTS seo_opportunities (
    id BIGSERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    suggested_page_type VARCHAR(32) NOT NULL,   -- 'striking_distance', 'missing_landing', 'ctr_optimization'
    suggested_slug TEXT NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    position NUMERIC(6, 2),
    opportunity_score INTEGER DEFAULT 0,        -- 0 ~ 100
    reason TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'applied', 'dismissed'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Google Search Console 搜尋表現明細 (GSC Loop)
CREATE TABLE IF NOT EXISTS gsc_search_analytics (
    id BIGSERIAL PRIMARY KEY,
    date VARCHAR(32) NOT NULL,
    query TEXT NOT NULL,
    page TEXT NOT NULL,
    country VARCHAR(8) DEFAULT 'all',
    device VARCHAR(16) DEFAULT 'desktop',
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr NUMERIC(6, 4) DEFAULT 0,
    position NUMERIC(6, 2) DEFAULT 0,
    is_anonymized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, query, page, device)
);

CREATE INDEX IF NOT EXISTS idx_gsc_date_query ON gsc_search_analytics(date DESC, query);
CREATE INDEX IF NOT EXISTS idx_gsc_page ON gsc_search_analytics(page);

-- 6. GSC 雙軌同步狀態
CREATE TABLE IF NOT EXISTS seo_sync_status (
    track TEXT PRIMARY KEY,                     -- 'aggregate' | 'query'
    last_attempt_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_rows INT NOT NULL DEFAULT 0,
    last_error TEXT
);

-- 7. 關鍵詞資產表 (Keyword Asset Management ⭐ 核心層)
CREATE TABLE IF NOT EXISTS seo_keyword (
    id          BIGSERIAL PRIMARY KEY,
    term        TEXT NOT NULL UNIQUE,
    locale      TEXT DEFAULT 'zh-Hant',
    intent      TEXT,                           -- 'transactional' | 'commercial' | 'informational' | 'navigational'
    is_brand    BOOLEAN DEFAULT FALSE,
    target_url  TEXT,                           -- NULL = Gap (有需求但無專屬落地頁)
    source      TEXT DEFAULT 'manual',          -- 'seed' | 'gsc' | 'manual'
    priority    INT DEFAULT 0,
    note        TEXT,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_kw_target ON seo_keyword(target_url);
CREATE INDEX IF NOT EXISTS idx_kw_brand ON seo_keyword(is_brand, intent);

-- 8. 關鍵詞每日歷史快照 (用於對照 target_url vs best_url 自相殘殺與錯配檢測)
CREATE TABLE IF NOT EXISTS seo_keyword_daily (
    keyword_id  BIGINT REFERENCES seo_keyword(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    best_url    TEXT,                           -- 當日實際排最高的 URL
    position    NUMERIC(6, 2),
    impressions INT DEFAULT 0,
    clicks      INT DEFAULT 0,
    PRIMARY KEY (keyword_id, date)
);

CREATE INDEX IF NOT EXISTS idx_kwd_date ON seo_keyword_daily(date DESC);

-- 9. 健康檢查與審計異常紀錄
CREATE TABLE IF NOT EXISTS seo_audit_results (
    id BIGSERIAL PRIMARY KEY,
    audit_type VARCHAR(64) NOT NULL,            -- '404_OR_500', 'CANONICAL_MISMATCH', 'THIN_CONTENT', 'ORPHAN_PAGE'
    page_id BIGINT,
    severity VARCHAR(16) DEFAULT 'warning',     -- 'critical', 'warning', 'info'
    details JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
