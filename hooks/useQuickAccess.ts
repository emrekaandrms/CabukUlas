import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { Company, CompanyBookmark, SearchHistoryItem } from "@/lib/types";

const FAVORITES_KEY = "cabukulas:favorites";
const RECENTS_KEY = "cabukulas:recents";
const SEARCH_HISTORY_KEY = "cabukulas:search-history";
const MAX_RECENTS = 12;
const MAX_SEARCHES = 8;

async function readList<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeList<T>(key: string, value: T[]) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

function toBookmark(company: Company): CompanyBookmark {
  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    logo_url: company.logo_url,
    category_name: company.category?.name,
    has_cargo_tracking: company.has_cargo_tracking,
    fastest_channel_type:
      company.contact_channels?.find((channel) => channel.is_fastest)?.channel_type ||
      null,
    last_viewed_at: new Date().toISOString(),
  };
}

export function useQuickAccess() {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["quick-access", "favorites"],
    queryFn: () => readList<CompanyBookmark>(FAVORITES_KEY),
    staleTime: Infinity,
  });

  const recentsQuery = useQuery({
    queryKey: ["quick-access", "recents"],
    queryFn: () => readList<CompanyBookmark>(RECENTS_KEY),
    staleTime: Infinity,
  });

  const favoriteMutation = useMutation({
    mutationFn: async (company: Company) => {
      const current = await readList<CompanyBookmark>(FAVORITES_KEY);
      const exists = current.some((item) => item.id === company.id);

      const next = exists
        ? current.filter((item) => item.id !== company.id)
        : [toBookmark(company), ...current].slice(0, MAX_RECENTS);

      await writeList(FAVORITES_KEY, next);
      void trackAnalyticsEvent({
        event_name: exists ? "favorite_removed" : "favorite_added",
        source_screen: `/company/${company.slug}`,
        company_id: company.id,
      });
      return next;
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["quick-access", "favorites"], next);
    },
  });

  const recentMutation = useMutation({
    mutationFn: async (company: Company) => {
      const current = await readList<CompanyBookmark>(RECENTS_KEY);
      const bookmark = toBookmark(company);
      const next = [
        bookmark,
        ...current.filter((item) => item.id !== company.id),
      ].slice(0, MAX_RECENTS);

      await writeList(RECENTS_KEY, next);
      return next;
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["quick-access", "recents"], next);
    },
  });

  const toggleFavorite = useCallback(
    (company: Company) => favoriteMutation.mutate(company),
    [favoriteMutation]
  );

  const addRecent = useCallback(
    (company: Company) => recentMutation.mutate(company),
    [recentMutation]
  );

  return {
    favorites: favoritesQuery.data || [],
    recents: recentsQuery.data || [],
    isFavorite: (companyId: string) =>
      (favoritesQuery.data || []).some((item) => item.id === companyId),
    toggleFavorite,
    addRecent,
    isLoading: favoritesQuery.isLoading || recentsQuery.isLoading,
  };
}

export function useSearchHistory() {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["quick-access", "search-history"],
    queryFn: () => readList<SearchHistoryItem>(SEARCH_HISTORY_KEY),
    staleTime: Infinity,
  });

  const saveSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      const normalized = query.trim();
      if (!normalized) return readList<SearchHistoryItem>(SEARCH_HISTORY_KEY);

      const current = await readList<SearchHistoryItem>(SEARCH_HISTORY_KEY);
      const next = [
        { query: normalized, created_at: new Date().toISOString() },
        ...current.filter(
          (item) => item.query.toLocaleLowerCase("tr") !== normalized.toLocaleLowerCase("tr")
        ),
      ].slice(0, MAX_SEARCHES);

      await writeList(SEARCH_HISTORY_KEY, next);
      return next;
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["quick-access", "search-history"], next);
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await writeList<SearchHistoryItem>(SEARCH_HISTORY_KEY, []);
      return [];
    },
    onSuccess: (next) => {
      queryClient.setQueryData(["quick-access", "search-history"], next);
    },
  });

  const saveSearch = useCallback(
    (query: string) => saveSearchMutation.mutate(query),
    [saveSearchMutation]
  );

  const clearHistory = useCallback(
    () => clearHistoryMutation.mutate(),
    [clearHistoryMutation]
  );

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    saveSearch,
    clearHistory,
  };
}
