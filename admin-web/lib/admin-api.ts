"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type {
  AdminProfile,
  AuditLogRow,
  CategoryRow,
  CsvImportResult,
  CompanyRow,
  ContactChannelRow,
  ContentReportRow,
  FeaturedPlacementRow,
  OverviewMetrics,
  ProductDailyMetricRow,
  ProductTopChannelRow,
  ProductTopCompanyRow,
  SearchInsightRow,
} from "@/lib/types";

function getClient() {
  return getSupabaseBrowserClient();
}

function normalizeCsvValue(value: unknown) {
  return String(value ?? "").trim();
}

function parseCsvBoolean(value: unknown, fallback = false) {
  const normalized = normalizeCsvValue(value).toLocaleLowerCase("tr");
  if (!normalized) return fallback;
  return ["1", "true", "yes", "evet", "y", "var"].includes(normalized);
}

function parseCsvNumber(value: unknown, fallback = 0) {
  const normalized = normalizeCsvValue(value);
  if (!normalized) return fallback;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeVerificationStatus(value: unknown) {
  const normalized = normalizeCsvValue(value);
  if (!normalized || normalized === "needs_review") {
    return "needs_verification";
  }

  if (["verified", "unverified", "needs_verification"].includes(normalized)) {
    return normalized;
  }

  return "needs_verification";
}

function normalizeContentStatus(value: unknown, fallback: string) {
  const normalized = normalizeCsvValue(value);
  if (!normalized) return fallback;
  return normalized;
}

type ImportCompanyRef = {
  id: string;
  slug: string;
};

type ImportCategoryRef = {
  id: string;
  name: string;
};

type ImportChannelCompanyRef = {
  id: string;
  name: string;
  slug: string;
};

type ImportChannelRef = {
  id: string;
  company_id: string;
  channel_type: string;
  label: string | null;
  value: string;
};

type ExportCompanyRow = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  description: string | null;
  website_url: string | null;
  has_cargo_tracking: boolean | null;
  cargo_tracking_url: string | null;
  status: string;
  verification_status: string | null;
  is_featured: boolean;
  is_sponsored: boolean;
  search_boost: number;
  category?: {
    name: string;
  } | null;
};

type ExportChannelRow = {
  id: string;
  company_id: string;
  channel_type: string;
  label: string | null;
  value: string;
  is_fastest: boolean;
  official_source_url: string | null;
  sort_order: number;
  status: string;
  verification_status: string | null;
  company?: {
    name: string;
    slug: string;
  } | null;
};

async function getCount(
  table: string,
  filter?: (query: any) => any
) {
  const supabase = getClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });

  if (filter) {
    query = filter(query);
  }

  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

export async function fetchOverviewMetrics(): Promise<OverviewMetrics> {
  const [
    pendingReview,
    needsVerification,
    brokenSources,
    staleRecords,
    openReports,
    companies,
    channels,
    placements,
  ] = await Promise.all([
    getCount("companies", (query) => query.eq("status", "in_review")),
    getCount("companies", (query) => query.eq("verification_status", "needs_verification")),
    getCount("company_sources", (query) => query.lt("confidence_score", 0.5)),
    getCount("companies", (query) =>
      query.lt("data_freshness_score", 50).neq("status", "archived")
    ),
    getCount("content_reports", (query) => query.eq("status", "open")),
    getCount("companies"),
    getCount("contact_channels"),
    getCount("featured_placements", (query) => query.neq("status", "archived")),
  ]);

  return {
    pendingReview,
    needsVerification,
    brokenSources,
    staleRecords,
    openReports,
    companies,
    channels,
    placements,
  };
}

export async function listCompanies() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*, category:categories(id, name)")
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data || []) as CompanyRow[];
}

