-- ==========================================
-- CabukUlas - Seed Data
-- Supabase SQL Editor'den calistirin
-- ==========================================

-- Kategoriler
INSERT INTO categories (id, name, icon, sort_order) VALUES
  ('cat-eticaret', 'E-Ticaret', 'e-ticaret', 1),
  ('cat-kargo', 'Kargo', 'kargo', 2),
  ('cat-banka', 'Banka', 'banka', 3),
  ('cat-telekom', 'Telekom', 'telekom', 4),
  ('cat-dijital', 'Dijital Servis', 'dijital', 5),
  ('cat-sigorta', 'Sigorta', 'sigorta', 6),
  ('cat-enerji', 'Enerji', 'enerji', 7),
  ('cat-ulasim', 'Ulaşım', 'ulasim', 8)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- E-Ticaret Firmalari
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url) VALUES
  ('comp-trendyol', 'Trendyol', 'trendyol', 'cat-eticaret', 'Türkiye''nin en büyük e-ticaret platformu', 'https://www.trendyol.com'),
  ('comp-hepsiburada', 'Hepsiburada', 'hepsiburada', 'cat-eticaret', 'Online alışveriş platformu', 'https://www.hepsiburada.com'),
  ('comp-n11', 'n11', 'n11', 'cat-eticaret', 'Online pazar yeri', 'https://www.n11.com'),
  ('comp-amazon-tr', 'Amazon Türkiye', 'amazon-turkiye', 'cat-eticaret', 'Global e-ticaret platformu', 'https://www.amazon.com.tr'),
  ('comp-ciceksepeti', 'Çiçeksepeti', 'ciceksepeti', 'cat-eticaret', 'Çiçek ve hediye siparişi', 'https://www.ciceksepeti.com'),
  ('comp-gittigidiyor', 'GittiGidiyor', 'gittigidiyor', 'cat-eticaret', 'Online açık artırma ve alışveriş', 'https://www.gittigidiyor.com'),
  ('comp-getir', 'Getir', 'getir', 'cat-eticaret', 'Hızlı market teslimatı', 'https://getir.com'),
  ('comp-yemeksepeti', 'Yemeksepeti', 'yemeksepeti', 'cat-eticaret', 'Online yemek siparişi', 'https://www.yemeksepeti.com')
ON CONFLICT (id) DO NOTHING;

