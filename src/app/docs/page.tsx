import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-12 stagger">
            <div className="flex flex-col gap-3">
              <h1 className="text-[32px] font-medium leading-tight tracking-tight lowercase">
                documentation
              </h1>
              <p className="text-[15px] text-[var(--text-secondary)] max-w-md">
                Everything you need to know about Glyph — a completely free QR code generator that stores your codes locally on your device.
              </p>
            </div>

            {/* Getting Started */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                Getting started
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  create a qr code
                </h3>
                <ol className="flex flex-col gap-3 text-[13px] text-[var(--text-secondary)] list-decimal list-inside">
                  <li>Paste any URL into the generator on the homepage.</li>
                  <li>Customize colors and add a logo overlay (optional).</li>
                  <li>Click generate. Download as PNG.</li>
                  <li>Save to your dashboard by clicking "save to dashboard".</li>
                </ol>
                <p className="text-[12px] text-[var(--text-tertiary)] mt-2">
                  No signup required. Everything is stored locally on your device.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  how it works
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Glyph generates static QR codes that point directly to your destination URL. There is no server-side routing or tracking. All your QR codes are saved in your browser's local storage, meaning they never leave your device unless you choose to download or share them.
                </p>
              </div>
            </div>

            {/* Dashboard */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                Dashboard
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  viewing your qr codes
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Access your dashboard to see all QR codes you've saved. Each code displays its destination URL, creation date, and scan count. You can download, edit, or delete codes directly from the dashboard.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  editing qr codes
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Click "edit" on any QR code in the dashboard to change its colors, add or remove a logo, or update the destination URL. Changes are saved immediately to your local storage.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  data persistence
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  All data is stored in your browser's local storage. Clearing your browser's data will delete all your saved QR codes. We recommend downloading important QR codes as PNG backups to ensure you don't lose them.
                </p>
              </div>
            </div>

            {/* Customization */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                Customization
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  colors
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Customize the foreground and background colors of your QR code. Choose from our presets (classic, warm, accent, inverted, forest) or pick custom colors using the color picker.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  logo overlay
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Upload a logo image to overlay in the center of your QR code. The logo will be displayed with a background box for readability. Supported formats: PNG, JPG, SVG.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                Frequently asked questions
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  is glyph really free?
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Yes. Glyph is completely free with unlimited QR code generation. No signup, no payment, no limits.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  where are my qr codes stored?
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Your QR codes are stored in your browser's local storage. They never leave your device unless you download or share them. This means you have full control over your data.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  can i access my qr codes on other devices?
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  No. Since data is stored locally, your QR codes are only accessible on the device and browser where you created them. To use QR codes on multiple devices, download them as PNG images.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  does glyph track scans?
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  No. Glyph generates static QR codes that point directly to your destination URL. There is no server-side routing or tracking. The scan count shown in the dashboard is simulated for demonstration purposes.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  what happens if i clear my browser data?
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Clearing your browser's local storage will delete all your saved QR codes. We recommend downloading important QR codes as PNG backups before clearing browser data.
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
