"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { QRCode, Scan } from "@/lib/supabase";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function QRDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [qr, setQr] = useState<QRCode | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: qrData } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!qrData) {
        router.push("/dashboard");
        return;
      }
      setQr(qrData);

      if (qrData.qr_type === "dynamic") {
        const { data: scanData } = await supabase
          .from("scans")
          .select("*")
          .eq("qr_code_id", id)
          .order("scanned_at", { ascending: false })
          .limit(200);
        setScans(scanData || []);
      }

      setLoading(false);
    };
    init();
  }, [id, router]);

  if (loading || !qr) {
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

  // Analytics aggregations
  const totalScans = scans.length;
  const deviceCounts = scans.reduce((acc, s) => {
    const d = s.device || "unknown";
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryCounts = scans.reduce((acc, s) => {
    const c = s.country || "unknown";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const browserCounts = scans.reduce((acc, s) => {
    const b = s.browser || "unknown";
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const sortedDevices = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]);
  const sortedBrowsers = Object.entries(browserCounts).sort((a, b) => b[1] - a[1]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glyph.calyvent.com";
  const trackingUrl = `${appUrl}/g/${qr.short_code}`;

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="max-w-4xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-8 stagger">
            {/* Back */}
            <Link
              href="/dashboard"
              className="text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline lowercase transition-colors self-start"
            >
              &larr; all codes
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className={`led ${qr.qr_type === "dynamic" ? "led-active" : ""}`} />
                <h1 className="text-[24px] font-medium lowercase">
                  {qr.title || qr.short_code}
                </h1>
              </div>
              <p className="text-[13px] font-mono text-[var(--text-secondary)] break-all">
                {qr.destination_url}
              </p>
              {qr.qr_type === "dynamic" && (
                <div className="module-recessed p-3 mt-2 inline-flex flex-col gap-1 max-w-md">
                  <span className="label">tracking url</span>
                  <code className="font-mono text-[12px] select-all break-all">
                    {trackingUrl}
                  </code>
                </div>
              )}
            </div>

            {/* Analytics */}
            {qr.qr_type === "dynamic" ? (
              <>
                {/* Total scans */}
                <div className="module-dark p-6 text-[var(--text-on-dark)]">
                  <span className="label text-[var(--text-on-dark-secondary)]">total scans</span>
                  <p className="text-[48px] font-medium mt-1">{totalScans}</p>
                </div>

                {/* Breakdown grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Devices */}
                  <div className="module p-5 flex flex-col gap-3">
                    <span className="label">devices</span>
                    {sortedDevices.map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between">
                        <span className="text-[13px] lowercase">{device}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[var(--surface-recessed)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--accent)] rounded-full"
                              style={{ width: `${totalScans ? (count / totalScans) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-[var(--text-secondary)] w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Browsers */}
                  <div className="module p-5 flex flex-col gap-3">
                    <span className="label">browsers</span>
                    {sortedBrowsers.map(([browser, count]) => (
                      <div key={browser} className="flex items-center justify-between">
                        <span className="text-[13px] lowercase">{browser}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[var(--surface-recessed)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--accent)] rounded-full"
                              style={{ width: `${totalScans ? (count / totalScans) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-[var(--text-secondary)] w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Countries */}
                  <div className="module p-5 flex flex-col gap-3">
                    <span className="label">locations</span>
                    {sortedCountries.map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-[13px] uppercase">{country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[var(--surface-recessed)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--accent)] rounded-full"
                              style={{ width: `${totalScans ? (count / totalScans) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-[var(--text-secondary)] w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                    {sortedCountries.length === 0 && (
                      <span className="text-[12px] text-[var(--text-tertiary)]">no scans yet</span>
                    )}
                  </div>
                </div>

                {/* Recent scans table */}
                {scans.length > 0 && (
                  <div className="module p-5">
                    <span className="label mb-4 block">recent scans</span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr className="border-b border-[var(--border-subtle)]">
                            <th className="text-left py-2 font-medium text-[var(--text-secondary)] lowercase">time</th>
                            <th className="text-left py-2 font-medium text-[var(--text-secondary)] lowercase">country</th>
                            <th className="text-left py-2 font-medium text-[var(--text-secondary)] lowercase">device</th>
                            <th className="text-left py-2 font-medium text-[var(--text-secondary)] lowercase">browser</th>
                            <th className="text-left py-2 font-medium text-[var(--text-secondary)] lowercase">os</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scans.slice(0, 20).map((scan) => (
                            <tr key={scan.id} className="border-b border-[var(--border-subtle)]">
                              <td className="py-2 font-mono text-[var(--text-secondary)]">
                                {new Date(scan.scanned_at).toLocaleString()}
                              </td>
                              <td className="py-2 uppercase">{scan.country || "—"}</td>
                              <td className="py-2 lowercase">{scan.device || "—"}</td>
                              <td className="py-2 lowercase">{scan.browser || "—"}</td>
                              <td className="py-2 lowercase">{scan.os || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="module-recessed p-8 flex flex-col items-center gap-3">
                <p className="text-[14px] text-[var(--text-secondary)]">
                  This is a static QR code — no tracking data available.
                </p>
                <p className="text-[12px] text-[var(--text-tertiary)]">
                  Upgrade to a dynamic code to track scans.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
