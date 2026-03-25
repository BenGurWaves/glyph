import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Glyph by Calyvent",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <article className="max-w-2xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-[28px] font-medium lowercase tracking-tight">privacy policy</h1>
              <p className="text-[13px] text-[var(--text-tertiary)] mt-2">effective date: march 25, 2026 &middot; last updated: march 25, 2026</p>
            </div>

            <div className="flex flex-col gap-6 text-[14px] text-[var(--text-secondary)] leading-relaxed">
              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">1. introduction</h2>
                <p>Glyph (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a product of Calyvent. This Privacy Policy explains how we collect, use, and protect information when you use our QR code platform at glyph.calyvent.com (the &ldquo;Service&rdquo;).</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">2. information we collect</h2>

                <p className="font-medium text-[var(--text-primary)] mt-2">account information</p>
                <p>When you create an account, we collect your email address and an encrypted password. We do not access or store plaintext passwords.</p>

                <p className="font-medium text-[var(--text-primary)] mt-4">qr code data</p>
                <p>When you create QR codes, we store the destination URL, title, short code, style configuration (colors, logo), and creation timestamp. QR codes created without an account are not stored.</p>

                <p className="font-medium text-[var(--text-primary)] mt-4">scan analytics</p>
                <p>When someone scans a dynamic QR code created through Glyph, we collect:</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  <li>Approximate geographic location (country and city, derived from IP via Cloudflare headers &mdash; we do not store IP addresses)</li>
                  <li>Device type (mobile, tablet, or desktop)</li>
                  <li>Browser name and operating system</li>
                  <li>Timestamp of the scan</li>
                  <li>Referrer URL (if available)</li>
                </ul>
                <p className="mt-2">This data is associated with the QR code, not with the person who scanned it. We do not identify or track individual scanners.</p>

                <p className="font-medium text-[var(--text-primary)] mt-4">payment information</p>
                <p>Payment processing is handled by Stripe. We do not store credit card numbers or payment details. We receive only your email address and subscription status from Stripe. For CashApp and cryptocurrency payments, we receive transaction references provided by you.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">3. how we use information</h2>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>To provide and maintain the Service</li>
                  <li>To authenticate your account and manage subscriptions</li>
                  <li>To display scan analytics for your QR codes</li>
                  <li>To process payments and manage billing</li>
                  <li>To communicate service updates (only if necessary)</li>
                </ul>
                <p className="mt-2">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">4. data storage and security</h2>
                <p>Your data is stored in Supabase (PostgreSQL) hosted in the United States. The Service is delivered via Cloudflare Workers with global edge deployment. We use encryption in transit (TLS/SSL) and at rest. Passwords are hashed using bcrypt. API keys are stored as SHA-256 hashes.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">5. third-party services</h2>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li><strong>Cloudflare</strong> &mdash; hosting and CDN (may collect technical data per their privacy policy)</li>
                  <li><strong>Supabase</strong> &mdash; database and authentication</li>
                  <li><strong>Stripe</strong> &mdash; payment processing</li>
                </ul>
                <p className="mt-2">Each third-party service operates under its own privacy policy. We encourage you to review them.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">6. data retention</h2>
                <p>Account data and QR codes are retained for as long as your account is active. Scan analytics data is retained indefinitely for active QR codes. Upon account deletion, your data will be removed within 30 days. Anonymized, aggregate analytics may be retained for operational purposes.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">7. your rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  <li>Access and download your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Object to data processing</li>
                </ul>
                <p className="mt-2">To exercise these rights, contact us at hello@calyvent.com.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">8. children&rsquo;s privacy</h2>
                <p>The Service is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">9. changes to this policy</h2>
                <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the Service constitutes acceptance of the revised policy.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">10. contact</h2>
                <p>For privacy-related inquiries, contact us at hello@calyvent.com.</p>
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