export async function saveCompany(input: Partial<CompanyRow>) {
  const supabase = getClient();
  const safeSlug = input.slug?.trim();
  const payload = {
    id: input.id || (safeSlug ? `comp-${safeSlug}` : undefined),
    name: input.name,
    slug: safeSlug,
    category_id: input.category_id,
    description: input.description,
    website_url: input.website_url,
    has_cargo_tracking: input.has_cargo_tracking || false,
    cargo_tracking_url: input.cargo_tracking_url,
    status: input.status || "draft",
    verification_status: input.verification_status || "needs_verification",
    is_featured: input.is_featured || false,
    is_sponsored: input.is_sponsored || false,
    search_boost: input.search_boost || 0,
  };

  const { error } = input.id
    ? await supabase.from("companies").update(payload).eq("id", input.id)
    : await supabase.from("companies").insert(payload);

  if (error) throw error;
}

export async function importCompaniesCsv(
  rows: Array<Record<string, unknown>>
): Promise<CsvImportResult> {
  const supabase = getClient();
  const errors: string[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const [{ data: existingCompanies, error: companiesError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase.from("companies").select("id, slug"),
      supabase.from("categories").select("id, name"),
    ]);

  if (companiesError) throw companiesError;
  if (categoriesError) throw categoriesError;

  const typedCompanies = (existingCompanies || []) as ImportCompanyRef[];
  const typedCategories = (categories || []) as ImportCategoryRef[];

  const companyById = new Map(typedCompanies.map((company: ImportCompanyRef) => [company.id, company]));
  const companyBySlug = new Map(
    typedCompanies.map((company: ImportCompanyRef) => [company.slug, company])
  );
  const categoryById = new Map(
    typedCategories.map((category: ImportCategoryRef) => [category.id, category.id])
  );
  const categoryByName = new Map(
    typedCategories.map((category: ImportCategoryRef) => [
      category.name.toLocaleLowerCase("tr"),
      category.id,
    ])
  );

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    const id = normalizeCsvValue(row.id);
    const slug = normalizeCsvValue(row.slug);
    const name = normalizeCsvValue(row.name);

    if (!name && !slug && !id) {
      skipped += 1;
      continue;
    }

    if (!slug && !id) {
      errors.push(`Satır ${rowNumber}: yeni firma oluşturmak için slug gerekli.`);
      continue;
    }

    const existing = (id ? companyById.get(id) : undefined) || (slug ? companyBySlug.get(slug) : undefined);
    const categoryIdRaw = normalizeCsvValue(row.category_id);
    const categoryNameRaw = normalizeCsvValue(row.category_name);
    const resolvedCategoryId =
      (categoryIdRaw && categoryById.get(categoryIdRaw)) ||
      (categoryNameRaw && categoryByName.get(categoryNameRaw.toLocaleLowerCase("tr"))) ||
      null;

    if ((categoryIdRaw || categoryNameRaw) && !resolvedCategoryId) {
      errors.push(`Satır ${rowNumber}: kategori bulunamadı (${categoryIdRaw || categoryNameRaw}).`);
      continue;
    }

    const payload = {
      id: existing?.id || id || (slug ? `comp-${slug}` : undefined),
      name: name || slug || existing?.slug,
      slug: slug || existing?.slug,
      category_id: resolvedCategoryId,
      description: normalizeCsvValue(row.description) || null,
      website_url: normalizeCsvValue(row.website_url) || null,
      has_cargo_tracking: parseCsvBoolean(row.has_cargo_tracking),
      cargo_tracking_url: normalizeCsvValue(row.cargo_tracking_url) || null,
      status: normalizeContentStatus(row.status, "draft"),
      verification_status: normalizeVerificationStatus(row.verification_status),
      is_featured: parseCsvBoolean(row.is_featured),
      is_sponsored: parseCsvBoolean(row.is_sponsored),
      search_boost: parseCsvNumber(row.search_boost),
    };

    const { error } = existing
      ? await supabase.from("companies").update(payload).eq("id", existing.id)
      : await supabase.from("companies").insert(payload);

    if (error) {
      errors.push(`Satır ${rowNumber}: ${error.message}`);
      continue;
    }

    if (existing) {
      updated += 1;
    } else {
      created += 1;
      if (payload.id && payload.slug) {
        const inserted = { id: payload.id, slug: payload.slug };
        companyById.set(inserted.id, inserted);
        companyBySlug.set(inserted.slug, inserted);
      }
    }
  }

  return { created, updated, skipped, errors };
}

