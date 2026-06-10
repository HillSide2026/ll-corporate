import type { Metadata } from "next"

import { IntakeShell } from "src/components/intake/IntakeShell"
import { EngagementClient } from "src/components/intake/EngagementClient"

export const metadata: Metadata = { title: "Service Engagement" }

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function EngagementPage({ searchParams }: Props) {
  const sp = await searchParams
  const serviceSlug = typeof sp.service === "string" ? sp.service : undefined

  return (
    <IntakeShell active="engagement">
      <EngagementClient serviceSlug={serviceSlug} />
    </IntakeShell>
  )
}
