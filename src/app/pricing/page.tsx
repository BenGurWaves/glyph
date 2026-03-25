"use client";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleStripeCheckout = async () => {
    if (!email) {
      setError("Enter your email to continue.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, coupon: coupon.trim() || undefined }),
    });

    const data = await res.json();
    if (data.free) {
      // Coupon accepted — show success, no redirect to Stripe
      setCouponSuccess(true);
      setLoading(false);
    } else if (data.url) {
      window.location.href = data.url;
    } else {
      setError(data.error || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />

      <main className="flex-1 pt-14">
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-12 stagger">
            <div className="flex flex-col gap-3">
              <h1 className="text-[32px] font-medium leading-tight tracking-tight lowercase">
                simple pricing
              </h1>
              <p className="text-[15px] text-[var(--text-secondary)] max-w-md">
                Free forever for generating and scanning. Pro unlocks analytics
                and customization for less than a coffee.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free */}
              <div className="module p-8 flex flex-col gap-5">
                <div>
                  <span className="text-[22px] font-medium lowercase">free</span>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                    forever. no card required.
                  </p>
                </div>
                <div className="text-[32px] font-medium">
                  $0
                  <span className="text-[14px] text-[var(--text-tertiary)] font-normal ml-1">
                    /month
                  </span>
                </div>
                <ul className="flex flex-col gap-3 text-[13px] text-[var(--text-secondary)]">
                  {[
                    "20 qr generations per day",
                    "camera qr scanner",
                    "3 dynamic (trackable) codes",
                    "png download",
                    "no signup required",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="led led-active" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/"
                  className="keycap keycap-light keycap-lg no-underline mt-auto text-center"
                >
                  start free
                </Link>
              </div>

              {/* Pro */}
              <div className="module-dark p-8 flex flex-col gap-5 text-[var(--text-on-dark)]">
                <div>
                  <span className="text-[22px] font-medium lowercase">pro</span>
                  <p className="text-[13px] text-[var(--text-on-dark-secondary)] mt-1">
                    everything you need.
                  </p>
                </div>
                <div className="text-[32px] font-medium">
                  $3
                  <span className="text-[14px] text-[var(--text-on-dark-secondary)] font-normal ml-1">
                    /month
                  </span>
                </div>
                <ul className="flex flex-col gap-3 text-[13px]">
                  {[
                    "everything in free",
                    "unlimited generations",
                    "unlimited dynamic codes",
                    "full scan analytics",
                    "location, device, time data",
                    "custom colors and logo",
                    "bulk csv generation",
                    "api access",
                    "save all codes to account",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="led led-active" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Checkout form */}
                {couponSuccess ? (
                  <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-[#2a2a2a] animate-in">
                    <div className="flex items-center gap-3">
                      <span className="led led-active" />
                      <span className="text-[16px] font-medium">pro activated</span>
                    </div>
                    <p className="text-[13px] text-[var(--text-on-dark-secondary)]">
                      Coupon accepted. Pro features are now active for {email}.
                    </p>
                    <Link
                      href="/login"
                      className="keycap keycap-accent keycap-lg no-underline text-center"
                    >
                      sign in to get started
                    </Link>
                  </div>
                ) : (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#2a2a2a]">
                  <div className="flex flex-col gap-1.5">
                    <span className="label text-[var(--text-on-dark-secondary)]">email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="hw-input !bg-[#2a2a2a] !border-[#3a3a3a] !text-[var(--text-on-dark)] !placeholder-[#666]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="label text-[var(--text-on-dark-secondary)]">coupon code</span>
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="optional"
                      className="hw-input !bg-[#2a2a2a] !border-[#3a3a3a] !text-[var(--text-on-dark)] !placeholder-[#666]"
                    />
                  </div>

                  {error && (
                    <p className="text-[12px] text-[var(--accent)]">{error}</p>
                  )}

                  <button
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="keycap keycap-accent keycap-lg disabled:opacity-50 w-full"
                  >
                    {loading ? "..." : "go pro — $3/mo"}
                  </button>

                  <p className="text-[11px] text-[var(--text-on-dark-secondary)] text-center">
                    powered by stripe. cancel anytime.
                  </p>
                </div>
                )}

                {/* Alternative payments */}
                <div className="flex flex-col gap-3 pt-4 border-t border-[#2a2a2a]">
                  <span className="label text-[var(--text-on-dark-secondary)]">
                    or pay with crypto
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://cash.app/$Calyvent" target="_blank" rel="noopener noreferrer" className="keycap keycap-dark keycap-sm no-underline flex items-center gap-2">
                      <span>cashapp</span>
                      <span className="text-[10px] text-[var(--text-on-dark-secondary)] font-mono">$Calyvent</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="module p-8">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-6">
                Why switch
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">tool</th>
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">price</th>
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">tracking</th>
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">scanner</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-secondary)]">
                    <tr className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 font-medium text-[var(--text-primary)]">glyph pro</td>
                      <td className="py-3 text-[var(--accent)] font-medium">$3/mo</td>
                      <td className="py-3"><span className="led led-active inline-block" /></td>
                      <td className="py-3"><span className="led led-active inline-block" /></td>
                    </tr>
                    {[
                      { name: "beaconstac", price: "$49/mo" },
                      { name: "qr tiger", price: "$12/mo" },
                      { name: "qr code generator", price: "$15/mo" },
                      { name: "uniqode", price: "$35/mo" },
                    ].map((comp) => (
                      <tr key={comp.name} className="border-b border-[var(--border-subtle)]">
                        <td className="py-3">{comp.name}</td>
                        <td className="py-3">{comp.price}</td>
                        <td className="py-3"><span className="led led-active inline-block" /></td>
                        <td className="py-3"><span className="led inline-block" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Crypto Payment Details */}
            <div className="module p-8">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-6">
                Crypto payment details
              </h2>
              <div className="flex flex-col gap-6">
                {[
                  { method: "CashApp", value: "$Calyvent", note: "Send $3 with your email as note." },
                  { method: "Bitcoin (BTC)", value: "bc1q956sg5dr8d9m4f23udrjaujvn00dz6fma634z9", note: "Send $3 equivalent. Email hello@calyvent.com with txn ID." },
                  { method: "Ethereum (ETH)", value: "0xced680c6fc75e7b63959f5826489fce866e60819", note: "Send $3 equivalent. Email hello@calyvent.com with txn hash." },
                  { method: "Solana (SOL)", value: "5QHDcj8tRYe6cYzUBU4q9Ro5kRZ2TqpDMbffdGyevQ3i", note: "Send $3 equivalent. Email hello@calyvent.com with txn sig." },
                ].map((p) => (
                  <div key={p.method} className="flex flex-col gap-2">
                    <span className="text-[14px] font-medium lowercase">{p.method}</span>
                    <div className="module-recessed p-3">
                      <code className="font-mono text-[12px] break-all select-all">{p.value}</code>
                    </div>
                    <p className="text-[12px] text-[var(--text-secondary)]">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
