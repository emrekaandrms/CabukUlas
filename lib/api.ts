import { supabase } from "./supabase";
import { Category, Company, CompanyWithChannels, ContactChannel } from "./types";

/**
 * Tum kategorileri getir
 */
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Kategoriye gore firmalari getir
 */
export async function fetchCompaniesByCategory(categoryId: string): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      category:categories(*),
      contact_channels(*)
    `)
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Firma detayini slug ile getir
 */
export async function fetchCompanyBySlug(slug: string): Promise<CompanyWithChannels | null> {
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      category:categories(*),
      contact_channels(*)
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

/**
 * Firma ara (Turkce destekli)
 */
export async function searchCompanies(query: string): Promise<Company[]> {
  const searchTerm = query.trim();
  if (!searchTerm) return [];

  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      category:categories(*),
      contact_channels(*)
    `)
    .ilike("name", `%${searchTerm}%`)
    .order("name", { ascending: true })
    .limit(20);

  if (error) throw error;
  return data || [];
}

/**
 * Populer / one cikan firmalari getir
 */
export async function fetchPopularCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("companies")
    .select(`
      *,
      category:categories(*),
      contact_channels(*)
    `)
    .order("name", { ascending: true })
    .limit(10);

  if (error) throw error;
  return data || [];
}

/**
 * Bir firmanin iletisim kanallarini getir
 */
export async function fetchContactChannels(companyId: string): Promise<ContactChannel[]> {
  const { data, error } = await supabase
    .from("contact_channels")
    .select("*")
    .eq("company_id", companyId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}
