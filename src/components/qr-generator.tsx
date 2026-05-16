"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generateQRDataURL } from "@/lib/qr";
import { generateQRWithLogo } from "@/lib/qr-with-logo";
import { saveQRCode } from "@/lib/storage";
import { useRouter } from "next/navigation";

export function QRGenerator() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrDataUrl(null);
      return;
    }

    setIsGenerating(true);
    setSaved(false);
    try {
      const dataUrl = await generateQRDataURL(text, {
        width: 300,
        margin: 2,
        color: { dark: "#1A1A1A", light: "#FFFFFF" },
        errorCorrectionLevel: "H",
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
      else {
        setQrDataUrl(null);
        setSaved(false);
      }
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

  const handleSave = async () => {
    if (!url.trim() || !qrDataUrl) return;
    
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    let title = normalizedUrl;
    try { title = new URL(normalizedUrl).hostname; } catch { /* use full url */ }

    try {
      saveQRCode({
        shortCode: Math.random().toString(36).substring(2, 9),
        destinationUrl: normalizedUrl,
        title: title,
        qrType: "static",
        styleConfig: {
          fgColor: "#1A1A1A",
          bgColor: "#FFFFFF",
        },
        qr_image: qrDataUrl,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save QR code:", error);
      alert("Failed to save QR code. Please check console for details.");
    }
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

        {/* Customize Colors */}
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

        {/* Actions */}
        {qrDataUrl && (
          <div className="flex justify-center gap-3 animate-in">
            <button onClick={download} className="keycap keycap-dark keycap-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              download
            </button>
            <button onClick={handleSave} className="keycap keycap-light keycap-md">
              {saved ? "saved!" : "save to dashboard"}
            </button>
          </div>
        )}

        {/* Note */}
        <p className="text-center text-[12px] text-[var(--text-tertiary)] lowercase tracking-wide">
          unlimited. free. saved to your device.
        </p>
      </div>
    </div>
  );
}
