import Link from "next/link"
import { Suspense } from "react"

import type { CaseInstance } from "src/lib/contracts"
import type { PortalSession } from "src/lib/auth/session"
import { getCounselProfile } from "src/lib/portal/counselProfileSource"
import { getDocumentList } from "src/lib/portal/documentSource"
import { getMatterList } from "src/lib/portal/matterSource"
import { getMatterRequests } from "src/lib/portal/matterRequestStore"
import { getRequests } from "src/lib/portal/requestStore"
import {
  PortalBadge,
  PortalButton,
  PortalCard,
  PortalCardContent,
  PortalCardDescription,
  PortalCardHeader,
  PortalCardTitle,
  PortalEmptyState,
  PortalPageHeader,
  PortalStatCard,
} from "./PortalDesignSystem"
import { PortalWorkspaceShell } from "./PortalWorkspaceShell"

type PortalShellProps = {
  session: PortalSession
  previewMode?: boolean
  accessToken?: string | null
  filterState?: string
  filterSearch?: string
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "No date"
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { month: "short", day: "numeric" })
}

function statusTone(state: CaseInstance["matterState"]): "navy" | "gold" | "green" | "neutral" {
  switch (state) {
    case "Active":
      return "navy"
    case "Pending":
      return "gold"
    case "Closed":
    case "Archived":
      return "neutral"
    default:
      return "neutral"
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-32 animate-pulse rounded-lg border border-stone-200 bg-white" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="h-80 animate-pulse rounded-lg border border-stone-200 bg-white" />
        <div className="h-80 animate-pulse rounded-lg border border-stone-200 bg-white" />
      </div>
    </div>
  )
}

