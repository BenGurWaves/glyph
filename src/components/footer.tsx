import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[var(--text-tertiary)] lowercase tracking-wide">
              glyph&trade; by{" "}
              <Link
                href="https://calyvent.com"
                target="_blank"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors"
              >
                calyvent
              </Link>
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)]">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] no-underline transition-colors lowercase tracking-wide">
              docs
            </Link>
            <a href="https://linkdrop.calyvent.com" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] no-underline transition-colors lowercase tracking-wide">
              linkdrop
            </a>
            <Link href="/legal/terms" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] no-underline transition-colors lowercase tracking-wide">
              terms
            </Link>
            <Link href="/legal/privacy" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] no-underline transition-colors lowercase tracking-wide">
              privacy
            </Link>
            <Link href="/legal/cookies" className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] no-underline transition-colors lowercase tracking-wide">
              cookies
            </Link>
          </div>
        </div>
        <div className="text-[10px] text-[var(--text-tertiary)] lowercase tracking-wide">
          last updated: 2026-03-25
        </div>
      </div>
    </footer>
  );
}
