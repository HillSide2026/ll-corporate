/**
 * Levine Law portal brand primitives. Every lead- and client-facing page builds
 * from these so the portal reads as one product. Rules: docs/BRAND_AND_DESIGN.md.
 */
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Primary action: navy, brightens to brand blue on hover. */
export const brandButton =
  "bg-brand-navy hover:bg-brand-blue focus-visible:ring-brand-blue/40 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"

/** White card on the stone page background. */
export const brandCard = "rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"

/** Small uppercase label above a heading; the coral rule marks the opening of a page. */
export function Eyebrow({
  children,
  tone = "light",
  rule = false,
  className,
}: {
  children: ReactNode
  tone?: "light" | "dark"
  rule?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {rule ? <span className="bg-brand-red h-0.5 w-8" aria-hidden="true" /> : null}
      <p
        className={cn(
          "text-[11px] font-semibold tracking-[0.2em] uppercase",
          tone === "dark" ? "text-white/70" : "text-brand-blue"
        )}
      >
        {children}
      </p>
    </div>
  )
}

/** Navy feature panel with the brand-blue glow and architectural grid. */
export function NavyPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "bg-brand-navy relative overflow-hidden rounded-3xl px-7 py-10 text-white sm:px-12 sm:py-14",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="bg-brand-blue/40 pointer-events-none absolute -top-32 -right-24 size-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [mask-image:linear-gradient(to_left,black,transparent_70%)] [background-size:48px_48px] opacity-[0.07]"
      />
      <div className="relative">{children}</div>
    </section>
  )
}
