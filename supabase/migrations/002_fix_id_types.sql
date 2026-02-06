-- ID tiplerini UUID'den TEXT'e cevir (okunabilir ID'ler icin)
DROP TRIGGER IF EXISTS contact_channels_updated_at ON contact_channels;
DROP TRIGGER IF EXISTS companies_updated_at ON companies;
DROP POLICY IF EXISTS "Herkes kanallari gorebilir" ON contact_channels;
DROP POLICY IF EXISTS "Herkes firmalari gorebilir" ON companies;
DROP POLICY IF EXISTS "Herkes kategorileri gorebilir" ON categories;
DROP TABLE IF EXISTS contact_channels;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  has_cargo_tracking BOOLEAN DEFAULT false,
  cargo_tracking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contact_channels (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  channel_type TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  is_fastest BOOLEAN DEFAULT false,
  working_hours JSONB,
  official_source_url TEXT,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_companies_category ON companies(category_id);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_contact_channels_company ON contact_channels(company_id);
CREATE INDEX idx_companies_name_search ON companies USING gin(to_tsvector('simple', name));

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cat_read" ON categories FOR SELECT USING (true);
CREATE POLICY "comp_read" ON companies FOR SELECT USING (true);
CREATE POLICY "chan_read" ON contact_channels FOR SELECT USING (true);

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER contact_channels_updated_at BEFORE UPDATE ON contact_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at();
