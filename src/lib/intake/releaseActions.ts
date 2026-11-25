"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { sendPortalNotification } from "src/lib/portal/portalNotifications"
import { leadServices } from "src/lib/services/leadServices"
import { getConflictRequestById } from "./conflictRequestStore"
import { getOnboardingDetailsById, recordRelease, recordReleaseError } from "./onboardingStore"
import { normalizeMatterNumber, releaseEngagementLetter } from "./releaseLetter"

const PAGE = "/corporate/admin/onboarding"

/**
 * MJL's "Approve and release to client" (step 3, ML1 2026-11-25). Admin only. The outcome
 * (released, or the reason it was refused) is shown on the onboarding admin page.
 */
export async function releaseEngagementLetterAction(formData: FormData): Promise<void> {
  const { isAdmin, isPreview } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")
  if (isPreview) redirect(`${PAGE}?error=preview`)

  const id = String(formData.get("id") ?? "").trim()
  const matterNumber = normalizeMatterNumber(String(formData.get("matterNumber") ?? ""))
  if (!id) redirect(`${PAGE}?error=invalid`)
  if (!matterNumber) redirect(`${PAGE}?error=matter&id=${encodeURIComponent(id)}`)

  const details = await getOnboardingDetailsById(id)
  const request = details ? await getConflictRequestById(details.conflictRequestId) : null
  const service = request ? leadServices.find((s) => s.slug === request.serviceSlug) : undefined
  if (!details || !request || !service) redirect(`${PAGE}?error=invalid`)

  const result = await releaseEngagementLetter(service, details, matterNumber)
  if (result.status !== "released") {
    await recordReleaseError(details.id, result.reason).catch((err: unknown) =>
      console.error("releaseEngagementLetterAction: could not record the refusal", err)
    )
  } else {
    const released = await recordRelease(details.id, {
      matterNumber,
      itemId: result.itemId,
      fileName: result.fileName,
    })
    if (released) {
      // Names, service and outcome only: never matter details
      await sendPortalNotification({
        type: "intake_engagement_letter_released",
        requestId: request.id,
        email: request.userEmail,
        fullName: request.applicantName,
        status: "released",
        serviceSlug: service.slug,
        serviceCode: service.code,
        source: request.source,
      }).catch((err: unknown) => console.warn("intake_engagement_letter_released: notification failed", err))
    }
  }

  revalidatePath(PAGE)
  revalidatePath("/corporate/admin/conflicts")
  revalidatePath(`/intake/start/${service.slug}`)
}