async function DashboardContent({ accessToken, session }: { accessToken: string | null; session: PortalSession }) {
  const { matters, isMock: mattersMock } = await getMatterList(accessToken)
  const { documents: lawyerDocs, isMock: documentsMock } = await getDocumentList()
  const serviceRequests = await getRequests(session.identity)
  const matterRequests = await getMatterRequests(session.identity)
  const { profile, isMock: profileMock } = getCounselProfile()

  const allDocs = lawyerDocs.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())

  const activeMatters = matters.filter((matter) => matter.matterState === "Active")
  const openMatterRequests = matterRequests.filter(
    (request) => request.status === "Received" || request.status === "In Review"
  )
  const openServiceRequests = serviceRequests.filter((request) => request.status !== "Complete")
  const actionNeeded = matters.filter((matter) => matter.nextActionOwnerType === "Client")
  const recentActivity = [
    ...allDocs.slice(0, 3).map((doc) => ({
      id: `doc-${doc.id}`,
      title: doc.filename,
      meta: `Document added to ${doc.matterKey}`,
      date: doc.addedAt,
    })),
    ...matterRequests.slice(0, 2).map((request) => ({
      id: `matter-request-${request.id}`,
      title: request.category,
      meta: `Matter request ${request.status.toLowerCase()}`,
      date: request.submittedAt,
    })),
    ...serviceRequests.slice(0, 2).map((request) => ({
      id: `service-request-${request.id}`,
      title: request.contract.serviceTitle,
      meta: `Service request ${request.status.toLowerCase()}`,
      date: request.contract.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {mattersMock || documentsMock || profileMock ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Preview data is visible until the production matter, document, and contact sources are connected.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard
          label="Active matters"
          value={activeMatters.length}
          detail="Open work currently in progress."
          tone="navy"
        />
        <PortalStatCard
          label="Open requests"
          value={openMatterRequests.length + openServiceRequests.length}
          detail="Requests awaiting review or completion."
          tone="gold"
        />
        <PortalStatCard
          label="Recent documents"
          value={allDocs.length}
          detail="Shared and uploaded files in the portal."
          tone="green"
        />
        <PortalStatCard
          label="Client actions"
          value={actionNeeded.length}
          detail="Items currently waiting on you."
          tone={actionNeeded.length > 0 ? "gold" : "neutral"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <PortalCard>
          <PortalCardHeader
            action={
              <PortalButton href="/corporate/app/matters" tone="secondary">
                View all
              </PortalButton>
            }
          >
            <PortalCardTitle>Active matters</PortalCardTitle>
            <PortalCardDescription>Current work, status, and next action visibility.</PortalCardDescription>
          </PortalCardHeader>
          <PortalCardContent className="space-y-3">
            {activeMatters.length === 0 ? (
              <PortalEmptyState
                title="No active matters"
                description="Active matters will appear here once Levine Law has accepted and opened work in the portal."
              />
            ) : (
              activeMatters.slice(0, 5).map((matter, index) => {
                const key = matter.businessKey ?? `matter-${index}`
                return (
                  <Link
                    key={key}
                    href={`/corporate/app/matters/${encodeURIComponent(key)}`}
                    className="hover:border-brand-navy/30 block rounded-lg border border-stone-200 bg-white px-4 py-4 transition hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-950">{key}</p>
                        {matter.matterType ? <p className="mt-1 text-sm text-stone-500">{matter.matterType}</p> : null}
                        <p className="mt-2 text-sm leading-6 text-stone-600">
                          {matter.nextActionSummary ?? "No next action on file."}
                        </p>
                      </div>
                      {matter.matterState ? (
                        <PortalBadge tone={statusTone(matter.matterState)}>{matter.matterState}</PortalBadge>
                      ) : null}
                    </div>
                  </Link>
                )
              })
            )}
          </PortalCardContent>
        </PortalCard>

        <div className="space-y-6">
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Primary Levine Law contact</PortalCardTitle>
              <PortalCardDescription>Your relationship contact for portal matters.</PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <div className="flex items-start gap-4">
                <div className="bg-brand-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  ML
                </div>
                <div>
                  <p className="font-semibold text-stone-950">{profile.lawyerName}</p>
                  <p className="mt-1 text-sm text-stone-500">{profile.model} Counsel</p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{profile.description}</p>
                  <Link
                    href="/corporate/app/scope"
                    className="text-brand-navy mt-4 inline-flex text-sm font-semibold underline-offset-2 hover:underline"
                  >
                    View team and scope
                  </Link>
                </div>
              </div>
            </PortalCardContent>
          </PortalCard>

          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Recent activity</PortalCardTitle>
              <PortalCardDescription>Latest document and request movement.</PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              {recentActivity.length === 0 ? (
                <PortalEmptyState
                  title="No recent activity"
                  description="Portal activity will appear here as documents and requests are updated."
                />
              ) : (
                <ol className="space-y-4">
                  {recentActivity.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="bg-brand-navy mt-1 h-2 w-2 shrink-0 rounded-full" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-950">{item.title}</p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {item.meta} · {formatDate(item.date)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </PortalCardContent>
          </PortalCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PortalCard>
          <PortalCardHeader
            action={
              <PortalButton href="/corporate/app/documents" tone="secondary">
                Browse
              </PortalButton>
            }
          >
            <PortalCardTitle>Recent documents</PortalCardTitle>
            <PortalCardDescription>Files shared by Levine Law and uploaded by you.</PortalCardDescription>
          </PortalCardHeader>
          <PortalCardContent>
            {allDocs.length === 0 ? (
              <PortalEmptyState
                title="No documents yet"
                description="Documents shared with you will appear here once available."
              />
            ) : (
              <div className="divide-y divide-stone-100">
                {allDocs.slice(0, 5).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-950">{doc.filename}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {doc.matterKey} · {formatDate(doc.addedAt)}
                      </p>
                    </div>
                    {doc.uploadedByClient ? <PortalBadge>Uploaded by you</PortalBadge> : null}
                  </div>
                ))}
              </div>
            )}
          </PortalCardContent>
        </PortalCard>

        <PortalCard>
          <PortalCardHeader action={<PortalButton href="/corporate/app/requests/new">Open matter</PortalButton>}>
            <PortalCardTitle>Open requests</PortalCardTitle>
            <PortalCardDescription>Requests currently awaiting review or follow-up.</PortalCardDescription>
          </PortalCardHeader>
          <PortalCardContent>
            {openMatterRequests.length + openServiceRequests.length === 0 ? (
              <PortalEmptyState
                title="No open requests"
                description="When you submit a matter or service request, status updates will appear here."
                action={<PortalButton href="/corporate/app/requests/new">Open a matter</PortalButton>}
              />
            ) : (
              <div className="space-y-3">
                {[...openMatterRequests, ...openServiceRequests].slice(0, 5).map((request) => {
                  const isMatterRequest = "category" in request
                  const title = isMatterRequest ? request.category : request.contract.serviceTitle
                  const date = isMatterRequest ? request.submittedAt : request.contract.createdAt
                  const status = request.status
                  return (
                    <div key={request.id} className="rounded-lg border border-stone-200 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-stone-950">{title}</p>
                          <p className="mt-1 text-xs text-stone-500">
                            {request.id} · {formatDate(date)}
                          </p>
                        </div>
                        <PortalBadge tone={status === "In Review" ? "navy" : "gold"}>{status}</PortalBadge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </PortalCardContent>
        </PortalCard>
      </div>
    </div>
  )
}

export function PortalShell({ previewMode = false, session, accessToken = null }: PortalShellProps) {
  const displayName = session.identity.displayName ?? session.identity.email ?? "Client"

  return (
    <PortalWorkspaceShell active="dashboard" previewMode={previewMode} session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Dashboard"
          title={`Welcome back, ${displayName}`}
          description="A secure overview of your Levine Law matters, requests, documents, and relationship contacts."
          action={
            <div className="flex flex-wrap gap-3">
              <PortalButton href="/corporate/app/requests/new">Open a matter</PortalButton>
              <PortalButton href="/corporate/app/documents" tone="secondary">
                View documents
              </PortalButton>
            </div>
          }
        />
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent accessToken={accessToken} session={session} />
        </Suspense>
      </div>
    </PortalWorkspaceShell>
  )
}
