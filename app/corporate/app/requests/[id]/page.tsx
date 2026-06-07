import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import {
  PortalBadge,
  PortalButton,
  PortalCard,
  PortalCardContent,
  PortalCardHeader,
  PortalCardTitle,
  PortalPageHeader,
} from "src/components/portal/PortalDesignSystem"
import { PortalWorkspaceShell } from "src/components/portal/PortalWorkspaceShell"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { getRequestById, type RequestStatus } from "src/lib/portal/requestStore"

type RequestDetailPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: RequestDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `Request ${id}` }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
}

function statusTone(status: RequestStatus): "navy" | "gold" | "green" {
  switch (status) {
    case "Received":
      return "gold"
    case "In Review":
      return "navy"
    case "Complete":
      return "green"
  }
}

export default async function RequestDetailPage({ params, searchParams }: RequestDetailPageProps) {
  const { id } = await params
  const sp = await searchParams
  const justSubmitted = sp.submitted === "1"

  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/corporate")
  }

  const req = await getRequestById(id, session.identity)
  if (!req) {
    notFound()
  }

  const inputEntries = Object.values(req.contract.inputPayload) as Array<{
    label: string
    value: string
  }>

  return (
    <PortalWorkspaceShell active="requests" session={session}>
      <div className="space-y-6">
        {justSubmitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm">
            <p className="font-semibold text-green-900">Request submitted</p>
            <p className="mt-1 text-green-700">
              Your request has been received. We&apos;ll follow up with next steps shortly.
            </p>
          </div>
        ) : null}

        <PortalPageHeader
          eyebrow="Service request"
          title={req.contract.serviceTitle}
          description={`${req.id} · Submitted ${formatDate(req.contract.createdAt)}`}
          action={
            <PortalButton href="/corporate/app/requests" tone="secondary">
              All requests
            </PortalButton>
          }
        />

        <PortalBadge tone={statusTone(req.status)}>{req.status}</PortalBadge>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Pricing */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Pricing</PortalCardTitle>
            </PortalCardHeader>
            <PortalCardContent>
              <p className="text-sm text-stone-600">{req.contract.pricingSnapshot.priceDisplay}</p>
            </PortalCardContent>
          </PortalCard>

          {/* Acknowledgement */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Engagement acknowledged</PortalCardTitle>
            </PortalCardHeader>
            <PortalCardContent>
              <p className="text-sm text-stone-600">{formatDateTime(req.contract.engagementAcknowledgedAt)}</p>
            </PortalCardContent>
          </PortalCard>
        </div>

        {/* Scope */}
        <PortalCard>
          <PortalCardHeader>
            <PortalCardTitle>Scope</PortalCardTitle>
          </PortalCardHeader>
          <PortalCardContent>
            <ul className="space-y-1">
              {req.contract.scopeSnapshot.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-stone-500">
                  <span className="bg-brand-navy/40 mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </PortalCardContent>
        </PortalCard>

        {/* Submitted information */}
        {inputEntries.length > 0 ? (
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Submitted information</PortalCardTitle>
            </PortalCardHeader>
            <PortalCardContent>
              <dl className="space-y-4">
                {inputEntries.map((entry, i) => (
                  <div key={i}>
                    <dt className="text-xs font-medium text-stone-400">{entry.label}</dt>
                    <dd className="mt-1 text-sm whitespace-pre-wrap text-stone-700">
                      {entry.value || <span className="text-stone-300 italic">Not provided</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </PortalCardContent>
          </PortalCard>
        ) : null}

        {/* Attachment */}
        {req.attachment ? (
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Attached document</PortalCardTitle>
            </PortalCardHeader>
            <PortalCardContent>
              <div className="mt-3 flex items-center gap-3 rounded border border-stone-100 bg-stone-50 px-4 py-3">
                <span className="text-sm font-medium text-stone-700">{req.attachment.filename}</span>
                <span className="text-xs text-stone-400">{formatDate(req.attachment.addedAt)}</span>
              </div>
              <p className="mt-2 text-xs text-stone-400">
                File received. Your counsel will review the attachment alongside your request.
              </p>
            </PortalCardContent>
          </PortalCard>
        ) : null}
      </div>
    </PortalWorkspaceShell>
  )
}
