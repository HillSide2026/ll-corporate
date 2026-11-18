import type { ReactNode } from "react"
import { cookies } from "next/headers"

import { NavyRail, navyRailButton, NavyRailLink, PortalLogo } from "src/components/portal/NavyRail"
import { cx } from "src/components/portal/PortalDesignSystem"
import { ContentFooter, SELF_FOOTED } from "src/components/brand/PortalFooter"
import { signOutFromPortal } from "src/lib/auth/actions"
import { IntakeFunnelBar } from "./IntakeFunnelBar"
import { IntakeHubLayout } from "./IntakeHubLayout"

export type IntakeSection = "browse" | "questionnaire" | "engagement"

export async function IntakeShell({
  active = "browse",
  wide = false,
  showProgress = true,
  bleed = false,
  step,
  children,
}: {
  active?: IntakeSection
  wide?: boolean
  showProgress?: boolean
  /** Full-width page: children lay out their own sections and containers. */
  bleed?: boolean
  /** Progress bar stage; set explicitly by each page. */
  step?: number
  children: ReactNode
}) {
  const cookieStore = await cookies()
  const mode = cookieStore.get("intake_mode")?.value === "hub" ? "hub" : "funnel"

  if (mode === "hub") {
    return <IntakeHubLayout active={active}>{children}</IntakeHubLayout>
  }

  const width = wide ? "max-w-5xl" : "max-w-3xl"

  return (
    <main {...SELF_FOOTED} className="min-h-dvh bg-white lg:grid lg:grid-cols-[232px_1fr] lg:grid-rows-[1fr_auto]">
      {/* The footer line crosses the whole page, faint over the navy; Sign out sits above it and
          comes into view at the bottom of the page. The footer is grey, as the FAQs (ML1 2026-11-18). */}
      <div className="bg-brand-navy lg:col-start-1 lg:row-start-1">
        <NavyRail
          homeHref="/intake"
          footerAtPageEnd
          footer={
            <form action={signOutFromPortal}>
              <button type="submit" className={navyRailButton}>
                Sign out
              </button>
            </form>
          }
        >
          <NavyRailLink href="/intake/catalog" active={active === "browse"}>
            Services
          </NavyRailLink>
        </NavyRail>
      </div>

      <div className="flex min-w-0 flex-col lg:col-start-2 lg:row-start-1">
        <div className={cx("mx-auto flex w-full justify-end px-6 pt-6", bleed ? "max-w-5xl" : width)}>
          <PortalLogo href="/intake" />
        </div>

        {showProgress ? <IntakeFunnelBar className={width} currentStep={step} /> : null}

        <div className="flex-1">
          {bleed ? children : <div className={cx("mx-auto w-full px-6 py-10 sm:py-14", width)}>{children}</div>}
        </div>
      </div>

      <div className="bg-brand-navy hidden border-t border-white/25 lg:col-start-1 lg:row-start-2 lg:block" />
      <ContentFooter
        className={cx("px-6", bleed ? "max-w-5xl" : width)}
        outerClassName="bg-stone-50 lg:col-start-2 lg:row-start-2"
      />
    </main>
  )
}
