import type { PortalIdentity } from "src/lib/auth/session"
import { uploadPortalDocumentBlob } from "./blobStorage"
import { recordAuditEvent } from "./auditLog"
import { isPortalDatabaseConfigured, isPortalMockFallbackEnabled, requirePortalDatabase } from "./portalDb"

export type PortalDocumentRecord = {
  id: string
  matterKey: string
  filename: string
  fileUrl: string
  addedAt: string
  addedByName: string
  uploadedByClient: boolean
  blobPathname?: string
  addedBySubject?: string
  contentType?: string
  sizeBytes?: number
}

export type AddPortalDocumentInput = {
  matterKey: string
  filename: string
  blobPathname: string
  blobUrl: string
  contentType?: string
  sizeBytes?: number
  addedBySubject?: string
  addedByEmail?: string
  addedByName: string
  uploadedByClient: boolean
}

type DocumentRow = {
  id: string
  matter_key: string
  filename: string
  blob_pathname: string
  content_type: string | null
  size_bytes: number | string | null
  added_at: Date | string
  added_by_name: string
  added_by_subject: string | null
  uploaded_by_client: boolean
}

function mapDocument(row: DocumentRow): PortalDocumentRecord {
  return {
    id: row.id,
    matterKey: row.matter_key,
    filename: row.filename,
    fileUrl: `/corporate/api/documents/${encodeURIComponent(row.id)}/download`,
    addedAt: row.added_at instanceof Date ? row.added_at.toISOString() : row.added_at,
    addedByName: row.added_by_name,
    uploadedByClient: row.uploaded_by_client,
    blobPathname: row.blob_pathname,
    addedBySubject: row.added_by_subject ?? undefined,
    contentType: row.content_type ?? undefined,
    sizeBytes: row.size_bytes == null ? undefined : Number(row.size_bytes),
  }
}

export function isDocumentStoreConfigured(): boolean {
  return isPortalDatabaseConfigured()
}

export async function addPortalDocument(input: AddPortalDocumentInput): Promise<PortalDocumentRecord> {
  const db = requirePortalDatabase()
  const id = `DOC-${crypto.randomUUID()}`
  const addedAt = new Date().toISOString()
  const retentionUntil = new Date()
  retentionUntil.setFullYear(retentionUntil.getFullYear() + 7)

  const result = await db.sql<DocumentRow>`
    insert into portal_documents (
      id,
      matter_key,
      filename,
      blob_pathname,
      blob_url,
      content_type,
      size_bytes,
      added_at,
      added_by_subject,
      added_by_email,
      added_by_name,
      uploaded_by_client,
      retention_until
    )
    values (
      ${id},
      ${input.matterKey},
      ${input.filename},
      ${input.blobPathname},
      ${input.blobUrl},
      ${input.contentType ?? null},
      ${input.sizeBytes ?? null},
      ${addedAt},
      ${input.addedBySubject ?? null},
      ${input.addedByEmail ?? null},
      ${input.addedByName},
      ${input.uploadedByClient},
      ${retentionUntil.toISOString()}
    )
    returning id, matter_key, filename, blob_pathname, content_type, size_bytes, added_at, added_by_name, added_by_subject, uploaded_by_client
  `
  return mapDocument(result.rows[0]!)
}

export async function uploadAndStorePortalDocument({
  file,
  matterKey,
  uploadedByClient,
  uploader,
}: {
  file: File
  matterKey: string
  uploadedByClient: boolean
  uploader: PortalIdentity & { displayName?: string }
}): Promise<PortalDocumentRecord> {
  const blob = await uploadPortalDocumentBlob({
    file,
    matterKey,
    uploadedBySubject: uploader.subject,
  })

  const document = await addPortalDocument({
    matterKey,
    filename: file.name,
    blobPathname: blob.pathname,
    blobUrl: blob.url,
    contentType: blob.contentType ?? undefined,
    sizeBytes: file.size,
    addedBySubject: uploader.subject,
    addedByEmail: uploader.email,
    addedByName: uploader.displayName ?? uploader.email ?? "Levine Law",
    uploadedByClient,
  })

  await recordAuditEvent({
    action: uploadedByClient ? "client_document_uploaded" : "admin_document_uploaded",
    actor: { identity: uploader, role: uploadedByClient ? "client" : "admin" },
    matterKey,
    metadata: { filename: file.name, sizeBytes: file.size },
    resourceId: document.id,
    resourceType: "document",
  })

  return document
}

export async function getPortalDocuments(): Promise<PortalDocumentRecord[]> {
  if (!isPortalDatabaseConfigured() && isPortalMockFallbackEnabled()) return []

  const db = requirePortalDatabase()
  const result = await db.sql<DocumentRow>`
    select id, matter_key, filename, blob_pathname, content_type, size_bytes, added_at, added_by_name, added_by_subject, uploaded_by_client
    from portal_documents
    where deleted_at is null
    order by added_at desc
  `
  return result.rows.map(mapDocument)
}

export async function getPortalDocumentsForMatter(matterKey: string): Promise<PortalDocumentRecord[]> {
  if (!isPortalDatabaseConfigured() && isPortalMockFallbackEnabled()) return []

  const db = requirePortalDatabase()
  const result = await db.sql<DocumentRow>`
    select id, matter_key, filename, blob_pathname, content_type, size_bytes, added_at, added_by_name, added_by_subject, uploaded_by_client
    from portal_documents
    where matter_key = ${matterKey}
      and deleted_at is null
    order by added_at desc
  `
  return result.rows.map(mapDocument)
}

export async function getPortalDocumentById(id: string): Promise<PortalDocumentRecord | null> {
  if (!isPortalDatabaseConfigured() && isPortalMockFallbackEnabled()) return null

  const db = requirePortalDatabase()
  const result = await db.sql<DocumentRow>`
    select id, matter_key, filename, blob_pathname, content_type, size_bytes, added_at, added_by_name, added_by_subject, uploaded_by_client
    from portal_documents
    where id = ${id}
      and deleted_at is null
    limit 1
  `
  return result.rows[0] ? mapDocument(result.rows[0]) : null
}
