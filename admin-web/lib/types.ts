export type AdminRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "reviewer"
  | "analyst"
  | "support";

export type ContentStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "rejected"
  | "archived"
  | "needs_verification";

export type VerificationStatus =
  | "verified"
  | "unverified"
  | "needs_review"
  | "needs_verification";

export interface AdminProfile {
  user_id: string;
  role: AdminRole;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  status?: ContentStatus;
  archived_at?: string | null;
  updated_at?: string | null;
}

export interface CompanyRow {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  has_cargo_tracking: boolean | null;
  cargo_tracking_url: string | null;
  status: ContentStatus;
  verification_status: VerificationStatus | null;
  verified_at: string | null;
  last_reviewed_at: string | null;
  data_freshness_score: number | null;
  is_featured: boolean;
  is_sponsored: boolean;
  search_boost: number;
  archived_at: string | null;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface ContactChannelRow {
  id: string;
  company_id: string;
  channel_type: string;
  value: string;
  label: string | null;
  is_fastest: boolean;
  working_hours: Record<string, string> | null;
  official_source_url: string | null;
  sort_order: number;
  status: ContentStatus;
  verification_status: VerificationStatus | null;
  verified_at: string | null;
  response_speed_label: string | null;
  source_confidence: number | null;
  last_checked_at: string | null;
  archived_at: string | null;
  updated_at: string;
  company?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface FeaturedPlacementRow {
  id: number;
  company_id: string;
  placement_key: string;
  priority: number;
  is_sponsored: boolean;
  starts_at: string | null;
  ends_at: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  company?: {
    id: string;
    name: string;
  } | null;
}

export interface ContentReportRow {
  id: number;
  company_id: string | null;
  contact_channel_id: string | null;
  report_type: string;
  message: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  company?: {
    id: string;
    name: string;
  } | null;
}

export interface AuditLogRow {
  id: number;
  entity_type: string;
  entity_id: string;
  action: string;
  reason: string | null;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  changed_by: string | null;
  created_at: string;
}

export interface ProductDailyMetricRow {
  metric_date: string;
  unique_users: number;
  sessions: number;
  average_session_seconds: number;
  screen_views: number;
  company_opens: number;
  channel_taps: number;
  no_result_searches: number;
}

export interface ProductTopCompanyRow {
  company_id: string;
  company_name: string;
  opens: number;
  channel_taps: number;
}

export interface ProductTopChannelRow {
  channel_type: string;
  taps: number;
}

export interface SearchInsightRow {
  query_text: string;
  no_result_count: number;
}

export interface CsvImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export interface OverviewMetrics {
  pendingReview: number;
  needsVerification: number;
  brokenSources: number;
  staleRecords: number;
  openReports: number;
  companies: number;
  channels: number;
  placements: number;
}
