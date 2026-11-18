import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * The signed-in portal's narrow navy column on the left (ML1 2026-11-18): the only navy once a
 * user is signed in. "Portal" label at the top, navigation in the middle, account actions at the
 * foot. The logo sits top right of the content area instead (PortalLogo).
 * On small screens it becomes a navy bar across the top. Place it in a navy grid cell that
 * runs the full height of the page; the column stays in view as the page scrolls.
 */
export function NavyRail({
  homeHref,
  label = "Portal",
  children,
  footer,
}: {
  homeHref: string
  /** "Client Portal" in the client workspace (ML1 2026-11-18); "Portal" on the lead pages. */
  label?: string
  children?: ReactNode
  footer?: ReactNode
}) {
  return (
    <aside className="bg-brand-navy text-white lg:sticky lg:top-0 lg:h-full lg:max-h-dvh">
      <div className="flex h-full flex-col">
        <div className="px-5 py-4 lg:pt-8 lg:pb-5">
          <Link
            href={homeHref}
            className="text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase hover:text-white"
          >
            {label}
          </Link>
        </div>

        {children ? (
          <nav aria-label="Portal navigation" className="border-t border-white/10 px-3 py-3 lg:flex-1 lg:py-5">
            {children}
          </nav>
        ) : (
          <div className="hidden lg:block lg:flex-1" />
        )}

        {footer ? <div className="p-3">{footer}</div> : null}
      </div>
    </aside>
  )
}

/** One navigation link in the navy column. */
export function NavyRailLink({
  href,
  active = false,
  children,
}: {
  href: string
  active?: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"
      )}
    >
      {children}
    </Link>
  )
}

/** Sign-out button styled for the navy column. */
export const navyRailButton =
  "w-full rounded-md border border-white/20 px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"

/**
 * The rounded-corner Horizontal Logo 600px (POL-050 4.3b), top right of the signed-in content
 * area, its right edge on the right edge of the page text (ML1 2026-11-18).
 */
export function PortalLogo({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Levine Law Portal" className="block">
      <Image
        src="/logos/levine-law-logo-horizontal-rounded.png"
        alt="Levine Law"
        width={580}
        height={300}
        priority
        className="h-12 w-auto"
      />
    </Link>
  )
}