export async function exportCompaniesCsvRows() {
  const supabase = getClient();
  const advancedQuery = await supabase
    .from("companies")
    .select("id, slug, name, category_id, description, website_url, has_cargo_tracking, cargo_tracking_url, status, verification_status, is_featured, is_sponsored, search_boost, category:categories(name)")
    .order("name", { ascending: true });

  if (!advancedQuery.error) {
    return ((advancedQuery.data || []) as ExportCompanyRow[]).map((row: ExportCompanyRow) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category_id: row.category_id,
      category_name: row.category?.name || "",
      description: row.description || "",
      website_url: row.website_url || "",
      has_cargo_tracking: row.has_cargo_tracking ? "true" : "false",
      cargo_tracking_url: row.cargo_tracking_url || "",
      status: row.status,
      verification_status: row.verification_status || "",
      is_featured: row.is_featured ? "true" : "false",
      is_sponsored: row.is_sponsored ? "true" : "false",
      search_boost: row.search_boost ?? 0,
    }));
  }

  if (advancedQuery.error.code !== "42703") {
    throw advancedQuery.error;
  }

  const legacyQuery = await supabase
    .from("companies")
    .select("id, slug, name, category_id, description, website_url, has_cargo_tracking, cargo_tracking_url, category:categories(name)")
    .order("name", { ascending: true });

  if (legacyQuery.error) throw legacyQuery.error;

  return ((legacyQuery.data || []) as Partial<ExportCompanyRow>[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    category_id: row.category_id,
    category_name: row.category?.name || "",
    description: row.description || "",
    website_url: row.website_url || "",
    has_cargo_tracking: row.has_cargo_tracking ? "true" : "false",
    cargo_tracking_url: row.cargo_tracking_url || "",
    status: row.status || "",
    verification_status: row.verification_status || "",
    is_featured: row.is_featured ? "true" : "false",
    is_sponsored: row.is_sponsored ? "true" : "false",
    search_boost: row.search_boost ?? 0,
  }));
}

export async function archiveCompany(id: string) {
  const supabase = getClient();
  const { error } = await supabase
    .from("companies")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function listCategories() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as CategoryRow[];
}

export async function saveCategory(input: Partial<CategoryRow>) {
  const supabase = getClient();
  const derivedId =
    input.id ||
    (input.name
      ? `cat-${input.name
          .toLocaleLowerCase("tr")
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-+|-+$/g, "")}`
      : undefined);
  const payload = {
    id: derivedId,
    name: input.name,
    icon: input.icon,
    sort_order: input.sort_order || 0,
    status: input.status || "published",
  };

  const { error } = input.id
    ? await supabase.from("categories").update(payload).eq("id", input.id)
    : await supabase.from("categories").insert(payload);

  if (error) throw error;
}

export async function listChannels() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("contact_channels")
    .select("*, company:companies(id, name, slug)")
    .order("updated_at", { ascending: false })
    .limit(80);

  if (error) throw error;
  return (data || []) as ContactChannelRow[];
}

export async function saveChannel(input: Partial<ContactChannelRow>) {
  const supabase = getClient();
  const payload = {
    company_id: input.company_id,
    channel_type: input.channel_type,
    value: input.value,
    label: input.label,
    is_fastest: input.is_fastest || false,
    official_source_url: input.official_source_url,
    sort_order: input.sort_order || 0,
    status: input.status || "draft",
    verification_status: input.verification_status || "needs_verification",
  };

  const { error } = input.id
    ? await supabase.from("contact_channels").update(payload).eq("id", input.id)
    : await supabase.from("contact_channels").insert(payload);

  if (error) throw error;
}

