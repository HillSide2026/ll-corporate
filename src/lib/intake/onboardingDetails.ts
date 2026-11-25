/**
 * Engagement letter details a lead gives after the conflict check clears (LLP-055, ML1
 * 2026-11-18: the portal's form asks for everything needed to complete the service's
 * agreement template). Per-client fields only, from the draft field list
 * "Onboarding Form 2026-10-09.docx" (Admin Onboarding Resources, Active Templates).
 * Firm-side fields on that list (matter number, fee, scope, service, responsible lawyer)
 * are set by Levine Law, not asked here. Never matter details.
 */

export const SALUTATIONS = ["Mr", "Ms", "Mx", "Dr"] as const
export type Salutation = (typeof SALUTATIONS)[number]

export type SigningCapacity = "personal" | "corporation"

export type OnboardingDetailsInput = {
  signingCapacity: SigningCapacity
  salutation: Salutation
  clientFirstName: string
  clientSurname: string
  /** Where documents and advice are delivered (defaults to the sign-in email). */
  clientEmail: string
  /** Corporation signing only: the corporation's legal name, the signer's title, authority. */
  corporationName: string | null
  signerTitle: string | null
  signingAuthority: boolean
  /** Person who instructs the Firm. Defaults to the signer. */
  instructingOfficerName: string
  instructingOfficerTitle: string | null
  instructingOfficerEmail: string | null
}

export type OnboardingField =
  | "signingCapacity"
  | "salutation"
  | "clientFirstName"
  | "clientSurname"
  | "clientEmail"
  | "corporationName"
  | "signerTitle"
  | "signingAuthority"
  | "instructingOfficerEmail"

export type OnboardingParseResult =
  | { ok: true; value: OnboardingDetailsInput }
  | { ok: false; field: OnboardingField; error: string }

const MAX_FIELD = 200
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_FIELD)
}

export function parseOnboardingDetails(formData: FormData, sessionEmail: string): OnboardingParseResult {
  const capacity = text(formData, "signingCapacity")
  if (capacity !== "personal" && capacity !== "corporation") {
    return { ok: false, field: "signingCapacity", error: "Choose who is signing the engagement letter." }
  }

  const salutation = text(formData, "salutation") as Salutation
  if (!SALUTATIONS.includes(salutation)) {
    return { ok: false, field: "salutation", error: "Choose how we should address you." }
  }

  const clientFirstName = text(formData, "clientFirstName")
  if (!clientFirstName) return { ok: false, field: "clientFirstName", error: "Enter your first name." }
  const clientSurname = text(formData, "clientSurname")
  if (!clientSurname) return { ok: false, field: "clientSurname", error: "Enter your surname." }

  const clientEmail = text(formData, "clientEmail") || sessionEmail
  if (!EMAIL.test(clientEmail)) return { ok: false, field: "clientEmail", error: "Enter a valid email address." }

  let corporationName: string | null = null
  let signerTitle: string | null = null
  let signingAuthority = false
  if (capacity === "corporation") {
    corporationName = text(formData, "corporationName") || null
    if (!corporationName) {
      return { ok: false, field: "corporationName", error: "Enter the corporation's full legal name." }
    }
    signerTitle = text(formData, "signerTitle") || null
    if (!signerTitle) return { ok: false, field: "signerTitle", error: "Enter your title at the corporation." }
    signingAuthority = formData.get("signingAuthority") === "on"
    if (!signingAuthority) {
      return { ok: false, field: "signingAuthority", error: "Confirm you have authority to bind the corporation." }
    }
  }

  const signerName = `${clientFirstName} ${clientSurname}`
  const instructingOfficerName = text(formData, "instructingOfficerName") || signerName
  const instructingOfficerTitle =
    text(formData, "instructingOfficerTitle") || (instructingOfficerName === signerName ? signerTitle : null)
  const instructingOfficerEmail =
    text(formData, "instructingOfficerEmail") || (instructingOfficerName === signerName ? clientEmail : null)
  if (instructingOfficerEmail && !EMAIL.test(instructingOfficerEmail)) {
    return { ok: false, field: "instructingOfficerEmail", error: "Enter a valid email address." }
  }

  return {
    ok: true,
    value: {
      signingCapacity: capacity,
      salutation,
      clientFirstName,
      clientSurname,
      clientEmail,
      corporationName,
      signerTitle,
      signingAuthority,
      instructingOfficerName,
      instructingOfficerTitle,
      instructingOfficerEmail,
    },
  }
}

/** The client as named on the letter: the corporation when it signs, otherwise the person. */
export function clientNameOf(details: OnboardingDetailsInput): string {
  return details.signingCapacity === "corporation" && details.corporationName
    ? details.corporationName
    : `${details.clientFirstName} ${details.clientSurname}`
}
