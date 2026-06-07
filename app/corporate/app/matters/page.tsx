import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { MatterList } from "src/components/portal/MatterList"
import { PortalButton, PortalCard, PortalCardContent, PortalPageHeader } from "src/components/portal/PortalDesignSystem"
import { PortalWorkspaceShell } from "src/components/portal/PortalWorkspaceShell"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getAccessToken, getPortalSession } from "src/lib/auth/session"

export const metadata: Metadata = { title: "Matters" }

export const dynamic = "force-dynamic"

type MattersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function MatterListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading matters">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-20 animate-pulse rounded-lg border border-stone-200 bg-white" />
      ))}
    </div>
  )
}

export default async function MattersPage({ searchParams }: MattersPageProps) {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) redirect("/sign-in")

  const accessToken = await getAccessToken()
  const params = await searchParams
  const filterState = typeof params.state === "string" ? params.state : undefined
  const filterSearch = typeof params.search === "string" ? params.search : undefined

  return (
    <PortalWorkspaceShell active="matters" session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Matters"
          title="Matters"
          description="Review active and pending matters, next actions, status, and ownership."
          action={<PortalButton href="/corporate/app/requests/new">Open a matter</PortalButton>}
        />

        <PortalCard>
          <PortalCardContent>
            <form method="GET" action="/corporate/app/matters" className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <label>
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">
                  Status
                </span>
                <select
                  name="state"
                  defaultValue={filterState ?? ""}
                  className="focus:border-brand-navy focus:ring-brand-navy w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:ring-1 focus:outline-none"
                >
                  <option value="">All matters</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">
                  Search
                </span>
                <input
                  type="search"
                  name="search"
                  defaultValue={filterSearch ?? ""}
                  placeholder="Search by matter, type, or next action"
                  className="focus:border-brand-navy focus:ring-brand-navy w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:outline-none"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-brand-navy hover:bg-brand-navy-dark w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors md:w-auto"
                >
                  Apply
                </button>
              </div>
            </form>
          </PortalCardContent>
        </PortalCard>

        <Suspense fallback={<MatterListSkeleton />}>
          <MatterList accessToken={accessToken} filterState={filterState} filterSearch={filterSearch} />
        </Suspense>
      </div>
    </PortalWorkspaceShell>
  )
}
