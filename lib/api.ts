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

function shouldFallbackToBaseTables(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const errorRecord = error as {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  };

  const combinedMessage = [
    errorRecord.code,
    errorRecord.message,
    errorRecord.details,
    errorRecord.hint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    errorRecord.code === "PGRST205" ||
    combinedMessage.includes("published_companies_public") ||
    combinedMessage.includes("published_contact_channels_public") ||
    combinedMessage.includes("relation") && combinedMessage.includes("does not exist")
  );
}

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

function createVirtualFastestChannel(
  companyId: string,
  channelType: ContactChannel["channel_type"],
  updatedAt: string
): ContactChannel {
  return {
    id: `virtual-fastest-${companyId}`,
    company_id: companyId,
    channel_type: channelType,
    value: "",
    label: "",
    is_fastest: true,
    working_hours: null,
    official_source_url: null,
    sort_order: 0,
    updated_at: updatedAt,
  };
}

async function fetchChannelRows(companyIds: string[]): Promise<ContactChannel[]> {
  if (companyIds.length === 0) return [];

  const publishedQuery = await supabase
    .from("published_contact_channels_public")
    .select("*")
    .in("company_id", companyIds)
    .order("sort_order", { ascending: true });

  if (!publishedQuery.error) {
    return (publishedQuery.data || []) as ContactChannel[];
  }

  if (!shouldFallbackToBaseTables(publishedQuery.error)) {
    throw publishedQuery.error;
  }

  const fallbackQuery = await supabase
    .from("contact_channels")
    .select("*")
    .in("company_id", companyIds)
    .order("sort_order", { ascending: true });

  if (fallbackQuery.error) throw fallbackQuery.error;
  return (fallbackQuery.data || []) as ContactChannel[];
}

