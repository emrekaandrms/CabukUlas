import { supabase } from "./supabase";
import {
  Category,
  Company,
  CompanyWithChannels,
  ContactChannel,
  SearchCompanyIndex,
} from "./types";
import { normalizeText } from "./utils";

type PublishedCompanyRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category_name?: string | null;
  category_icon?: string | null;
  category_sort_order?: number | null;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  has_cargo_tracking: boolean;
  cargo_tracking_url: string | null;
  created_at: string;
  updated_at: string;
  status?: Company["status"];
  verification_status?: Company["verification_status"];
  verified_at?: string | null;
  data_freshness_score?: number | null;
  is_featured?: boolean;
  is_sponsored?: boolean;
  search_boost?: number;
  last_reviewed_at?: string | null;
  last_publication_at?: string | null;
  archived_at?: string | null;
  fastest_channel_type?: ContactChannel["channel_type"] | null;
};

function mapPublishedCompany(row: PublishedCompanyRow): Company {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category_id: row.category_id || "",
    logo_url: row.logo_url,
    description: row.description,
    website_url: row.website_url,
    has_cargo_tracking: row.has_cargo_tracking,
    cargo_tracking_url: row.cargo_tracking_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
    status: row.status,
    verification_status: row.verification_status,
    verified_at: row.verified_at,
    data_freshness_score: row.data_freshness_score,
    is_featured: row.is_featured,
    is_sponsored: row.is_sponsored,
    search_boost: row.search_boost,
    last_reviewed_at: row.last_reviewed_at,
    last_publication_at: row.last_publication_at,
    archived_at: row.archived_at,
    category:
      row.category_id && row.category_name
        ? {
            id: row.category_id,
            name: row.category_name,
            icon: row.category_icon || "",
            sort_order: row.category_sort_order || 0,
          }
        : undefined,
    contact_channels: row.fastest_channel_type
      ? [
          {
            id: `virtual-fastest-${row.id}`,
            company_id: row.id,
            channel_type: row.fastest_channel_type,
            value: "",
            label: "",
            is_fastest: true,
            working_hours: null,
            official_source_url: null,
            sort_order: 0,
            updated_at: row.updated_at,
          },
        ]
      : [],
  };
}

async function attachPublishedChannels(companies: Company[]): Promise<Company[]> {
  if (companies.length === 0) return companies;

  const ids = companies.map((company) => company.id);
  const { data, error } = await supabase
    .from("published_contact_channels_public")
    .select("*")
    .in("company_id", ids)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const channelMap = (data || []).reduce<Record<string, ContactChannel[]>>((acc, row) => {
    const channel = row as ContactChannel;
    if (!acc[channel.company_id]) acc[channel.company_id] = [];
    acc[channel.company_id].push(channel);
    return acc;
  }, {});

  return companies.map((company) => ({
    ...company,
    contact_channels: channelMap[company.id] || company.contact_channels || [],
  }));
}

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
    .from("published_companies_public")
    .select("*")
    .eq("category_id", categoryId)
    .order("name", { ascending: true });

  if (error) throw error;

  const companies = ((data || []) as PublishedCompanyRow[]).map(mapPublishedCompany);
  return attachPublishedChannels(companies);
}

/**
 * Firma detayini slug ile getir
 */
export async function fetchCompanyBySlug(slug: string): Promise<CompanyWithChannels | null> {
  const { data, error } = await supabase
    .from("published_companies_public")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  const company = mapPublishedCompany(data as PublishedCompanyRow);
  const [hydrated] = await attachPublishedChannels([company]);
  return hydrated as CompanyWithChannels;
}

/**
 * Firma ara (Turkce destekli)
 */
export async function searchCompanies(query: string): Promise<Company[]> {
  const searchTerm = query.trim();
  if (!searchTerm) return [];
  const normalizedQuery = normalizeText(searchTerm);

  const { data, error } = await supabase
    .from("published_companies_public")
    .select("*")
    .ilike("name", `%${searchTerm}%`)
    .limit(40);

  if (error) throw error;

  const companies = ((data || []) as PublishedCompanyRow[]).map(mapPublishedCompany);
  const hydratedCompanies = await attachPublishedChannels(companies);

  return hydratedCompanies.sort((a, b) => {
    const aName = normalizeText(a.name);
    const bName = normalizeText(b.name);

    const aExact = aName === normalizedQuery ? 1 : 0;
    const bExact = bName === normalizedQuery ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    const aPrefix = aName.startsWith(normalizedQuery) ? 1 : 0;
    const bPrefix = bName.startsWith(normalizedQuery) ? 1 : 0;
    if (aPrefix !== bPrefix) return bPrefix - aPrefix;

    const aFastest = a.contact_channels?.some((channel: ContactChannel) => channel.is_fastest)
      ? 1
      : 0;
    const bFastest = b.contact_channels?.some((channel: ContactChannel) => channel.is_fastest)
      ? 1
      : 0;
    if (aFastest !== bFastest) return bFastest - aFastest;

    return a.name.localeCompare(b.name, "tr");
  });
}

type SearchIndexRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  updated_at: string;
  has_cargo_tracking: boolean;
  category_name?: string | null;
  fastest_channel_type?: ContactChannel["channel_type"] | null;
};

/**
 * Hafif arama indeksi getir
 */
export async function fetchSearchIndex(): Promise<SearchCompanyIndex[]> {
  const { data, error } = await supabase
    .from("published_companies_public")
    .select(`
      id,
      name,
      slug,
      logo_url,
      updated_at,
      has_cargo_tracking,
      category_name,
      fastest_channel_type
    `)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return ((data || []) as SearchIndexRow[]).map((company) => {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logo_url: company.logo_url,
      updated_at: company.updated_at,
      has_cargo_tracking: company.has_cargo_tracking,
      category: company.category_name ? { name: company.category_name } : null,
      fastest_channel_type: company.fastest_channel_type || null,
    };
  });
}

/**
 * Populer / one cikan firmalari getir
 */
export async function fetchPopularCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from("published_companies_public")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(12);

  if (error) throw error;

  const companies = ((data || []) as PublishedCompanyRow[]).map(mapPublishedCompany);
  return attachPublishedChannels(companies);
}

/**
 * Bir firmanin iletisim kanallarini getir
 */
export async function fetchContactChannels(companyId: string): Promise<ContactChannel[]> {
  const { data, error } = await supabase
    .from("published_contact_channels_public")
    .select("*")
    .eq("company_id", companyId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}
