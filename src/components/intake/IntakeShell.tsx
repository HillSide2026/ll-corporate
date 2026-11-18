import type { ReactNode } from "react"
import { cookies } from "next/headers"

import { PortalBrandHeader } from "src/components/portal/PortalBrandHeader"
import { cx } from "src/components/portal/PortalDesignSystem"
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
    <main className="min-h-dvh bg-stone-50">
      <PortalBrandHeader
        label="Portal"
        href="/intake"
        className={width}
        action={
          <form action={signOutFromPortal}>
            <button
              type="submit"
              className="text-sm text-stone-500 underline-offset-4 hover:text-stone-950 hover:underline"
            >
              Sign out
            </button>
          </form>
        }
      />

      {showProgress ? <IntakeFunnelBar className={width} currentStep={step} /> : null}

      {bleed ? children : <div className={cx("mx-auto w-full px-6 py-10 sm:py-14", width)}>{children}</div>}
    </main>
  )
}
