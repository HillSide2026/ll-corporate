import type { ReactNode } from "react"
import { Check } from "lucide-react"

import { brandCard, Eyebrow, NavyPanel } from "src/components/brand/Brand"
import { cn } from "@/lib/utils"
import { PortalBrandHeader } from "./PortalBrandHeader"

/** Sign-in and sign-up layout: navy brand panel on the left, the form card on the right. */
export function AuthSplit({
  title,
  points,
  cardTitle,
  children,
  footer,
}: {
  title: string
  points?: string[]
  cardTitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="min-h-dvh bg-stone-50">
      <PortalBrandHeader className="max-w-5xl" />

      <div className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-10 sm:py-16 lg:grid-cols-2 lg:items-stretch">
        <NavyPanel className="flex flex-col justify-center">
          <Eyebrow tone="dark" rule>
            Corporate law services
          </Eyebrow>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-white/80">
            Levine Law helps founders and entrepreneurs set up, run and grow their companies on sound legal footing.
          </p>
          {points?.length ? (
            <ul className="mt-8 space-y-3">
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
        </NavyPanel>

        <div className="flex flex-col justify-center">
          <section className={cn(brandCard, "p-7 sm:p-9")}>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-950">{cardTitle}</h2>
            <div className="mt-6">{children}</div>
          </section>
          {footer ? <div className="mt-6 space-y-2 text-center text-sm text-stone-500">{footer}</div> : null}
        </div>
      </div>
    </main>
  )
}
