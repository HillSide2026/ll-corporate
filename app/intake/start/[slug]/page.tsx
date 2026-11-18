import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { ConflictCheckView } from "src/components/intake/ConflictCheckView"
import { IntakeShell } from "src/components/intake/IntakeShell"
import { getPortalSession } from "src/lib/auth/session"
import { normalizeRef, REF_COOKIE } from "src/lib/intake/attribution"
import { type ConflictRequest, getLatestConflictRequest } from "src/lib/intake/conflictRequestStore"
import { recordIntakeEvent } from "src/lib/intake/eventStore"
import { leadServices } from "src/lib/services/leadServices"

export const metadata: Metadata = { title: "Conflict check" }

export const dynamic = "force-dynamic"

type PageProps = { params: Promise<{ slug: string }> }

export default async function ConflictCheckPage({ params }: PageProps) {
  const session = await getPortalSession()
  if (!session?.identity.email) redirect("/sign-in")

  const { slug } = await params
  const service = leadServices.find((s) => s.slug === slug)
  if (!service) notFound()

  let request: ConflictRequest | null = null
  let unavailable = false
  try {
    request = await getLatestConflictRequest(session.identity.subject, service.slug)
  } catch (err) {
    console.error("ConflictCheckPage: conflict request store unavailable", err)
    unavailable = true
  }

  // Funnel measurement: count the lead once per service, even if they never submit
  if (!request && !unavailable) {
    const source = normalizeRef((await cookies()).get(REF_COOKIE)?.value)
    await recordIntakeEvent({
      userId: session.identity.subject,
      serviceSlug: service.slug,
      event: "started",
      source,
    }).catch((err: unknown) => console.warn("ConflictCheckPage: could not record started event", err))
  }

  return (
    <IntakeShell active="browse" wide step={2} bleed>
      <ConflictCheckView
        service={service}
        request={request}
        email={session.identity.email}
        defaultName={session.identity.displayName}
        unavailable={unavailable}
      />
    </IntakeShell>
  )
}
