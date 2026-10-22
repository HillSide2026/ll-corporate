import Link from "next/link"

import { TERMS_URL } from "src/lib/portal/terms"

/** On every portal page (root layout). The Terms of Use link is required (ML1 2026-10-22). */
export function PortalFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Levine Law</p>
        <nav aria-label="Legal">
          <Link href={TERMS_URL} className="text-brand-navy font-medium underline-offset-4 hover:underline">
            Terms of Use
          </Link>
        </nav>
      </div>
    </footer>
  )
}
