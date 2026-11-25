// @vitest-environment node
import { describe, expect, it } from "vitest"

import type { OnboardingFolderItem } from "src/lib/api/sharepointGraph"
import { findLeadService, leadServices } from "src/lib/services/leadServices"
import type { OnboardingDetailsInput } from "./onboardingDetails"
import {
  letterFileName,
  ONBOARDING_FOLDERS,
  placeholderValues,
  selectTemplate,
  torontoDateParts,
} from "./onboardingLibrary"

function item(
  name: string,
  fields: Record<string, unknown>,
  lastModifiedAt = "2026-11-24T00:00:00Z"
): OnboardingFolderItem {
  return { itemId: name, name, isFile: true, lastModifiedAt, fields }
}

const current = { OnboardingDocument: "Engagement Letter", AgreementTemplate: "Portal", ResourceStatus: "Current" }

const corporate: OnboardingDetailsInput = {
  signingCapacity: "corporation",
  salutation: "Ms",
  clientFirstName: "Ada",
  clientSurname: "Ng",
  clientEmail: "ada@example.com",
  corporationName: "Acme Inc.",
  signerTitle: "CEO",
  signingAuthority: true,
  instructingOfficerName: "Ada Ng",
  instructingOfficerTitle: "CEO",
  instructingOfficerEmail: "ada@example.com",
}

describe("ONBOARDING_FOLDERS", () => {
  it("maps every portal offer to a folder", () => {
    for (const s of leadServices) expect(ONBOARDING_FOLDERS[s.slug]).toBeTruthy()
  })
})

describe("selectTemplate", () => {
  it("uses only a Current portal engagement letter", () => {
    const items = [
      item("draft.docx", { ...current, ResourceStatus: "Draft" }),
      item("scope.docx", { ...current, OnboardingDocument: "Scope" }),
      item("corp.docx", { ...current, AgreementTemplate: "Corporation" }),
    ]
    expect(selectTemplate(items, "Incorporation")).toBeNull()
    expect(selectTemplate([...items, item("t.docx", current)], "Incorporation")?.name).toBe("t.docx")
  })

  it("skips another offer's template and client letters, and prefers the newest", () => {
    const items = [
      item("review.docx", { ...current, Offer: "Review Letter of Intent" }),
      item("client.docx", { ...current, ClientName: "Acme Inc." }),
      item("old.docx", { ...current, Offer: "Prepare Letter of Intent" }, "2026-11-01T00:00:00Z"),
      item("new.docx", { ...current, Offer: "Prepare Letter of Intent" }, "2026-11-20T00:00:00Z"),
    ]
    expect(selectTemplate(items, "Prepare Letter of Intent")?.name).toBe("new.docx")
  })
})

describe("placeholderValues", () => {
  const service = findLeadService("incorporation")!
  const now = new Date("2026-11-25T03:00:00Z") // 24 November in Toronto

  it("dates the letter in Toronto time", () => {
    expect(torontoDateParts(now)).toEqual({ day: "24", month: "November", year: "2026", iso: "2026-11-24" })
  })

  it("fills the corporation fields and keeps the addressee segment for a corporation", () => {
    const { values, optional } = placeholderValues(service, corporate, now)
    expect(values).toMatchObject({ "CORPORATION NAME": "ACME INC.", Title: "CEO", Salutation: "Ms" })
    expect(optional).toEqual([{ text: "[, {Title}, {Corporation Name}]", keep: true }])
    expect(values["Matter Number"]).toBeUndefined()
  })

  it("drops the addressee segment for a personal signer", () => {
    const personal = { ...corporate, signingCapacity: "personal" as const, corporationName: null, signerTitle: null }
    const { values, optional } = placeholderValues(service, personal, now)
    expect(values["Corporation Name"]).toBeUndefined()
    expect(optional[0]!.keep).toBe(false)
  })

  it("names the file with LLS and no unsafe characters", () => {
    const name = letterFileName(service, { ...corporate, corporationName: 'Acme: "One" Inc.' }, now)
    expect(name).toBe("Incorporation Engagement Letter - Acme One Inc. - 2026-11-24 LLS.docx")
  })
})

describe("letter of intent offers", () => {
  it("draw on COMM-022 and keep unique offer keys", () => {
    const loi = leadServices.filter((s) => s.code === "COMM-022").map((s) => s.offerKey)
    expect(loi).toEqual(["MA-LOI-PREP", "MA-LOI-REVIEW"])
    expect(new Set(leadServices.map((s) => s.offerKey)).size).toBe(leadServices.length)
  })
})
