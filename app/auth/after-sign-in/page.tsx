import { redirect } from "next/navigation"

import { getPortalSession, isWorkspacePortalSession } from "src/lib/auth/session"
import { findLeadService } from "src/lib/services/leadServices"

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> }

export default async function AfterSignInPage({ searchParams }: PageProps) {
  const session = await getPortalSession()

  if (!session) {
    redirect("/sign-in")
  }

  if (isWorkspacePortalSession(session)) {
    redirect("/corporate/app")
  }

  // A lead who arrived by a service entry link goes straight to that service
  const params = await searchParams
  const service = findLeadService(typeof params?.service === "string" ? params.service : undefined)
  redirect(service ? `/intake/start/${service.slug}` : "/intake")
}
