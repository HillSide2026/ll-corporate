import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

import { Eyebrow, NavyPanel } from "src/components/brand/Brand"
import { SELF_FOOTED } from "src/components/brand/PortalFooter"
import { TERMS_URL } from "src/lib/portal/terms"

/**
 * Sign-in and sign-up layout. A full-height navy section fills the left side; the form sits on
 * white to the right. No cards: the contrast between the two sections carries the design
 * (ML1 2026-10-22). The logo is the rounded-corner Horizontal Logo 600px (POL-050 4.3b, Canva
 * DAHaS2lfANs), with its right edge on the right edge of the form fields. The page ends with
 * the copyright and Terms of Use strip; the navy runs down behind it on the left, and the line
 * above it crosses the whole page, faint white over the navy (ML1 2026-11-18). These pages
 * draw that strip themselves, so the root layout's PortalFooter hides (SELF_FOOTED).
 */
export function AuthSplit({
  eyebrow = "Corporate law services",
  title,
  intro = "Levine Law helps founders and entrepreneurs set up, run and grow their companies on sound legal footing.",
  points,
  cardTitle,
  children,
  footer,
}: {
  /** Shared pages (sign-in) pass neutral wording: leads and clients both see them. */
  eyebrow?: string
  title: string
  intro?: string
  points?: string[]
  cardTitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main {...SELF_FOOTED} className="grid min-h-dvh bg-white lg:grid-cols-2 lg:grid-rows-[1fr_auto]">
      <NavyPanel bleed className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:px-16 lg:py-12">
        <div className="flex h-full max-w-lg flex-col justify-center">
          <Eyebrow tone="dark" rule>
            {eyebrow}
          </Eyebrow>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 hidden text-lg leading-8 text-white/80 sm:block">{intro}</p>
          {points?.length ? (
            <ul className="mt-8 hidden space-y-3 sm:block">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[15px] text-white/90">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </NavyPanel>

      <section className="flex flex-col px-6 pt-8 lg:col-start-2 lg:row-start-1 lg:px-16 lg:pt-10">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
          <div className="flex justify-end">
            <Link href="/sign-in" aria-label="Levine Law Portal" className="block">
              <Image
                src="/logos/levine-law-logo-horizontal-rounded.png"
                alt="Levine Law"
                width={580}
                height={300}
                priority
                className="h-14 w-auto"
              />
            </Link>
          </div>
          <div className="flex flex-1 flex-col justify-center py-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-950">{cardTitle}</h2>
            <div className="mt-6">{children}</div>
            {footer ? (
              <div className="mt-8 space-y-2 border-t border-stone-200 pt-6 text-sm text-stone-500">{footer}</div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-stone-200 px-6 py-6 text-sm text-stone-500 lg:col-start-1 lg:row-start-2 lg:border-white/25 lg:px-16 lg:text-white/60">
        <p>© {new Date().getFullYear()} Levine Law</p>
      </div>
      <div className="px-6 pb-6 text-sm lg:col-start-2 lg:row-start-2 lg:border-t lg:border-stone-200 lg:px-16 lg:py-6">
        <nav aria-label="Legal" className="mx-auto flex w-full max-w-sm lg:justify-end">
          <Link href={TERMS_URL} className="text-brand-navy font-medium underline-offset-4 hover:underline">
            Terms of Use
          </Link>
        </nav>
      </div>
    </main>
  )
}
