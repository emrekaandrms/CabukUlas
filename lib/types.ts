// ==========================================
// CabukUlas - TypeScript Tip Tanimlari
// ==========================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

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
  verification_status?: "verified" | "unverified" | "needs_review";
  verified_at?: string | null;
  response_speed_label?: string | null;
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
  verification_status?: "verified" | "unverified" | "needs_review";
  verified_at?: string | null;
  is_featured?: boolean;
  is_sponsored?: boolean;
  search_boost?: number;
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
