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
                Glyph is a free QR code generator with built-in scan analytics.
                Generate codes instantly, scan from your camera, and track every
                scan — location, device, time. All for $3/month instead of $49.
              </p>

              {/* Comparison */}
              <div className="module-recessed p-4 inline-flex flex-col gap-1 max-w-xs">
                <div className="flex items-center gap-3">
                  <span className="label">others</span>
                  <span className="text-[14px] line-through text-[var(--text-tertiary)]">
                    $49/month
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="label text-[var(--accent)]">glyph</span>
                  <span className="text-[14px] font-medium">$3/month</span>
                  <span className="led led-active" />
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1 lowercase">
                  same scans. same data. less noise.
                </p>
              </div>
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

            {/* Scan */}
            <div className="module p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="led led-active" />
                <span className="label">scan</span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Point your camera at any QR code. Instant decode, no app needed.
                Works on every device.
              </p>
              <Link
                href="/scan"
                className="keycap keycap-light keycap-sm self-start no-underline"
              >
                open scanner
              </Link>
            </div>

            {/* Track */}
            <div className="module p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="led led-active" />
                <span className="label">track</span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                See who scans your codes. Location, device, browser, time. Real
                data, real-time.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--text-tertiary)] lowercase">
                  pro feature
                </span>
                <span className="text-[11px] text-[var(--accent)] font-medium">
                  $3/mo
                </span>
              </div>
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

        {/* ─── Pricing ─── */}
        <section className="max-w-5xl mx-auto px-6 py-20" id="pricing">
          <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-10">
            Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {/* Free */}
            <div className="module p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[18px] font-medium lowercase">free</span>
                <span className="text-[13px] text-[var(--text-secondary)]">
                  $0 / forever
                </span>
              </div>
              <ul className="flex flex-col gap-2 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  20 qr generations per day
                </li>
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  camera scanner
                </li>
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  3 dynamic (trackable) codes
                </li>
                <li className="flex items-center gap-2">
                  <span className="led" />
                  <span className="text-[var(--text-tertiary)]">
                    scan analytics
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="led" />
                  <span className="text-[var(--text-tertiary)]">
                    custom colors / logo
                  </span>
                </li>
              </ul>
              <Link
                href="/"
                className="keycap keycap-light keycap-md self-start no-underline mt-2"
              >
                start free
              </Link>
            </div>

            {/* Pro */}
            <div className="module-dark p-6 flex flex-col gap-4 text-[var(--text-on-dark)]">
              <div className="flex items-center justify-between">
                <span className="text-[18px] font-medium lowercase">pro</span>
                <span className="text-[13px] text-[var(--text-on-dark-secondary)]">
                  $3 / month
                </span>
              </div>
              <ul className="flex flex-col gap-2 text-[13px]">
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  everything in free
                </li>
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  unlimited dynamic codes
                </li>
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  full scan analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  custom colors and logo
                </li>
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  bulk csv generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="led led-active" />
                  api access
                </li>
              </ul>
              <Link
                href="/pricing"
                className="keycap keycap-accent keycap-md self-start no-underline mt-2"
              >
                go pro — $3/mo
              </Link>
            </div>
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
                q: "How many QR codes can I make for free?",
                a: "20 per day, forever. No email required, no signup wall. If you need more, Pro gives you unlimited for $3/month.",
              },
              {
                q: "What is a dynamic QR code?",
                a: "A dynamic QR code routes through Glyph before reaching your destination. This lets us track every scan — location, device, browser, and time — without changing the printed code.",
              },
              {
                q: "How is this so much cheaper than competitors?",
                a: "We keep it simple. No enterprise sales team, no bloated feature set. QR codes are not complicated technology. We charge what they are worth.",
              },
              {
                q: "Can I use Glyph for my restaurant or business?",
                a: "Absolutely. Most of our users are restaurants, retailers, and event organizers who need QR codes for menus, payments, or check-ins — and want to know how often they get scanned.",
              },
              {
                q: "What payment methods do you accept?",
                a: "CashApp, Bitcoin, Ethereum, and Solana. We are adding Stripe (credit/debit cards) soon.",
              },
              {
                q: "Can I change the destination URL after printing?",
                a: "Yes — that is the point of dynamic codes. Change where your QR code points without reprinting. Your analytics carry over.",
              },
              {
                q: "Is there an API?",
                a: "Pro subscribers get API access for programmatic QR generation and analytics retrieval. Documentation available after signup.",
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
