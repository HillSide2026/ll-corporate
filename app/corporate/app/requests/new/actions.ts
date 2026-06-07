"use server"

import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { uploadAndStorePortalDocument } from "src/lib/portal/documentStore"
import { addMatterRequest, type MatterRequestCategory } from "src/lib/portal/matterRequestStore"
import { validatePortalDocumentFile } from "src/lib/portal/uploadValidation"

const VALID_CATEGORIES: MatterRequestCategory[] = ["Corporate", "Contract", "Financial Services"]

export async function submitMatterRequest(formData: FormData): Promise<void> {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/corporate")

  const category = formData.get("category")
  const description = formData.get("description")

  if (typeof category !== "string" || !VALID_CATEGORIES.includes(category as MatterRequestCategory)) {
    redirect("/corporate/app/requests/new?error=1")
  }

  if (typeof description !== "string" || description.trim().length < 10) {
    redirect("/corporate/app/requests/new?error=1")
  }

  const file = formData.get("attachment")
  let attachment = null
  if (file instanceof File && file.name && file.size > 0) {
    validatePortalDocumentFile(file)
    attachment = await uploadAndStorePortalDocument({
      file,
      matterKey: `matter-request/${String(category).toLowerCase().replace(/\s+/g, "-")}`,
      uploadedByClient: true,
      uploader: session.identity,
    })
  }

  const stored = await addMatterRequest({
    category: category as MatterRequestCategory,
    description: description.trim(),
    attachmentDocumentId: attachment?.id ?? null,
    attachmentFilename: attachment?.filename ?? null,
    submittedAt: new Date().toISOString(),
    clientIdentity: session.identity,
  })

  redirect(`/corporate/app/requests?mr=${stored.id}&submitted=1`)
}
