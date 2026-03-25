import QRCode from "qrcode";

export interface QROptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

const defaults: QROptions = {
  width: 300,
  margin: 2,
  color: {
    dark: "#1A1A1A",
    light: "#FFFFFF",
  },
  errorCorrectionLevel: "M",
};

export async function generateQRDataURL(
  text: string,
  options?: QROptions
): Promise<string> {
  const merged = {
    ...defaults,
    ...options,
    color: { ...defaults.color, ...options?.color },
  };

  return QRCode.toDataURL(text, {
    width: merged.width,
    margin: merged.margin,
    color: merged.color,
    errorCorrectionLevel: merged.errorCorrectionLevel,
  });
}

export async function generateQRSVG(
  text: string,
  options?: QROptions
): Promise<string> {
  const merged = {
    ...defaults,
    ...options,
    color: { ...defaults.color, ...options?.color },
  };

  return QRCode.toString(text, {
    type: "svg",
    width: merged.width,
    margin: merged.margin,
    color: merged.color,
    errorCorrectionLevel: merged.errorCorrectionLevel,
  });
}

export function generateShortCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
