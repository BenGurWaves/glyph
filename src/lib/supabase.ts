import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Supabase client unavailable.");
}

// Use https://localhost as safe fallback to avoid mixed-content errors in production.
// In production these env vars MUST be set during build for the client to work.
export const supabase = createClient(
  supabaseUrl || "https://localhost",
  supabaseAnonKey || "missing"
);

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
