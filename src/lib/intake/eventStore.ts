import { requirePortalDatabase } from "src/lib/portal/portalDb"

/** Funnel events counted once per lead per service (ML1 2026-10-22). */
export type IntakeEvent = "started"

export async function recordIntakeEvent(input: {
  userId: string
  serviceSlug: string
  event: IntakeEvent
  source: string | null
}): Promise<void> {
  const db = requirePortalDatabase()
  await db.sql`
    insert into intake_events (user_id, service_slug, event, source)
    values (${input.userId}, ${input.serviceSlug}, ${input.event}, ${input.source})
    on conflict (user_id, service_slug, event) do nothing
  `
}

export type EventCount = { serviceSlug: string; source: string | null; event: string; count: number }

export async function countIntakeEvents(): Promise<EventCount[]> {
  const db = requirePortalDatabase()
  const result = await db.sql<{ service_slug: string; source: string | null; event: string; count: string }>`
    select service_slug, source, event, count(*)::text as count
    from intake_events
    group by service_slug, source, event
  `
  return result.rows.map((row) => ({
    serviceSlug: row.service_slug,
    source: row.source,
    event: row.event,
    count: Number(row.count),
  }))
}
