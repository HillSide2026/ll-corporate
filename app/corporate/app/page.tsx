import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { PortalShell } from "src/components/portal/PortalShell"
import { getAccessToken, getPortalSession } from "src/lib/auth/session"

export const metadata: Metadata = {
  title: "Portal Workspace",
}

type PortalAppPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PortalAppPage({ searchParams }: PortalAppPageProps) {
  const session = await getPortalSession()

  if (!session) {
    redirect("/corporate")
  }

  const accessToken = await getAccessToken()
  const sp = await searchParams
  const filterState = typeof sp.state === "string" ? sp.state : undefined
  const filterSearch = typeof sp.search === "string" ? sp.search : undefined

  return (
    <PortalShell
      session={session}
      accessToken={accessToken}
      filterState={filterState}
      filterSearch={filterSearch}
    />
  )
}
