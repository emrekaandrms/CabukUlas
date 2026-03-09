import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useDeferredValue, useMemo, useEffect, useRef } from "react";
import { fetchSearchIndex } from "@/lib/api";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { SearchCompanyIndex } from "@/lib/types";
import { normalizeText } from "@/lib/utils";

interface UseSearchOptions {
  maxResults?: number;
  sourceScreen?: string;
}

type PreparedSearchCompany = SearchCompanyIndex & {
  normalizedName: string;
  normalizedCategory: string;
  searchableText: string;
};

function getSearchScore(company: PreparedSearchCompany, normalizedQuery: string): number {
  if (!normalizedQuery) return 0;

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const { normalizedName, normalizedCategory, searchableText } = company;

  let score = 0;

  if (normalizedName === normalizedQuery) score += 1600;
  if (normalizedName.startsWith(normalizedQuery)) score += 900;
  if (normalizedName.includes(` ${normalizedQuery}`)) score += 650;
  if (normalizedName.includes(normalizedQuery)) score += 450;

  if (normalizedCategory === normalizedQuery) score += 260;
  if (normalizedCategory.startsWith(normalizedQuery)) score += 180;
  if (normalizedCategory.includes(normalizedQuery)) score += 120;

  const allTokensMatch = tokens.every((token) => searchableText.includes(token));
  if (!allTokensMatch) {
    return score;
  }

  score += tokens.length * 140;
  score += company.fastest_channel_type ? 35 : 0;
  score += company.has_cargo_tracking ? 12 : 0;
  score -= Math.min(normalizedName.length, 48);

  return score;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { maxResults = 20, sourceScreen } = options;
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery.trim());
  const previousNormalizedQuery = useRef("");
  const noResultTrackedFor = useRef("");

  const updateQuery = useCallback(
    (value: string) => {
      setQuery(value);
    },
    []
  );

  const searchIndex = useQuery({
    queryKey: ["companies", "search-index"],
    queryFn: fetchSearchIndex,
    staleTime: 1000 * 60 * 30,
  });

  const preparedIndex = useMemo<PreparedSearchCompany[]>(
    () =>
      (searchIndex.data || []).map((company) => {
        const normalizedName = normalizeText(company.name);
        const normalizedCategory = normalizeText(company.category?.name || "");

        return {
          ...company,
          normalizedName,
          normalizedCategory,
          searchableText: `${normalizedName} ${normalizedCategory}`.trim(),
        };
      }),
    [searchIndex.data]
  );

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return preparedIndex
      .map((company) => ({
        company,
        score: getSearchScore(company, normalizedQuery),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.company.name.localeCompare(b.company.name, "tr");
      })
      .slice(0, maxResults)
      .map(({ company }) => ({
        id: company.id,
        name: company.name,
        slug: company.slug,
        logo_url: company.logo_url,
        updated_at: company.updated_at,
        has_cargo_tracking: company.has_cargo_tracking,
        fastest_channel_type: company.fastest_channel_type,
        category: company.category,
      }));
  }, [maxResults, normalizedQuery, preparedIndex]);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  useEffect(() => {
    if (normalizedQuery && !previousNormalizedQuery.current) {
      void trackAnalyticsEvent({
        event_name: "search_started",
        source_screen: sourceScreen,
        query_text: query,
      });
    }

    previousNormalizedQuery.current = normalizedQuery;
  }, [normalizedQuery, query, sourceScreen]);

  useEffect(() => {
    if (!normalizedQuery) {
      noResultTrackedFor.current = "";
      return;
    }

    if (
      !searchIndex.isLoading &&
      !searchIndex.error &&
      results.length === 0 &&
      noResultTrackedFor.current !== normalizedQuery
    ) {
      void trackAnalyticsEvent({
        event_name: "search_no_result",
        source_screen: sourceScreen,
        query_text: query,
      });
      noResultTrackedFor.current = normalizedQuery;
    }
  }, [normalizedQuery, query, results.length, searchIndex.error, searchIndex.isLoading, sourceScreen]);

  return {
    query,
    updateQuery,
    clearSearch,
    normalizedQuery,
    results,
    isSearching: searchIndex.isLoading && normalizedQuery.length > 0,
    isIndexReady: Boolean(searchIndex.data),
    indexCount: searchIndex.data?.length || 0,
    error: searchIndex.error,
    isActive: normalizedQuery.length > 0,
  };
}
