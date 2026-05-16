import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-[64px] font-medium lowercase leading-none tracking-tight">
        404
      </h1>
      <p className="text-[16px] text-[var(--text-secondary)] mt-4 max-w-md text-center">
        page not found
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-[8px] text-[14px] font-medium lowercase hover:opacity-90 transition-opacity"
      >
        go home
      </Link>
    </div>
  );
}
