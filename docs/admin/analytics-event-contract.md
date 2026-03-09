# CabukUlas Analytics Event Contract

## Amaç

Bu doküman mobil uygulamadan toplanan ürün eventlerini, event alanlarını ve dashboard KPI hesaplarını standartlaştırır.

## Event Grupları

### Session

- `session_started`
- `session_ended`

### Navigation

- `screen_view`
- `category_opened`
- `company_opened`

### Search

- `search_started`
- `search_submitted`
- `search_no_result`
- `search_result_clicked`

### Conversion

- `contact_channel_clicked`
- `cargo_tracking_clicked`
- `external_link_opened`
- `favorite_added`
- `favorite_removed`

## Zorunlu Alanlar

- `user_pseudo_id`
- `session_id`
- `event_name`
- `occurred_at`
- `platform`
- `app_version`
- `device_type`
- `locale`

## Opsiyonel Alanlar

- `source_screen`
- `target_screen`
- `company_id`
- `category_id`
- `contact_channel_id`
- `channel_type`
- `query_text`
- `query_normalized`
- `duration_seconds`
- `metadata`

## Ekran Anahtarları

- `/home`
- `/search`
- `/categories`
- `/category/[id]`
- `/company/[slug]`
- `/saved`

## KPI Eşlemesi

- Günlük aktif kullanıcı: `count(distinct user_pseudo_id)`
- Günlük oturum: `count(distinct session_id)` where `event_name = session_started`
- Ortalama oturum süresi: `avg(duration_seconds)` where `event_name = session_ended`
- En çok açılan firmalar: `company_opened`
- En çok tıklanan kanallar: `contact_channel_clicked`
- Sonuçsuz arama oranı: `search_no_result / search_submitted`
- Kaydetme davranışı: `favorite_added`, `favorite_removed`

## Retention Önerisi

- Ham `product_events`: 12 ay
- Günlük aggregate view / materialized report: süresiz
- Aylık export / warehouse entegrasyonu: ikinci faz

## Dashboard Kullanımı

- `analytics_product_daily`: zaman serisi özet
- `analytics_top_companies`: firma bazlı performans
- `analytics_top_channels`: kanal bazlı performans
- `analytics_no_result_searches`: veri kapsam boşlukları
