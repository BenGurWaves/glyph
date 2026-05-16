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
              <p className="text-[13px] text-[var(--text-tertiary)] mt-2">effective date: may 16, 2026 &middot; last updated: may 16, 2026</p>
            </div>

            <div className="flex flex-col gap-6 text-[14px] text-[var(--text-secondary)] leading-relaxed">
              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">1. introduction</h2>
                <p>Glyph (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a product of Calyvent. This Privacy Policy explains how we collect, use, and protect information when you use our QR code platform at glyph.calyvent.com (the &ldquo;Service&rdquo;).</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">2. information we collect</h2>

                <p className="font-medium text-[var(--text-primary)] mt-2">local storage only</p>
                <p>Glyph is a completely free service that stores all data locally on your device. We do not collect or store any personal information on our servers. No account registration, email, or personal data is required.</p>

                <p className="font-medium text-[var(--text-primary)] mt-4">qr code data</p>
                <p>QR codes you create are stored in your browser's local storage. This includes the destination URL, title, short code, style configuration (colors, logo), and creation timestamp. This data never leaves your device unless you choose to download or share it.</p>

                <p className="font-medium text-[var(--text-primary)] mt-4">scan analytics</p>
                <p>Scan analytics are simulated locally for demonstration purposes. Since QR codes are static and point directly to your destination URLs, we do not track actual scans. No scan data is collected or stored on our servers.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">3. how we use information</h2>
                <p>Since all data is stored locally on your device, we do not use any personal information. The Service operates entirely client-side. We do not collect, process, or store any data on our servers.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">4. data storage and security</h2>
                <p>All data is stored in your browser's local storage. This means:</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  <li>Data remains on your device and never leaves it</li>
                  <li>Data is not transmitted to any server</li>
                  <li>Data is deleted if you clear your browser's local storage</li>
                  <li>Data is not accessible from other devices or browsers</li>
                </ul>
                <p className="mt-2">We take no responsibility for data loss due to browser clearing, device loss, or other local factors. We recommend backing up important QR codes by downloading them.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">5. third-party services</h2>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li><strong>Cloudflare</strong> &mdash; hosting and CDN (may collect technical data per their privacy policy)</li>
                </ul>
                <p className="mt-2">No third-party services are used for data storage, authentication, or payments. Each third-party service operates under its own privacy policy.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">6. data retention</h2>
                <p>Data is retained in your browser's local storage until you clear it. Since data is stored locally, you have full control over its retention. Clearing your browser's local storage will delete all QR codes and associated data.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">7. your rights</h2>
                <p>Since data is stored locally on your device, you have full control:</p>
                <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
                  <li>Access your data at any time through the dashboard</li>
                  <li>Delete individual QR codes or all data by clearing local storage</li>
                  <li>Download QR codes as PNG images for backup</li>
                  <li>Export your data by copying from local storage (advanced users)</li>
                </ul>
                <p className="mt-2">No account deletion is required since there is no account.</p>
              </section>

              <section>
                <h2 className="text-[13px] font-medium text-[var(--text-primary)] uppercase tracking-[0.1em] mb-3">8. children&rsquo;s privacy</h2>
                <p>The Service is suitable for all ages. Since we do not collect any personal information and all data is stored locally, there are no special considerations for children.</p>
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
