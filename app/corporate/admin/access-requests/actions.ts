"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import type { PortalAccessRequestStatus } from "src/lib/portal/accessRequestApi"
import {
  PortalAccessRequestStatusSchema,
  updatePortalAccessRequest,
} from "src/lib/portal/accessRequestApi"
import { sendPortalNotification } from "src/lib/portal/portalNotifications"

export async function updateAccessRequestStatus(formData: FormData): Promise<void> {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const id = String(formData.get("id") ?? "").trim()
  const status = String(formData.get("status") ?? "").trim()
  const internalNote = String(formData.get("internalNote") ?? "").trim()
  const keycloakUserId = String(formData.get("keycloakUserId") ?? "").trim()

  const parsedStatus = PortalAccessRequestStatusSchema.safeParse(status)
  if (!id || !parsedStatus.success) {
    redirect("/corporate/admin/access-requests?error=invalid")
  }

  const updated = await updatePortalAccessRequest(id, {
    status: parsedStatus.data as PortalAccessRequestStatus,
    internalNote: internalNote || undefined,
    keycloakUserId: keycloakUserId || undefined,
  })

  await sendPortalNotification({
    type: "portal_access_request_status_changed",
    requestId: updated.id,
    email: updated.email,
    fullName: updated.fullName,
    status: updated.status,
  })

  revalidatePath("/corporate/admin/access-requests")
  redirect("/corporate/admin/access-requests?updated=1")
}
