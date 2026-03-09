import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { searchCompanies } from "@/lib/api";
import { normalizeText } from "@/lib/utils";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debounceTimeout = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setDebouncedQuery(value);
        }, 300);
      };
    })(),
    []
  );

  const updateQuery = useCallback(
    (value: string) => {
      setQuery(value);
      debounceTimeout(value);
    },
    [debounceTimeout]
  );

  const results = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchCompanies(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
  }, []);

  return {
    query,
    updateQuery,
    clearSearch,
    normalizedQuery: normalizeText(query),
    results: results.data || [],
    isSearching: results.isLoading,
    error: results.error,
    isActive: query.length >= 2,
  };
}
