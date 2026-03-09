// ==========================================
// CabukUlas - TypeScript Tip Tanimlari
// ==========================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  status?: ContentStatus;
  archived_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ContentStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "published"
  | "rejected"
  | "archived"
  | "needs_verification";

export type VerificationStatus = "verified" | "unverified" | "needs_verification";

export type ChannelType =
  | "phone"
  | "live_chat"
  | "email"
  | "twitter"
  | "whatsapp"
  | "instagram"
  | "app"
  | "sikayetvar";

export interface WorkingHours {
  weekdays?: string;
  weekend?: string;
  note?: string;
}

export interface ContactChannel {
  id: string;
  company_id: string;
  channel_type: ChannelType;
  value: string;
  label: string;
  is_fastest: boolean;
  working_hours: WorkingHours | null;
  official_source_url: string | null;
  sort_order: number;
  updated_at: string;
  status?: ContentStatus;
  verification_status?: VerificationStatus;
  verified_at?: string | null;
  response_speed_label?: string | null;
  source_confidence?: number | null;
  last_checked_at?: string | null;
  archived_at?: string | null;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;
  has_cargo_tracking: boolean;
  cargo_tracking_url: string | null;
  created_at: string;
  updated_at: string;
  status?: ContentStatus;
  verification_status?: VerificationStatus;
  verified_at?: string | null;
  is_featured?: boolean;
  is_sponsored?: boolean;
  search_boost?: number;
  data_freshness_score?: number | null;
  last_reviewed_at?: string | null;
  last_publication_at?: string | null;
  archived_at?: string | null;
  // Joined fields
  category?: Category;
  contact_channels?: ContactChannel[];
}

export interface CompanyWithChannels extends Company {
  contact_channels: ContactChannel[];
}

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  category_name: string;
  fastest_channel_type: ChannelType | null;
}

export interface SearchCompanyIndex {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  updated_at: string;
  has_cargo_tracking: boolean;
  fastest_channel_type: ChannelType | null;
  category?: {
    name: string;
  } | null;
}

export interface CompanyBookmark {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  category_name?: string;
  has_cargo_tracking?: boolean;
  fastest_channel_type?: ChannelType | null;
  last_viewed_at?: string;
}

export interface SearchHistoryItem {
  query: string;
  created_at: string;
}

export interface ProductEventPayload {
  event_name:
    | "session_started"
    | "session_ended"
    | "screen_view"
    | "search_started"
    | "search_submitted"
    | "search_no_result"
    | "search_result_clicked"
    | "category_opened"
    | "company_opened"
    | "contact_channel_clicked"
    | "cargo_tracking_clicked"
    | "external_link_opened"
    | "favorite_added"
    | "favorite_removed";
  source_screen?: string;
  target_screen?: string;
  company_id?: string | null;
  category_id?: string | null;
  contact_channel_id?: string | null;
  channel_type?: string | null;
  query_text?: string;
  duration_seconds?: number;
  metadata?: Record<string, unknown>;
}
