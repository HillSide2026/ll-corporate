import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

import { Eyebrow, NavyPanel } from "src/components/brand/Brand"

/**
 * Sign-in and sign-up layout: a full-height navy brand section on the left meeting a white
 * section with the form on the right. No cards: the contrast between the two sections carries
 * the design (ML1 2026-10-22).
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
    <main className="grid min-h-dvh grid-rows-[auto_1fr] bg-white lg:grid-cols-2 lg:grid-rows-1">
      <NavyPanel bleed className="lg:px-16 lg:py-12">
        <div className="flex h-full flex-col">
          <Link href="/sign-in" aria-label="Levine Law Portal" className="flex w-fit items-center gap-3">
            <Image
              src="/logos/levine-law-wordmark-white-transparent.png"
              alt=""
              width={1080}
              height={600}
              priority
              className="-ml-3 h-14 w-auto lg:h-20"
            />
            <span className="h-6 w-px bg-white/25" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">Portal</span>
          </Link>

          <div className="mt-10 max-w-lg lg:my-auto lg:py-12">
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
        </div>
      </NavyPanel>

      <section className="flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-950">{cardTitle}</h2>
          <div className="mt-6">{children}</div>
          {footer ? (
            <div className="mt-8 space-y-2 border-t border-stone-200 pt-6 text-sm text-stone-500">{footer}</div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
