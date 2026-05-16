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
              <p className="text-[13px] text-[var(--text-tertiary)] mt-2">effective date: may 16, 2026 &middot; last updated: may 16, 2026</p>
            </div>

            <div className="flex flex-col gap-6 text-[14px] text-[var(--text-secondary)] leading-relaxed">
              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">1. acceptance of terms</h2>
                <p>By accessing and using Glyph at glyph.calyvent.com (the &ldquo;Service&rdquo;), you agree to be bound by these Terms and Conditions. Glyph is a product of Calyvent, a holding company. If you do not agree to these Terms, do not use the Service.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">2. description of service</h2>
                <p>Glyph is a completely free QR code platform that allows users to generate unlimited QR codes. All data is stored locally on your device using browser local storage. No account registration, payment, or personal information is required.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">3. no account required</h2>
                <p>Glyph does not require account creation. All features are available without registration. Since no account is needed, there are no credentials to manage or account deletion processes.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">4. unlimited free use</h2>
                <p>Glyph is completely free with unlimited QR code generation. There are no daily limits, no subscription tiers, and no premium features. All functionality is available to all users at no cost.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">5. local storage</h2>
                <p>QR codes you create are stored in your browser's local storage. This data never leaves your device unless you choose to download or share it. We are not responsible for data loss due to browser clearing, device loss, or other local factors. We recommend backing up important QR codes by downloading them as PNG images.</p>
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
                  <li>Reverse engineer or copy the Service's code or design</li>
                </ul>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">9. static qr codes only</h2>
                <p>All QR codes generated by Glyph are static and point directly to your destination URLs. There is no server-side routing or scan tracking. Analytics displayed in the dashboard are simulated for demonstration purposes only.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">10. limitation of liability</h2>
                <p>The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. Calyvent shall not be liable for any damages arising from your use of the Service, including but not limited to data loss from clearing local storage. Since the Service is free, our total liability is limited to $0.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">11. termination</h2>
                <p>Since no account is required, there is no account to terminate. Calyvent may discontinue or modify the Service at any time with or without notice. You may stop using the Service at any time.</p>
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
