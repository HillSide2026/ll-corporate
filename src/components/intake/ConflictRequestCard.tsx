import { decideConflictCheck } from "src/lib/intake/conflictActions"
import type { ConflictRequest, ConflictStatus } from "src/lib/intake/conflictRequestStore"
import { leadServices } from "src/lib/services/leadServices"

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

export function ConflictRequestCard({ request }: { request: ConflictRequest }) {
  const service = leadServices.find((s) => s.slug === request.serviceSlug)
  return (
    <li className="rounded border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-stone-900">{request.applicantName}</p>
          <p className="mt-0.5 text-sm text-stone-500">
            {request.userEmail} · Picked: {service?.title ?? request.serviceSlug} ({request.serviceCode}), not yet
            confirmed
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
