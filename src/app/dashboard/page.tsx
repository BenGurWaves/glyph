"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { QRCode } from "@/lib/supabase";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setQrCodes(data || []);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <>
        <Nav />
        <main className="flex-1 pt-14">
          <div className="max-w-4xl mx-auto px-6 pt-20 flex items-center gap-3">
            <span className="led led-active" />
            <span className="text-[13px] text-[var(--text-secondary)] lowercase">
              loading...
            </span>
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
                <p className="text-[12px] text-[var(--text-secondary)] mt-1">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="keycap keycap-light keycap-sm"
              >
                sign out
              </button>
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
                <p className="text-[14px] text-[var(--text-secondary)]">
                  No QR codes yet.
                </p>
                <Link href="/" className="keycap keycap-accent keycap-md no-underline">
                  create your first
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {qrCodes.map((qr) => (
                  <Link
                    key={qr.id}
                    href={`/dashboard/${qr.id}`}
                    className="module p-4 flex items-center justify-between hover:bg-[var(--surface-mid)] transition-colors no-underline"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`led ${qr.qr_type === "dynamic" ? "led-active" : ""}`}
                      />
                      <div>
                        <p className="text-[14px] font-medium lowercase">
                          {qr.title || qr.short_code}
                        </p>
                        <p className="text-[12px] text-[var(--text-secondary)] font-mono truncate max-w-[300px]">
                          {qr.destination_url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[var(--text-tertiary)] lowercase">
                        {qr.qr_type}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </Link>
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
