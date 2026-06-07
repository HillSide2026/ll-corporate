"use server"

import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { addMatterUpdate } from "./matterUpdateStore"
import { uploadAndStorePortalDocument } from "./documentStore"
import { validatePortalDocumentFile } from "./uploadValidation"

export async function postMatterUpdate(formData: FormData): Promise<void> {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const matterKey = formData.get("matterKey")
  const body = formData.get("body")
  const authorName = formData.get("authorName")

  if (typeof matterKey !== "string" || !matterKey) throw new Error("Missing matterKey.")
  if (typeof body !== "string" || !body.trim()) throw new Error("Update body is required.")
  if (typeof authorName !== "string" || !authorName.trim()) throw new Error("Author name is required.")

  await addMatterUpdate({
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
  if (!(file instanceof File)) throw new Error("No file selected.")
  validatePortalDocumentFile(file)

  await uploadAndStorePortalDocument({
    matterKey,
    file,
    uploadedByClient: false,
    uploader: {
      subject: "portal-admin",
      displayName: authorName.trim(),
    },
  })

  redirect(`/corporate/admin/matters/${encodeURIComponent(matterKey)}?uploaded=1`)
}
