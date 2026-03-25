import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateShortCode } from "@/lib/qr";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { destination_url, title, qr_type = "static", style_config = {} } = body;

  if (!destination_url) {
    return NextResponse.json({ error: "destination_url is required" }, { status: 400 });
  }

  // Generate unique short code
  let short_code = generateShortCode();
  let attempts = 0;
  while (attempts < 5) {
    const { data: existing } = await supabase
      .from("qr_codes")
      .select("id")
      .eq("short_code", short_code)
      .single();
    if (!existing) break;
    short_code = generateShortCode();
    attempts++;
  }

  // Get user from auth header if present
  const authHeader = request.headers.get("authorization");
  let user_id: string | null = null;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const authedSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user } } = await authedSupabase.auth.getUser();
    user_id = user?.id || null;
  }

  const { data, error } = await supabase.from("qr_codes").insert({
    user_id,
    short_code,
    destination_url,
    title,
    qr_type,
    style_config,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glyph.calyvent.com";

  return NextResponse.json({
    ...data,
    tracking_url: qr_type === "dynamic" ? `${appUrl}/g/${short_code}` : null,
  }, { status: 201 });
}
