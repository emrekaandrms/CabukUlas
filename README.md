# CabukUlas - Firmalara En Hizli Yoldan Ulas

Turkiye'deki buyuk firmalara en hizli ve en dogru iletisim kanalini gosteren mobil uygulama.

## Teknoloji

- **Frontend**: React Native (Expo SDK 54) + TypeScript
- **Stil**: NativeWind (TailwindCSS)
- **State**: TanStack Query (cache + offline)
- **Backend**: Supabase (PostgreSQL + REST API)
- **Build**: EAS Build

## Hizli Baslangic

### 1. Bagimliliklari Kur

```bash
npm install
```

### 2. Supabase Kurulumu

1. [supabase.com](https://supabase.com) adresinde yeni proje olusturun
2. SQL Editor'den sema'yi olusturun:
   - `supabase/migrations/001_initial_schema.sql` dosyasini calistirin
3. Seed data'yi yukleyin:
   - `supabase/seed.sql` dosyasini calistirin
4. `.env` dosyasi olusturun:

```bash
cp .env.example .env
```

Supabase Dashboard > Settings > API kismindaki degerleri `.env` dosyasina yapistirir.

### 2.1. Terminalden Supabase Yonetimi

SQL Editor ile ugrasmak istemiyorsaniz, veritabani baglantisini bir kere tanimlayip komutlari terminalden calistirabilirsiniz.

1. Ornek dosyayi kopyalayin:

```bash
cp .env.supabase.example .env.supabase.local
```

2. `.env.supabase.local` icine `SUPABASE_DB_URL` degerini yazin.
3. Sonra asagidaki komutlari kullanin:

```bash
npm run supabase:ping
npm run supabase:sql -- "select count(*) from companies;"
npm run supabase:file -- supabase/migrations/006_operational_foundation.sql
npm run supabase:apply -- supabase/migrations/006_operational_foundation.sql supabase/migrations/007_admin_analytics_surface.sql
```

Notlar:
- Komutlar sirasiyla `.env.supabase.local`, `.env.local`, `.env` dosyalarini yukler.
- Yikici SQL desenleri algilanirsa komut durur. Bilerek calistirmaniz gerekiyorsa `--force` ekleyin.

### 3. Uygulamayi Calistir

```bash
npx expo start
```

- **a** tusu: Android emulator
- **i** tusu: iOS simulator
- **w** tusu: Web tarayici

## Proje Yapisi

```
app/                  # Expo Router sayfalari
  (tabs)/             # Tab navigasyon (Ana Sayfa, Kategoriler)
  company/[slug].tsx  # Firma detay sayfasi
  category/[id].tsx   # Kategori firma listesi
  search.tsx          # Arama ekrani
components/           # UI bilesenleri
hooks/                # React Query hooks
lib/                  # Supabase client, API, utils, tipler
constants/            # Tema renkleri
supabase/
  migrations/         # Veritabani sema
  seed.sql            # Baslangic verisi (50+ firma)
  functions/          # Edge Functions (scraping)
scripts/              # Scraper ve yardimci scriptler
```

## Build ve Dagitim

### Development Build

```bash
npx eas build --profile development --platform all
```

### Production Build

```bash
npx eas build --profile production --platform all
```

### Magaza Gonderimi

```bash
npx eas submit --platform ios
npx eas submit --platform android
```

## Admin Dashboard

Web tabanli admin paneli `admin-web/` altindadir.

```bash
cp admin-web/.env.example admin-web/.env.local
npm run admin:dev
```

Build kontrolu icin:

```bash
npm run admin:typecheck
npm run admin:build
```

## Veri Guncelleme

Firma iletisim bilgileri `supabase/seed.sql` dosyasinda tanimlidir.
Yeni firma eklemek icin SQL dosyasina INSERT satiri ekleyip
Supabase SQL Editor'den calistirin.

Otomatik guncelleme icin:
- `scripts/scraper.ts` - Node.js scraper (gelistirme asamasinda)
- `.github/workflows/scraper.yml` - GitHub Actions cron

## Lisans

Ozel proje - Tum haklari saklidir.
