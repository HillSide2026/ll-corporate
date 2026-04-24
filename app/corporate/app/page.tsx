import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { PortalShell } from "src/components/portal/PortalShell"
import { getPortalSession } from "src/lib/auth/session"

export const metadata: Metadata = {
  title: "Portal Workspace",
}

export default async function PortalAppPage() {
  const session = await getPortalSession()

  if (!session) {
    redirect("/corporate")
  }

  return <PortalShell session={session} />
}
