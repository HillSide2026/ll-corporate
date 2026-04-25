import { describe, expect, it } from "vitest"

import { getServiceBySlug } from "src/lib/services/catalog"

import { createIntakeRequestContract, validateIntakeRequestContract } from "./intake"

const incorporation = getServiceBySlug("incorporation")

describe("intake request contract", () => {
  it("creates a contract-shaped request package with catalog snapshots", () => {
    expect(incorporation).toBeDefined()

    const request = createIntakeRequestContract({
      service: incorporation!,
      clientIdentity: {
        subject: "user-123",
        displayName: "Client User",
        email: "client@example.com",
      },
      inputPayload: {
        jurisdiction: "Ontario",
      },
      engagementAcknowledgedAt: "2026-04-24T12:00:00.000Z",
      createdAt: "2026-04-24T12:01:00.000Z",
    })

    expect(request).toMatchObject({
      serviceSlug: "incorporation",
      serviceTitle: "Incorporation",
      source: "ll-corporate",
      pricingSnapshot: {
        priceType: "estimate",
        priceDisplay: "From $1,250 + disbursements",
      },
    })
    expect(request.scopeSnapshot).toEqual(incorporation?.scope)
    expect(request.assumptionsSnapshot).toEqual(incorporation?.assumptions)
    expect(request.scopeSnapshot).not.toBe(incorporation?.scope)
    expect(validateIntakeRequestContract(request).success).toBe(true)
  })

  it("rejects missing required contract fields", () => {
    const result = validateIntakeRequestContract({
      serviceSlug: "incorporation",
      serviceTitle: "Incorporation",
    })

    expect(result.success).toBe(false)
  })

  it("rejects invalid timestamps", () => {
    expect(incorporation).toBeDefined()

    const request = createIntakeRequestContract({
      service: incorporation!,
      clientIdentity: {
        subject: "user-123",
      },
      inputPayload: {},
      engagementAcknowledgedAt: "not-a-date",
      createdAt: "2026-04-24T12:01:00.000Z",
    })

    expect(validateIntakeRequestContract(request).success).toBe(false)
  })
})
