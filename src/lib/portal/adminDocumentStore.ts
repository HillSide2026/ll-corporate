/**
 * TEMPORARY — in-memory store for documents uploaded by the lawyer via the admin surface.
 *
 * Mirrors the shape of PortalDocument from mockDocuments.ts so it can be
 * merged cleanly into the client-facing documents list.
 *
 * Persists for the lifetime of the Node.js process. Replace with real S3/R2
 * storage before production use.
 *
 * To remove:
 *   1. Replace add/get with real document storage API calls.
 *   2. Delete this file.
 */

export type AdminUploadedDocument = {
  id: string
  matterKey: string
  filename: string
  fileUrl: string
  addedAt: string
  addedByName: string
}

const store = new Map<string, AdminUploadedDocument>()

export function addAdminDocument(
  doc: Omit<AdminUploadedDocument, "id">,
): AdminUploadedDocument {
  const id = `ADMIN-DOC-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const stored: AdminUploadedDocument = { id, ...doc }
  store.set(id, stored)
  return stored
}

export function getAdminDocuments(): AdminUploadedDocument[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  )
}
