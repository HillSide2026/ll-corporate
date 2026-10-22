import { requirePortalDatabase } from "src/lib/portal/portalDb"

export type ConflictStatus = "pending" | "cleared" | "declined"

export type ConflictRequest = {
  id: string
  userId: string
  userEmail: string
  serviceCode: string
  serviceSlug: string
  applicantName: string
  companyName: string | null
  relatedParties: string | null
  adverseParties: string | null
  status: ConflictStatus
  decidedAt: string | null
  createdAt: string
  /** Where the lead came from (?ref= code), if known. */
  source: string | null
  /** Conversion record, kept by Levine Law after clearing (ML1 2026-10-22). */
  engagedAt: string | null
  finalServiceCode: string | null
  feeCents: number | null
  clioMatter: string | null
  paidAt: string | null
  completedAt: string | null
  hours: number | null
}

type ConflictRow = {
  id: string
  user_id: string
  user_email: string
  service_code: string
  service_slug: string
  applicant_name: string
  company_name: string | null
  related_parties: string | null
  adverse_parties: string | null
  status: ConflictStatus
  decided_at: Date | string | null
  created_at: Date | string
  source: string | null
  engaged_at: Date | string | null
  final_service_code: string | null
  fee_cents: number | null
  clio_matter: string | null
  paid_at: Date | string | null
  completed_at: Date | string | null
  hours: string | number | null
}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value
}

function toIsoOrNull(value: Date | string | null): string | null {
  return value ? toIso(value) : null
}

function mapRow(row: ConflictRow): ConflictRequest {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    serviceCode: row.service_code,
    serviceSlug: row.service_slug,
    applicantName: row.applicant_name,
    companyName: row.company_name,
    relatedParties: row.related_parties,
    adverseParties: row.adverse_parties,
    status: row.status,
    decidedAt: toIsoOrNull(row.decided_at),
    createdAt: toIso(row.created_at),
    source: row.source ?? null,
    engagedAt: toIsoOrNull(row.engaged_at ?? null),
    finalServiceCode: row.final_service_code ?? null,
    feeCents: row.fee_cents ?? null,
    clioMatter: row.clio_matter ?? null,
    paidAt: toIsoOrNull(row.paid_at ?? null),
    completedAt: toIsoOrNull(row.completed_at ?? null),
    hours: row.hours === null || row.hours === undefined ? null : Number(row.hours),
  }
}

export async function createConflictRequest(input: {
  userId: string
  userEmail: string
  serviceCode: string
  serviceSlug: string
  applicantName: string
  companyName?: string
  relatedParties?: string
  adverseParties?: string
  source?: string | null
}): Promise<ConflictRequest> {
  const db = requirePortalDatabase()
  const id = `CC-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const result = await db.sql<ConflictRow>`
    insert into intake_conflict_requests (
      id, user_id, user_email, service_code, service_slug,
      applicant_name, company_name, related_parties, adverse_parties, source
    )
    values (
      ${id}, ${input.userId}, ${input.userEmail}, ${input.serviceCode}, ${input.serviceSlug},
      ${input.applicantName}, ${input.companyName ?? null}, ${input.relatedParties ?? null},
      ${input.adverseParties ?? null}, ${input.source ?? null}
    )
    returning *
  `
  return mapRow(result.rows[0]!)
}

export async function getLatestConflictRequest(userId: string, serviceSlug: string): Promise<ConflictRequest | null> {
  const db = requirePortalDatabase()
  const result = await db.sql<ConflictRow>`
    select * from intake_conflict_requests
    where user_id = ${userId} and service_slug = ${serviceSlug}
    order by created_at desc
    limit 1
  `
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

export async function listConflictRequests(): Promise<ConflictRequest[]> {
  const db = requirePortalDatabase()
  const result = await db.sql<ConflictRow>`
    select * from intake_conflict_requests
    order by (status = 'pending') desc, created_at desc
  `
  return result.rows.map(mapRow)
}

export async function decideConflictRequest(
  id: string,
  status: "cleared" | "declined"
): Promise<ConflictRequest | null> {
  const db = requirePortalDatabase()
  const result = await db.sql<ConflictRow>`
    update intake_conflict_requests
    set status = ${status}, decided_at = now()
    where id = ${id} and status = 'pending'
    returning *
  `
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

/** Engagement letter sent: the service and flat fee actually agreed, and the Clio matter. */
export async function recordEngagement(
  id: string,
  input: { finalServiceCode: string; feeCents: number; clioMatter: string | null }
): Promise<boolean> {
  const db = requirePortalDatabase()
  const result = await db.sql`
    update intake_conflict_requests
    set engaged_at = now(), final_service_code = ${input.finalServiceCode},
        fee_cents = ${input.feeCents}, clio_matter = ${input.clioMatter}
    where id = ${id} and status = 'cleared' and engaged_at is null
  `
  return (result.rowCount ?? 0) > 0
}

export async function recordPayment(id: string): Promise<boolean> {
  const db = requirePortalDatabase()
  const result = await db.sql`
    update intake_conflict_requests
    set paid_at = now()
    where id = ${id} and engaged_at is not null and paid_at is null
  `
  return (result.rowCount ?? 0) > 0
}

/** Work delivered, with the hours recorded against the matter in Clio. */
export async function recordCompletion(id: string, hours: number): Promise<boolean> {
  const db = requirePortalDatabase()
  const result = await db.sql`
    update intake_conflict_requests
    set completed_at = now(), hours = ${hours}
    where id = ${id} and paid_at is not null and completed_at is null
  `
  return (result.rowCount ?? 0) > 0
}
