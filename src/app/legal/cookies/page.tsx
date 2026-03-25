import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies Policy — Glyph by Calyvent",
};

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <article className="max-w-2xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-[28px] font-medium lowercase tracking-tight">cookies policy</h1>
              <p className="text-[13px] text-[var(--text-tertiary)] mt-2">effective date: march 25, 2026 &middot; last updated: march 25, 2026</p>
            </div>

            <div className="flex flex-col gap-6 text-[14px] text-[var(--text-secondary)] leading-relaxed">
              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">1. what are cookies</h2>
                <p>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work efficiently and to provide information to site owners.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">2. cookies we use</h2>

                <div className="module-recessed p-4 mt-2">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-2 font-medium text-[var(--text-primary)] lowercase">cookie</th>
                        <th className="text-left py-2 font-medium text-[var(--text-primary)] lowercase">purpose</th>
                        <th className="text-left py-2 font-medium text-[var(--text-primary)] lowercase">type</th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--text-secondary)]">
                      <tr className="border-b border-[var(--border-subtle)]">
                        <td className="py-2 font-mono text-[12px]">sb-*-auth-token</td>
                        <td className="py-2">Authentication session (Supabase)</td>
                        <td className="py-2">Essential</td>
                      </tr>
                      <tr className="border-b border-[var(--border-subtle)]">
                        <td className="py-2 font-mono text-[12px]">__cf_bm</td>
                        <td className="py-2">Bot management (Cloudflare)</td>
                        <td className="py-2">Essential</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-3">We use only <strong>essential cookies</strong> required for the Service to function. We do not use advertising cookies, tracking cookies, or third-party analytics cookies.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">3. local storage</h2>
                <p>We use browser local storage (not cookies) to store:</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  <li>Your daily QR generation count (resets every 24 hours)</li>
                  <li>Authentication session tokens</li>
                </ul>
                <p className="mt-2">This data never leaves your browser and is not transmitted to our servers.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">4. third-party cookies</h2>
                <p>Cloudflare may set essential cookies for security and performance purposes. Stripe may set cookies during the checkout process. These are governed by their respective cookie policies.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">5. managing cookies</h2>
                <p>You can control cookies through your browser settings. Disabling essential cookies may prevent certain features of the Service from functioning properly, particularly authentication.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">6. contact</h2>
                <p>For questions about our use of cookies, contact us at hello@calyvent.com.</p>
              </section>

              <p className="text-[12px] text-[var(--text-tertiary)] pt-4 border-t border-[var(--border-subtle)]">&copy; 2026 Calyvent. All rights reserved. Glyph&trade; is a trademark of Calyvent.</p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
