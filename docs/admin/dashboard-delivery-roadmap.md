# CabukUlas Dashboard Delivery Roadmap

## Faz 1: Foundation

- `admin-web` uygulamasını ayağa kaldır
- Supabase Auth magic link ile giriş
- `admin_profiles` üzerinden role gate
- Overview, Companies, Categories, Contact Channels modülleri
- Review queue ve temel audit log görünümü

## Faz 2: Product Analytics

- Mobil uygulamada event instrumentation
- `product_events` tablosuna yazım
- `analytics_product_daily`
- `analytics_top_companies`
- `analytics_top_channels`
- `analytics_no_result_searches`

## Faz 3: Operations Control Tower

- Data Health modülü
- Reports çözüm akışı
- stale record ve verification görünürlüğü
- review backlog ve rapor çözüm süresi görünürlüğü

## Faz 4: Publishing Hardening

- Public-safe projection / view geçişi
- publish / archive / rollback yardımcı akışları
- placement yönetimini operasyonlaştır
- automation suggestions acceptance flow

## Canlıya Çıkış Checklist

- Migration `007_admin_analytics_surface.sql` uygulanmış olmalı
- `admin_profiles` içine en az bir `super_admin` kullanıcı atanmış olmalı
- `admin-web/.env.local` doğru Supabase public anahtarlarını içermeli
- Admin giriş testi yapılmalı
- Public app event insert testi yapılmalı
- Dashboard analytics view’larında veri akışı doğrulanmalı
