"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/scan", label: "scan" },
    { href: "/pricing", label: "pricing" },
    { href: "/dashboard", label: "dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--text-primary)] no-underline"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span className="text-[15px] font-medium tracking-tight lowercase">
            glyph
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[12px] font-medium tracking-wide lowercase no-underline transition-colors ${
                pathname === link.href
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
