import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

function parseUserAgent(ua: string) {
  let device = 'desktop'
  let browser = 'Unknown'
  let os = 'Unknown'

  if (/mobile|android|iphone|ipad/i.test(ua)) device = 'mobile'
  else if (/tablet|ipad/i.test(ua)) device = 'tablet'

  if (/chrome/i.test(ua)) browser = 'Chrome'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua)) browser = 'Safari'
  else if (/edge/i.test(ua)) browser = 'Edge'

  if (/windows/i.test(ua)) os = 'Windows'
  else if (/mac|os x/i.test(ua)) os = 'macOS'
  else if (/linux/i.test(ua)) os = 'Linux'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS'

  return { device, browser, os }
}

async function getLocation(ip: string) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    return {
      country: data.country_name || null,
      city: data.city || null,
    }
  } catch {
    return { country: null, city: null }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params

  // Get QR code from database
  const { data: qrCode, error } = await supabaseAdmin
    .from('qr_codes')
    .select('*')
    .eq('short_code', shortcode)
    .single()

  if (error || !qrCode) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Get scan data
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown'
  const ua = request.headers.get('user-agent') || 'Unknown'
  const referrer = request.headers.get('referer') || null

  const { device, browser, os } = parseUserAgent(ua)
  const { country, city } = await getLocation(ip)

  // Record scan
  await supabaseAdmin.from('scans').insert({
    qr_code_id: qrCode.id,
    country,
    city,
    device,
    browser,
    os,
    referrer,
    scanned_at: new Date().toISOString(),
  })

  // Redirect to destination
  return NextResponse.redirect(qrCode.destination_url)
}
