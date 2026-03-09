"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type {
  AdminProfile,
  AuditLogRow,
  CategoryRow,
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
