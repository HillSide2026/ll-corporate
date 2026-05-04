"use server"

import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { addUploadedDocument } from "./uploadedDocumentStore"

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
])

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export async function uploadMatterDocument(formData: FormData): Promise<void> {
  const session =
    (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/corporate")

  const matterKey = formData.get("matterKey")
  const file = formData.get("file")

  if (typeof matterKey !== "string" || !matterKey) {
    throw new Error("Missing matterKey.")
  }
  if (!(file instanceof File) || !file.name || file.size === 0) {
    throw new Error("No file selected.")
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Upload a PDF, DOCX, or image.")
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds the 10 MB limit.")
  }

  const displayName =
    session.identity.displayName ?? session.identity.email ?? "Client"

  // TEMPORARY: file bytes are discarded — only metadata is stored.
  // Replace with a real S3/R2 upload and store the resulting URL in fileUrl.
  addUploadedDocument({
    matterKey,
    filename: file.name,
    fileUrl: "#",
    addedAt: new Date().toISOString(),
    addedByName: displayName,
  })

  redirect(`/corporate/app/matters/${encodeURIComponent(matterKey)}?uploaded=1`)
}
