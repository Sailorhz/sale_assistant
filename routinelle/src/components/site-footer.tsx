import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#d8d0c3] px-4 py-6 text-center text-xs text-[#53685d] sm:px-6">
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>
      </nav>
    </footer>
  );
}
