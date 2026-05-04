"use server"

import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { addMatterRequest, type MatterRequestCategory } from "src/lib/portal/matterRequestStore"

const VALID_CATEGORIES: MatterRequestCategory[] = ["Corporate", "Contract", "Financial Services"]

export async function submitMatterRequest(formData: FormData): Promise<void> {
  const session =
    (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/corporate")

  const category = formData.get("category")
  const description = formData.get("description")

  if (
    typeof category !== "string" ||
    !VALID_CATEGORIES.includes(category as MatterRequestCategory)
  ) {
    redirect("/corporate/app/requests/new?error=1")
  }

  if (typeof description !== "string" || description.trim().length < 10) {
    redirect("/corporate/app/requests/new?error=1")
  }

  const file = formData.get("attachment")
  const attachmentFilename =
    file instanceof File && file.name && file.size > 0 ? file.name : null

  const stored = addMatterRequest({
    category: category as MatterRequestCategory,
    description: description.trim(),
    attachmentFilename,
    submittedAt: new Date().toISOString(),
    clientIdentity: session.identity,
  })

  redirect(`/corporate/app/requests?mr=${stored.id}&submitted=1`)
}
