import { useQuery } from "@tanstack/react-query";
import { fetchCompanyBySlug, fetchCompaniesByCategory, fetchPopularCompanies } from "@/lib/api";

export function useCompany(slug: string) {
  return useQuery({
    queryKey: ["company", slug],
    queryFn: () => fetchCompanyBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 15, // 15 dakika cache
  });
}

export function useCompaniesByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["companies", "category", categoryId],
    queryFn: () => fetchCompaniesByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 15,
  });
}

export function usePopularCompanies() {
  return useQuery({
    queryKey: ["companies", "popular"],
    queryFn: fetchPopularCompanies,
    staleTime: 1000 * 60 * 30,
  });
}
