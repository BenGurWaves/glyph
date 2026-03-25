import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }

    const apiKey = authHeader.replace("Bearer ", "");
    const keyHash = await hashKey(apiKey);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Validate API key
    const { data: keyRow } = await supabase
      .from("api_keys")
      .select("user_id")
      .eq("key_hash", keyHash)
      .single();

    if (!keyRow) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Update last_used_at
    await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("key_hash", keyHash);

    const body = await request.json();
    const { url, title, dynamic = true } = body;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let shortCode = "";
    for (let i = 0; i < 7; i++) shortCode += chars[Math.floor(Math.random() * chars.length)];

    let resolvedTitle = title || url;
    try { resolvedTitle = title || new URL(url).hostname; } catch { /* use url */ }

    const { data, error } = await supabase.from("qr_codes").insert({
      user_id: keyRow.user_id,
      short_code: shortCode,
      destination_url: url,
      title: resolvedTitle,
      qr_type: dynamic ? "dynamic" : "static",
      style_config: {},
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glyph.calyvent.com";

    return NextResponse.json({
      id: data.id,
      short_code: shortCode,
      tracking_url: dynamic ? `${appUrl}/g/${shortCode}` : null,
      destination_url: url,
      title: resolvedTitle,
      created_at: data.created_at,
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "API error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
