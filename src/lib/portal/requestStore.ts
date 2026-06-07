import type { PortalIdentity } from "src/lib/auth/session"
import type { IntakeRequestContract } from "src/lib/contracts/intake"
import { recordAuditEvent } from "./auditLog"
import { isPortalDatabaseConfigured, isPortalMockFallbackEnabled, requirePortalDatabase } from "./portalDb"

export type RequestStatus = "Received" | "In Review" | "Complete"

export type RequestAttachment = {
  documentId?: string
  filename: string
  addedAt: string
}

export type StoredRequest = {
  id: string
  contract: IntakeRequestContract
  status: RequestStatus
  attachment: RequestAttachment | null
}

type RequestRow = {
  id: string
  contract: IntakeRequestContract | string
  status: RequestStatus
  attachment_document_id: string | null
  created_at: Date | string
}

function parseContract(contract: RequestRow["contract"]): IntakeRequestContract {
  return typeof contract === "string" ? (JSON.parse(contract) as IntakeRequestContract) : contract
}

function mapRequest(row: RequestRow): StoredRequest {
  const contract = parseContract(row.contract)
  return {
    id: row.id,
    contract,
    status: row.status,
    attachment: row.attachment_document_id
      ? {
          documentId: row.attachment_document_id,
          filename: "Supporting document",
          addedAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
        }
      : null,
  }
}

export function isRequestStoreConfigured(): boolean {
  return isPortalDatabaseConfigured()
}

export async function addRequest(
  contract: IntakeRequestContract,
  attachment?: RequestAttachment,
  identity?: PortalIdentity
): Promise<StoredRequest> {
  const db = requirePortalDatabase()
  const id = `REQ-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const result = await db.sql<RequestRow>`
    insert into portal_service_requests (
      id,
      client_subject,
      client_email,
      client_name,
      contract,
      status,
      attachment_document_id,
      created_at
    )
    values (
      ${id},
      ${contract.clientIdentity.subject},
      ${contract.clientIdentity.email ?? null},
      ${contract.clientIdentity.displayName ?? null},
      ${JSON.stringify(contract)}::jsonb,
      ${"Received"},
      ${attachment?.documentId ?? null},
      ${contract.createdAt}
    )
    returning id, contract, status, attachment_document_id, created_at
  `

  await recordAuditEvent({
    action: "service_request_created",
    actor: { identity: identity ?? contract.clientIdentity, role: "client" },
    metadata: { serviceTitle: contract.serviceTitle },
    resourceId: id,
    resourceType: "service_request",
  })

  return mapRequest(result.rows[0]!)
}

export async function getRequests(identity?: PortalIdentity): Promise<StoredRequest[]> {
  if (!isPortalDatabaseConfigured() && isPortalMockFallbackEnabled()) return []

  const db = requirePortalDatabase()
  const result = identity
    ? await db.sql<RequestRow>`
        select id, contract, status, attachment_document_id, created_at
        from portal_service_requests
        where client_subject = ${identity.subject}
        order by created_at desc
      `
    : await db.sql<RequestRow>`
        select id, contract, status, attachment_document_id, created_at
        from portal_service_requests
        order by created_at desc
      `

  return result.rows.map(mapRequest)
}

export async function getRequestById(id: string, identity?: PortalIdentity): Promise<StoredRequest | undefined> {
  if (!isPortalDatabaseConfigured() && isPortalMockFallbackEnabled()) return undefined

  const db = requirePortalDatabase()
  const result = identity
    ? await db.sql<RequestRow>`
        select id, contract, status, attachment_document_id, created_at
        from portal_service_requests
        where id = ${id}
          and client_subject = ${identity.subject}
        limit 1
      `
    : await db.sql<RequestRow>`
        select id, contract, status, attachment_document_id, created_at
        from portal_service_requests
        where id = ${id}
        limit 1
      `

  return result.rows[0] ? mapRequest(result.rows[0]) : undefined
}
