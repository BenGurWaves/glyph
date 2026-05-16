import { supabase } from '@/lib/supabase'

export interface QRCode {
  id: string;
  shortCode: string;
  destinationUrl: string;
  title: string | null;
  qrType: "static" | "dynamic";
  styleConfig: {
    fgColor?: string;
    bgColor?: string;
    logo?: string;
  };
  createdAt: string;
  scans: Scan[];
  qr_image?: string;
}

export interface Scan {
  id: string;
  scannedAt: string;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
}

export async function getQRCodes(): Promise<QRCode[]> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []

  return data.map((qr: any) => ({
    id: qr.id,
    shortCode: qr.short_code,
    destinationUrl: qr.destination_url,
    title: qr.title,
    qrType: qr.qr_type,
    styleConfig: qr.style_config,
    createdAt: qr.created_at,
    scans: [], // Will be loaded separately
    qr_image: qr.qr_image,
  }))
}

export async function getQRCodeScans(qrCodeId: string): Promise<Scan[]> {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('qr_code_id', qrCodeId)
    .order('scanned_at', { ascending: false })

  if (error) return []

  return data.map((scan: any) => ({
    id: scan.id,
    scannedAt: scan.scanned_at,
    country: scan.country,
    city: scan.city,
    device: scan.device,
    browser: scan.browser,
    os: scan.os,
    referrer: scan.referrer,
  }))
}

export async function saveQRCode(qrCode: Omit<QRCode, "id" | "createdAt" | "scans">): Promise<QRCode> {
  const shortCode = Math.random().toString(36).substring(2, 10)

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({
      short_code: shortCode,
      destination_url: qrCode.destinationUrl,
      title: qrCode.title,
      qr_type: 'dynamic', // Always dynamic for analytics
      style_config: qrCode.styleConfig,
      qr_image: qrCode.qr_image,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    shortCode: data.short_code,
    destinationUrl: data.destination_url,
    title: data.title,
    qrType: data.qr_type,
    styleConfig: data.style_config,
    createdAt: data.created_at,
    scans: [],
    qr_image: data.qr_image,
  }
}

export async function deleteQRCode(id: string): Promise<void> {
  const { error } = await supabase.from('qr_codes').delete().eq('id', id)
  if (error) throw error
}

export async function updateQRCode(id: string, updates: Partial<QRCode>): Promise<void> {
  const updateData: any = {}
  if (updates.styleConfig) updateData.style_config = updates.styleConfig
  if (updates.destinationUrl) updateData.destination_url = updates.destinationUrl
  if (updates.qr_image) updateData.qr_image = updates.qr_image

  const { error } = await supabase
    .from('qr_codes')
    .update(updateData)
    .eq('id', id)

  if (error) throw error
}

export function getQRCodeById(id: string): QRCode | undefined {
  // This is now async, use getQRCodes() and filter
  return undefined
}

export function getQRCodeByShortCode(shortCode: string): QRCode | undefined {
  // This is now async, use getQRCodes() and filter
  return undefined
}

