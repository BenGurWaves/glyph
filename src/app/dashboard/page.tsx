"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { generateQRDataURL } from "@/lib/qr";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { getQRCodes, deleteQRCode, updateQRCode, getQRCodeScans, type QRCode } from "@/lib/storage";

type StyleConfig = {
  fgColor?: string;
  bgColor?: string;
  logo?: string;
};

async function renderQR(qr: QRCode): Promise<string> {
  const fgColor = qr.styleConfig?.fgColor || "#1A1A1A";
  const bgColor = qr.styleConfig?.bgColor || "#FFFFFF";
  const logo = qr.styleConfig?.logo;

  const baseQR = await generateQRDataURL(qr.destinationUrl, {
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
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFg, setEditFg] = useState("#1A1A1A");
  const [editBg, setEditBg] = useState("#FFFFFF");
  const [editLogo, setEditLogo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const loadQrCodes = useCallback(async () => {
    const codes = await getQRCodes();
    // Load scans for each code
    const codesWithScans = await Promise.all(
      codes.map(async (qr) => ({
        ...qr,
        scans: await getQRCodeScans(qr.id),
      }))
    );
    setQrCodes(codesWithScans);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQrCodes();
  }, [loadQrCodes]);

  const handleDelete = async (id: string) => {
    await deleteQRCode(id);
    setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
  };

  const downloadQr = (qr: QRCode, qrImage: string) => {
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = `glyph-${qr.shortCode}.png`;
    a.click();
  };

  const startEdit = (qr: QRCode) => {
    setEditingId(qr.id);
    setEditFg(qr.styleConfig?.fgColor || "#1A1A1A");
    setEditBg(qr.styleConfig?.bgColor || "#FFFFFF");
    setEditLogo(qr.styleConfig?.logo || null);
    setEditUrl(qr.destinationUrl);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const saveEdit = async (qr: QRCode) => {
    setSaving(true);
    const newConfig: StyleConfig = { fgColor: editFg, bgColor: editBg };
    if (editLogo) newConfig.logo = editLogo;

    // Update in Supabase
    await updateQRCode(qr.id, {
      styleConfig: newConfig,
      destinationUrl: editUrl,
      qr_image: qr.qr_image,
    });

    // Re-render QR with new config
    const updatedQr = { ...qr, styleConfig: newConfig, destinationUrl: editUrl };
    const newImage = await renderQR(updatedQr);

    // Update state with both the new config and new image
    setQrCodes((prev) =>
      prev.map((q) =>
        q.id === qr.id ? { ...updatedQr, qr_image: newImage, styleConfig: newConfig, destinationUrl: editUrl } : q
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
                <p className="text-[12px] text-[var(--text-secondary)] mt-1">
                  your qr codes. saved locally.
                </p>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">total codes</span>
                <span className="text-[24px] font-medium">{qrCodes.length}</span>
              </div>
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">total scans</span>
                <span className="text-[24px] font-medium">{qrCodes.reduce((sum, q) => sum + q.scans.length, 0)}</span>
              </div>
              <div className="module-recessed p-4 flex flex-col gap-1">
                <span className="label">storage</span>
                <span className="text-[24px] font-medium">local</span>
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
                  <QRCodeItem
                    key={qr.id}
                    qr={qr}
                    qrImage={qr.qr_image}
                    editingId={editingId}
                    editFg={editFg}
                    editBg={editBg}
                    editLogo={editLogo}
                    editUrl={editUrl}
                    saving={saving}
                    logoInputRef={logoInputRef}
                    onDownload={downloadQr}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                    onSaveEdit={saveEdit}
                    onLogoUpload={handleLogoUpload}
                    onSetEditFg={setEditFg}
                    onSetEditBg={setEditBg}
                    onSetEditLogo={setEditLogo}
                    onSetEditUrl={setEditUrl}
                    onSetEditingId={setEditingId}
                    onRenderQR={renderQR}
                    onSetQrCodes={setQrCodes}
                  />
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

function QRCodeItem({
  qr,
  qrImage,
  editingId,
  editFg,
  editBg,
  editLogo,
  editUrl,
  saving,
  logoInputRef,
  onDownload,
  onEdit,
  onDelete,
  onSaveEdit,
  onLogoUpload,
  onSetEditFg,
  onSetEditBg,
  onSetEditLogo,
  onSetEditUrl,
  onSetEditingId,
  onRenderQR,
  onSetQrCodes,
}: {
  qr: QRCode;
  qrImage?: string;
  editingId: string | null;
  editFg: string;
  editBg: string;
  editLogo: string | null;
  editUrl: string;
  saving: boolean;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  onDownload: (qr: QRCode, qrImage: string) => void;
  onEdit: (qr: QRCode) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (qr: QRCode) => Promise<void>;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetEditFg: (val: string) => void;
  onSetEditBg: (val: string) => void;
  onSetEditLogo: (val: string | null) => void;
  onSetEditUrl: (val: string) => void;
  onSetEditingId: (val: string | null) => void;
  onRenderQR: (qr: QRCode) => Promise<string>;
  onSetQrCodes: React.Dispatch<React.SetStateAction<QRCode[]>>;
}) {
  const [localQrImage, setLocalQrImage] = useState<string | undefined>(qrImage);

  useEffect(() => {
    if (!qrImage) {
      onRenderQR(qr).then(setLocalQrImage);
    }
  }, [qr, qrImage, onRenderQR]);

  return (
    <div className="module p-5 flex flex-col gap-4">
      <div className="flex gap-4">
        {/* QR Preview */}
        {localQrImage && (
          <div className="module-recessed p-2 shrink-0 flex items-center justify-center" style={{ width: 80, height: 80 }}>
            <img src={localQrImage} alt="QR code" width={64} height={64} />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="led led-active" />
            <span className="text-[14px] font-medium lowercase truncate">{qr.title || qr.shortCode}</span>
          </div>
          <p className="text-[12px] font-mono text-[var(--text-secondary)] truncate">{qr.destinationUrl}</p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-[11px] text-[var(--text-secondary)]">{qr.scans.length} {qr.scans.length === 1 ? "scan" : "scans"}</span>
            <span className="text-[11px] text-[var(--text-tertiary)]">{new Date(qr.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          {localQrImage && (
            <button onClick={() => onDownload(qr, localQrImage)} className="keycap keycap-light keycap-sm">download</button>
          )}
          <button
            onClick={() => editingId === qr.id ? onSetEditingId(null) : onEdit(qr)}
            className="keycap keycap-dark keycap-sm"
          >
            {editingId === qr.id ? "close" : "edit"}
          </button>
          <button onClick={() => onDelete(qr.id)} className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors lowercase">delete</button>
        </div>
      </div>

      {/* Edit Panel */}
      {editingId === qr.id && (
        <div className="module-recessed p-4 flex flex-col gap-4 animate-in">
          <span className="label">customize qr code</span>

          {/* Destination URL */}
          <div className="flex flex-col gap-1.5">
            <span className="label">destination url</span>
            <input
              type="url"
              value={editUrl}
              onChange={(e) => onSetEditUrl(e.target.value)}
              placeholder="https://example.com"
              className="hw-input font-mono text-[12px]"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="label">code color</span>
              <div className="flex items-center gap-2">
                <input type="color" value={editFg} onChange={(e) => onSetEditFg(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]" style={{ padding: 0 }} />
                <span className="font-mono text-[11px] text-[var(--text-secondary)]">{editFg}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="label">background</span>
              <div className="flex items-center gap-2">
                <input type="color" value={editBg} onChange={(e) => onSetEditBg(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-[var(--border)]" style={{ padding: 0 }} />
                <span className="font-mono text-[11px] text-[var(--text-secondary)]">{editBg}</span>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex flex-col gap-1.5">
            <span className="label">logo overlay</span>
            <div className="flex items-center gap-3">
              <input ref={logoInputRef} type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />
              <button onClick={() => logoInputRef.current?.click()} className="keycap keycap-light keycap-sm">
                {editLogo ? "change logo" : "upload logo"}
              </button>
              {editLogo && (
                <>
                  <img src={editLogo} alt="Logo" className="w-8 h-8 rounded object-cover border border-[var(--border)]" />
                  <button onClick={() => onSetEditLogo(null)} className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)]">remove</button>
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
              <button key={p.name} onClick={() => { onSetEditFg(p.fg); onSetEditBg(p.bg); }} className="keycap keycap-light keycap-sm">
                <span className="w-3 h-3 rounded-sm mr-1.5 border border-[var(--border)] inline-block" style={{ background: p.fg }} />
                {p.name}
              </button>
            ))}
          </div>

          <button onClick={() => onSaveEdit(qr)} disabled={saving} className="keycap keycap-accent keycap-md self-start disabled:opacity-50">
            {saving ? "saving..." : "save changes"}
          </button>
        </div>
      )}
    </div>
  );
}
