"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { getPortalSession } from "src/lib/auth/session"
import { sendPortalNotification } from "src/lib/portal/portalNotifications"
import { leadServices } from "src/lib/services/leadServices"
import { createConflictRequest, decideConflictRequest, getLatestConflictRequest } from "./conflictRequestStore"

export type ConflictFormState = {
  error?: string
  field?: "applicantName" | "acknowledged"
} | null

const MAX_FIELD = 2000

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim().slice(0, MAX_FIELD)
}

export async function submitConflictCheck(_prev: ConflictFormState, formData: FormData): Promise<ConflictFormState> {
  const session = await getPortalSession()
  if (!session?.identity.email) redirect("/sign-in")

  const service = leadServices.find((s) => s.slug === field(formData, "serviceSlug"))
  if (!service) return { error: "That service is not available. Please choose a service again." }

  const applicantName = field(formData, "applicantName")
  if (!applicantName) return { error: "Enter your full legal name.", field: "applicantName" }
  if (formData.get("acknowledged") !== "on") {
    return { error: "Please confirm you have read the note above.", field: "acknowledged" }
  }

  // A database failure must show a message, not crash the page
  try {
    const existing = await getLatestConflictRequest(session.identity.subject, service.slug)
    if (!existing) {
      const created = await createConflictRequest({
        userId: session.identity.subject,
        userEmail: session.identity.email,
        serviceCode: service.code,
        serviceSlug: service.slug,
        applicantName,
        companyName: field(formData, "companyName") || undefined,
        relatedParties: field(formData, "relatedParties") || undefined,
        adverseParties: field(formData, "adverseParties") || undefined,
      })
      await sendPortalNotification({
        type: "intake_conflict_request_created",
        requestId: created.id,
        email: created.userEmail,
        fullName: created.applicantName,
        status: created.status,
      }).catch((err: unknown) => console.warn("submitConflictCheck: notification failed", err))
    }
  } catch (err) {
    console.error("submitConflictCheck: conflict request store unavailable", err)
    return { error: "We could not send your request right now. Please try again later." }
  }

  redirect(`/intake/start/${service.slug}`)
}

export async function decideConflictCheck(formData: FormData): Promise<void> {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const id = String(formData.get("id") ?? "").trim()
  const decision = String(formData.get("decision") ?? "")
  if (!id || (decision !== "cleared" && decision !== "declined")) {
    redirect("/corporate/admin/conflicts?error=invalid")
  }

  const decided = await decideConflictRequest(id, decision)
  if (decided) {
    await sendPortalNotification({
      type: "intake_conflict_request_decided",
      requestId: decided.id,
      email: decided.userEmail,
      fullName: decided.applicantName,
      status: decided.status,
    }).catch((err: unknown) => console.warn("decideConflictCheck: notification failed", err))
  }

  revalidatePath("/corporate/admin/conflicts")
}
