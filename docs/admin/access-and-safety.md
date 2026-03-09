# CabukUlas Admin Access ve Safety Notları

## Rol Modeli

- `super_admin`
  Rol yönetimi, publish, archive, rollback, placement ve sistem ayarları.
- `admin`
  Tüm içerik yönetimi, approve, publish, archive.
- `editor`
  Draft oluşturma ve düzenleme.
- `reviewer`
  Review, approve, reject, report çözümü.
- `analyst`
  Dashboard, analytics, audit log ve health verisini okuma.
- `support`
  Rapor ve operasyon görünürlüğü, sınırlı çözümleme akışı.

## Public vs Admin Ayrımı

- Public app yalnızca `published` ve `archived_at is null` içerikleri görür.
- Admin panel base tablolar üzerinde role-aware RLS ile çalışır.
- Public-safe projection:
  - `published_companies_public`
  - `published_contact_channels_public`

## Güvenlik Kuralları

- Hard delete varsayılan akış değildir.
- Firma ve contact channel için varsayılan destructive aksiyon `archive` olur.
- Publish edilen içerik audit log’a yazılır.
- Review dışı yayınlamalar trace edilebilir olmalıdır.
- Public analytics insert açık olabilir; select yalnızca operasyon rolleri içindir.

## Audit

Aşağıdaki tablolar için otomatik audit trigger tanımlanmıştır:

- `companies`
- `contact_channels`
- `categories`
- `featured_placements`
- `content_reports`

Her audit kaydı şu alanları taşır:

- `entity_type`
- `entity_id`
- `action`
- `before_state`
- `after_state`
- `changed_by`
- `created_at`

## Publish Safety

- `status` alanı kontrollü sözlük ile sınırlandırılır.
- `verification_status` alanı normalize edilir.
- Fastest channel tekil unique partial index ile korunur.
- Public app doğrudan draft içerik okuyamaz.
