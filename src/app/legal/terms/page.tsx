import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Glyph by Calyvent",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <article className="max-w-2xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-[28px] font-medium lowercase tracking-tight">terms & conditions</h1>
              <p className="text-[13px] text-[var(--text-tertiary)] mt-2">effective date: march 25, 2026 &middot; last updated: march 25, 2026</p>
            </div>

            <div className="flex flex-col gap-6 text-[14px] text-[var(--text-secondary)] leading-relaxed">
              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">1. acceptance of terms</h2>
                <p>By accessing and using Glyph at glyph.calyvent.com (the &ldquo;Service&rdquo;), you agree to be bound by these Terms and Conditions. Glyph is a product of Calyvent, a holding company. If you do not agree to these Terms, do not use the Service.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">2. description of service</h2>
                <p>Glyph is a QR code platform that allows users to generate, scan, and track QR codes. The Service offers a free tier with limited features and a paid subscription (&ldquo;Pro&rdquo;) with additional capabilities including unlimited generation, scan analytics, custom styling, bulk generation, and API access.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">3. accounts</h2>
                <p>You may use certain features of the Service without creating an account. To access Pro features, save QR codes, or view analytics, you must create an account with a valid email address and password. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">4. free tier</h2>
                <p>The free tier allows up to 20 QR code generations per day, access to the camera scanner, and up to 3 dynamic (trackable) QR codes. Free-tier usage does not require an account. Glyph reserves the right to modify free-tier limits at any time.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">5. pro subscription</h2>
                <p>The Pro subscription is billed monthly at $3.00 USD via Stripe. Alternative payment methods (CashApp, Bitcoin, Ethereum, Solana) are available. Subscriptions auto-renew monthly until cancelled. You may cancel at any time through your payment provider. No refunds are issued for partial billing periods.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">6. intellectual property</h2>
                <p>Glyph&trade; is a trademark of Calyvent. All content on this Service &mdash; including but not limited to text, graphics, logos, icons, images, user interface design, and software &mdash; is the property of Calyvent or its licensors and is protected by United States and international copyright, trademark, and intellectual property laws.</p>
                <p className="mt-2">QR codes you generate using the Service are yours. Glyph does not claim ownership of your content or the QR codes you create.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">7. trademarks</h2>
                <p>&ldquo;Glyph,&rdquo; &ldquo;Calyvent,&rdquo; the Glyph logo, and the Calyvent logo are trademarks of Calyvent. All other trademarks, service marks, and trade names referenced on this Service are the property of their respective owners. You may not use any trademark displayed on this Service without the prior written consent of the trademark owner.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">8. acceptable use</h2>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  <li>Generate QR codes linking to illegal, harmful, or malicious content</li>
                  <li>Distribute malware, phishing links, or deceptive content via QR codes</li>
                  <li>Attempt to gain unauthorized access to the Service or its systems</li>
                  <li>Abuse the API or circumvent rate limits</li>
                  <li>Resell or redistribute the Service without authorization</li>
                </ul>
                <p className="mt-2">Calyvent reserves the right to suspend or terminate accounts that violate these terms without notice.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">9. data and analytics</h2>
                <p>Dynamic QR codes route through Glyph&rsquo;s servers to enable scan tracking. Scan data collected includes approximate location (country/city), device type, browser, operating system, and timestamp. This data is associated with your QR code and accessible through your dashboard. See our Privacy Policy for details.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">10. limitation of liability</h2>
                <p>The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. Calyvent shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service in the twelve months preceding the claim.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">11. termination</h2>
                <p>Calyvent may terminate or suspend your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service ceases immediately. Data associated with terminated accounts may be deleted after a reasonable retention period.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">12. governing law</h2>
                <p>These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or the Service shall be resolved in the courts of competent jurisdiction.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">13. changes to terms</h2>
                <p>Calyvent reserves the right to modify these Terms at any time. Changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date. Continued use of the Service after changes constitutes acceptance of the revised Terms.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">14. contact</h2>
                <p>For questions about these Terms, contact us at hello@calyvent.com.</p>
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
