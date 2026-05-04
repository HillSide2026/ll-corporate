"use server"

import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { createIntakeRequestContract } from "src/lib/contracts/intake"
import { addRequest } from "src/lib/portal/requestStore"
import { getServiceBySlug } from "src/lib/services/catalog"

export async function submitServiceRequest(formData: FormData) {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/corporate")
  }

  const slug = formData.get("serviceSlug")
  if (typeof slug !== "string" || !slug) {
    redirect("/corporate/app")
  }

  const service = getServiceBySlug(slug)
  if (!service) {
    redirect("/corporate/app")
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

  // Capture optional file attachment metadata (bytes are not persisted — TEMPORARY).
  const file = formData.get("attachment")
  const attachment =
    file instanceof File && file.name && file.size > 0
      ? { filename: file.name, addedAt: now }
      : undefined

  const stored = addRequest(contract, attachment)

  redirect(`/corporate/app/requests/${stored.id}?submitted=1`)
}
