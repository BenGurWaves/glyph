import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
