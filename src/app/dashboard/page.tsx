"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { generateQRDataURL } from "@/lib/qr";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

type StyleConfig = {
  fgColor?: string;
  bgColor?: string;
  logo?: string;
};

type QRCodeRow = {
  id: string;
  user_id: string | null;
  short_code: string;
  destination_url: string;
  title: string | null;
  qr_type: "static" | "dynamic";
  style_config: StyleConfig;
  created_at: string;
  scan_count?: number;
  qr_image?: string;
};

async function renderQR(qr: QRCodeRow): Promise<string> {
  const fgColor = qr.style_config?.fgColor || "#1A1A1A";
  const bgColor = qr.style_config?.bgColor || "#FFFFFF";
  const logo = qr.style_config?.logo;

  const trackingUrl = qr.qr_type === "dynamic"
    ? `https://glyph.calyvent.com/g/${qr.short_code}`
    : qr.destination_url;

  const baseQR = await generateQRDataURL(trackingUrl, {
    width: 300, margin: 2,
    color: { dark: fgColor, light: bgColor },
    errorCorrectionLevel: "H",
  });

  if (!logo) return baseQR;

  // Overlay logo using canvas
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d")!;
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, 300, 300);
      const logoImg = new Image();
      logoImg.onload = () => {
        const s = 60, x = 120, y = 120;
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(x - 8, y - 8, s + 16, s + 16, 6);
        ctx.fill();
        ctx.drawImage(logoImg, x, y, s, s);
        resolve(canvas.toDataURL("image/png"));
      };
      logoImg.onerror = () => resolve(baseQR);
      logoImg.src = logo;
    };
    qrImg.src = baseQR;
  });
}

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QRCodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFg, setEditFg] = useState("#1A1A1A");
  const [editBg, setEditBg] = useState("#FFFFFF");
  const [editLogo, setEditLogo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const loadQrCodes = useCallback(async (uid: string) => {
    const { data: codes } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!codes) return;

    const enriched: QRCodeRow[] = await Promise.all(
      codes.map(async (qr: QRCodeRow) => {
        const { count } = await supabase
          .from("scans")
          .select("*", { count: "exact", head: true })
          .eq("qr_code_id", qr.id);

        let qrImage = "";
        try {
          qrImage = await renderQR(qr);
        } catch { /* skip */ }

        return { ...qr, scan_count: count || 0, qr_image: qrImage };
      })
    );

    setQrCodes(enriched);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

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

  const startEdit = (qr: QRCodeRow) => {
    setEditingId(qr.id);
    setEditFg(qr.style_config?.fgColor || "#1A1A1A");
    setEditBg(qr.style_config?.bgColor || "#FFFFFF");
    setEditLogo(qr.style_config?.logo || null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const saveEdit = async (qr: QRCodeRow) => {
    setSaving(true);
    const newConfig: StyleConfig = { fgColor: editFg, bgColor: editBg };
    if (editLogo) newConfig.logo = editLogo;

    await supabase.from("qr_codes")
      .update({ style_config: newConfig, updated_at: new Date().toISOString() })
      .eq("id", qr.id);

    // Re-render QR
    const updated = { ...qr, style_config: newConfig };
    const newImage = await renderQR(updated);

    setQrCodes((prev) =>
      prev.map((q) =>
        q.id === qr.id ? { ...q, style_config: newConfig, qr_image: newImage } : q
      )
    );

    setEditingId(null);
    setSaving(false);
  };

  if (loading) {
    return (
      <><Nav /><main className="flex-1 pt-14">
        <div className="max-w-4xl mx-auto px-6 pt-20 flex items-center gap-3">
          <span className="led led-active" />
          <span className="text-[13px] text-[var(--text-secondary)] lowercase">loading...</span>
        </div>
      </main><Footer /></>
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
                <h1 className="text-[28px] font-medium leading-tight tracking-tight lowercase">dashboard</h1>
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
              <button onClick={handleSignOut} className="keycap keycap-light keycap-sm">sign out</button>
            </div>

            {/* Pro tools */}
            {isPro && (
              <div className="flex gap-3">
                <Link href="/dashboard/bulk" className="keycap keycap-light keycap-sm no-underline">bulk generate</Link>
                <Link href="/dashboard/api-keys" className="keycap keycap-light keycap-sm no-underline">api keys</Link>
              </div>
            )}

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">total codes</span>
                <span className="text-[24px] font-medium">{qrCodes.length}</span>
              </div>
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">dynamic codes</span>
                <span className="text-[24px] font-medium">{qrCodes.filter((q) => q.qr_type === "dynamic").length}</span>
              </div>
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">total scans</span>
                <span className="text-[24px] font-medium">{qrCodes.reduce((sum, q) => sum + (q.scan_count || 0), 0)}</span>
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
                <Link href="/" className="keycap keycap-accent keycap-md no-underline">create your first</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {qrCodes.map((qr) => (
                  <div key={qr.id} className="module p-5 flex flex-col gap-4">
                    <div className="flex gap-4">
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
                          <span className="text-[14px] font-medium lowercase truncate">{qr.title || qr.short_code}</span>
                          <span className="text-[10px] text-[var(--text-tertiary)] lowercase">{qr.qr_type}</span>
                        </div>
                        <p className="text-[12px] font-mono text-[var(--text-secondary)] truncate">{qr.destination_url}</p>
                        {qr.qr_type === "dynamic" && (
                          <p className="text-[11px] font-mono text-[var(--text-tertiary)]">glyph.calyvent.com/g/{qr.short_code}</p>
                        )}
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[11px] text-[var(--text-secondary)]">{qr.scan_count} {qr.scan_count === 1 ? "scan" : "scans"}</span>
                          <span className="text-[11px] text-[var(--text-tertiary)]">{new Date(qr.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => downloadQr(qr)} className="keycap keycap-light keycap-sm">download</button>
                        {isPro && (
                          <button
                            onClick={() => editingId === qr.id ? setEditingId(null) : startEdit(qr)}
                            className="keycap keycap-dark keycap-sm"
                          >
                            {editingId === qr.id ? "close" : "edit"}
                          </button>
                        )}
                        {qr.qr_type === "dynamic" && (
                          <Link href={`/dashboard/${qr.id}`} className="keycap keycap-light keycap-sm no-underline text-center">analytics</Link>
                        )}
                        <button onClick={() => handleDelete(qr.id)} className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors lowercase">delete</button>
                      </div>
                    </div>

                    {/* Edit Panel (Pro) */}
                    {editingId === qr.id && isPro && (
                      <div className="module-recessed p-4 flex flex-col gap-4 animate-in">
                        <span className="label">customize qr code</span>

                        <div className="flex gap-6">
                          <div className="flex flex-col gap-1.5">
                            <span className="label">code color</span>
                            <div className="flex items-center gap-2">
                              <input type="color" value={editFg} onChange={(e) => setEditFg(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]" style={{ padding: 0 }} />
                              <span className="font-mono text-[11px] text-[var(--text-secondary)]">{editFg}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <span className="label">background</span>
                            <div className="flex items-center gap-2">
                              <input type="color" value={editBg} onChange={(e) => setEditBg(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]" style={{ padding: 0 }} />
                              <span className="font-mono text-[11px] text-[var(--text-secondary)]">{editBg}</span>
                            </div>
                          </div>
                        </div>

                        {/* Logo */}
                        <div className="flex flex-col gap-1.5">
                          <span className="label">logo overlay</span>
                          <div className="flex items-center gap-3">
                            <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            <button onClick={() => logoInputRef.current?.click()} className="keycap keycap-light keycap-sm">
                              {editLogo ? "change logo" : "upload logo"}
                            </button>
                            {editLogo && (
                              <>
                                <img src={editLogo} alt="Logo" className="w-8 h-8 rounded object-cover border border-[var(--border)]" />
                                <button onClick={() => setEditLogo(null)} className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)]">remove</button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Presets */}
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { fg: "#1A1A1A", bg: "#FFFFFF", name: "classic" },
                            { fg: "#1A1A1A", bg: "#F5F0EB", name: "warm" },
                            { fg: "#E8652B", bg: "#FFFFFF", name: "accent" },
                            { fg: "#FFFFFF", bg: "#1A1A1A", name: "inverted" },
                            { fg: "#023020", bg: "#F5F0EB", name: "forest" },
                          ].map((p) => (
                            <button key={p.name} onClick={() => { setEditFg(p.fg); setEditBg(p.bg); }} className="keycap keycap-light keycap-sm">
                              <span className="w-3 h-3 rounded-sm mr-1.5 border border-[var(--border)] inline-block" style={{ background: p.fg }} />
                              {p.name}
                            </button>
                          ))}
                        </div>

                        <button onClick={() => saveEdit(qr)} disabled={saving} className="keycap keycap-accent keycap-md self-start disabled:opacity-50">
                          {saving ? "saving..." : "save changes"}
                        </button>
                      </div>
                    )}
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
