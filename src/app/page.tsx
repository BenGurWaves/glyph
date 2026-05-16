import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { QRGenerator } from "@/components/qr-generator";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1 pt-14">
        {/* ─── Hero ─── */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6 stagger lg:pt-8">
              <h1 className="text-[36px] lg:text-[44px] font-medium leading-[1.15] tracking-tight lowercase">
                scan. track. know.
              </h1>
              <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-md">
                Glyph is a completely free QR code generator with built-in analytics.
                Generate unlimited codes, track every scan — location, device, time.
                All saved to your device. No signup required.
              </p>
            </div>

            {/* Right: QR Generator */}
            <div className="animate-in" style={{ animationDelay: "200ms" }}>
              <QRGenerator />
            </div>
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {/* Generate */}
            <div className="module p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="led led-active" />
                <span className="label">generate</span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Create QR codes instantly. No signup, no limits. Static codes
                free forever.
              </p>
              <div className="module-recessed p-3 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              </div>
            </div>

            {/* Track */}
            <div className="module p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="led led-active" />
                <span className="label">track</span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                See who scans your codes. Location, device, browser, time. Real
                data, real-time. All in your dashboard.
              </p>
            </div>

            {/* Analytics */}
            <div className="module p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="led led-active" />
                <span className="label">analytics</span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                View detailed analytics for each code. Scan counts, geographic
                distribution, device breakdown. All free.
              </p>
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger">
            {[
              { step: "01", title: "paste a url", desc: "Any link. Any page." },
              {
                step: "02",
                title: "get your code",
                desc: "Download PNG or copy SVG.",
              },
              {
                step: "03",
                title: "place it anywhere",
                desc: "Print, screen, packaging.",
              },
              {
                step: "04",
                title: "watch the scans",
                desc: "Real-time analytics dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-2">
                <span className="font-mono text-[12px] text-[var(--accent)]">
                  {item.step}
                </span>
                <span className="text-[15px] font-medium lowercase">
                  {item.title}
                </span>
                <span className="text-[13px] text-[var(--text-secondary)]">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-10">
            Questions
          </h2>
          <div className="flex flex-col gap-4 max-w-2xl">
            {[
              {
                q: "How many QR codes can I make?",
                a: "Unlimited. No daily limits, no email required, no signup. Generate as many as you need, all for free.",
              },
              {
                q: "Where are my QR codes saved?",
                a: "All QR codes are saved to your device's local storage. Your data stays on your device — we don't store anything on our servers.",
              },
              {
                q: "Can I access my QR codes from other devices?",
                a: "No. Since QR codes are saved to your device's local storage, they're only accessible on that device. This is a privacy-first approach.",
              },
              {
                q: "What scan analytics do I get?",
                a: "Full analytics for each QR code: scan counts, location data (country, city), device type, browser, and scan timestamps. All visible in your dashboard.",
              },
              {
                q: "Is this really free?",
                a: "Yes. Completely free. No hidden fees, no premium tiers, no signup required. QR codes and analytics are free forever.",
              },
              {
                q: "Can I use Glyph for my business?",
                a: "Absolutely. Great for restaurants, retailers, event organizers — anyone who needs QR codes with analytics. Just keep in mind codes are saved to your device.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="module p-4 cursor-pointer group"
              >
                <summary className="text-[14px] font-medium lowercase list-none flex items-center justify-between">
                  {faq.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-tertiary)"
                    strokeWidth="2"
                    className="transition-transform group-open:rotate-45 shrink-0 ml-4"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </summary>
                <p className="text-[13px] text-[var(--text-secondary)] mt-3 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
