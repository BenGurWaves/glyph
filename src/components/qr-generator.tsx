"use client";

import { useState, useEffect, useCallback } from "react";
import { generateQRDataURL } from "@/lib/qr";

export function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrDataUrl(null);
      return;
    }
    setIsGenerating(true);
    try {
      const dataUrl = await generateQRDataURL(text, {
        width: 300,
        margin: 2,
        color: { dark: "#1A1A1A", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
    } catch {
      setQrDataUrl(null);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url.trim()) generate(url);
      else setQrDataUrl(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [url, generate]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `glyph-qr-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="module p-8 max-w-xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        {/* URL Input */}
        <div className="flex flex-col gap-2">
          <span className="label">destination url</span>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-link.com"
              className="hw-input flex-1"
              autoFocus
            />
            <button
              onClick={() => generate(url)}
              disabled={!url.trim() || isGenerating}
              className="keycap keycap-accent keycap-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              generate
            </button>
          </div>
        </div>

        {/* QR Preview */}
        <div className="flex justify-center">
          <div className="module-recessed p-6 flex items-center justify-center" style={{ minHeight: 200, minWidth: 200 }}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Generated QR code"
                width={200}
                height={200}
                className="animate-in"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-[120px] h-[120px] border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="3" height="3" />
                    <rect x="18" y="14" width="3" height="3" />
                    <rect x="14" y="18" width="3" height="3" />
                    <rect x="18" y="18" width="3" height="3" />
                  </svg>
                </div>
                <span className="label">enter a url above</span>
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        {qrDataUrl && (
          <div className="flex justify-center animate-in">
            <button onClick={download} className="keycap keycap-dark keycap-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              download png
            </button>
          </div>
        )}

        {/* No signup note */}
        <p className="text-center text-[12px] text-[var(--text-tertiary)] lowercase tracking-wide">
          instant. no signup. no email.
        </p>
      </div>
    </div>
  );
}
