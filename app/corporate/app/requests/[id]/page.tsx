import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

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
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
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

function statusBadge(status: RequestStatus): string {
  switch (status) {
    case "Received":
      return "bg-amber-50 text-amber-700"
    case "In Review":
      return "bg-brand-navy/10 text-brand-navy"
    case "Complete":
      return "bg-stone-100 text-stone-500"
  }
}

export default async function RequestDetailPage({ params, searchParams }: RequestDetailPageProps) {
  const { id } = await params
  const sp = await searchParams
  const justSubmitted = sp.submitted === "1"

  const session =
    (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/corporate")
  }

  const req = getRequestById(id)
  if (!req) {
    notFound()
  }

  const inputEntries = Object.values(req.contract.inputPayload) as Array<{
    label: string
    value: string
  }>

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm">
          <Link
            href="/corporate/app/requests"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← All requests
          </Link>
        </nav>

        {justSubmitted ? (
          <div className="mt-6 rounded border border-green-200 bg-green-50 px-5 py-4 text-sm">
            <p className="font-semibold text-green-900">Request submitted</p>
            <p className="mt-1 text-green-700">
              Your request has been received. We&apos;ll follow up with next steps shortly.
            </p>
          </div>
        ) : null}

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">
            Service Request
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-stone-900">{req.contract.serviceTitle}</h1>
            <span className={`rounded px-2 py-1 text-xs font-medium ${statusBadge(req.status)}`}>
              {req.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-stone-400">
            {req.id} · Submitted {formatDate(req.contract.createdAt)}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Pricing */}
          <div className="rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Pricing</h2>
            <p className="mt-2 text-sm text-stone-500">{req.contract.pricingSnapshot.priceDisplay}</p>
          </div>

          {/* Acknowledgement */}
          <div className="rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Engagement acknowledged</h2>
            <p className="mt-2 text-sm text-stone-500">
              {formatDateTime(req.contract.engagementAcknowledgedAt)}
            </p>
          </div>
        </div>

        {/* Scope */}
        <div className="mt-4 rounded border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-sm font-semibold text-stone-900">Scope</h2>
          <ul className="mt-3 space-y-1">
            {req.contract.scopeSnapshot.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-stone-500">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Submitted information */}
        {inputEntries.length > 0 ? (
          <div className="mt-4 rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Submitted information</h2>
            <dl className="mt-4 space-y-4">
              {inputEntries.map((entry, i) => (
                <div key={i}>
                  <dt className="text-xs font-medium text-stone-400">{entry.label}</dt>
                  <dd className="mt-1 text-sm text-stone-700 whitespace-pre-wrap">
                    {entry.value || <span className="italic text-stone-300">Not provided</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {/* Attachment */}
        {req.attachment ? (
          <div className="mt-4 rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Attached document</h2>
            <div className="mt-3 flex items-center gap-3 rounded border border-stone-100 bg-stone-50 px-4 py-3">
              <span className="text-sm font-medium text-stone-700">{req.attachment.filename}</span>
              <span className="text-xs text-stone-400">{formatDate(req.attachment.addedAt)}</span>
            </div>
            <p className="mt-2 text-xs text-stone-400">
              File received. Your counsel will review the attachment alongside your request.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  )
}
