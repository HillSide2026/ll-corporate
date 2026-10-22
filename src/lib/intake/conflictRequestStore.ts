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
}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value
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
    decidedAt: row.decided_at ? toIso(row.decided_at) : null,
    createdAt: toIso(row.created_at),
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
}): Promise<ConflictRequest> {
  const db = requirePortalDatabase()
  const id = `CC-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const result = await db.sql<ConflictRow>`
    insert into intake_conflict_requests (
      id, user_id, user_email, service_code, service_slug,
      applicant_name, company_name, related_parties, adverse_parties
    )
    values (
      ${id}, ${input.userId}, ${input.userEmail}, ${input.serviceCode}, ${input.serviceSlug},
      ${input.applicantName}, ${input.companyName ?? null}, ${input.relatedParties ?? null},
      ${input.adverseParties ?? null}
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
    limit 200
  `
  return result.rows.map(mapRow)
}

export async function decideConflictRequest(id: string, status: "cleared" | "declined"): Promise<ConflictRequest | null> {
  const db = requirePortalDatabase()
  const result = await db.sql<ConflictRow>`
    update intake_conflict_requests
    set status = ${status}, decided_at = now()
    where id = ${id} and status = 'pending'
    returning *
  `
  return result.rows[0] ? mapRow(result.rows[0]) : null
}
