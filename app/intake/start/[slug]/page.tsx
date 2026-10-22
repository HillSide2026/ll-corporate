import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { ConflictCheckView } from "src/components/intake/ConflictCheckView"
import { IntakeShell } from "src/components/intake/IntakeShell"
import { getPortalSession } from "src/lib/auth/session"
import { type ConflictRequest, getLatestConflictRequest } from "src/lib/intake/conflictRequestStore"
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

  return (
    <IntakeShell active="browse" wide step={2}>
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
