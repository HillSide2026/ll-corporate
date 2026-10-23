import {
  decideConflictCheck,
  recordCompletionAction,
  recordEngagementAction,
  recordPaymentAction,
} from "src/lib/intake/conflictActions"
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

function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })
}

const smallButton =
  "bg-brand-navy hover:bg-brand-navy-dark rounded px-4 py-2 text-sm font-semibold text-white transition-colors"
const smallInput = "rounded border border-stone-300 bg-white px-3 py-2 text-sm"

/** After clearing: letter sent (service, fee, Clio matter), then paid, then complete (hours). */
function ConversionRecord({ request }: { request: ConflictRequest }) {
  if (request.status !== "cleared") return null
  const finalService = leadServices.find((s) => s.code === request.finalServiceCode)

  if (!request.engagedAt) {
    const picked = leadServices.find((s) => s.code === request.serviceCode)
    const pickedFee = picked?.testFeeCents ? String(picked.testFeeCents / 100) : undefined
    return (
      <form
        action={recordEngagementAction}
        className="mt-4 flex flex-wrap items-end gap-3 border-t border-stone-100 pt-4"
      >
        <input type="hidden" name="id" value={request.id} />
        <label className="text-xs text-stone-500">
          Service in the letter
          <select name="finalServiceCode" defaultValue={request.serviceCode} className={`mt-1 block ${smallInput}`}>
            {leadServices.map((s) => (
              <option key={s.code} value={s.code}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-stone-500">
          Flat fee ($)
          <input
            name="fee"
            inputMode="decimal"
            required
            defaultValue={pickedFee}
            placeholder="0"
            className={`mt-1 block w-28 ${smallInput}`}
          />
        </label>
        <label className="text-xs text-stone-500">
          Clio matter no.
          <input name="clioMatter" placeholder="Optional" className={`mt-1 block w-36 ${smallInput}`} />
        </label>
        <button type="submit" className={smallButton}>
          Letter sent
        </button>
      </form>
    )
  }

  return (
    <div className="mt-4 space-y-3 border-t border-stone-100 pt-4 text-sm text-stone-700">
      <p>
        Letter sent: {finalService?.title ?? request.finalServiceCode} · {formatMoney(request.feeCents ?? 0)}
        {request.clioMatter ? ` · Clio ${request.clioMatter}` : ""}
        {request.paidAt ? " · Paid" : ""}
        {request.completedAt && request.hours
          ? ` · Complete in ${request.hours} h (${formatMoney(Math.round((request.feeCents ?? 0) / request.hours))}/h)`
          : ""}
      </p>
      {!request.paidAt ? (
        <form action={recordPaymentAction}>
          <input type="hidden" name="id" value={request.id} />
          <button type="submit" className={smallButton}>
            Mark paid
          </button>
        </form>
      ) : !request.completedAt ? (
        <form action={recordCompletionAction} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="id" value={request.id} />
          <label className="text-xs text-stone-500">
            Hours (from Clio)
            <input
              name="hours"
              inputMode="decimal"
              required
              placeholder="3.5"
              className={`mt-1 block w-24 ${smallInput}`}
            />
          </label>
          <button type="submit" className={smallButton}>
            Mark complete
          </button>
        </form>
      ) : null}
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
            {request.userEmail} · Picked: {service?.title ?? request.serviceSlug} ({request.serviceCode})
            {request.engagedAt ? "" : ", not yet confirmed"}
          </p>
          <p className="mt-0.5 text-xs text-stone-400">
            Requested {formatDate(request.createdAt)} · Source: {request.source ?? "direct"}
          </p>
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

      <ConversionRecord request={request} />
    </li>
  )
}
