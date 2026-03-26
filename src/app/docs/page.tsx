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
                Everything you need to know about Glyph — from creating your first
                QR code to using the API programmatically.
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
                  <li>
                    Choose <strong>static</strong> (permanent, no tracking) or{" "}
                    <strong>dynamic</strong> (trackable, editable URL).
                  </li>
                  <li>Click generate. Download as PNG.</li>
                  <li>
                    That&apos;s it. No signup required for static codes.
                  </li>
                </ol>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  static vs dynamic codes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="module-recessed p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="led" />
                      <span className="text-[13px] font-medium lowercase">
                        static
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1 text-[12px] text-[var(--text-secondary)]">
                      <li>Points directly to your URL</li>
                      <li>No tracking or analytics</li>
                      <li>Cannot change URL after creation</li>
                      <li>Free, unlimited</li>
                    </ul>
                  </div>
                  <div className="module-recessed p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="led led-active" />
                      <span className="text-[13px] font-medium lowercase">
                        dynamic
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1 text-[12px] text-[var(--text-secondary)]">
                      <li>Routes through glyph.calyvent.com/g/code</li>
                      <li>Full scan analytics (location, device, time)</li>
                      <li>Change destination URL anytime</li>
                      <li>Free: 3 codes. Pro: unlimited</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  edit a destination url
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Dynamic QR codes can point to a different URL without
                  reprinting. Go to{" "}
                  <strong>Dashboard &rarr; Edit</strong> on any dynamic code,
                  change the destination URL, and save. The QR code image stays
                  the same — only where it redirects changes. All scan history
                  carries over.
                </p>
              </div>
            </div>

            {/* Scan Analytics */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                Scan analytics
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  what we track
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Every time someone scans a dynamic QR code, Glyph records:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "country & city",
                    "device type",
                    "browser",
                    "operating system",
                    "referrer",
                    "timestamp",
                  ].map((item) => (
                    <div
                      key={item}
                      className="module-recessed p-3 text-[12px] text-[var(--text-secondary)] lowercase flex items-center gap-2"
                    >
                      <span className="led led-active" />
                      {item}
                    </div>
                  ))}
                </div>
                <p className="text-[12px] text-[var(--text-tertiary)]">
                  Analytics are available in the dashboard for each dynamic
                  code. Pro subscribers see full history; free users can view
                  analytics for their 3 dynamic codes.
                </p>
              </div>
            </div>

            {/* Customization */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                Customization (Pro)
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  colors and logo
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Pro subscribers can customize QR codes with custom foreground
                  and background colors, upload a logo overlay, or use one of
                  our presets (classic, warm, accent, inverted, forest). Changes
                  are saved and the QR code regenerates instantly.
                </p>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  bulk generation
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Upload a CSV file with URLs to generate multiple QR codes at
                  once. Each row becomes a QR code in your dashboard. Format:
                  one URL per line, or two columns (URL, title).
                </p>
              </div>
            </div>

            {/* API Reference */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                API reference (Pro)
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  authentication
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Generate an API key from{" "}
                  <strong>Dashboard &rarr; API Keys</strong>. Include it in
                  every request:
                </p>
                <div className="module-recessed p-4 overflow-x-auto">
                  <pre className="font-mono text-[12px] text-[var(--text-secondary)] whitespace-pre">
{`Authorization: Bearer YOUR_API_KEY`}
                  </pre>
                </div>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  create a qr code
                </h3>
                <div className="module-recessed p-4 overflow-x-auto">
                  <pre className="font-mono text-[12px] text-[var(--text-secondary)] whitespace-pre">
{`POST https://glyph.calyvent.com/api/v1/qr
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "url": "https://example.com",
  "title": "My Link",
  "dynamic": true
}`}
                  </pre>
                </div>

                <h4 className="text-[13px] font-medium lowercase mt-2">
                  response
                </h4>
                <div className="module-recessed p-4 overflow-x-auto">
                  <pre className="font-mono text-[12px] text-[var(--text-secondary)] whitespace-pre">
{`{
  "id": "uuid",
  "short_code": "abc1234",
  "tracking_url": "https://glyph.calyvent.com/g/abc1234",
  "destination_url": "https://example.com"
}`}
                  </pre>
                </div>

                <h4 className="text-[13px] font-medium lowercase mt-2">
                  parameters
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)]">
                        <th className="text-left py-2 font-medium lowercase text-[var(--text-secondary)]">
                          field
                        </th>
                        <th className="text-left py-2 font-medium lowercase text-[var(--text-secondary)]">
                          type
                        </th>
                        <th className="text-left py-2 font-medium lowercase text-[var(--text-secondary)]">
                          required
                        </th>
                        <th className="text-left py-2 font-medium lowercase text-[var(--text-secondary)]">
                          description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--text-secondary)]">
                      <tr className="border-b border-[var(--border-subtle)]">
                        <td className="py-2 font-mono">url</td>
                        <td className="py-2">string</td>
                        <td className="py-2">yes</td>
                        <td className="py-2">destination URL</td>
                      </tr>
                      <tr className="border-b border-[var(--border-subtle)]">
                        <td className="py-2 font-mono">title</td>
                        <td className="py-2">string</td>
                        <td className="py-2">no</td>
                        <td className="py-2">label for the QR code</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono">dynamic</td>
                        <td className="py-2">boolean</td>
                        <td className="py-2">no</td>
                        <td className="py-2">
                          true for trackable codes (default: false)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  rate limits
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  API requests are not rate-limited for Pro subscribers.
                  Free-tier API access is not available — upgrade to Pro for
                  programmatic access.
                </p>
              </div>
            </div>

            {/* Pricing & Payments */}
            <div className="flex flex-col gap-6">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em]">
                Pricing & payments
              </h2>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  free tier
                </h3>
                <ul className="flex flex-col gap-2 text-[13px] text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />5 QR code generations per day
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />3 dynamic (trackable) codes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />Camera scanner
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />PNG download
                  </li>
                </ul>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  pro — $3/month
                </h3>
                <ul className="flex flex-col gap-2 text-[13px] text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />Unlimited generations and dynamic codes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />Full scan analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />Custom colors and logo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />Edit destination URL anytime
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />Bulk CSV generation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />API access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="led led-active" />No ads or cross-promotions
                  </li>
                </ul>
              </div>

              <div className="module p-6 flex flex-col gap-4">
                <h3 className="text-[16px] font-medium lowercase">
                  payment methods
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  We accept Stripe (credit/debit cards, Apple Pay, Google Pay),
                  CashApp, Bitcoin, Ethereum, and Solana. For crypto payments,
                  send $3 equivalent to the addresses on our pricing page and
                  email hello@calyvent.com with your transaction ID to activate
                  Pro.
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
