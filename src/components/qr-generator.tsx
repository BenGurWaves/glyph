"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generateQRDataURL } from "@/lib/qr";
import { generateQRWithLogo } from "@/lib/qr-with-logo";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const DAILY_LIMIT = 5;
const STORAGE_KEY = "glyph_daily_gen";
const AUTO_SAVE_DELAY = 3000;

function getDailyUsage(): { count: number; date: string } {
  if (typeof window === "undefined") return { count: 0, date: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: new Date().toDateString() };
    const parsed = JSON.parse(raw);
    if (parsed.date !== new Date().toDateString()) {
      return { count: 0, date: new Date().toDateString() };
    }
    return parsed;
  } catch {
    return { count: 0, date: new Date().toDateString() };
  }
}

function incrementUsage() {
  const usage = getDailyUsage();
  usage.count++;
  usage.date = new Date().toDateString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}

export function QRGenerator() {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [limitReached, setLimitReached] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string | null>(null);

  // Pro features
  const [fgColor, setFgColor] = useState("#1A1A1A");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [showProControls, setShowProControls] = useState(false);
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

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedUrl = useRef<string>("");
  const userId = useRef<string | null>(null);

  useEffect(() => {
    const usage = getDailyUsage();
    setRemaining(DAILY_LIMIT - usage.count);
    setLimitReached(usage.count >= DAILY_LIMIT);

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setIsLoggedIn(!!user);
      if (user) {
        userId.current = user.id;
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        if (sub && sub.plan === "pro") {
          setIsPro(true);
          setLimitReached(false);
        } else {
          const { data: couponData } = await supabase
            .from("coupon_activations")
            .select("email")
            .eq("email", user.email?.toLowerCase() || "")
            .single();

          if (couponData) {
            await supabase.from("subscriptions").upsert(
              { user_id: user.id, plan: "pro", payment_method: "coupon", status: "active" },
              { onConflict: "user_id" }
            );
            setIsPro(true);
            setLimitReached(false);
          }
        }
      }
    });
  }, []);

  // Auto-save for Pro users after 3 seconds of inactivity
  const autoSave = useCallback(async (destUrl: string) => {
    if (!userId.current || !isPro || !destUrl.trim()) return;
    // Normalize URL
    let normalizedUrl = destUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    if (normalizedUrl === lastSavedUrl.current) return;

    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let shortCode = "";
    for (let i = 0; i < 7; i++) shortCode += chars[Math.floor(Math.random() * chars.length)];

    let title = destUrl;
    try { title = new URL(destUrl).hostname; } catch { /* use full url */ }

    const { error } = await supabase.from("qr_codes").insert({
      user_id: userId.current,
      short_code: shortCode,
      destination_url: normalizedUrl,
      title,
      qr_type: "dynamic",
      style_config: { fgColor, bgColor, ...(logoDataUrl ? { logo: logoDataUrl } : {}) },
    });

    if (!error) {
      lastSavedUrl.current = normalizedUrl;
      setAutoSaveStatus("auto-saved to dashboard");
      setSaved(true);
      setTimeout(() => setAutoSaveStatus(null), 3000);
    }
  }, [isPro, fgColor, bgColor]);

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrDataUrl(null);
      return;
    }

    if (!isPro) {
      const usage = getDailyUsage();
      if (usage.count >= DAILY_LIMIT) {
        setLimitReached(true);
        return;
      }
    }

    setIsGenerating(true);
    setSaved(false);
    setAutoSaveStatus(null);
    try {
      let dataUrl: string;
      if (isPro && logoDataUrl) {
        dataUrl = await generateQRWithLogo(text, { width: 300, fgColor, bgColor, logoDataUrl });
      } else {
        dataUrl = await generateQRDataURL(text, {
          width: 300,
          margin: 2,
          color: { dark: fgColor, light: bgColor },
          errorCorrectionLevel: isPro ? "H" : "M",
        });
      }
      setQrDataUrl(dataUrl);
      if (!isPro) {
        incrementUsage();
        setRemaining(DAILY_LIMIT - getDailyUsage().count);
      }

      // Start auto-save timer for Pro users
      if (isPro && userId.current) {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => autoSave(text), AUTO_SAVE_DELAY);
      }
    } catch {
      setQrDataUrl(null);
    } finally {
      setIsGenerating(false);
    }
  }, [isPro, fgColor, bgColor, logoDataUrl, autoSave]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url.trim() && !limitReached) generate(url);
      else if (!url.trim()) {
        setQrDataUrl(null);
        setSaved(false);
        setAutoSaveStatus(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [url, generate, limitReached]);

  useEffect(() => {
    // Re-generate when colors or logo change (Pro only)
    if (isPro && url.trim() && qrDataUrl) {
      generate(url);
    }
  }, [fgColor, bgColor, logoDataUrl]);

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
          <div className="flex items-center justify-between">
            <span className="label">destination url</span>
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
              {isPro ? "pro — unlimited" : `${remaining}/${DAILY_LIMIT} today`}
            </span>
          </div>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-link.com"
              className="hw-input flex-1"
              disabled={limitReached}
              autoFocus
            />
            <button
              onClick={() => generate(url)}
              disabled={!url.trim() || isGenerating || limitReached}
              className="keycap keycap-accent keycap-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              generate
            </button>
          </div>
        </div>

        {/* Pro Color Controls */}
        {isPro && qrDataUrl && (
          <div className="animate-in">
            <button
              onClick={() => setShowProControls(!showProControls)}
              className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] lowercase transition-colors flex items-center gap-2"
            >
              <span className="led led-active" />
              {showProControls ? "hide pro controls" : "customize colors"}
            </button>

            {showProControls && (
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

        {/* Limit reached */}
        {limitReached && (
          <div className="module-recessed p-4 flex flex-col gap-2 animate-in">
            <p className="text-[13px] text-[var(--text-primary)]">
              Daily limit reached (20/day on free).
            </p>
            <Link
              href="/pricing"
              className="keycap keycap-accent keycap-sm self-start no-underline"
            >
              go pro — unlimited
            </Link>
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

        {/* Auto-save status */}
        {autoSaveStatus && (
          <div className="flex items-center justify-center gap-2 animate-in">
            <span className="led led-active" />
            <span className="text-[11px] text-[var(--text-secondary)] lowercase">{autoSaveStatus}</span>
          </div>
        )}

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
            {!isLoggedIn && (
              <Link href="/login" className="keycap keycap-light keycap-md no-underline">
                sign in to save
              </Link>
            )}
          </div>
        )}

        {/* LinkDrop cross-promote */}
        {qrDataUrl && (
          <div className="flex justify-center animate-in">
            <a
              href="https://linkdrop.calyvent.com"
              target="_blank"
              className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] no-underline transition-colors lowercase mt-2 inline-block"
            >
              add this to your linkdrop page &rarr;
            </a>
          </div>
        )}

        {/* Note */}
        <p className="text-center text-[12px] text-[var(--text-tertiary)] lowercase tracking-wide">
          {isPro
            ? "pro — auto-saves to your dashboard."
            : limitReached
              ? "pro users get unlimited generations."
              : "instant. no signup. no email."}
        </p>
      </div>
    </div>
  );
}