export async function importChannelsCsv(
  rows: Array<Record<string, unknown>>
): Promise<CsvImportResult> {
  const supabase = getClient();
  const errors: string[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const [{ data: companies, error: companiesError }, { data: channels, error: channelsError }] =
    await Promise.all([
      supabase.from("companies").select("id, name, slug"),
      supabase.from("contact_channels").select("id, company_id, channel_type, label, value"),
    ]);

  if (companiesError) throw companiesError;
  if (channelsError) throw channelsError;

  const typedCompanies = (companies || []) as ImportChannelCompanyRef[];
  const typedChannels = (channels || []) as ImportChannelRef[];

  const companyById = new Map(
    typedCompanies.map((company: ImportChannelCompanyRef) => [company.id, company])
  );
  const companyBySlug = new Map(
    typedCompanies.map((company: ImportChannelCompanyRef) => [company.slug, company])
  );
  const companyByName = new Map(
    typedCompanies.map((company: ImportChannelCompanyRef) => [
      company.name.toLocaleLowerCase("tr"),
      company,
    ])
  );
  const channelById = new Map(typedChannels.map((channel: ImportChannelRef) => [channel.id, channel]));
  const channelByComposite = new Map(
    typedChannels.map((channel: ImportChannelRef) => [
      `${channel.company_id}::${channel.channel_type}::${(channel.label || "").toLocaleLowerCase("tr")}`,
      channel,
    ])
  );
  const channelByFallback = new Map(
    typedChannels.map((channel: ImportChannelRef) => [
      `${channel.company_id}::${channel.channel_type}::${channel.value}`,
      channel,
    ])
  );

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    const id = normalizeCsvValue(row.id);
    const companyIdRaw = normalizeCsvValue(row.company_id);
    const companySlugRaw = normalizeCsvValue(row.company_slug);
    const companyNameRaw = normalizeCsvValue(row.company_name);
    const channelType = normalizeCsvValue(row.channel_type);
    const label = normalizeCsvValue(row.label);
    const value = normalizeCsvValue(row.value);

    if (!companyIdRaw && !companySlugRaw && !companyNameRaw && !channelType && !value) {
      skipped += 1;
      continue;
    }

    const resolvedCompany =
      (companyIdRaw && companyById.get(companyIdRaw)) ||
      (companySlugRaw && companyBySlug.get(companySlugRaw)) ||
      (companyNameRaw && companyByName.get(companyNameRaw.toLocaleLowerCase("tr")));

    if (!resolvedCompany) {
      errors.push(
        `Satır ${rowNumber}: şirket bulunamadı (${companySlugRaw || companyNameRaw || companyIdRaw}).`
      );
      continue;
    }

    if (!channelType || !value) {
      errors.push(`Satır ${rowNumber}: channel_type ve value zorunlu.`);
      continue;
    }

    const existing =
      (id && channelById.get(id)) ||
      channelByComposite.get(
        `${resolvedCompany.id}::${channelType}::${label.toLocaleLowerCase("tr")}`
      ) ||
      channelByFallback.get(`${resolvedCompany.id}::${channelType}::${value}`);

    const payload = {
      company_id: resolvedCompany.id,
      channel_type: channelType,
      value,
      label: label || null,
      is_fastest: parseCsvBoolean(row.is_fastest),
      official_source_url: normalizeCsvValue(row.official_source_url) || null,
      sort_order: parseCsvNumber(row.sort_order),
      status: normalizeContentStatus(row.status, "draft"),
      verification_status: normalizeVerificationStatus(row.verification_status),
    };

    const { error } = existing
      ? await supabase.from("contact_channels").update(payload).eq("id", existing.id)
      : await supabase.from("contact_channels").insert(payload);

    if (error) {
      errors.push(`Satır ${rowNumber}: ${error.message}`);
      continue;
    }

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  return { created, updated, skipped, errors };
}

export async function exportChannelsCsvRows() {
  const supabase = getClient();
  const advancedQuery = await supabase
    .from("contact_channels")
    .select("id, company_id, channel_type, label, value, is_fastest, official_source_url, sort_order, status, verification_status, company:companies(name, slug)")
    .order("company_id", { ascending: true })
    .order("sort_order", { ascending: true });

  if (!advancedQuery.error) {
    return ((advancedQuery.data || []) as ExportChannelRow[]).map((row: ExportChannelRow) => ({
      id: row.id,
      company_id: row.company_id,
      company_slug: row.company?.slug || "",
      company_name: row.company?.name || "",
      channel_type: row.channel_type,
      label: row.label || "",
      value: row.value,
      is_fastest: row.is_fastest ? "true" : "false",
      official_source_url: row.official_source_url || "",
      sort_order: row.sort_order ?? 0,
      status: row.status,
      verification_status: row.verification_status || "",
    }));
  }

  if (advancedQuery.error.code !== "42703") {
    throw advancedQuery.error;
  }

  const legacyQuery = await supabase
    .from("contact_channels")
    .select("id, company_id, channel_type, label, value, is_fastest, official_source_url, sort_order, company:companies(name, slug)")
    .order("company_id", { ascending: true })
    .order("sort_order", { ascending: true });

  if (legacyQuery.error) throw legacyQuery.error;

  return ((legacyQuery.data || []) as Partial<ExportChannelRow>[]).map((row) => ({
    id: row.id,
    company_id: row.company_id,
    company_slug: row.company?.slug || "",
    company_name: row.company?.name || "",
    channel_type: row.channel_type,
    label: row.label || "",
    value: row.value,
    is_fastest: row.is_fastest ? "true" : "false",
    official_source_url: row.official_source_url || "",
    sort_order: row.sort_order ?? 0,
    status: row.status || "",
    verification_status: row.verification_status || "",
  }));
}

export async function archiveChannel(id: string) {
  const supabase = getClient();
  const { error } = await supabase
    .from("contact_channels")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function listReviewCompanies() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*, category:categories(id, name)")
    .in("status", ["draft", "in_review", "approved", "rejected"])
    .order("updated_at", { ascending: false })
    .limit(40);

  if (error) throw error;
  return (data || []) as CompanyRow[];
}

export async function updateCompanyWorkflow(id: string, status: string) {
  const supabase = getClient();
  const { error } = await supabase
    .from("companies")
    .update({
      status,
      last_reviewed_at: new Date().toISOString(),
      last_publication_at: status === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function listPlacements() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("featured_placements")
    .select("*, company:companies(id, name)")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []) as FeaturedPlacementRow[];
}

export async function savePlacement(input: Partial<FeaturedPlacementRow>) {
  const supabase = getClient();
  const payload = {
    company_id: input.company_id,
    placement_key: input.placement_key,
    priority: input.priority || 0,
    is_sponsored: input.is_sponsored || false,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
    status: input.status || "draft",
  };

  const { error } = input.id
    ? await supabase.from("featured_placements").update(payload).eq("id", input.id)
    : await supabase.from("featured_placements").insert(payload);

  if (error) throw error;
}

export async function listReports() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("content_reports")
    .select("*, company:companies(id, name)")
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) throw error;
  return (data || []) as ContentReportRow[];
}

