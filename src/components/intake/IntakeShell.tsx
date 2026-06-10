import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { signOutFromPortal } from "src/lib/auth/actions"
import { switchToFunnelMode, switchToHubMode } from "src/lib/intake/modeActions"
import { cx } from "src/components/portal/PortalDesignSystem"
import { IntakeFunnelBar } from "./IntakeFunnelBar"

export type IntakeSection = "browse" | "questionnaire" | "engagement"

const hubNavItems: Array<{ key: IntakeSection; label: string; href: string; marker: string }> = [
  { key: "browse", label: "Browse", href: "/intake/catalog", marker: "B" },
  { key: "questionnaire", label: "My Intake", href: "/intake/questionnaire", marker: "I" },
  { key: "engagement", label: "Engagement", href: "/intake/engagement", marker: "E" },
]

export async function IntakeShell({
  active = "browse",
  children,
}: {
  active?: IntakeSection
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const mode = cookieStore.get("intake_mode")?.value === "hub" ? "hub" : "funnel"

  if (mode === "hub") {
    return (
      <main className="min-h-dvh bg-stone-100 text-stone-950">
        <div className="grid min-h-dvh lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-stone-200 bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
            <div className="flex h-full flex-col">
              <div className="border-b border-stone-100 px-5 py-5">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/logos/levine-law-icon-navy.png"
                    alt="Levine Law"
                    width={500}
                    height={500}
                    className="h-9 w-9 rounded-md border border-stone-200 bg-white"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-950">Levine Law</p>
                    <p className="text-xs text-stone-500">Client Intake</p>
                  </div>
                </Link>
              </div>

              <nav aria-label="Intake navigation" className="flex-1 px-3 py-4">
                <p className="px-3 text-xs font-semibold tracking-[0.16em] text-stone-400 uppercase">Intake</p>
                <ul className="mt-3 space-y-1">
                  {hubNavItems.map((item) => {
                    const isActive = active === item.key
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cx(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-brand-navy text-white shadow-sm"
                              : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                          )}
                        >
                          <span
                            className={cx(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[11px] font-semibold",
                              isActive
                                ? "border-white/20 bg-white/10 text-white"
                                : "border-stone-200 bg-white text-brand-navy"
                            )}
                            aria-hidden="true"
                          >
                            {item.marker}
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-6">
                  <form action={switchToFunnelMode}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
                    >
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-stone-200 bg-white text-[11px] font-semibold text-stone-400"
                        aria-hidden="true"
                      >
                        G
                      </span>
                      Guided setup
                    </button>
                  </form>
                </div>
              </nav>

              <div className="border-t border-stone-100 p-3">
                <form action={signOutFromPortal}>
                  <button
                    type="submit"
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:border-stone-400"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </aside>

          <section className="min-w-0">
            <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
              <div className="flex min-h-14 items-center px-5 py-3 md:px-8">
                <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">
                  Client Intake Workspace
                </p>
              </div>
            </header>
            <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-8">{children}</div>
          </section>
        </div>
      </main>
    )
  }

  // Funnel mode
  return (
    <main className="min-h-dvh bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src="/logos/levine-law-wordmark-navy-transparent-2.png"
              alt="Levine Law"
              width={1080}
              height={600}
              className="h-8 w-auto"
            />
          </Link>
          <form action={switchToHubMode}>
            <button
              type="submit"
              className="text-sm text-stone-400 underline-offset-2 hover:text-stone-600 hover:underline"
            >
              Explore freely
            </button>
          </form>
        </div>
      </header>

      <IntakeFunnelBar />

      <div className="mx-auto w-full max-w-3xl px-6 py-10">{children}</div>
    </main>
  )
}
