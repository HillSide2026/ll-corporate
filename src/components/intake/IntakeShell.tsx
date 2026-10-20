import type { ReactNode } from "react"
import { cookies } from "next/headers"

import { PortalBrandHeader } from "src/components/portal/PortalBrandHeader"
import { switchToHubMode } from "src/lib/intake/modeActions"
import { IntakeFunnelBar } from "./IntakeFunnelBar"
import { IntakeHubLayout } from "./IntakeHubLayout"

export type IntakeSection = "browse" | "questionnaire" | "engagement"

export async function IntakeShell({ active = "browse", children }: { active?: IntakeSection; children: ReactNode }) {
  const cookieStore = await cookies()
  const mode = cookieStore.get("intake_mode")?.value === "hub" ? "hub" : "funnel"

  if (mode === "hub") {
    return <IntakeHubLayout active={active}>{children}</IntakeHubLayout>
  }

  return (
    <main className="min-h-dvh bg-stone-50">
      <PortalBrandHeader
        label="Client Intake"
        href="/intake"
        className="max-w-3xl"
        action={
          <form action={switchToHubMode}>
            <button
              type="submit"
              className="text-sm text-stone-500 underline-offset-4 hover:text-stone-950 hover:underline"
            >
              Skip guided setup
            </button>
          </form>
        }
      />

      <IntakeFunnelBar />

      <div className="mx-auto w-full max-w-3xl px-6 py-10">{children}</div>
    </main>
  )
}
