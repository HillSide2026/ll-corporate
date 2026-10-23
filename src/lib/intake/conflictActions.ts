"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { getPortalSession } from "src/lib/auth/session"
import { sendPortalNotification } from "src/lib/portal/portalNotifications"
import { leadServices } from "src/lib/services/leadServices"
import { normalizeRef, REF_COOKIE } from "./attribution"
import { parseScreening } from "./screening"
import {
  type ConflictRequest,
  createConflictRequest,
  decideConflictRequest,
  getLatestConflictRequest,
  recordCompletion,
  recordEngagement,
  recordPayment,
} from "./conflictRequestStore"

export type ConflictFormState = {
  error?: string
  field?: "applicantName" | "acknowledged" | "screening"
} | null

const MAX_FIELD = 2000

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "")
    .trim()
    .slice(0, MAX_FIELD)
}

export async function submitConflictCheck(_prev: ConflictFormState, formData: FormData): Promise<ConflictFormState> {
  const session = await getPortalSession()
  if (!session?.identity.email) redirect("/sign-in")

  const service = leadServices.find((s) => s.slug === field(formData, "serviceSlug"))
  if (!service) return { error: "That service is not available. Please choose a service again." }

  const applicantName = field(formData, "applicantName")
  if (!applicantName) return { error: "Enter your full legal name.", field: "applicantName" }
  const screening = parseScreening(service, formData)
  if (!screening) return { error: "Please answer each question above.", field: "screening" }
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
        source: normalizeRef((await cookies()).get(REF_COOKIE)?.value),
        screening,
      })
      await notifyIntake("intake_conflict_request_created", created)
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
  if (decided) await notifyIntake("intake_conflict_request_decided", decided)

  revalidatePath("/corporate/admin/conflicts")
}

/** Tells the CRM where the lead now stands. A failed notification never blocks the action. */
async function notifyIntake(
  type:
    | "intake_conflict_request_created"
    | "intake_conflict_request_decided"
    | "intake_engagement_recorded"
    | "intake_payment_recorded"
    | "intake_completion_recorded",
  request: ConflictRequest
): Promise<void> {
  await sendPortalNotification({
    type,
    requestId: request.id,
    email: request.userEmail,
    fullName: request.applicantName,
    status: request.status,
    serviceSlug: request.serviceSlug,
    serviceCode: request.finalServiceCode ?? request.serviceCode,
    source: request.source,
  }).catch((err: unknown) => console.warn(`${type}: notification failed`, err))
}

async function requireAdmin(): Promise<void> {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")
}

/** Parses "1,250" or "1250.00" dollars into cents; null if not a positive amount. */
function parseFeeCents(value: string): number | null {
  const amount = Number(value.replace(/[$,\s]/g, ""))
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : null
}

export async function recordEngagementAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = field(formData, "id")
  const finalServiceCode = field(formData, "finalServiceCode")
  const feeCents = parseFeeCents(field(formData, "fee"))
  if (!id || !finalServiceCode || feeCents === null) redirect("/corporate/admin/conflicts?error=engagement")
  const engaged = await recordEngagement(id, {
    finalServiceCode,
    feeCents,
    clioMatter: field(formData, "clioMatter") || null,
  })
  if (engaged) await notifyIntake("intake_engagement_recorded", engaged)
  revalidatePath("/corporate/admin/conflicts")
}

export async function recordPaymentAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = field(formData, "id")
  const paid = id ? await recordPayment(id) : null
  if (paid) await notifyIntake("intake_payment_recorded", paid)
  revalidatePath("/corporate/admin/conflicts")
}

export async function recordCompletionAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = field(formData, "id")
  const hours = Number(field(formData, "hours"))
  if (!id || !Number.isFinite(hours) || hours <= 0 || hours > 999) {
    redirect("/corporate/admin/conflicts?error=hours")
  }
  const completed = await recordCompletion(id, Math.round(hours * 100) / 100)
  if (completed) await notifyIntake("intake_completion_recorded", completed)
  revalidatePath("/corporate/admin/conflicts")
}
