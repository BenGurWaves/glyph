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

const STORAGE_KEY = "glyph_qr_codes";

export function getQRCodes(): QRCode[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveQRCode(qrCode: Omit<QRCode, "id" | "createdAt" | "scans">): QRCode {
  const qrCodes = getQRCodes();
  const newQRCode: QRCode = {
    ...qrCode,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    scans: [],
  };
  qrCodes.push(newQRCode);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(qrCodes));
  return newQRCode;
}

export function deleteQRCode(id: string): void {
  const qrCodes = getQRCodes();
  const filtered = qrCodes.filter((qr) => qr.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function addScan(shortCode: string, scan: Omit<Scan, "id" | "scannedAt">): void {
  const qrCodes = getQRCodes();
  const qrCode = qrCodes.find((qr) => qr.shortCode === shortCode);
  if (qrCode) {
    const newScan: Scan = {
      ...scan,
      id: crypto.randomUUID(),
      scannedAt: new Date().toISOString(),
    };
    qrCode.scans.push(newScan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qrCodes));
  }
}

export function getQRCodeById(id: string): QRCode | undefined {
  const qrCodes = getQRCodes();
  return qrCodes.find((qr) => qr.id === id);
}

export function incrementScanCount(id: string): void {
  const qrCodes = getQRCodes();
  const qrCode = qrCodes.find((qr) => qr.id === id);
  if (qrCode) {
    // Add a simulated scan
    const newScan: Scan = {
      id: crypto.randomUUID(),
      scannedAt: new Date().toISOString(),
      country: "US",
      city: "San Francisco",
      device: "mobile",
      browser: "Chrome",
      os: "iOS",
      referrer: null,
    };
    qrCode.scans.push(newScan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(qrCodes));
  }
}

export function getQRCodeByShortCode(shortCode: string): QRCode | undefined {
  const qrCodes = getQRCodes();
  return qrCodes.find((qr) => qr.shortCode === shortCode);
}
