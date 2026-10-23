import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { cx } from "./PortalDesignSystem"

/**
 * The portal's one brand lockup: the Levine Law serif wordmark, a rule, and the
 * section label. Used by every header and sidebar so the product reads as one.
 */
export function PortalBrandMark({ label = "Portal", href }: { label?: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3" aria-label={`Levine Law ${label}`}>
      <Image
        src="/logos/levine-law-wordmark-navy-transparent.png"
        alt=""
        width={1080}
        height={600}
        priority
        className="-ml-2 h-12 w-auto"
      />
      <span className="h-6 w-px bg-stone-200" aria-hidden="true" />
      <span className="text-xs font-semibold tracking-[0.16em] text-stone-500 uppercase">{label}</span>
    </Link>
  )
}

/** Header for the portal's entry surfaces (sign-in, sign-up, intake). */
export function PortalBrandHeader({
  label = "Portal",
  href = "/sign-in",
  action,
  className,
}: {
  label?: string
  href?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className={cx("mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6", className)}>
        <PortalBrandMark label={label} href={href} />
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  )
}
