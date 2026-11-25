/**
 * Step 3 (ML1 2026-11-25): MJL finishes and releases a client's engagement letter.
 *
 * The portal filed a Draft letter in the offer's folder of the Clients site Onboarding
 * library when the lead gave their details. To release it, MJL enters the Clio matter
 * number and approves. The Draft is downloaded, {Matter Number} is filled, and the result
 * is uploaded as a NEW file in the same folder, tagged Resource Status = Current. The Draft
 * itself is never changed.
 *
 * A release is refused, with the reason recorded for the admin page, when the letter
 * still has any {curly bracket} placeholder after the matter number is filled (MJL fixes
 * the Draft in SharePoint and retries) or still has tracked changes. Optional
 * [square bracket] text does not block a release.
 *
 * The release is always a human action by MJL; nothing here runs on its own. Signing and
 * payment are not handled (ML1's decision, in the portal or by email, is open).
 *
 * Server-only.
 */

import {
  downloadOnboardingFile,
  getOnboardingDriveId,
  isSharePointConfigured,
  setOnboardingFileFields,
  SharePointApiError,
  uploadNewOnboardingFile,
} from "src/lib/api/sharepointGraph"
import type { LeadService } from "src/lib/services/leadServices"
import { documentPlaceholders, fillDocx, hasTrackedChanges } from "./docxTemplate"
import { clientNameOf } from "./onboardingDetails"
import { COLUMNS, ONBOARDING_FOLDERS } from "./onboardingLibrary"
import type { OnboardingDetails } from "./onboardingStore"

/** Clio display number, as in the matter records: 24-256-00001, 26-1615-00003. */
export const MATTER_NUMBER_PATTERN = /^\d{2}-\d{3,4}-\d{5}$/

export function normalizeMatterNumber(value: string): string | null {
  const trimmed = value.trim()
  return MATTER_NUMBER_PATTERN.test(trimmed) ? trimmed : null
}

/**
 * Name of the released file: the Draft's name with "- Released" before the closing "LLS".
 * Keeps "LLS" in the name; never adds the firm name.
 */
export function releasedFileName(draftName: string): string {
  const base = draftName.replace(/\.docx$/i, "")
  const stem = base.replace(/\s+LLS$/, "")
  return `${stem} - Released LLS.docx`
}

export type ReleaseCheck = { ok: true; letter: Buffer } | { ok: false; reason: string }

/** Fills the matter number into the Draft and checks the result is fit to release. */
export function prepareRelease(draft: Buffer, matterNumber: string): ReleaseCheck {
  const letter = fillDocx(draft, { "Matter Number": matterNumber })
  if (hasTrackedChanges(letter)) {
    return {
      ok: false,
      reason: "The letter still has tracked changes. Accept or reject them in SharePoint, then retry.",
    }
  }
  const left = documentPlaceholders(letter)
  if (left.length > 0) {
    return {
      ok: false,
      reason: `Complete these in the Draft in SharePoint, then retry: ${left.join(", ")}`,
    }
  }
  return { ok: true, letter }
}

export type ReleaseResult =
  | { status: "released"; itemId: string; fileName: string }
  | { status: "refused"; reason: string }
  | { status: "error"; reason: string }

/** Releases one letter. Never throws: every outcome is returned. */
export async function releaseEngagementLetter(
  service: LeadService,
  details: OnboardingDetails,
  matterNumber: string
): Promise<ReleaseResult> {
  if (details.releasedAt) return { status: "refused", reason: "This letter has already been released." }
  if (details.sharepointStatus !== "uploaded" || !details.sharepointItemId || !details.sharepointFileName) {
    return { status: "refused", reason: "There is no filed Draft letter to release." }
  }
  if (!isSharePointConfigured()) return { status: "error", reason: "SharePoint is not configured." }
  const folder = ONBOARDING_FOLDERS[service.slug]
  if (!folder) return { status: "error", reason: `No Onboarding folder mapped for ${service.slug}.` }

  try {
    const driveId = await getOnboardingDriveId()
    if (!driveId) return { status: "error", reason: "The Onboarding library was not found on the Clients site." }

    const check = prepareRelease(await downloadOnboardingFile(driveId, details.sharepointItemId), matterNumber)
    if (!check.ok) return { status: "refused", reason: check.reason }

    const fileName = releasedFileName(details.sharepointFileName)
    const itemId = await uploadNewOnboardingFile(driveId, folder, fileName, check.letter)
    await setOnboardingFileFields(driveId, itemId, {
      [COLUMNS.serviceCode]: service.code,
      [COLUMNS.serviceName]: service.serviceName,
      [COLUMNS.offer]: service.title,
      [COLUMNS.portalSlug]: service.slug,
      [COLUMNS.onboardingDocument]: "Engagement Letter",
      [COLUMNS.resourceStatus]: "Current",
      [COLUMNS.agreementTemplate]: "Portal",
      [COLUMNS.clientName]: clientNameOf(details),
      [COLUMNS.instructingOfficer]: details.instructingOfficerName,
      [COLUMNS.signingParty]: details.signingCapacity === "corporation" ? "Corporation" : "Individual",
    })
    return { status: "released", itemId, fileName }
  } catch (err) {
    if (err instanceof SharePointApiError && err.status === 409) {
      return { status: "error", reason: "A released letter with this name is already in the folder." }
    }
    if (err instanceof SharePointApiError && (err.status === 401 || err.status === 403)) {
      return { status: "error", reason: "The portal is not permitted to write to the Onboarding library." }
    }
    return { status: "error", reason: err instanceof Error ? err.message : String(err) }
  }
}
