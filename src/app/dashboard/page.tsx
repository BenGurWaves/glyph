"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { generateQRDataURL } from "@/lib/qr";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { getQRCodes, deleteQRCode, type QRCode } from "@/lib/storage";

type StyleConfig = {
  fgColor?: string;
  bgColor?: string;
  logo?: string;
};

async function renderQR(qr: QRCode): Promise<string> {
  return await generateQRDataURL(qr.destinationUrl, {
    width: 300,
    margin: 2,
    color: { dark: "#1A1A1A", light: "#FFFFFF" },
    errorCorrectionLevel: "H",
  });
}

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQrCodes = useCallback(() => {
    const codes = getQRCodes();
    setQrCodes(codes);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQrCodes();
  }, [loadQrCodes]);

  const handleDelete = (id: string) => {
    deleteQRCode(id);
    setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
  };

  const downloadQr = (qr: QRCode, qrImage: string) => {
    const a = document.createElement("a");
    a.href = qrImage;
    a.download = `glyph-${qr.shortCode}.png`;
    a.click();
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
                    onDownload={downloadQr}
                    onDelete={handleDelete}
                    onRenderQR={renderQR}
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
  onDownload,
  onDelete,
  onRenderQR,
}: {
  qr: QRCode;
  qrImage?: string;
  onDownload: (qr: QRCode, qrImage: string) => void;
  onDelete: (id: string) => void;
  onRenderQR: (qr: QRCode) => Promise<string>;
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
          <button onClick={() => onDelete(qr.id)} className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors lowercase">delete</button>
        </div>
      </div>
    </div>
  );
}
