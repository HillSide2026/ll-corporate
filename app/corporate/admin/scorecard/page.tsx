import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { type ConflictRequest, listConflictRequests } from "src/lib/intake/conflictRequestStore"
import { countIntakeEvents, type EventCount } from "src/lib/intake/eventStore"
import { buildScorecard, type ScorecardRow } from "src/lib/intake/scorecard"
import { leadServices } from "src/lib/services/leadServices"

export const metadata: Metadata = { title: "Lead Scorecard — Levine Law Admin" }

export const dynamic = "force-dynamic"

function money(cents: number | null): string {
  return cents === null
    ? "—"
    : (cents / 100).toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })
}

function num(value: number | null, digits = 1): string {
  return value === null ? "—" : value.toFixed(digits)
}

const columns: Array<{ label: string; title: string; cell: (r: ScorecardRow) => string }> = [
  { label: "Started", title: "Opened the conflict check page", cell: (r) => String(r.started) },
  { label: "Requested", title: "Submitted a conflict check", cell: (r) => String(r.requested) },
  { label: "Cleared", title: "Conflict check cleared", cell: (r) => String(r.cleared) },
  { label: "Declined", title: "Conflict check declined", cell: (r) => String(r.declined) },
  { label: "Letter sent", title: "Engagement letter sent", cell: (r) => String(r.engaged) },
  { label: "Switched", title: "Engaged on a different service than picked", cell: (r) => String(r.switched) },
  { label: "Paid", title: "Flat fee paid", cell: (r) => String(r.paid) },
  { label: "Complete", title: "Work delivered", cell: (r) => String(r.completed) },
  { label: "Revenue", title: "Fees paid", cell: (r) => money(r.revenueCents) },
  { label: "Avg fee", title: "Average fee of paid jobs", cell: (r) => money(r.avgFeeCents) },
  { label: "Avg hours", title: "Average hours per completed job", cell: (r) => num(r.avgHours) },
  {
    label: "$/hour",
    title: "Fees of completed jobs divided by their hours",
    cell: (r) => money(r.effectiveHourlyCents),
  },
  { label: "Days", title: "Average days from request to completion", cell: (r) => num(r.avgDaysToComplete, 0) },
]

function ScorecardTable({
  title,
  rows,
  labelOf,
}: {
  title: string
  rows: ScorecardRow[]
  labelOf: (key: string) => string
}) {
  return (
    <section>
      <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-stone-400">No data yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs text-stone-500">
              <tr>
                <th className="px-4 py-3 font-semibold"> </th>
                {columns.map((c) => (
                  <th key={c.label} title={c.title} className="px-3 py-3 text-right font-semibold whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-t border-stone-100">
                  <td className="px-4 py-3 font-medium whitespace-nowrap text-stone-900">{labelOf(r.key)}</td>
                  {columns.map((c) => (
                    <td key={c.label} className="px-3 py-3 text-right text-stone-700 tabular-nums">
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default async function AdminScorecardPage() {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  let requests: ConflictRequest[] = []
  let events: EventCount[] = []
  let unavailable = false
  try {
    ;[requests, events] = await Promise.all([listConflictRequests(), countIntakeEvents()])
  } catch (err) {
    console.error("AdminScorecardPage: lead data unavailable", err)
    unavailable = true
  }

  const byService = buildScorecard(requests, events, (item) => item.serviceSlug)
  const bySource = buildScorecard(requests, events, (item) => item.source ?? "direct")
  const serviceTitle = (slug: string) => leadServices.find((s) => s.slug === slug)?.title ?? slug

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link href="/corporate/admin" className="text-brand-navy text-sm font-semibold">
            Levine Law Admin
          </Link>
          <h1 className="mt-0.5 text-lg font-semibold text-stone-900">Lead scorecard</h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <p className="max-w-3xl text-sm leading-6 text-stone-500">
          Which entry-level service can be fulfilled profitably at a flat fee, and which sources bring paying work.
          Leads count against the service they picked. Fees and hours come from the record kept on each request in the
          conflict check queue (letter sent, paid, complete).
        </p>

        {unavailable ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Lead data is unavailable. Check that the portal database tables exist.
          </p>
        ) : (
          <>
            <ScorecardTable title="By service" rows={byService} labelOf={serviceTitle} />
            <ScorecardTable title="By source" rows={bySource} labelOf={(key) => key} />
          </>
        )}
      </div>
    </main>
  )
}
