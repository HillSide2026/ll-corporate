import type { Metadata } from "next"

import { IntakeShell } from "src/components/intake/IntakeShell"
import { LeadWelcome } from "src/components/intake/LeadWelcome"
import { getPortalSession } from "src/lib/auth/session"

export const metadata: Metadata = { title: "Welcome" }

export default async function CatalogPage() {
  const session = await getPortalSession()
  const firstName = session?.identity.displayName?.trim().split(/\s+/)[0]

  return (
    <IntakeShell active="browse" wide showProgress={false} bleed>
      <LeadWelcome firstName={firstName} />
    </IntakeShell>
  )
}
