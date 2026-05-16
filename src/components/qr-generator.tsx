"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generateQRDataURL } from "@/lib/qr";
import { generateQRWithLogo } from "@/lib/qr-with-logo";
import { saveQRCode, getTrackingUrl } from "@/lib/storage";
import { useRouter } from "next/navigation";

export function QRGenerator() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  // Color customization (free for everyone)
  const [fgColor, setFgColor] = useState("#1A1A1A");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoDataUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrDataUrl(null);
      return;
    }

    setIsGenerating(true);
    setSaved(false);
    try {
      let dataUrl: string;
      if (logoDataUrl) {
        dataUrl = await generateQRWithLogo(text, { width: 300, fgColor, bgColor, logoDataUrl });
      } else {
        dataUrl = await generateQRDataURL(text, {
          width: 300,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
          errorCorrectionLevel: "H",
        });
      }
      setQrDataUrl(dataUrl);
    } catch {
      setQrDataUrl(null);
    } finally {
      setIsGenerating(false);
    }
  }, [fgColor, bgColor, logoDataUrl]);

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

  useEffect(() => {
    // Re-generate when colors or logo change
    if (url.trim() && qrDataUrl) {
      generate(url);
    }
  }, [fgColor, bgColor, logoDataUrl, generate]);

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
      const qrCode = await saveQRCode({
        shortCode: Math.random().toString(36).substring(2, 9),
        destinationUrl: normalizedUrl,
        title: title,
        qrType: "dynamic",
        styleConfig: {
          fgColor,
          bgColor,
          logo: logoDataUrl || undefined,
        },
        qr_image: qrDataUrl,
      });
      
      // Regenerate QR with tracking URL
      const trackingUrl = getTrackingUrl(qrCode.shortCode);
      let dataUrl: string;
      if (logoDataUrl) {
        dataUrl = await generateQRWithLogo(trackingUrl, { width: 300, fgColor, bgColor, logoDataUrl });
      } else {
        dataUrl = await generateQRDataURL(trackingUrl, {
          width: 300,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
          errorCorrectionLevel: "H",
        });
      }
      setQrDataUrl(dataUrl);
      
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
        {qrDataUrl && (
          <div className="animate-in">
            <button
              onClick={() => setShowCustomize(!showCustomize)}
              className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] lowercase transition-colors flex items-center gap-2"
            >
              <span className="led led-active" />
              {showCustomize ? "hide customization" : "customize colors"}
            </button>

            {showCustomize && (
              <div className="mt-4 flex flex-col gap-4 module-recessed p-4 animate-in">
                <div className="flex gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="label">code color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]"
                        style={{ padding: 0 }}
                      />
                      <span className="font-mono text-[11px] text-[var(--text-secondary)]">{fgColor}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="label">background</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]"
                        style={{ padding: 0 }}
                      />
                      <span className="font-mono text-[11px] text-[var(--text-secondary)]">{bgColor}</span>
                    </div>
                  </div>
                </div>
                {/* Logo upload */}
                <div className="flex flex-col gap-1.5">
                  <span className="label">logo overlay</span>
                  <div className="flex items-center gap-3">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="keycap keycap-light keycap-sm"
                    >
                      {logoDataUrl ? "change logo" : "upload logo"}
                    </button>
                    {logoDataUrl && (
                      <>
                        <img src={logoDataUrl} alt="Logo" className="w-8 h-8 rounded object-cover border border-[var(--border)]" />
                        <button
                          onClick={() => setLogoDataUrl(null)}
                          className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)]"
                        >
                          remove
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick presets */}
                <div className="flex gap-2">
                  {[
                    { fg: "#1A1A1A", bg: "#FFFFFF", name: "classic" },
                    { fg: "#1A1A1A", bg: "#F5F0EB", name: "warm" },
                    { fg: "#E8652B", bg: "#FFFFFF", name: "accent" },
                    { fg: "#FFFFFF", bg: "#1A1A1A", name: "inverted" },
                    { fg: "#023020", bg: "#F5F0EB", name: "forest" },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg); }}
                      className="keycap keycap-light keycap-sm"
                      title={preset.name}
                    >
                      <span
                        className="w-3 h-3 rounded-sm mr-1.5 border border-[var(--border)]"
                        style={{ background: preset.fg, display: "inline-block" }}
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
