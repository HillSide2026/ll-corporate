"use server"

import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { addMatterUpdate } from "./matterUpdateStore"
import { addAdminDocument } from "./adminDocumentStore"

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
])

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function postMatterUpdate(formData: FormData): Promise<void> {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const matterKey = formData.get("matterKey")
  const body = formData.get("body")
  const authorName = formData.get("authorName")

  if (typeof matterKey !== "string" || !matterKey) throw new Error("Missing matterKey.")
  if (typeof body !== "string" || !body.trim()) throw new Error("Update body is required.")
  if (typeof authorName !== "string" || !authorName.trim()) throw new Error("Author name is required.")

  addMatterUpdate({
    matterKey,
    body: body.trim(),
    authorName: authorName.trim(),
    addedAt: new Date().toISOString(),
  })

  redirect(`/corporate/admin/matters/${encodeURIComponent(matterKey)}?updated=1`)
}

export async function adminUploadDocument(formData: FormData): Promise<void> {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const matterKey = formData.get("matterKey")
  const file = formData.get("file")
  const authorName = formData.get("authorName")

  if (typeof matterKey !== "string" || !matterKey) throw new Error("Missing matterKey.")
  if (typeof authorName !== "string" || !authorName.trim()) throw new Error("Author name is required.")
  if (!(file instanceof File) || !file.name || file.size === 0) throw new Error("No file selected.")
  if (!ALLOWED_MIME_TYPES.has(file.type)) throw new Error("Unsupported file type.")
  if (file.size > MAX_FILE_SIZE) throw new Error("File exceeds 10 MB limit.")

  // TEMPORARY: file bytes discarded. Replace with S3/R2 upload.
  addAdminDocument({
    matterKey,
    filename: file.name,
    fileUrl: "#",
    addedAt: new Date().toISOString(),
    addedByName: authorName.trim(),
  })

  redirect(`/corporate/admin/matters/${encodeURIComponent(matterKey)}?uploaded=1`)
}
