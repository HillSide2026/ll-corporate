"use server"

import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession, isClientPortalSession } from "src/lib/auth/session"
import { uploadAndStorePortalDocument } from "./documentStore"
import { validatePortalDocumentFile } from "./uploadValidation"

export async function uploadMatterDocument(formData: FormData): Promise<void> {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/sign-in")
  if (!isClientPortalSession(session)) redirect("/intake")

  const matterKey = formData.get("matterKey")
  const file = formData.get("file")

  if (typeof matterKey !== "string" || !matterKey) {
    throw new Error("Missing matterKey.")
  }
  if (!(file instanceof File)) {
    throw new Error("No file selected.")
  }
  validatePortalDocumentFile(file)

  await uploadAndStorePortalDocument({
    matterKey,
    file,
    uploadedByClient: true,
    uploader: session.identity,
  })

  redirect(`/corporate/app/matters/${encodeURIComponent(matterKey)}?uploaded=1`)
}
