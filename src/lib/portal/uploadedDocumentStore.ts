/**
 * TEMPORARY — in-memory store for client-uploaded document metadata.
 *
 * Persists for the lifetime of the Node.js process. File bytes are NOT stored —
 * only filename, matterKey, and upload timestamp. Replace with real S3/R2
 * storage and a metadata API before production use.
 *
 * To remove:
 *   1. Replace addUploadedDocument / getUploadedDocuments with real S3/R2 upload
 *      and a metadata API call.
 *   2. Wire the fileUrl to the real storage URL.
 *   3. Delete this file.
 */

export type UploadedDocument = {
  id: string
  matterKey: string
  filename: string
  fileUrl: string
  addedAt: string
  addedByName: string
  uploadedByClient: true
}

const store = new Map<string, UploadedDocument>()

export function addUploadedDocument(
  doc: Omit<UploadedDocument, "id" | "uploadedByClient">,
): UploadedDocument {
  const id = `UPLOAD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const stored: UploadedDocument = { id, uploadedByClient: true, ...doc }
  store.set(id, stored)
  return stored
}

export function getUploadedDocuments(): UploadedDocument[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  )
}

export function getUploadedDocumentsForMatter(matterKey: string): UploadedDocument[] {
  return getUploadedDocuments().filter((d) => d.matterKey === matterKey)
}
