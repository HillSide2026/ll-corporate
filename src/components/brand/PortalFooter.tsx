import Link from "next/link"

import { cn } from "@/lib/utils"
import { TERMS_URL } from "src/lib/portal/terms"

/**
 * Layouts that draw the copyright and Terms of Use strip themselves (AuthSplit, the signed-in
 * shells) spread this onto their <main>; the root layout's PortalFooter then hides (rule in
 * styles/tailwind.css).
 */
export const SELF_FOOTED = { "data-self-footed": "" } as const

/** On every portal page (root layout). The Terms of Use link is required (ML1 2026-10-22). */
export function PortalFooter() {
  return (
    <footer data-portal-footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Levine Law</p>
        <TermsLink />
      </div>
    </footer>
  )
}

export function TermsLink() {
  return (
    <nav aria-label="Legal">
      <Link href={TERMS_URL} className="text-brand-navy font-medium underline-offset-4 hover:underline">
        Terms of Use
      </Link>
    </nav>
  )
}

/**
 * Copyright and Terms of Use at the bottom of the signed-in content area, below the page's last
 * section, lined up with the page text (ML1 2026-11-18). `className` sets the column width so the
 * edges match the page above.
 */
export function ContentFooter({
  className,
  outerClassName,
}: {
  className?: string
  /** Background and grid placement of the full-width strip, e.g. grey on the lead pages. */
  outerClassName?: string
}) {
  return (
    <div className={cn("border-t border-stone-200", outerClassName)}>
      <div
        className={cn(
          "mx-auto flex w-full flex-col gap-3 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        <p>© {new Date().getFullYear()} Levine Law</p>
        <TermsLink />
      </div>
    </div>
  )
}
