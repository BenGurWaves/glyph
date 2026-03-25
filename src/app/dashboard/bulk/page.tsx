"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { generateQRDataURL } from "@/lib/qr";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkPage() {
  const [csvText, setCsvText] = useState("");
  const [results, setResults] = useState<{ url: string; title: string; qrImage: string; shortCode: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [isPro, setIsPro] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();
      if (sub?.plan !== "pro") { router.push("/pricing"); return; }
      setIsPro(true);
    });
  }, [router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target?.result as string);
    reader.readAsText(file);
  };

  const processCsv = async () => {
    if (!csvText.trim() || !userId) return;
    setProcessing(true);
    setResults([]);

    const lines = csvText.trim().split("\n");
    const header = lines[0].toLowerCase();
    const urlIdx = header.split(",").findIndex(h => h.trim() === "url" || h.trim() === "link" || h.trim() === "destination");
    const titleIdx = header.split(",").findIndex(h => h.trim() === "title" || h.trim() === "name" || h.trim() === "label");

    const dataLines = urlIdx >= 0 ? lines.slice(1) : lines; // skip header if found
    const effectiveUrlIdx = urlIdx >= 0 ? urlIdx : 0;

    const generated: typeof results = [];

    for (let i = 0; i < dataLines.length; i++) {
      const cols = dataLines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
      const url = cols[effectiveUrlIdx];
      if (!url || !url.startsWith("http")) continue;

      setProgress(`${i + 1} / ${dataLines.length}`);

      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
      let shortCode = "";
      for (let j = 0; j < 7; j++) shortCode += chars[Math.floor(Math.random() * chars.length)];

      let title = url;
      if (titleIdx >= 0 && cols[titleIdx]) {
        title = cols[titleIdx];
      } else {
        try { title = new URL(url).hostname; } catch { /* use url */ }
      }

      // Save to database
      await supabase.from("qr_codes").insert({
        user_id: userId,
        short_code: shortCode,
        destination_url: url,
        title,
        qr_type: "dynamic",
        style_config: {},
      });

      // Generate QR image
      const trackingUrl = `https://glyph.calyvent.com/g/${shortCode}`;
      const qrImage = await generateQRDataURL(trackingUrl, {
        width: 300, margin: 2,
        color: { dark: "#1A1A1A", light: "#FFFFFF" },
        errorCorrectionLevel: "H",
      });

      generated.push({ url, title, qrImage, shortCode });
    }

    setResults(generated);
    setProcessing(false);
    setProgress("");
  };

  const downloadAll = () => {
    results.forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = r.qrImage;
        a.download = `glyph-${r.shortCode}.png`;
        a.click();
      }, i * 200);
    });
  };

  if (!isPro) {
    return (
      <><Nav /><main className="flex-1 pt-14"><div className="max-w-lg mx-auto px-6 pt-20 flex items-center gap-3">
        <span className="led led-active" /><span className="text-[13px] text-[var(--text-secondary)]">loading...</span>
      </div></main><Footer /></>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="max-w-2xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-6 stagger">
            <Link href="/dashboard" className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline lowercase">&larr; dashboard</Link>

            <h1 className="text-[28px] font-medium lowercase tracking-tight">bulk generate</h1>
            <p className="text-[14px] text-[var(--text-secondary)]">
              Upload a CSV with URLs to generate QR codes in bulk. All codes are saved to your dashboard as dynamic (trackable) codes.
            </p>

            {/* CSV Input */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <label className="keycap keycap-light keycap-md cursor-pointer">
                  upload csv
                  <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="label self-center">or paste below</span>
              </div>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={"url,title\nhttps://example.com,Example\nhttps://shop.com,My Shop"}
                className="hw-input font-mono text-[12px] min-h-[120px] resize-y"
                rows={6}
              />
            </div>

            <button
              onClick={processCsv}
              disabled={!csvText.trim() || processing}
              className="keycap keycap-accent keycap-lg disabled:opacity-50 self-start"
            >
              {processing ? `generating... ${progress}` : "generate all"}
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div className="flex flex-col gap-4 animate-in">
                <div className="flex items-center justify-between">
                  <span className="label">{results.length} codes generated</span>
                  <button onClick={downloadAll} className="keycap keycap-dark keycap-sm">
                    download all
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {results.map((r) => (
                    <div key={r.shortCode} className="module p-3 flex flex-col items-center gap-2">
                      <img src={r.qrImage} alt={r.title} width={120} height={120} />
                      <span className="text-[11px] font-medium lowercase truncate max-w-full">{r.title}</span>
                      <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{r.shortCode}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
