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

## Veri Guncelleme

Firma iletisim bilgileri `supabase/seed.sql` dosyasinda tanimlidir.
Yeni firma eklemek icin SQL dosyasina INSERT satiri ekleyip
Supabase SQL Editor'den calistirin.

Otomatik guncelleme icin:
- `scripts/scraper.ts` - Node.js scraper (gelistirme asamasinda)
- `.github/workflows/scraper.yml` - GitHub Actions cron

## Lisans

Ozel proje - Tum haklari saklidir.
