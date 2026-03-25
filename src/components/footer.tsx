import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-[var(--text-tertiary)] lowercase tracking-wide">
            glyph by{" "}
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
        <div className="text-[11px] text-[var(--text-tertiary)] lowercase tracking-wide">
          last updated: 2026-03-25
        </div>
      </div>
    </footer>
  );
}
