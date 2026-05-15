"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function MaintenanceBanner() {
  return (
    <div className="shrink-0 bg-amber-500 text-[#1A1A1A] text-center py-1.5 px-4 animate-pulse">
      <p className="text-[11px] font-semibold tracking-wide uppercase">
        We are currently updating Glyph. We apologize for any inconvenience — please check back in 24 to 48 hours.
      </p>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "create" },
    { href: "/scan", label: "scan" },
    { href: "/pricing", label: "pricing" },
    { href: "/dashboard", label: "dashboard" },
    { href: "/dashboard/settings", label: "settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <MaintenanceBanner />
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between w-full">
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
