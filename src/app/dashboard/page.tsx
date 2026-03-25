"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { generateQRDataURL } from "@/lib/qr";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

type QRCodeRow = {
  id: string;
  user_id: string | null;
  short_code: string;
  destination_url: string;
  title: string | null;
  qr_type: "static" | "dynamic";
  style_config: Record<string, string>;
  created_at: string;
  scan_count?: number;
  qr_image?: string;
};

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QRCodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isPro, setIsPro] = useState(false);
  const router = useRouter();

  const loadQrCodes = useCallback(async (uid: string) => {
    const { data: codes } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!codes) return;

    // Get scan counts for each QR code
    const enriched: QRCodeRow[] = await Promise.all(
      codes.map(async (qr: QRCodeRow) => {
        // Get scan count
        const { count } = await supabase
          .from("scans")
          .select("*", { count: "exact", head: true })
          .eq("qr_code_id", qr.id);

        // Generate QR image for preview
        const fgColor = qr.style_config?.fgColor || "#1A1A1A";
        const bgColor = qr.style_config?.bgColor || "#FFFFFF";
        let qrImage = "";
        try {
          const trackingUrl = qr.qr_type === "dynamic"
            ? `https://glyph.calyvent.com/g/${qr.short_code}`
            : qr.destination_url;
          qrImage = await generateQRDataURL(trackingUrl, {
            width: 200,
            margin: 2,
            color: { dark: fgColor, light: bgColor },
            errorCorrectionLevel: "H",
          });
        } catch { /* skip */ }

        return { ...qr, scan_count: count || 0, qr_image: qrImage };
      })
    );

    setQrCodes(enriched);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Check Pro status
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();
      setIsPro(sub?.plan === "pro");

      await loadQrCodes(user.id);
      setLoading(false);
    };
    init();
  }, [router, loadQrCodes]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("qr_codes").delete().eq("id", id);
    setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
  };

  const downloadQr = (qr: QRCodeRow) => {
    if (!qr.qr_image) return;
    const a = document.createElement("a");
    a.href = qr.qr_image;
    a.download = `glyph-${qr.short_code}.png`;
    a.click();
  };

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 pt-14">
          <div className="max-w-4xl mx-auto px-6 pt-20 flex items-center gap-3">
            <span className="led led-active" />
            <span className="text-[13px] text-[var(--text-secondary)] lowercase">loading...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-medium leading-tight tracking-tight lowercase">
                  dashboard
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[12px] text-[var(--text-secondary)]">{user?.email}</p>
                  {isPro && (
                    <span className="flex items-center gap-1.5">
                      <span className="led led-active" />
                      <span className="text-[10px] font-medium text-[var(--accent)]">pro</span>
                    </span>
                  )}
                </div>
              </div>
              <button onClick={handleSignOut} className="keycap keycap-light keycap-sm">
                sign out
              </button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">total codes</span>
                <span className="text-[24px] font-medium">{qrCodes.length}</span>
              </div>
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">dynamic codes</span>
                <span className="text-[24px] font-medium">
                  {qrCodes.filter((q) => q.qr_type === "dynamic").length}
                </span>
              </div>
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">total scans</span>
                <span className="text-[24px] font-medium">
                  {qrCodes.reduce((sum, q) => sum + (q.scan_count || 0), 0)}
                </span>
              </div>
            </div>

            {/* QR Code List */}
            {qrCodes.length === 0 ? (
              <div className="module-recessed p-12 flex flex-col items-center gap-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
                <p className="text-[14px] text-[var(--text-secondary)]">No QR codes yet.</p>
                <Link href="/" className="keycap keycap-accent keycap-md no-underline">
                  create your first
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {qrCodes.map((qr) => (
                  <div key={qr.id} className="module p-5 flex gap-4">
                    {/* QR Preview */}
                    {qr.qr_image && (
                      <div className="module-recessed p-2 shrink-0 flex items-center justify-center" style={{ width: 80, height: 80 }}>
                        <img src={qr.qr_image} alt="QR code" width={64} height={64} />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`led ${qr.qr_type === "dynamic" ? "led-active" : ""}`} />
                        <span className="text-[14px] font-medium lowercase truncate">
                          {qr.title || qr.short_code}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] lowercase">{qr.qr_type}</span>
                      </div>
                      <p className="text-[12px] font-mono text-[var(--text-secondary)] truncate">
                        {qr.destination_url}
                      </p>
                      {qr.qr_type === "dynamic" && (
                        <p className="text-[11px] font-mono text-[var(--text-tertiary)]">
                          glyph.calyvent.com/g/{qr.short_code}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[11px] text-[var(--text-secondary)]">
                          {qr.scan_count} {qr.scan_count === 1 ? "scan" : "scans"}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)]">
                          {new Date(qr.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => downloadQr(qr)} className="keycap keycap-light keycap-sm">
                        download
                      </button>
                      {qr.qr_type === "dynamic" && (
                        <Link
                          href={`/dashboard/${qr.id}`}
                          className="keycap keycap-dark keycap-sm no-underline text-center"
                        >
                          analytics
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(qr.id)}
                        className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors lowercase"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