-- E-Ticaret Iletisim Kanallari
INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  -- Trendyol
  ('comp-trendyol', 'live_chat', 'https://www.trendyol.com/yardim', 'Canlı Destek (Uygulama içi)', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.trendyol.com/yardim', 1),
  ('comp-trendyol', 'phone', '0212 331 0 200', 'Müşteri Hizmetleri', false, '{"weekdays": "09:00-18:00", "weekend": ""}', 'https://www.trendyol.com/yardim', 2),
  ('comp-trendyol', 'email', 'customercare@trendyol.com', 'E-posta Destek', false, NULL, 'https://www.trendyol.com/yardim', 3),
  ('comp-trendyol', 'twitter', 'https://twitter.com/taboradestek', 'Twitter Destek', false, NULL, NULL, 4),

  -- Hepsiburada
  ('comp-hepsiburada', 'live_chat', 'https://www.hepsiburada.com/yardim', 'Canlı Destek', true, '{"weekdays": "08:00-24:00", "weekend": "08:00-24:00"}', 'https://www.hepsiburada.com/yardim', 1),
  ('comp-hepsiburada', 'phone', '0850 252 40 00', 'Müşteri Hizmetleri', false, '{"weekdays": "09:00-18:00", "weekend": ""}', 'https://www.hepsiburada.com/yardim', 2),
  ('comp-hepsiburada', 'twitter', 'https://twitter.com/haboradestek', 'Twitter Destek', false, NULL, NULL, 3),

  -- n11
  ('comp-n11', 'phone', '0850 222 11 11', 'Müşteri Hizmetleri', false, '{"weekdays": "09:00-18:00", "weekend": ""}', 'https://www.n11.com/bilgi/iletisim', 1),
  ('comp-n11', 'live_chat', 'https://www.n11.com/bilgi/iletisim', 'Canlı Destek', true, '{"weekdays": "09:00-22:00", "weekend": "09:00-22:00"}', 'https://www.n11.com/bilgi/iletisim', 2),

  -- Amazon Türkiye
  ('comp-amazon-tr', 'live_chat', 'https://www.amazon.com.tr/gp/help/customer/contact-us', 'Canlı Sohbet', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.amazon.com.tr/gp/help/customer/contact-us', 1),
  ('comp-amazon-tr', 'phone', '0800 620 02 40', 'Ücretsiz Müşteri Hizmetleri', false, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.amazon.com.tr/gp/help/customer/contact-us', 2),

  -- Çiçeksepeti
  ('comp-ciceksepeti', 'phone', '0850 210 21 21', 'Müşteri Hizmetleri', false, '{"weekdays": "08:00-22:00", "weekend": "08:00-22:00"}', 'https://www.ciceksepeti.com/iletisim', 1),
  ('comp-ciceksepeti', 'live_chat', 'https://www.ciceksepeti.com/iletisim', 'Canlı Destek', true, '{"weekdays": "08:00-22:00", "weekend": "08:00-22:00"}', 'https://www.ciceksepeti.com/iletisim', 2),
  ('comp-ciceksepeti', 'whatsapp', 'https://wa.me/908502102121', 'WhatsApp', false, NULL, NULL, 3),

  -- Getir
  ('comp-getir', 'live_chat', 'https://getir.com', 'Uygulama İçi Destek', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://getir.com', 1),
  ('comp-getir', 'email', 'destek@getir.com', 'E-posta', false, NULL, 'https://getir.com', 2),

  -- Yemeksepeti
  ('comp-yemeksepeti', 'live_chat', 'https://www.yemeksepeti.com/iletisim', 'Canlı Destek', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.yemeksepeti.com/iletisim', 1),
  ('comp-yemeksepeti', 'phone', '0850 755 05 55', 'Müşteri Hizmetleri', false, '{"weekdays": "10:00-24:00", "weekend": "10:00-24:00"}', 'https://www.yemeksepeti.com/iletisim', 2);

-- ==========================================
-- Kargo Firmalari
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url, has_cargo_tracking, cargo_tracking_url) VALUES
  ('comp-yurtici', 'Yurtiçi Kargo', 'yurtici-kargo', 'cat-kargo', 'Yurt içi kargo taşımacılığı', 'https://www.yurticikargo.com', true, 'https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code={code}'),
  ('comp-aras', 'Aras Kargo', 'aras-kargo', 'cat-kargo', 'Kargo taşımacılığı', 'https://www.araskargo.com.tr', true, 'https://www.araskargo.com.tr/trmGonderiSorgula.aspx?q={code}'),
  ('comp-mng', 'MNG Kargo', 'mng-kargo', 'cat-kargo', 'Kargo ve lojistik', 'https://www.mngkargo.com.tr', true, 'https://www.mngkargo.com.tr/gonderi-takip?tracking_code={code}'),
  ('comp-ptt', 'PTT Kargo', 'ptt-kargo', 'cat-kargo', 'PTT kargo hizmeti', 'https://gonderitakip.ptt.gov.tr', true, 'https://gonderitakip.ptt.gov.tr/Track/Verify?q={code}'),
  ('comp-surat', 'Sürat Kargo', 'surat-kargo', 'cat-kargo', 'Hızlı kargo teslimatı', 'https://www.suratkargo.com.tr', true, 'https://www.suratkargo.com.tr/kargo-takip?kod={code}'),
  ('comp-trendyolexpress', 'Trendyol Express', 'trendyol-express', 'cat-kargo', 'Trendyol kargo hizmeti', 'https://www.trendyolexpress.com', true, 'https://www.trendyolexpress.com/gonderi-takip?barkod={code}'),
  ('comp-ups', 'UPS Türkiye', 'ups-turkiye', 'cat-kargo', 'Uluslararası kargo', 'https://www.ups.com.tr', true, 'https://www.ups.com/track?tracknum={code}'),
  ('comp-fedex', 'FedEx Türkiye', 'fedex-turkiye', 'cat-kargo', 'Uluslararası kargo hizmeti', 'https://www.fedex.com/tr-tr', true, 'https://www.fedex.com/fedextrack/?tracknumbers={code}')
ON CONFLICT (id) DO NOTHING;

-- Kargo Iletisim Kanallari
INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  -- Yurtiçi Kargo
  ('comp-yurtici', 'phone', '0850 222 09 99', 'Müşteri Hizmetleri', true, '{"weekdays": "08:30-19:00", "weekend": "09:00-17:00"}', 'https://www.yurticikargo.com/tr/iletisim', 1),
  ('comp-yurtici', 'live_chat', 'https://www.yurticikargo.com/tr/iletisim', 'Canlı Destek', false, '{"weekdays": "08:30-19:00", "weekend": ""}', 'https://www.yurticikargo.com/tr/iletisim', 2),
  ('comp-yurtici', 'whatsapp', 'https://wa.me/908502220999', 'WhatsApp', false, NULL, NULL, 3),

  -- Aras Kargo
  ('comp-aras', 'phone', '444 25 52', 'Müşteri Hizmetleri', true, '{"weekdays": "08:30-19:00", "weekend": "09:00-17:00"}', 'https://www.araskargo.com.tr/iletisim', 1),
  ('comp-aras', 'live_chat', 'https://www.araskargo.com.tr/iletisim', 'Canlı Destek', false, '{"weekdays": "08:00-20:00", "weekend": ""}', NULL, 2),

  -- MNG Kargo
  ('comp-mng', 'phone', '444 0 665', 'Müşteri Hizmetleri', true, '{"weekdays": "08:30-19:00", "weekend": "09:00-14:00"}', 'https://www.mngkargo.com.tr/iletisim', 1),
  ('comp-mng', 'email', 'info@mngkargo.com.tr', 'E-posta', false, NULL, 'https://www.mngkargo.com.tr/iletisim', 2),

  -- PTT Kargo
  ('comp-ptt', 'phone', '444 1 788', 'ALO PTT', true, '{"weekdays": "08:00-22:00", "weekend": "08:00-22:00"}', 'https://www.ptt.gov.tr/iletisim', 1),
  ('comp-ptt', 'email', 'bilgi@ptt.gov.tr', 'E-posta', false, NULL, NULL, 2),

  -- Sürat Kargo
  ('comp-surat', 'phone', '0850 222 57 87', 'Müşteri Hizmetleri', true, '{"weekdays": "08:30-18:30", "weekend": ""}', 'https://www.suratkargo.com.tr/iletisim', 1),

  -- Trendyol Express
  ('comp-trendyolexpress', 'phone', '0850 202 09 09', 'Müşteri Hizmetleri', true, '{"weekdays": "09:00-18:00", "weekend": ""}', 'https://www.trendyolexpress.com/iletisim', 1),

  -- UPS Türkiye
  ('comp-ups', 'phone', '444 00 33', 'Müşteri Hizmetleri', true, '{"weekdays": "08:30-18:30", "weekend": ""}', 'https://www.ups.com.tr/iletisim', 1),
  ('comp-ups', 'live_chat', 'https://www.ups.com.tr', 'Online Destek', false, NULL, NULL, 2),

  -- FedEx Türkiye
  ('comp-fedex', 'phone', '0212 444 0 338', 'Müşteri Hizmetleri', true, '{"weekdays": "08:30-18:30", "weekend": ""}', 'https://www.fedex.com/tr-tr/customer-support.html', 1);

-- ==========================================
-- Bankalar
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url) VALUES
  ('comp-garanti', 'Garanti BBVA', 'garanti-bbva', 'cat-banka', 'Garanti BBVA Bankası', 'https://www.garantibbva.com.tr'),
  ('comp-isbank', 'İş Bankası', 'is-bankasi', 'cat-banka', 'Türkiye İş Bankası', 'https://www.isbank.com.tr'),
  ('comp-akbank', 'Akbank', 'akbank', 'cat-banka', 'Akbank T.A.Ş.', 'https://www.akbank.com'),
  ('comp-yapikredi', 'Yapı Kredi', 'yapi-kredi', 'cat-banka', 'Yapı ve Kredi Bankası', 'https://www.yapikredi.com.tr'),
  ('comp-ziraat', 'Ziraat Bankası', 'ziraat-bankasi', 'cat-banka', 'T.C. Ziraat Bankası', 'https://www.ziraatbank.com.tr'),
  ('comp-halkbank', 'Halkbank', 'halkbank', 'cat-banka', 'Türkiye Halk Bankası', 'https://www.halkbank.com.tr'),
  ('comp-vakifbank', 'VakıfBank', 'vakifbank', 'cat-banka', 'Türkiye Vakıflar Bankası', 'https://www.vakifbank.com.tr'),
  ('comp-enpara', 'Enpara', 'enpara', 'cat-banka', 'QNB Finansbank dijital bankacılık', 'https://www.enpara.com'),
  ('comp-papara', 'Papara', 'papara', 'cat-banka', 'Dijital ödeme platformu', 'https://www.papara.com')
ON CONFLICT (id) DO NOTHING;

-- Banka Iletisim Kanallari
INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  -- Garanti BBVA
  ('comp-garanti', 'phone', '444 0 333', 'Müşteri İletişim Merkezi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.garantibbva.com.tr/iletisim', 1),
  ('comp-garanti', 'live_chat', 'https://www.garantibbva.com.tr', 'Uygulama İçi Destek', false, NULL, NULL, 2),
  ('comp-garanti', 'twitter', 'https://twitter.com/garantibbva', 'Twitter', false, NULL, NULL, 3),

  -- İş Bankası
  ('comp-isbank', 'phone', '444 0 202', 'Müşteri İletişim Merkezi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.isbank.com.tr/iletisim', 1),
  ('comp-isbank', 'live_chat', 'https://www.isbank.com.tr', 'İşCep Destek', false, NULL, NULL, 2),
  ('comp-isbank', 'email', 'musteri@isbank.com.tr', 'E-posta', false, NULL, NULL, 3),

  -- Akbank
  ('comp-akbank', 'phone', '444 25 25', 'Akbank Direkt', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.akbank.com/iletisim', 1),
  ('comp-akbank', 'live_chat', 'https://www.akbank.com', 'Akbank Mobil Destek', false, NULL, NULL, 2),

  -- Yapı Kredi
  ('comp-yapikredi', 'phone', '444 0 444', 'Müşteri İletişim', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.yapikredi.com.tr/iletisim', 1),
  ('comp-yapikredi', 'live_chat', 'https://www.yapikredi.com.tr', 'Online Destek', false, NULL, NULL, 2),
  ('comp-yapikredi', 'twitter', 'https://twitter.com/yapikredi', 'Twitter', false, NULL, NULL, 3),

  -- Ziraat Bankası
  ('comp-ziraat', 'phone', '444 0 000', 'ALO Ziraat', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.ziraatbank.com.tr/tr/iletisim', 1),
  ('comp-ziraat', 'live_chat', 'https://www.ziraatbank.com.tr', 'Ziraat Mobil Destek', false, NULL, NULL, 2),

  -- Halkbank
  ('comp-halkbank', 'phone', '444 0 400', 'Halkbank Çağrı Merkezi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.halkbank.com.tr/tr/iletisim', 1),

  -- VakıfBank
  ('comp-vakifbank', 'phone', '444 0 724', 'VakıfBank Çağrı Merkezi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.vakifbank.com.tr/iletisim', 1),
  ('comp-vakifbank', 'live_chat', 'https://www.vakifbank.com.tr', 'VakıfBank Mobil', false, NULL, NULL, 2),

  -- Enpara
  ('comp-enpara', 'phone', '0850 222 00 46', 'Enpara.com Destek', false, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.enpara.com/iletisim', 1),
  ('comp-enpara', 'live_chat', 'https://www.enpara.com', 'Uygulama İçi Chat', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', NULL, 2),

  -- Papara
  ('comp-papara', 'live_chat', 'https://www.papara.com/destek', 'Uygulama İçi Destek', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.papara.com/destek', 1),
  ('comp-papara', 'email', 'destek@papara.com', 'E-posta', false, NULL, NULL, 2),
  ('comp-papara', 'twitter', 'https://twitter.com/papaboradestek', 'Twitter Destek', false, NULL, NULL, 3);

-- ==========================================
-- Telekom Firmalari
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url) VALUES
  ('comp-turkcell', 'Turkcell', 'turkcell', 'cat-telekom', 'GSM operatörü', 'https://www.turkcell.com.tr'),
  ('comp-vodafone', 'Vodafone', 'vodafone', 'cat-telekom', 'GSM operatörü', 'https://www.vodafone.com.tr'),
  ('comp-turktelekom', 'Türk Telekom', 'turk-telekom', 'cat-telekom', 'Sabit hat ve internet sağlayıcı', 'https://www.turktelekom.com.tr'),
  ('comp-superonline', 'Superonline', 'superonline', 'cat-telekom', 'Fiber internet sağlayıcı', 'https://www.superonline.net'),
  ('comp-bimcell', 'Bimcell', 'bimcell', 'cat-telekom', 'Sanal mobil operatör', 'https://www.bimcell.com.tr')
ON CONFLICT (id) DO NOTHING;

-- Telekom Iletisim Kanallari
INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  -- Turkcell
  ('comp-turkcell', 'phone', '532 532 00 00', 'Müşteri Hizmetleri', false, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.turkcell.com.tr/iletisim', 1),
  ('comp-turkcell', 'live_chat', 'https://www.turkcell.com.tr', 'Dijital Asistan', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', NULL, 2),
  ('comp-turkcell', 'whatsapp', 'https://wa.me/905325320000', 'WhatsApp', false, NULL, NULL, 3),
  ('comp-turkcell', 'twitter', 'https://twitter.com/turkcell', 'Twitter', false, NULL, NULL, 4),

  -- Vodafone
  ('comp-vodafone', 'phone', '542 542 00 00', 'Müşteri Hizmetleri', false, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.vodafone.com.tr/iletisim', 1),
  ('comp-vodafone', 'live_chat', 'https://www.vodafone.com.tr', 'TOBi Dijital Asistan', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', NULL, 2),
  ('comp-vodafone', 'twitter', 'https://twitter.com/vodafonetr', 'Twitter', false, NULL, NULL, 3),

  -- Türk Telekom
  ('comp-turktelekom', 'phone', '444 1 444', 'Müşteri Hizmetleri', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.turktelekom.com.tr/iletisim', 1),
  ('comp-turktelekom', 'live_chat', 'https://www.turktelekom.com.tr', 'Online İşlemler', false, NULL, NULL, 2),
  ('comp-turktelekom', 'twitter', 'https://twitter.com/turktelekom', 'Twitter', false, NULL, NULL, 3),

  -- Superonline
  ('comp-superonline', 'phone', '444 4 103', 'Teknik Destek', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.superonline.net/iletisim', 1),
  ('comp-superonline', 'live_chat', 'https://www.superonline.net', 'Online Destek', false, NULL, NULL, 2),

  -- Bimcell
  ('comp-bimcell', 'phone', '0850 222 02 46', 'Müşteri Hizmetleri', true, '{"weekdays": "08:00-22:00", "weekend": "09:00-18:00"}', 'https://www.bimcell.com.tr/iletisim', 1);

-- ==========================================
-- Dijital Servis Firmalari
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url) VALUES
  ('comp-spotify', 'Spotify', 'spotify', 'cat-dijital', 'Müzik streaming servisi', 'https://www.spotify.com'),
  ('comp-netflix', 'Netflix', 'netflix', 'cat-dijital', 'Film ve dizi streaming', 'https://www.netflix.com'),
  ('comp-youtube', 'YouTube Premium', 'youtube-premium', 'cat-dijital', 'Video streaming ve premium', 'https://www.youtube.com'),
  ('comp-apple', 'Apple Türkiye', 'apple-turkiye', 'cat-dijital', 'Apple ürün ve servisleri', 'https://www.apple.com/tr'),
  ('comp-samsung', 'Samsung Türkiye', 'samsung-turkiye', 'cat-dijital', 'Samsung ürün ve servisleri', 'https://www.samsung.com/tr'),
  ('comp-xbox', 'Xbox / Microsoft', 'xbox-microsoft', 'cat-dijital', 'Xbox ve Microsoft servisleri', 'https://www.xbox.com/tr-TR'),
  ('comp-playstation', 'PlayStation', 'playstation', 'cat-dijital', 'PlayStation oyun servisi', 'https://www.playstation.com/tr-tr'),
  ('comp-steam', 'Steam', 'steam', 'cat-dijital', 'PC oyun platformu', 'https://store.steampowered.com')
ON CONFLICT (id) DO NOTHING;

-- Dijital Servis Iletisim Kanallari
INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  -- Spotify
  ('comp-spotify', 'live_chat', 'https://support.spotify.com/tr/contact-spotify-support/', 'Online Destek', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://support.spotify.com/tr/', 1),
  ('comp-spotify', 'twitter', 'https://twitter.com/SpotifyCares', 'Twitter Destek', false, NULL, NULL, 2),
  ('comp-spotify', 'email', 'support@spotify.com', 'E-posta', false, NULL, NULL, 3),

  -- Netflix
  ('comp-netflix', 'phone', '0850 390 11 93', 'Müşteri Hizmetleri', false, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://help.netflix.com/tr/contactus', 1),
  ('comp-netflix', 'live_chat', 'https://help.netflix.com/tr/contactus', 'Canlı Sohbet', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://help.netflix.com/tr/contactus', 2),

  -- Apple Türkiye
  ('comp-apple', 'phone', '0800 261 17 00', 'Apple Destek (Ücretsiz)', true, '{"weekdays": "09:00-20:00", "weekend": "09:00-18:00"}', 'https://support.apple.com/tr-tr', 1),
  ('comp-apple', 'live_chat', 'https://getsupport.apple.com/solutions', 'Online Destek', false, NULL, NULL, 2),

  -- Samsung Türkiye
  ('comp-samsung', 'phone', '444 77 11', 'Samsung Çağrı Merkezi', true, '{"weekdays": "09:00-18:00", "weekend": ""}', 'https://www.samsung.com/tr/support/', 1),
  ('comp-samsung', 'live_chat', 'https://www.samsung.com/tr/support/', 'Canlı Destek', false, NULL, NULL, 2),
  ('comp-samsung', 'whatsapp', 'https://wa.me/908502270022', 'WhatsApp', false, NULL, NULL, 3),

  -- Xbox / Microsoft
  ('comp-xbox', 'live_chat', 'https://support.xbox.com/tr-TR/contact-us', 'Online Destek', true, NULL, 'https://support.xbox.com/tr-TR', 1),
  ('comp-xbox', 'phone', '0850 222 08 28', 'Microsoft Destek', false, '{"weekdays": "09:00-18:00", "weekend": ""}', NULL, 2),

  -- PlayStation
  ('comp-playstation', 'phone', '0212 371 78 00', 'PlayStation Destek', false, '{"weekdays": "10:00-19:00", "weekend": ""}', 'https://www.playstation.com/tr-tr/support/', 1),
  ('comp-playstation', 'live_chat', 'https://www.playstation.com/tr-tr/support/', 'Canlı Sohbet', true, '{"weekdays": "10:00-19:00", "weekend": ""}', NULL, 2),

  -- Steam
  ('comp-steam', 'live_chat', 'https://help.steampowered.com/', 'Steam Destek', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://help.steampowered.com/', 1);

-- ==========================================
-- Sigorta Firmalari
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url) VALUES
  ('comp-anadolusigorta', 'Anadolu Sigorta', 'anadolu-sigorta', 'cat-sigorta', 'Sigorta hizmetleri', 'https://www.anadolusigorta.com.tr'),
  ('comp-allianz', 'Allianz Türkiye', 'allianz-turkiye', 'cat-sigorta', 'Sigorta ve bireysel emeklilik', 'https://www.allianz.com.tr'),
  ('comp-axasigorta', 'AXA Sigorta', 'axa-sigorta', 'cat-sigorta', 'Sigorta hizmetleri', 'https://www.axasigorta.com.tr')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  ('comp-anadolusigorta', 'phone', '444 0 350', 'Çağrı Merkezi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.anadolusigorta.com.tr/iletisim', 1),
  ('comp-allianz', 'phone', '444 0 399', 'Müşteri Hizmetleri', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.allianz.com.tr/tr/iletisim.html', 1),
  ('comp-allianz', 'whatsapp', 'https://wa.me/908502221399', 'WhatsApp', false, NULL, NULL, 2),
  ('comp-axasigorta', 'phone', '444 0 292', 'Müşteri Hizmetleri', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.axasigorta.com.tr/iletisim', 1);

-- ==========================================
-- Enerji Firmalari
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url) VALUES
  ('comp-igdas', 'İGDAŞ', 'igdas', 'cat-enerji', 'İstanbul doğalgaz dağıtım', 'https://www.igdas.istanbul'),
  ('comp-bedas', 'BEDAŞ', 'bedas', 'cat-enerji', 'Boğaziçi Elektrik Dağıtım', 'https://www.bedas.com.tr'),
  ('comp-enerjisa', 'Enerjisa', 'enerjisa', 'cat-enerji', 'Enerji dağıtım ve perakende', 'https://www.enerjisa.com.tr')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  ('comp-igdas', 'phone', '187', 'Doğalgaz Arıza', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.igdas.istanbul/iletisim', 1),
  ('comp-igdas', 'phone', '444 4 187', 'Müşteri Hizmetleri', false, '{"weekdays": "08:00-18:00", "weekend": ""}', NULL, 2),
  ('comp-bedas', 'phone', '186', 'Arıza Bildirimi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.bedas.com.tr/iletisim', 1),
  ('comp-bedas', 'phone', '444 0 186', 'Müşteri Hizmetleri', false, '{"weekdays": "08:00-17:00", "weekend": ""}', NULL, 2),
  ('comp-enerjisa', 'phone', '444 4 372', 'Müşteri Hizmetleri', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.enerjisa.com.tr/iletisim', 1),
  ('comp-enerjisa', 'live_chat', 'https://www.enerjisa.com.tr', 'Online Destek', false, NULL, NULL, 2);

-- ==========================================
-- Ulasim Firmalari
-- ==========================================

INSERT INTO companies (id, name, slug, category_id, description, website_url) VALUES
  ('comp-thy', 'Türk Hava Yolları', 'turk-hava-yollari', 'cat-ulasim', 'Ulusal havayolu', 'https://www.turkishairlines.com'),
  ('comp-pegasus', 'Pegasus', 'pegasus', 'cat-ulasim', 'Düşük maliyetli havayolu', 'https://www.flypgs.com'),
  ('comp-tcdd', 'TCDD', 'tcdd', 'cat-ulasim', 'Devlet Demiryolları', 'https://www.tcdd.gov.tr'),
  ('comp-obilet', 'oBilet', 'obilet', 'cat-ulasim', 'Online otobüs ve uçak bileti', 'https://www.obilet.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_channels (company_id, channel_type, value, label, is_fastest, working_hours, official_source_url, sort_order) VALUES
  -- THY
  ('comp-thy', 'phone', '444 0 849', 'Çağrı Merkezi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.turkishairlines.com/tr-int/iletisim/', 1),
  ('comp-thy', 'live_chat', 'https://www.turkishairlines.com', 'Online Destek', false, NULL, NULL, 2),
  ('comp-thy', 'whatsapp', 'https://wa.me/908503330849', 'WhatsApp', false, NULL, NULL, 3),
  ('comp-thy', 'twitter', 'https://twitter.com/turkishairlines', 'Twitter', false, NULL, NULL, 4),

  -- Pegasus
  ('comp-pegasus', 'phone', '0888 228 12 12', 'Çağrı Merkezi', true, '{"weekdays": "00:00-23:59", "weekend": "00:00-23:59"}', 'https://www.flypgs.com/iletisim', 1),
  ('comp-pegasus', 'live_chat', 'https://www.flypgs.com', 'Online Destek', false, NULL, NULL, 2),

  -- TCDD
  ('comp-tcdd', 'phone', '444 8 233', 'TCDD İletişim', true, '{"weekdays": "07:00-23:00", "weekend": "07:00-23:00"}', 'https://www.tcdd.gov.tr/iletisim', 1),

  -- oBilet
  ('comp-obilet', 'phone', '0850 302 14 14', 'Müşteri Hizmetleri', false, '{"weekdays": "08:00-22:00", "weekend": "08:00-22:00"}', 'https://www.obilet.com/iletisim', 1),
  ('comp-obilet', 'live_chat', 'https://www.obilet.com/iletisim', 'Canlı Destek', true, '{"weekdays": "08:00-22:00", "weekend": "08:00-22:00"}', NULL, 2);
