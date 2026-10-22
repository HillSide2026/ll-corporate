import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { decideConflictCheck } from "src/lib/intake/conflictActions"
import { type ConflictRequest, type ConflictStatus, listConflictRequests } from "src/lib/intake/conflictRequestStore"
import { leadServices } from "src/lib/services/leadServices"

export const metadata: Metadata = { title: "Conflict Checks — Levine Law Admin" }

export const dynamic = "force-dynamic"

function statusBadge(status: ConflictStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700"
    case "cleared":
      return "bg-green-50 text-green-700"
    default:
      return "bg-stone-100 text-stone-500"
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Toronto",
  })
}

function PartyList({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm whitespace-pre-line text-stone-800">{value}</dd>
    </div>
  )
}

function RequestCard({ request }: { request: ConflictRequest }) {
  const service = leadServices.find((s) => s.slug === request.serviceSlug)
  return (
    <li className="rounded border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-stone-900">{request.applicantName}</p>
          <p className="mt-0.5 text-sm text-stone-500">
            {request.userEmail} · {service?.title ?? request.serviceSlug} ({request.serviceCode})
          </p>
          <p className="mt-0.5 text-xs text-stone-400">Requested {formatDate(request.createdAt)}</p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-medium ${statusBadge(request.status)}`}>{request.status}</span>
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <PartyList label="Company" value={request.companyName} />
        <PartyList label="Others involved" value={request.relatedParties} />
        <PartyList label="Other side" value={request.adverseParties} />
      </dl>

      {request.status === "pending" ? (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
          <form action={decideConflictCheck}>
            <input type="hidden" name="id" value={request.id} />
            <input type="hidden" name="decision" value="cleared" />
            <button
              type="submit"
              className="bg-brand-navy hover:bg-brand-navy-dark rounded px-4 py-2 text-sm font-semibold text-white transition-colors"
            >
              Clear: no conflict
            </button>
          </form>
          <form action={decideConflictCheck}>
            <input type="hidden" name="id" value={request.id} />
            <input type="hidden" name="decision" value="declined" />
            <button
              type="submit"
              className="rounded border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400"
            >
              Decline
            </button>
          </form>
        </div>
      ) : request.decidedAt ? (
        <p className="mt-4 text-xs text-stone-400">Decided {formatDate(request.decidedAt)}</p>
      ) : null}
    </li>
  )
}

export default async function AdminConflictsPage() {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  let requests: ConflictRequest[] = []
  let unavailable = false
  try {
    requests = await listConflictRequests()
  } catch (err) {
    console.error("AdminConflictsPage: conflict request store unavailable", err)
    unavailable = true
  }
  const pending = requests.filter((r) => r.status === "pending").length

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link href="/corporate/admin" className="text-brand-navy text-sm font-semibold">
            Levine Law Admin
          </Link>
          <h1 className="mt-0.5 text-lg font-semibold text-stone-900">Conflict checks</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <p className="text-sm text-stone-500">
          Run each name through Clio&apos;s conflict search, then clear or decline. The lead sees the result on their
          conflict check page; contact them by email as well. {pending} pending.
        </p>

        {unavailable ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            The conflict check table is unavailable. Check that intake_conflict_requests exists in the portal database.
          </p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-stone-400">No conflict check requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
