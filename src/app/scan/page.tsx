"use client";

import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function ScanPage() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef<unknown>(null);

  const startScanner = async () => {
    if (scanning) return;
    setError(null);
    setResult(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          setResult(decodedText);
          scanner.stop().catch(() => {});
          setScanning(false);
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError(
        "Could not access camera. Please allow camera permissions and try again."
      );
      console.error(err);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      const scanner = html5QrCodeRef.current as { stop: () => Promise<void> };
      await scanner.stop().catch(() => {});
      html5QrCodeRef.current = null;
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const isUrl = result && /^https?:\/\//i.test(result);

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="max-w-lg mx-auto px-6 pt-20 pb-16">
          <div className="flex flex-col gap-6 stagger">
            <h1 className="text-[28px] font-medium leading-tight tracking-tight lowercase">
              scan a qr code
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)]">
              Point your camera at any QR code. Instant decode, no app required.
            </p>

            {/* Scanner viewport */}
            <div className="module-recessed overflow-hidden" style={{ minHeight: 300 }}>
              <div id="qr-reader" ref={scannerRef} className="w-full" />
              {!scanning && !result && (
                <div className="flex items-center justify-center p-12">
                  <button
                    onClick={startScanner}
                    className="keycap keycap-accent keycap-lg"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="mr-2"
                    >
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    start camera
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="module p-4 border-l-2 border-[var(--accent)]">
                <p className="text-[13px] text-[var(--text-secondary)]">
                  {error}
                </p>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="module p-6 flex flex-col gap-4 animate-in">
                <div className="flex items-center gap-3">
                  <span className="led led-active" />
                  <span className="label">decoded</span>
                </div>

                <div className="module-recessed p-4">
                  <p className="font-mono text-[13px] break-all">{result}</p>
                </div>

                <div className="flex gap-3">
                  {isUrl && (
                    <a
                      href={result}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="keycap keycap-accent keycap-md no-underline"
                    >
                      open link
                    </a>
                  )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                    }}
                    className="keycap keycap-light keycap-md"
                  >
                    copy
                  </button>
                  <button
                    onClick={() => {
                      setResult(null);
                      startScanner();
                    }}
                    className="keycap keycap-dark keycap-md"
                  >
                    scan again
                  </button>
                </div>
              </div>
            )}

            {/* Scanning indicator */}
            {scanning && (
              <div className="flex items-center gap-3 justify-center">
                <span className="led led-active" />
                <span className="text-[12px] text-[var(--text-secondary)] lowercase">
                  scanning...
                </span>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
