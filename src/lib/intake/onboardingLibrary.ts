/**
 * Draft engagement letter for a cleared lead, written to the Clients site Onboarding
 * library (LLP-055, ML1 2026-11-18: one engagement agreement per service; the portal's
 * form asks for everything that service's template needs; the data goes to SharePoint).
 *
 * The template for each offer is the file in that offer's folder tagged
 * Onboarding Document = Engagement Letter, Agreement Template = Portal and
 * Resource Status = Current. Only a Current template is used: if there is none, no letter
 * is made and the submission is flagged. The letter is uploaded as a new Draft file in the
 * same folder; nothing is signed, sent or paid here (that step is ML1's open decision).
 *
 * Server-only.
 */

import {
  downloadOnboardingFile,
  getOnboardingDriveId,
  isSharePointConfigured,
  listOnboardingFolder,
  type OnboardingFolderItem,
  setOnboardingFileFields,
  SharePointApiError,
  uploadNewOnboardingFile,
} from "src/lib/api/sharepointGraph"
import type { LeadService } from "src/lib/services/leadServices"
import { fillDocx } from "./docxTemplate"
import { clientNameOf, type OnboardingDetailsInput } from "./onboardingDetails"
import type { SharePointStatus } from "./onboardingStore"

/**
 * Onboarding library folder for each offer, by portal slug. Change here if the folders
 * are renamed or moved; the path is relative to the library root.
 */
export const ONBOARDING_FOLDERS: Record<string, string> = {
  incorporation: "Incorporation",
  "founders-shareholder-agreement": "Founders' Agreement",
  "new-shareholder": "New Shareholder",
  "corporate-checkup": "Corporate CheckUp",
  "letter-of-intent": "Letter of Intent",
  "letter-of-intent-review": "Letter of Intent",
}

/** Internal names of the Onboarding library columns (created 2026-11-24). */
export const COLUMNS = {
  serviceCode: "ServiceCode",
  serviceName: "ServiceName",
  offer: "Offer",
  portalSlug: "PortalSlug",
  onboardingDocument: "OnboardingDocument",
  resourceStatus: "ResourceStatus",
  agreementTemplate: "AgreementTemplate",
  clientName: "ClientName",
  instructingOfficer: "InstructingOfficer",
  signingParty: "SigningParty",
} as const

/**
 * Picks the offer's Current portal engagement letter template from a folder listing.
 * A file tagged for a different offer (two offers can share a folder) is skipped, as is
 * anything already carrying a client name. Newest wins if there are several.
 */
export function selectTemplate(items: OnboardingFolderItem[], offerTitle: string): OnboardingFolderItem | null {
  const candidates = items.filter((item) => {
    const f = item.fields
    return (
      item.isFile &&
      item.name.toLowerCase().endsWith(".docx") &&
      f[COLUMNS.onboardingDocument] === "Engagement Letter" &&
      f[COLUMNS.agreementTemplate] === "Portal" &&
      f[COLUMNS.resourceStatus] === "Current" &&
      (!f[COLUMNS.offer] || f[COLUMNS.offer] === offerTitle) &&
      !f[COLUMNS.clientName]
    )
  })
  candidates.sort((a, b) => (b.lastModifiedAt ?? "").localeCompare(a.lastModifiedAt ?? ""))
  return candidates[0] ?? null
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

/** Today's date in Toronto, as the letter's {Day} {Month} {Year}. */
export function torontoDateParts(now: Date = new Date()): { day: string; month: string; year: string; iso: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  const year = get("year")
  const month = get("month")
  const day = get("day")
  return { day: String(Number(day)), month: MONTHS[Number(month) - 1]!, year, iso: `${year}-${month}-${day}` }
}

/** Per-client placeholder values for the portal template. {Matter Number} is left for Clio. */
export function placeholderValues(
  service: LeadService,
  details: OnboardingDetailsInput,
  now: Date = new Date()
): { values: Record<string, string>; optional: Array<{ text: string; keep: boolean }> } {
  const date = torontoDateParts(now)
  const corporation = details.signingCapacity === "corporation"
  const values: Record<string, string> = {
    Day: date.day,
    Month: date.month,
    Year: date.year,
    "Client First Name": details.clientFirstName,
    "Client Surname": details.clientSurname,
    Salutation: details.salutation,
    "Service Name": service.title,
  }
  if (corporation && details.corporationName) {
    values["Corporation Name"] = details.corporationName
    values["CORPORATION NAME"] = details.corporationName.toUpperCase()
    values["Title"] = details.signerTitle ?? ""
  }
  // The addressee line's optional segment is kept for a corporation, dropped otherwise
  const optional = [{ text: "[, {Title}, {Corporation Name}]", keep: corporation }]
  return { values, optional }
}

/** SharePoint file name: letters, digits, spaces and a few safe marks only. */
export function letterFileName(service: LeadService, details: OnboardingDetailsInput, now: Date = new Date()): string {
  const safe = (value: string) =>
    value
      .replace(/["*:<>?/\\|#%~&{}]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80)
  return `${safe(service.title)} Engagement Letter - ${safe(clientNameOf(details))} - ${torontoDateParts(now).iso} LLS.docx`
}

export type LetterResult = {
  status: SharePointStatus
  itemId?: string
  fileName?: string
  error?: string
}

/** Makes and files the draft letter. Never throws: every outcome is returned as a status. */
export async function generateEngagementLetter(
  service: LeadService,
  details: OnboardingDetailsInput,
  now: Date = new Date()
): Promise<LetterResult> {
  if (!isSharePointConfigured()) return { status: "not_configured", error: "SharePoint is not configured." }
  const folder = ONBOARDING_FOLDERS[service.slug]
  if (!folder) return { status: "no_template", error: `No Onboarding folder mapped for ${service.slug}.` }

  try {
    const driveId = await getOnboardingDriveId()
    if (!driveId) return { status: "error", error: "The Onboarding library was not found on the Clients site." }

    const template = selectTemplate(await listOnboardingFolder(driveId, folder), service.title)
    if (!template) {
      return { status: "no_template", error: `No Current portal engagement letter template in "${folder}".` }
    }

    const { values, optional } = placeholderValues(service, details, now)
    const letter = fillDocx(await downloadOnboardingFile(driveId, template.itemId), values, optional)
    const fileName = letterFileName(service, details, now)
    const itemId = await uploadNewOnboardingFile(driveId, folder, fileName, letter)

    await setOnboardingFileFields(driveId, itemId, {
      [COLUMNS.serviceCode]: service.code,
      [COLUMNS.serviceName]: service.serviceName,
      [COLUMNS.offer]: service.title,
      [COLUMNS.portalSlug]: service.slug,
      [COLUMNS.onboardingDocument]: "Engagement Letter",
      [COLUMNS.resourceStatus]: "Draft",
      [COLUMNS.agreementTemplate]: "Portal",
      [COLUMNS.clientName]: clientNameOf(details),
      [COLUMNS.instructingOfficer]: details.instructingOfficerName,
      [COLUMNS.signingParty]: details.signingCapacity === "corporation" ? "Corporation" : "Individual",
    })
    return { status: "uploaded", itemId, fileName }
  } catch (err) {
    if (err instanceof SharePointApiError && (err.status === 401 || err.status === 403)) {
      return { status: "not_permitted", error: err.message }
    }
    return { status: "error", error: err instanceof Error ? err.message : String(err) }
  }
}
