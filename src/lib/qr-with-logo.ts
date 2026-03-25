"use client";

import { generateQRDataURL } from "./qr";

export async function generateQRWithLogo(
  text: string,
  options: {
    width?: number;
    fgColor?: string;
    bgColor?: string;
    logoDataUrl?: string;
  }
): Promise<string> {
  const { width = 300, fgColor = "#1A1A1A", bgColor = "#FFFFFF", logoDataUrl } = options;

  // Generate base QR with high error correction for logo overlay
  const qrDataUrl = await generateQRDataURL(text, {
    width,
    margin: 2,
    color: { dark: fgColor, light: bgColor },
    errorCorrectionLevel: "H",
  });

  if (!logoDataUrl) return qrDataUrl;

  // Overlay logo using canvas
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext("2d")!;

    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, width, width);

      const logoImg = new Image();
      logoImg.onload = () => {
        // Logo takes up ~20% of QR code
        const logoSize = width * 0.2;
        const logoX = (width - logoSize) / 2;
        const logoY = (width - logoSize) / 2;

        // White background circle behind logo
        ctx.fillStyle = bgColor;
        const padding = logoSize * 0.15;
        ctx.beginPath();
        ctx.roundRect(
          logoX - padding,
          logoY - padding,
          logoSize + padding * 2,
          logoSize + padding * 2,
          8
        );
        ctx.fill();

        // Draw logo
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

        resolve(canvas.toDataURL("image/png"));
      };
      logoImg.onerror = () => resolve(qrDataUrl); // Fallback to QR without logo
      logoImg.src = logoDataUrl;
    };
    qrImg.src = qrDataUrl;
  });
}