async function attachCompanyRelations(companies: Company[]): Promise<Company[]> {
  if (companies.length === 0) return companies;

  const ids = companies.map((company) => company.id);
  const [categories, channels] = await Promise.all([
    fetchCategories(),
    fetchChannelRows(ids),
  ]);

  const categoryMap = categories.reduce<Record<string, Category>>((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  const channelMap = channels.reduce<Record<string, ContactChannel[]>>((acc, channel) => {
    if (!acc[channel.company_id]) acc[channel.company_id] = [];
    acc[channel.company_id].push(channel);
    return acc;
  }, {});

  return companies.map((company) => {
    const resolvedChannels = channelMap[company.id] || company.contact_channels || [];
    const fastestChannelType =
      resolvedChannels.find((channel) => channel.is_fastest)?.channel_type ||
      company.contact_channels?.find((channel) => channel.is_fastest)?.channel_type ||
      null;

    return {
      ...company,
      category: company.category || categoryMap[company.category_id],
      contact_channels:
        resolvedChannels.length > 0
          ? resolvedChannels
          : fastestChannelType
            ? [createVirtualFastestChannel(company.id, fastestChannelType, company.updated_at)]
            : [],
    };
  });
}

async function fetchCompanyRowsWithFallback(
  publishedQuery: () => any,
  fallbackQuery: () => any
): Promise<PublishedCompanyRow[]> {
  const publishedResult = await publishedQuery();
  if (!publishedResult.error) {
    return (publishedResult.data || []) as PublishedCompanyRow[];
  }

  if (!shouldFallbackToBaseTables(publishedResult.error)) {
    throw publishedResult.error;
  }

  const fallbackResult = await fallbackQuery();
  if (fallbackResult.error) throw fallbackResult.error;
  return (fallbackResult.data || []) as PublishedCompanyRow[];
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
  const rows = await fetchCompanyRowsWithFallback(
    () =>
      supabase
        .from("published_companies_public")
        .select("*")
        .eq("category_id", categoryId)
        .order("name", { ascending: true }),
    () =>
      supabase
        .from("companies")
        .select("*")
        .eq("category_id", categoryId)
        .order("name", { ascending: true })
  );

  const companies = rows.map(mapPublishedCompany);
  return attachCompanyRelations(companies);
}

/**
 * Firma detayini slug ile getir
 */
export async function fetchCompanyBySlug(slug: string): Promise<CompanyWithChannels | null> {
  let data: PublishedCompanyRow | null = null;
  let error: { code?: string } | null = null;

  const publishedResult = await supabase
    .from("published_companies_public")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!publishedResult.error) {
    data = publishedResult.data as PublishedCompanyRow;
  } else if (shouldFallbackToBaseTables(publishedResult.error)) {
    const fallbackResult = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .single();

    data = (fallbackResult.data as PublishedCompanyRow | null) || null;
    error = fallbackResult.error;
  } else {
    error = publishedResult.error;
  }

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  const company = mapPublishedCompany(data as PublishedCompanyRow);
  const [hydrated] = await attachCompanyRelations([company]);
  return hydrated as CompanyWithChannels;
}

/**
 * Firma ara (Turkce destekli)
 */
export async function searchCompanies(query: string): Promise<Company[]> {
  const searchTerm = query.trim();
  if (!searchTerm) return [];
  const normalizedQuery = normalizeText(searchTerm);

  const rows = await fetchCompanyRowsWithFallback(
    () =>
      supabase
        .from("published_companies_public")
        .select("*")
        .ilike("name", `%${searchTerm}%`)
        .limit(40),
    () =>
      supabase
        .from("companies")
        .select("*")
        .ilike("name", `%${searchTerm}%`)
        .limit(40)
  );

  const companies = rows.map(mapPublishedCompany);
  const hydratedCompanies = await attachCompanyRelations(companies);

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

/**
 * Hafif arama indeksi getir
 */
export async function fetchSearchIndex(): Promise<SearchCompanyIndex[]> {
  const rows = await fetchCompanyRowsWithFallback(
    () =>
      supabase
        .from("published_companies_public")
        .select(`
          id,
          name,
          slug,
          category_id,
          category_name,
          logo_url,
          has_cargo_tracking,
          updated_at,
          created_at,
          fastest_channel_type
        `)
        .order("updated_at", { ascending: false }),
    () =>
      supabase
        .from("companies")
        .select(`
          id,
          name,
          slug,
          category_id,
          logo_url,
          has_cargo_tracking,
          updated_at,
          created_at
        `)
        .order("updated_at", { ascending: false })
  );

  const hydratedCompanies = await attachCompanyRelations(rows.map(mapPublishedCompany));

  return hydratedCompanies.map((company) => {
    const fastestChannelType =
      company.contact_channels?.find((channel) => channel.is_fastest)?.channel_type || null;

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logo_url: company.logo_url,
      updated_at: company.updated_at,
      has_cargo_tracking: company.has_cargo_tracking,
      category: company.category ? { name: company.category.name } : null,
      fastest_channel_type: fastestChannelType,
    };
  });
}

/**
 * Populer / one cikan firmalari getir
 */
export async function fetchPopularCompanies(): Promise<Company[]> {
  const rows = await fetchCompanyRowsWithFallback(
    () =>
      supabase
        .from("published_companies_public")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(12),
    () =>
      supabase
        .from("companies")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(12)
  );

  const companies = rows.map(mapPublishedCompany);
  return attachCompanyRelations(companies);
}

/**
 * Bir firmanin iletisim kanallarini getir
 */
export async function fetchContactChannels(companyId: string): Promise<ContactChannel[]> {
  const publishedResult = await supabase
    .from("published_contact_channels_public")
    .select("*")
    .eq("company_id", companyId)
    .order("sort_order", { ascending: true });

  if (!publishedResult.error) {
    return (publishedResult.data || []) as ContactChannel[];
  }

  if (!shouldFallbackToBaseTables(publishedResult.error)) {
    throw publishedResult.error;
  }

  const fallbackResult = await supabase
    .from("contact_channels")
    .select("*")
    .eq("company_id", companyId)
    .order("sort_order", { ascending: true });

  if (fallbackResult.error) throw fallbackResult.error;
  return (fallbackResult.data || []) as ContactChannel[];
}
