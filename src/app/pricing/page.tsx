import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Glyph QR Code Platform",
  description:
    "Free QR code generation forever. Pro analytics for $3/month — 90% cheaper than Beaconstac, QR Tiger, and QR Code Generator Pro.",
};

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does Glyph cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Glyph is free for unlimited QR code generation and scanning. Pro analytics costs $3/month — 90% cheaper than competitors like Beaconstac ($49/mo).",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods does Glyph accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Glyph accepts CashApp ($Calyvent), Bitcoin (BTC), Ethereum (ETH), and Solana (SOL). Stripe card payments coming soon.",
      },
    },
  ],
});

export default function PricingPage() {
  return (
    <>
      <Nav />
      <script type="application/ld+json" suppressHydrationWarning>
        {faqJsonLd}
      </script>

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
                    "unlimited static qr codes",
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
                    "unlimited dynamic codes",
                    "full scan analytics",
                    "location, device, time data",
                    "custom colors and logo",
                    "bulk csv generation",
                    "api access",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="led led-active" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 mt-auto">
                  <span className="label text-[var(--text-on-dark-secondary)]">
                    pay with
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <PaymentButton
                      label="cashapp"
                      detail="$Calyvent"
                      href="https://cash.app/$Calyvent"
                    />
                    <PaymentButton
                      label="bitcoin"
                      detail="bc1q...34z9"
                      href="#btc"
                    />
                    <PaymentButton
                      label="ethereum"
                      detail="0xced...0819"
                      href="#eth"
                    />
                    <PaymentButton
                      label="solana"
                      detail="5QHD...vQ3i"
                      href="#sol"
                    />
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
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">
                        tool
                      </th>
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">
                        price
                      </th>
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">
                        tracking
                      </th>
                      <th className="text-left py-3 font-medium lowercase text-[var(--text-secondary)]">
                        scanner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-secondary)]">
                    <tr className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 font-medium text-[var(--text-primary)]">
                        glyph pro
                      </td>
                      <td className="py-3 text-[var(--accent)] font-medium">
                        $3/mo
                      </td>
                      <td className="py-3">
                        <span className="led led-active inline-block" />
                      </td>
                      <td className="py-3">
                        <span className="led led-active inline-block" />
                      </td>
                    </tr>
                    {[
                      { name: "beaconstac", price: "$49/mo" },
                      { name: "qr tiger", price: "$12/mo" },
                      { name: "qr code generator", price: "$15/mo" },
                      { name: "uniqode", price: "$35/mo" },
                    ].map((comp) => (
                      <tr
                        key={comp.name}
                        className="border-b border-[var(--border-subtle)]"
                      >
                        <td className="py-3">{comp.name}</td>
                        <td className="py-3">{comp.price}</td>
                        <td className="py-3">
                          <span className="led led-active inline-block" />
                        </td>
                        <td className="py-3">
                          <span className="led inline-block" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Details */}
            <div className="module p-8" id="btc">
              <h2 className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-6">
                Payment details
              </h2>
              <div className="flex flex-col gap-6">
                <PaymentDetail
                  method="CashApp"
                  value="$Calyvent"
                  instructions='Send $3 to $Calyvent with your email as the note. You will receive access within 1 hour.'
                />
                <PaymentDetail
                  method="Bitcoin (BTC)"
                  value="bc1q956sg5dr8d9m4f23udrjaujvn00dz6fma634z9"
                  instructions="Send $3 equivalent in BTC. Include your email in the transaction memo or email hello@calyvent.com with your transaction ID."
                />
                <PaymentDetail
                  method="Ethereum (ETH)"
                  value="0xced680c6fc75e7b63959f5826489fce866e60819"
                  instructions="Send $3 equivalent in ETH. Email hello@calyvent.com with your transaction hash."
                />
                <PaymentDetail
                  method="Solana (SOL)"
                  value="5QHDcj8tRYe6cYzUBU4q9Ro5kRZ2TqpDMbffdGyevQ3i"
                  instructions="Send $3 equivalent in SOL. Email hello@calyvent.com with your transaction signature."
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PaymentButton({
  label,
  detail,
  href,
}: {
  label: string;
  detail: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="keycap keycap-dark keycap-sm no-underline flex items-center gap-2"
    >
      <span>{label}</span>
      <span className="text-[10px] text-[var(--text-on-dark-secondary)] font-mono">
        {detail}
      </span>
    </a>
  );
}

function PaymentDetail({
  method,
  value,
  instructions,
}: {
  method: string;
  value: string;
  instructions: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] font-medium lowercase">{method}</span>
      <div className="module-recessed p-3">
        <code className="font-mono text-[12px] break-all select-all">
          {value}
        </code>
      </div>
      <p className="text-[12px] text-[var(--text-secondary)]">{instructions}</p>
    </div>
  );
}
