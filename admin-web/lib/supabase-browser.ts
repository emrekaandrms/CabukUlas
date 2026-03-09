"use client";

import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const isServer = typeof window === "undefined";
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (isServer ? "https://placeholder.supabase.co" : undefined);
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isServer ? "placeholder-anon-key" : undefined);

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Admin web env eksik. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanimlanmali."
    );
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
