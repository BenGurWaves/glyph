"use client";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || null);
        setEmail(user.email || "");
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();
        setCurrentPlan(sub?.plan === "pro" ? "pro" : "free");
      }
    });
  }, []);

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
                    "5 qr generations per day",
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
              <div className="module-dark p-8 flex flex-col gap-5 text-[var(--text-on-dark)] relative">
                {currentPlan === "pro" && (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="led led-active" />
                    <span className="text-[11px] font-medium text-[var(--accent)]">current plan</span>
                  </div>
                )}
                <div>
                  <span className="text-[22px] font-medium lowercase">pro</span>
                  <p className="text-[13px] text-[var(--text-on-dark-secondary)] mt-1">
                    {currentPlan === "pro" ? `active — ${userEmail}` : "everything you need."}
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
                    "edit destination url anytime",
                    "no ads or cross-promotions",
                    "save all codes to account",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="led led-active" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Checkout form */}
                {currentPlan === "pro" ? (
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                      <span className="led led-active" />
                      <span className="text-[14px] font-medium">you are on pro</span>
                    </div>
                    <p className="text-[12px] text-[var(--text-on-dark-secondary)]">
                      billed monthly. manage your account in the dashboard.
                    </p>
                    <Link href="/dashboard" className="keycap keycap-accent keycap-lg no-underline text-center">
                      go to dashboard
                    </Link>
                  </div>
                ) : couponSuccess ? (
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
                  <p className="text-[11px] text-[var(--text-on-dark-secondary)]">
                    bitcoin, ethereum, solana, and more via coinbase commerce
                  </p>
                  <button
                    onClick={async () => {
                      if (!email) { setError("Enter your email first."); return; }
                      setLoading(true);
                      setError(null);
                      const res = await fetch("/api/checkout/crypto", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                      });
                      const data = await res.json();
                      if (data.url) {
                        window.location.href = data.url;
                      } else {
                        setError(data.error || "Crypto checkout failed.");
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="keycap keycap-dark keycap-md disabled:opacity-50 w-full"
                  >
                    {loading ? "..." : "pay with crypto — $3"}
                  </button>
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
                How crypto payments work
              </h2>
              <div className="flex flex-col gap-4">
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Crypto payments are processed through Coinbase Commerce. Click
                  &ldquo;pay with crypto&rdquo; above, choose your preferred
                  cryptocurrency (Bitcoin, Ethereum, Solana, and more), and
                  complete the payment. Your Pro subscription activates
                  automatically once the transaction confirms on-chain.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {["bitcoin", "ethereum", "solana"].map((coin) => (
                    <div key={coin} className="module-recessed p-3 flex items-center gap-2">
                      <span className="led led-active" />
                      <span className="text-[12px] text-[var(--text-secondary)] lowercase">{coin}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  No manual email required. Payment verification is fully automated.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
