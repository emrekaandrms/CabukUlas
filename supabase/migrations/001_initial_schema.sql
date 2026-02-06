-- ==========================================
-- CabukUlas - Veritabani Sema Olusturma
-- ==========================================

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

-- Firmalar tablosu
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  has_cargo_tracking BOOLEAN DEFAULT false,
  cargo_tracking_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Iletisim kanallari tablosu
CREATE TABLE IF NOT EXISTS contact_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('phone', 'live_chat', 'email', 'twitter', 'whatsapp', 'instagram', 'app')),
  value TEXT NOT NULL,
  label TEXT,
  is_fastest BOOLEAN DEFAULT false,
  working_hours JSONB,
  official_source_url TEXT,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(category_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_contact_channels_company ON contact_channels(company_id);
CREATE INDEX IF NOT EXISTS idx_contact_channels_fastest ON contact_channels(is_fastest) WHERE is_fastest = true;

-- Turkce arama icin full-text search index
-- Not: Supabase'de Turkce dil destegi icin 'simple' veya 'turkish' config kullanilabilir
CREATE INDEX IF NOT EXISTS idx_companies_name_search ON companies USING gin(to_tsvector('simple', name));

-- Row Level Security (RLS) - Herkes okuyabilir
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes kategorileri gorebilir" ON categories FOR SELECT USING (true);
CREATE POLICY "Herkes firmalari gorebilir" ON companies FOR SELECT USING (true);
CREATE POLICY "Herkes kanallari gorebilir" ON contact_channels FOR SELECT USING (true);

-- updated_at otomatik guncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER contact_channels_updated_at
  BEFORE UPDATE ON contact_channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
