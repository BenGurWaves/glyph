import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function parseUserAgent(ua: string) {
  let device = "desktop";
  let browser = "other";
  let os = "other";

  if (/mobile|android|iphone|ipad/i.test(ua)) {
    device = /ipad|tablet/i.test(ua) ? "tablet" : "mobile";
  }

  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = "chrome";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "safari";
  else if (/firefox/i.test(ua)) browser = "firefox";
  else if (/edg/i.test(ua)) browser = "edge";

  if (/windows/i.test(ua)) os = "windows";
  else if (/mac/i.test(ua)) os = "macos";
  else if (/android/i.test(ua)) os = "android";
  else if (/iphone|ipad/i.test(ua)) os = "ios";
  else if (/linux/i.test(ua)) os = "linux";

  return { device, browser, os };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("id, destination_url, qr_type")
    .eq("short_code", shortcode)
    .single();

  if (error || !qr) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Log scan for dynamic QR codes — MUST await before redirect
  if (qr.qr_type === "dynamic") {
    const ua = request.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(ua);

    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      null;
    const city =
      request.headers.get("cf-ipcity") ||
      request.headers.get("x-vercel-ip-city") ||
      null;
    const referrer = request.headers.get("referer") || null;

    await supabase.from("scans").insert({
      qr_code_id: qr.id,
      country,
      city,
      device,
      browser,
      os,
      referrer,
    });
  }

  // Ensure URL has protocol
  let destUrl = qr.destination_url;
  if (!/^https?:\/\//i.test(destUrl)) {
    destUrl = "https://" + destUrl;
  }

  return NextResponse.redirect(destUrl, { status: 302 });
}
