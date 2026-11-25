"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getPortalSession } from "src/lib/auth/session"
import { sendPortalNotification } from "src/lib/portal/portalNotifications"
import { leadServices } from "src/lib/services/leadServices"
import { getLatestConflictRequest } from "./conflictRequestStore"
import { type OnboardingField, parseOnboardingDetails } from "./onboardingDetails"
import { generateEngagementLetter } from "./onboardingLibrary"
import { createOnboardingDetails, getOnboardingDetails, recordSharePointResult } from "./onboardingStore"

export type OnboardingFormState = { error?: string; field?: OnboardingField } | null

/**
 * The lead's engagement letter details, after the conflict check clears. Recorded once per
 * conflict request; the draft letter is then made in SharePoint and ML1 is alerted. A
 * SharePoint failure never blocks the lead: it is recorded and flagged for Levine Law.
 */
export async function submitOnboardingDetails(
  _prev: OnboardingFormState,
  formData: FormData
): Promise<OnboardingFormState> {
  const session = await getPortalSession()
  if (!session?.identity.email) redirect("/sign-in")

  const service = leadServices.find((s) => s.slug === String(formData.get("serviceSlug") ?? ""))
  if (!service) return { error: "That service is not available." }

  const parsed = parseOnboardingDetails(formData, session.identity.email)
  if (!parsed.ok) return { error: parsed.error, field: parsed.field }

  try {
    const request = await getLatestConflictRequest(session.identity.subject, service.slug)
    if (!request || request.status !== "cleared") {
      return { error: "These details can only be given once the conflict check is complete." }
    }
    if (await getOnboardingDetails(request.id)) redirect(`/intake/start/${service.slug}`)

    const created = await createOnboardingDetails({
      conflictRequestId: request.id,
      userId: session.identity.subject,
      details: parsed.value,
    })
    if (created) {
      const letter = await generateEngagementLetter(service, parsed.value)
      await recordSharePointResult(created.id, letter).catch((err: unknown) =>
        console.error("submitOnboardingDetails: could not record SharePoint result", err)
      )
      if (letter.status !== "uploaded") {
        console.warn(`submitOnboardingDetails: letter not filed (${letter.status}) for ${request.id}: ${letter.error}`)
      }
      // Names, service and outcome only: never matter details
      await sendPortalNotification({
        type: "intake_onboarding_details_submitted",
        requestId: request.id,
        email: request.userEmail,
        fullName: request.applicantName,
        status: letter.status,
        serviceSlug: service.slug,
        serviceCode: service.code,
        source: request.source,
      }).catch((err: unknown) => console.warn("intake_onboarding_details_submitted: notification failed", err))
    }
  } catch (err) {
    // redirect() throws a control-flow error that must pass through
    if (err && typeof err === "object" && "digest" in err) throw err
    console.error("submitOnboardingDetails: onboarding store unavailable", err)
    return { error: "We could not save your details right now. Please try again later." }
  }

  revalidatePath(`/intake/start/${service.slug}`)
  redirect(`/intake/start/${service.slug}`)
}
