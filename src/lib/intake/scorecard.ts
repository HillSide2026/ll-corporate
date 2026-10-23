import type { ConflictRequest } from "./conflictRequestStore"
import type { EventCount } from "./eventStore"

/**
 * Per-service lead funnel and economics (ML1 2026-10-22): the portal exists to find
 * the one entry-level service that can be fulfilled profitably at a flat fee.
 * Leads are counted against the service they picked; revenue and hours against the
 * same row, with a count of how many ended up engaged on a different service.
 */
export type ScorecardRow = {
  key: string
  started: number
  requested: number
  cleared: number
  declined: number
  engaged: number
  switched: number
  paid: number
  completed: number
  revenueCents: number
  hours: number
  /** Revenue of completed jobs divided by their hours; null until a job is complete. */
  effectiveHourlyCents: number | null
  avgFeeCents: number | null
  avgHours: number | null
  avgDaysToComplete: number | null
}

function emptyRow(key: string): ScorecardRow {
  return {
    key,
    started: 0,
    requested: 0,
    cleared: 0,
    declined: 0,
    engaged: 0,
    switched: 0,
    paid: 0,
    completed: 0,
    revenueCents: 0,
    hours: 0,
    effectiveHourlyCents: null,
    avgFeeCents: null,
    avgHours: null,
    avgDaysToComplete: null,
  }
}

const DAY_MS = 24 * 60 * 60 * 1000

export function buildScorecard(
  requests: ConflictRequest[],
  events: EventCount[],
  keyOf: (item: { serviceSlug: string; serviceCode?: string; source: string | null }) => string
): ScorecardRow[] {
  const rows = new Map<string, ScorecardRow>()
  const row = (key: string) => rows.get(key) ?? rows.set(key, emptyRow(key)).get(key)!

  for (const event of events) {
    if (event.event === "started") row(keyOf(event)).started += event.count
  }

  const completedFees = new Map<string, { fees: number; hours: number; days: number; n: number }>()
  for (const request of requests) {
    const r = row(keyOf(request))
    r.requested += 1
    if (request.status === "cleared") r.cleared += 1
    if (request.status === "declined") r.declined += 1
    if (request.engagedAt) {
      r.engaged += 1
      if (request.finalServiceCode && request.finalServiceCode !== request.serviceCode) r.switched += 1
    }
    if (request.paidAt) {
      r.paid += 1
      r.revenueCents += request.feeCents ?? 0
    }
    if (request.completedAt) {
      r.completed += 1
      r.hours += request.hours ?? 0
      const totals = completedFees.get(r.key) ?? { fees: 0, hours: 0, days: 0, n: 0 }
      totals.fees += request.feeCents ?? 0
      totals.hours += request.hours ?? 0
      totals.days += (Date.parse(request.completedAt) - Date.parse(request.createdAt)) / DAY_MS
      totals.n += 1
      completedFees.set(r.key, totals)
    }
  }

  for (const r of Array.from(rows.values())) {
    if (r.paid > 0) r.avgFeeCents = Math.round(r.revenueCents / r.paid)
    const totals = completedFees.get(r.key)
    if (totals && totals.n > 0) {
      r.avgHours = totals.hours / totals.n
      r.avgDaysToComplete = totals.days / totals.n
      r.effectiveHourlyCents = totals.hours > 0 ? Math.round(totals.fees / totals.hours) : null
    }
  }

  return Array.from(rows.values())
}