export async function resolveReport(id: number) {
  const supabase = getClient();
  const { error } = await supabase
    .from("content_reports")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function listAuditLogs() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;
  return (data || []) as AuditLogRow[];
}

export async function listAdminProfiles() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as AdminProfile[];
}

export async function saveAdminProfile(input: Partial<AdminProfile>) {
  const supabase = getClient();
  const payload = {
    user_id: input.user_id,
    role: input.role,
    full_name: input.full_name,
    is_active: input.is_active ?? true,
  };

  const { error } = await supabase.from("admin_profiles").upsert(payload);
  if (error) throw error;
}

export async function fetchAnalyticsDaily() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("analytics_product_daily")
    .select("*")
    .order("metric_date", { ascending: true })
    .limit(14);

  if (error) throw error;
  return (data || []) as ProductDailyMetricRow[];
}

export async function fetchTopCompanies() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("analytics_top_companies")
    .select("*")
    .order("opens", { ascending: false })
    .limit(10);

  if (error) throw error;
  return (data || []) as ProductTopCompanyRow[];
}

export async function fetchTopChannels() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("analytics_top_channels")
    .select("*")
    .order("taps", { ascending: false })
    .limit(10);

  if (error) throw error;
  return (data || []) as ProductTopChannelRow[];
}

export async function fetchNoResultSearches() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("analytics_no_result_searches")
    .select("*")
    .order("no_result_count", { ascending: false })
    .limit(10);

  if (error) throw error;
  return (data || []) as SearchInsightRow[];
}
