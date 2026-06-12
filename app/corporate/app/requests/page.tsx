import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

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
} from "src/components/portal/PortalDesignSystem"
import { PortalWorkspaceShell } from "src/components/portal/PortalWorkspaceShell"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession, isClientPortalSession } from "src/lib/auth/session"
import { getMatterRequests, type MatterRequestStatus } from "src/lib/portal/matterRequestStore"
import { getRequests, type RequestStatus } from "src/lib/portal/requestStore"
import { serviceCatalog } from "src/lib/services/catalog"

export const metadata: Metadata = {
  title: "Requests",
}

export const dynamic = "force-dynamic"

type RequestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

function requestTone(status: RequestStatus | MatterRequestStatus): "navy" | "gold" | "green" | "neutral" {
  switch (status) {
    case "Received":
      return "gold"
    case "In Review":
      return "navy"
    case "Accepted":
    case "Complete":
      return "green"
    default:
      return "neutral"
  }
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) redirect("/sign-in")
  if (!isClientPortalSession(session)) redirect("/intake")

  const params = await searchParams
  const justSubmitted = params.submitted === "1"

  const serviceRequests = await getRequests(session.identity)
  const matterRequests = await getMatterRequests(session.identity)
  const openMatterRequests = matterRequests.filter(
    (request) => request.status === "Received" || request.status === "In Review"
  )
  const openServiceRequests = serviceRequests.filter((request) => request.status !== "Complete")

  return (
    <PortalWorkspaceShell active="requests" session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Requests"
          title="Requests"
          description="Open new work, track submitted requests, and review status history."
          action={<PortalButton href="/corporate/app/requests/new">Open a matter</PortalButton>}
        />

        {justSubmitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm">
            <p className="font-semibold text-green-900">Request submitted</p>
            <p className="mt-1 text-green-700">
              Your request has been received. Levine Law will follow up with next steps.
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <PortalStatCard
            label="Open"
            value={openMatterRequests.length + openServiceRequests.length}
            detail="Awaiting review or completion."
            tone="gold"
          />
          <PortalStatCard
            label="Matter requests"
            value={matterRequests.length}
            detail="Open-ended counsel requests."
            tone="navy"
          />
          <PortalStatCard
            label="Service requests"
            value={serviceRequests.length}
            detail="Fixed-scope service requests."
            tone="green"
          />
        </div>

        <PortalCard>
          <PortalCardHeader
            action={
              <PortalButton href="/corporate/app/requests/new" tone="secondary">
                New matter
              </PortalButton>
            }
          >
            <PortalCardTitle>Matter requests</PortalCardTitle>
            <PortalCardDescription>
              Requests to open new work within or adjacent to your counsel relationship.
            </PortalCardDescription>
          </PortalCardHeader>
          <PortalCardContent>
            {matterRequests.length === 0 ? (
              <PortalEmptyState
                title="No matter requests yet"
                description="Open a matter request when you need Levine Law to review a new business issue or legal workstream."
                action={<PortalButton href="/corporate/app/requests/new">Open a matter</PortalButton>}
              />
            ) : (
              <div className="space-y-3">
                {matterRequests.map((request) => (
                  <div key={request.id} className="rounded-lg border border-stone-200 bg-white px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-950">{request.category}</p>
                        <p className="mt-1 text-xs text-stone-500">
                          {request.id} · Submitted {formatDate(request.submittedAt)}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{request.description}</p>
                        {request.attachmentFilename ? (
                          <p className="mt-2 text-xs text-stone-400">Attachment: {request.attachmentFilename}</p>
                        ) : null}
                      </div>
                      <PortalBadge tone={requestTone(request.status)}>{request.status}</PortalBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PortalCardContent>
        </PortalCard>

        <PortalCard>
          <PortalCardHeader>
            <PortalCardTitle>Service requests</PortalCardTitle>
            <PortalCardDescription>
              Fixed-scope services with defined pricing, assumptions, and turnaround.
            </PortalCardDescription>
          </PortalCardHeader>
          <PortalCardContent>
            {serviceRequests.length === 0 ? (
              <PortalEmptyState
                title="No service requests submitted"
                description="Submitted fixed-scope service requests will appear here with their current status."
              />
            ) : (
              <div className="overflow-hidden rounded-lg border border-stone-200">
                <div className="divide-y divide-stone-100">
                  {serviceRequests.map((request) => (
                    <Link
                      key={request.id}
                      href={`/corporate/app/requests/${request.id}`}
                      className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition hover:bg-stone-50"
                    >
                      <div>
                        <p className="font-semibold text-stone-950">{request.contract.serviceTitle}</p>
                        <p className="mt-1 text-xs text-stone-500">
                          {request.id} · {formatDate(request.contract.createdAt)} ·{" "}
                          {request.contract.pricingSnapshot.priceDisplay}
                        </p>
                      </div>
                      <PortalBadge tone={requestTone(request.status)}>{request.status}</PortalBadge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </PortalCardContent>
        </PortalCard>

        <PortalCard>
          <PortalCardHeader>
            <PortalCardTitle>Available services</PortalCardTitle>
            <PortalCardDescription>Common legal workflows available through the portal.</PortalCardDescription>
          </PortalCardHeader>
          <PortalCardContent>
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {serviceCatalog.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/corporate/services/${service.slug}/request`}
                    className="hover:border-brand-navy/30 block h-full rounded-lg border border-stone-200 bg-white px-4 py-4 transition hover:shadow-sm"
                  >
                    <p className="font-semibold text-stone-950">{service.title}</p>
                    <p className="mt-1 text-xs text-stone-500">{service.turnaround}</p>
                    <p className="text-brand-navy mt-3 text-sm font-semibold">
                      {service.price ?? "Estimate on review"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </PortalCardContent>
        </PortalCard>
      </div>
    </PortalWorkspaceShell>
  )
}
