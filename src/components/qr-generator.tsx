"use client";

import { useState, useEffect, useCallback } from "react";
import { generateQRDataURL } from "@/lib/qr";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const DAILY_LIMIT = 20;
const STORAGE_KEY = "glyph_daily_gen";

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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const usage = getDailyUsage();
    setRemaining(DAILY_LIMIT - usage.count);
    setLimitReached(usage.count >= DAILY_LIMIT);

    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  const generate = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrDataUrl(null);
      return;
    }

    const usage = getDailyUsage();
    if (usage.count >= DAILY_LIMIT) {
      setLimitReached(true);
      return;
    }

    setIsGenerating(true);
    setSaved(false);
    try {
      const dataUrl = await generateQRDataURL(text, {
        width: 300,
        margin: 2,
        color: { dark: "#1A1A1A", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
      incrementUsage();
      setRemaining(DAILY_LIMIT - getDailyUsage().count);
    } catch {
      setQrDataUrl(null);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url.trim() && !limitReached) generate(url);
      else if (!url.trim()) setQrDataUrl(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [url, generate, limitReached]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `glyph-qr-${Date.now()}.png`;
    a.click();
  };

  const saveToAccount = async () => {
    if (!url.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const res = await fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination_url: url,
        title: new URL(url).hostname,
        qr_type: "static",
      }),
    });

    if (res.ok) {
      setSaved(true);
    }
  };

  return (
    <div className="module p-8 max-w-xl mx-auto w-full">
      <div className="flex flex-col gap-6">
        {/* URL Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="label">destination url</span>
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
              {remaining}/{DAILY_LIMIT} today
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
            {isLoggedIn ? (
              <button
                onClick={saveToAccount}
                disabled={saved}
                className={`keycap keycap-light keycap-md ${saved ? "opacity-60" : ""}`}
              >
                {saved ? "saved" : "save to account"}
              </button>
            ) : (
              <Link
                href="/login"
                className="keycap keycap-light keycap-md no-underline"
              >
                sign in to save
              </Link>
            )}
          </div>
        )}

        {/* Note */}
        <p className="text-center text-[12px] text-[var(--text-tertiary)] lowercase tracking-wide">
          {limitReached
            ? "pro users get unlimited generations."
            : "instant. no signup. no email."}
        </p>
      </div>
    </div>
  );
}
