import type { PortalIdentity } from "src/lib/auth/session"
import { recordAuditEvent } from "./auditLog"
import { isPortalDatabaseConfigured, isPortalMockFallbackEnabled, requirePortalDatabase } from "./portalDb"

export type MatterRequestCategory = "Corporate" | "Contract" | "Financial Services"

export type MatterRequestStatus = "Received" | "In Review" | "Accepted" | "Declined"

export type MatterRequest = {
  id: string
  category: MatterRequestCategory
  description: string
  attachmentFilename: string | null
  attachmentDocumentId?: string | null
  submittedAt: string
  clientIdentity: PortalIdentity
  status: MatterRequestStatus
}

type MatterRequestRow = {
  id: string
  category: MatterRequestCategory
  description: string
  attachment_document_id: string | null
  submitted_at: Date | string
  client_subject: string
  client_email: string | null
  client_name: string | null
  status: MatterRequestStatus
}

function mapMatterRequest(row: MatterRequestRow): MatterRequest {
  return {
    id: row.id,
    category: row.category,
    description: row.description,
    attachmentFilename: row.attachment_document_id ? "Supporting document" : null,
    attachmentDocumentId: row.attachment_document_id,
    submittedAt: row.submitted_at instanceof Date ? row.submitted_at.toISOString() : row.submitted_at,
    clientIdentity: {
      subject: row.client_subject,
      email: row.client_email ?? undefined,
      displayName: row.client_name ?? undefined,
    },
    status: row.status,
  }
}

export function isMatterRequestStoreConfigured(): boolean {
  return isPortalDatabaseConfigured()
}

export async function addMatterRequest(request: Omit<MatterRequest, "id" | "status">): Promise<MatterRequest> {
  const db = requirePortalDatabase()
  const id = `MR-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const result = await db.sql<MatterRequestRow>`
    insert into portal_matter_requests (
      id,
      client_subject,
      client_email,
      client_name,
      category,
      description,
      attachment_document_id,
      submitted_at,
      status
    )
    values (
      ${id},
      ${request.clientIdentity.subject},
      ${request.clientIdentity.email ?? null},
      ${request.clientIdentity.displayName ?? null},
      ${request.category},
      ${request.description},
      ${request.attachmentDocumentId ?? null},
      ${request.submittedAt},
      ${"Received"}
    )
    returning id, category, description, attachment_document_id, submitted_at, client_subject, client_email, client_name, status
  `

  await recordAuditEvent({
    action: "matter_request_created",
    actor: { identity: request.clientIdentity, role: "client" },
    metadata: { category: request.category },
    resourceId: id,
    resourceType: "matter_request",
  })

  return mapMatterRequest(result.rows[0]!)
}

export async function getMatterRequests(identity?: PortalIdentity): Promise<MatterRequest[]> {
  if (!isPortalDatabaseConfigured() && isPortalMockFallbackEnabled()) return []

  const db = requirePortalDatabase()
  const result = identity
    ? await db.sql<MatterRequestRow>`
        select id, category, description, attachment_document_id, submitted_at, client_subject, client_email, client_name, status
        from portal_matter_requests
        where client_subject = ${identity.subject}
        order by submitted_at desc
      `
    : await db.sql<MatterRequestRow>`
        select id, category, description, attachment_document_id, submitted_at, client_subject, client_email, client_name, status
        from portal_matter_requests
        order by submitted_at desc
      `
  return result.rows.map(mapMatterRequest)
}

export async function getMatterRequestById(id: string, identity?: PortalIdentity): Promise<MatterRequest | undefined> {
  if (!isPortalDatabaseConfigured() && isPortalMockFallbackEnabled()) return undefined

  const db = requirePortalDatabase()
  const result = identity
    ? await db.sql<MatterRequestRow>`
        select id, category, description, attachment_document_id, submitted_at, client_subject, client_email, client_name, status
        from portal_matter_requests
        where id = ${id}
          and client_subject = ${identity.subject}
        limit 1
      `
    : await db.sql<MatterRequestRow>`
        select id, category, description, attachment_document_id, submitted_at, client_subject, client_email, client_name, status
        from portal_matter_requests
        where id = ${id}
        limit 1
      `
  return result.rows[0] ? mapMatterRequest(result.rows[0]) : undefined
}
