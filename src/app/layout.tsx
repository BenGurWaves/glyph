import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Glyph — Free QR Code Generator with Scan Analytics",
  description:
    "Generate, scan, and track QR codes for free. Glyph replaces $49/month QR tools at $3/month. Real-time scan analytics, custom designs, bulk generation. No signup required.",
  keywords: [
    "free QR code generator",
    "QR code analytics",
    "QR code tracker",
    "QR code scanner",
    "beaconstac alternative",
    "cheap QR code tool",
    "QR code with tracking",
  ],
  metadataBase: new URL("https://glyph.calyvent.com"),
  openGraph: {
    title: "Glyph — QR codes that cost less and tell you more",
    description:
      "Free QR code generator with built-in scan analytics. Track every scan — location, device, time. $3/month instead of $49.",
    url: "https://glyph.calyvent.com",
    siteName: "Glyph",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glyph — Free QR Code Generator with Analytics",
    description:
      "Generate, scan, and track QR codes. $3/month replaces $49/month tools.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Glyph",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://glyph.calyvent.com",
  description:
    "Free QR code generator with built-in scan analytics. Generate, scan, and track QR codes. Replaces tools like Beaconstac and QR Tiger at 90% lower cost.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
      description: "Unlimited QR generation and scanning",
    },
    {
      "@type": "Offer",
      price: "3.00",
      priceCurrency: "USD",
      name: "Pro",
      description:
        "Scan analytics, custom colors, logo embedding, bulk generation",
    },
  ],
  creator: {
    "@type": "Organization",
    name: "Calyvent",
    url: "https://calyvent.com",
  },
  datePublished: "2026-03-25",
  dateModified: "2026-03-26",
});

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many QR codes can I make for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "5 per day, forever. No email required, no signup wall. If you need more, Pro gives you unlimited for $3/month.",
      },
    },
    {
      "@type": "Question",
      name: "What is a dynamic QR code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A dynamic QR code routes through Glyph before reaching your destination. This lets us track every scan — location, device, browser, and time — without changing the printed code.",
      },
    },
    {
      "@type": "Question",
      name: "Can I change the destination URL after printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — that is the point of dynamic codes. Change where your QR code points without reprinting. Your analytics carry over.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stripe (credit/debit cards, CashApp, Apple Pay, Google Pay), Bitcoin, Ethereum, and Solana via Coinbase Commerce.",
      },
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script type="application/ld+json" suppressHydrationWarning>{jsonLd}</script>
        <script type="application/ld+json" suppressHydrationWarning>{faqJsonLd}</script>
      </head>
      <body className="min-h-full flex flex-col bg-[var(--surface)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
