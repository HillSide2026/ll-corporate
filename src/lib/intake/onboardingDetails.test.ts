import { describe, expect, it } from "vitest"

import { clientNameOf, parseOnboardingDetails } from "./onboardingDetails"

function form(values: Record<string, string>): FormData {
  const data = new FormData()
  for (const [key, value] of Object.entries(values)) data.set(key, value)
  return data
}

const personal = { signingCapacity: "personal", salutation: "Ms", clientFirstName: "Ada", clientSurname: "Ng" }

describe("parseOnboardingDetails", () => {
  it("accepts a personal signer and defaults the email and instructing officer", () => {
    const result = parseOnboardingDetails(form(personal), "ada@example.com")
    expect(result).toEqual({
      ok: true,
      value: expect.objectContaining({
        clientEmail: "ada@example.com",
        instructingOfficerName: "Ada Ng",
        instructingOfficerEmail: "ada@example.com",
        corporationName: null,
        signingAuthority: false,
      }),
    })
  })

  it("requires the corporation's name, title and authority when signing for a corporation", () => {
    const base = { ...personal, signingCapacity: "corporation" }
    expect(parseOnboardingDetails(form(base), "a@b.co")).toMatchObject({ ok: false, field: "corporationName" })
    expect(parseOnboardingDetails(form({ ...base, corporationName: "Acme Inc." }), "a@b.co")).toMatchObject({
      ok: false,
      field: "signerTitle",
    })
    expect(
      parseOnboardingDetails(form({ ...base, corporationName: "Acme Inc.", signerTitle: "CEO" }), "a@b.co")
    ).toMatchObject({ ok: false, field: "signingAuthority" })
    const ok = parseOnboardingDetails(
      form({ ...base, corporationName: "Acme Inc.", signerTitle: "CEO", signingAuthority: "on" }),
      "a@b.co"
    )
    expect(ok.ok && clientNameOf(ok.value)).toBe("Acme Inc.")
    expect(ok.ok && ok.value.instructingOfficerTitle).toBe("CEO")
  })

  it("takes a separate instructing officer", () => {
    const result = parseOnboardingDetails(
      form({ ...personal, instructingOfficerName: "Bo Li", instructingOfficerEmail: "bo@example.com" }),
      "ada@example.com"
    )
    expect(result.ok && result.value.instructingOfficerName).toBe("Bo Li")
    expect(result.ok && result.value.instructingOfficerEmail).toBe("bo@example.com")
  })

  it("rejects a missing capacity, an unknown salutation and a bad email", () => {
    expect(parseOnboardingDetails(form({ ...personal, signingCapacity: "" }), "a@b.co")).toMatchObject({
      field: "signingCapacity",
    })
    expect(parseOnboardingDetails(form({ ...personal, salutation: "Sir" }), "a@b.co")).toMatchObject({
      field: "salutation",
    })
    expect(parseOnboardingDetails(form({ ...personal, clientEmail: "nope" }), "a@b.co")).toMatchObject({
      field: "clientEmail",
    })
  })
})
