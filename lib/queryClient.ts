import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query istemcisi - Agresif cache stratejisi
 * 
 * Strateji:
 * - Kategoriler: 30 dk cache (nadiren degisir)
 * - Firma listesi: 15 dk cache
 * - Firma detay: 15 dk cache
 * - Arama sonuclari: 5 dk cache
 * - gcTime (garbage collection): 30 dk (cache'den silme suresi)
 * - retry: 2 kez (network hatalarinda)
 * 
 * Bu yaklasim sayesinde kullanici bir kez firma bilgisini
 * yukledikten sonra, ayni firma icin tekrar API cagrisi
 * yapilmadan cache'den aninda gosterilir.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,  // 5 dakika - veri "taze" kabul edilir
      gcTime: 1000 * 60 * 30,     // 30 dakika - cache'de tutulur
      refetchOnWindowFocus: false, // Mobilde gereksiz
      refetchOnReconnect: true,    // Internet geldiginde yenile
    },
  },
});
