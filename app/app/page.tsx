import { redirect } from "next/navigation"

import { PortalShell } from "src/components/portal/PortalShell"
import { getPortalSession } from "src/lib/auth/session"

export default async function PortalAppPage() {
  const session = await getPortalSession()

  if (!session) {
    redirect("/")
  }

  return <PortalShell session={session} />
}
