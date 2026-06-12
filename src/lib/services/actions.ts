"use server"

import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession, isClientPortalSession } from "src/lib/auth/session"
import { createIntakeRequestContract } from "src/lib/contracts/intake"
import { addRequest } from "src/lib/portal/requestStore"
import { uploadAndStorePortalDocument } from "src/lib/portal/documentStore"
import { validatePortalDocumentFile } from "src/lib/portal/uploadValidation"
import { getServiceBySlug } from "src/lib/services/catalog"

export async function submitServiceRequest(formData: FormData) {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/sign-in")
  }
  if (!isClientPortalSession(session)) {
    redirect("/intake")
  }

  const slug = formData.get("serviceSlug")
  if (typeof slug !== "string" || !slug) {
    redirect("/intake")
  }

  const service = getServiceBySlug(slug)
  if (!service) {
    redirect("/intake")
  }

  const now = new Date().toISOString()

  // Build inputPayload from requiredInputs using index-based keys.
  const inputPayload: Record<string, unknown> = {}
  service.requiredInputs.forEach((label, index) => {
    const value = formData.get(`field_${index}`)
    inputPayload[`field_${index}`] = {
      label,
      value: typeof value === "string" ? value.trim() : "",
    }
  })

  const contract = createIntakeRequestContract({
    service,
    clientIdentity: session.identity,
    inputPayload,
    engagementAcknowledgedAt: now,
    createdAt: now,
  })

  const file = formData.get("attachment")
  let attachment
  if (file instanceof File && file.name && file.size > 0) {
    validatePortalDocumentFile(file)
    attachment = await uploadAndStorePortalDocument({
      file,
      matterKey: `service-request/${service.slug}`,
      uploadedByClient: true,
      uploader: session.identity,
    })
  }

  const stored = await addRequest(
    contract,
    attachment
      ? {
          documentId: attachment.id,
          filename: attachment.filename,
          addedAt: attachment.addedAt,
        }
      : undefined,
    session.identity
  )

  redirect(`/corporate/app/requests/${stored.id}?submitted=1`)
}
