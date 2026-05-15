import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!url || !key) {
      console.warn("NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set.");
    }
    _client = createClient(url || "http://placeholder", key || "placeholder");
  }
  return _client;
}

// Lazy proxy — client is only created when actually used, not during static generation
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    const value = (getClient() as any)[prop];
    if (typeof value === "function") {
      return value.bind(getClient());
    }
    return value;
  },
}) as SupabaseClient;

export type QRCode = {
  id: string;
  user_id: string | null;
  short_code: string;
  destination_url: string;
  title: string | null;
  qr_type: "static" | "dynamic";
  style_config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Scan = {
  id: string;
  qr_code_id: string;
  scanned_at: string;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
};
