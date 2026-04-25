import { describe, expect, it } from "vitest"

import { getServiceBySlug, getServicePriceDisplay, getServicePriceTypeLabel, serviceCatalog } from "./catalog"

describe("serviceCatalog", () => {
  it("defines the MVP corporate services with required catalog fields", () => {
    expect(serviceCatalog).toHaveLength(5)
    expect(serviceCatalog.map((service) => service.slug)).toEqual([
      "incorporation",
      "director-officer-change",
      "share-issuance",
      "minute-book-update",
      "annual-return-basic-filing",
    ])

    for (const service of serviceCatalog) {
      expect(service.title).not.toHaveLength(0)
      expect(service.description).not.toHaveLength(0)
      expect(["fixed", "estimate", "quote"]).toContain(service.priceType)
      expect(service.turnaround).not.toHaveLength(0)
      expect(service.scope.length).toBeGreaterThan(0)
      expect(service.assumptions.length).toBeGreaterThan(0)
      expect(service.requiredInputs.length).toBeGreaterThan(0)
      expect(service.ctaLabel).not.toHaveLength(0)
    }
  })

  it("keeps service slugs unique and lookup-friendly", () => {
    const slugs = serviceCatalog.map((service) => service.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(getServiceBySlug("share-issuance")?.title).toBe("Share Issuance")
    expect(getServiceBySlug("missing-service")).toBeUndefined()
  })

  it("formats pricing labels for UI surfaces", () => {
    const incorporation = getServiceBySlug("incorporation")

    expect(incorporation).toBeDefined()
    expect(getServicePriceTypeLabel("fixed")).toBe("Fixed fee")
    expect(getServicePriceTypeLabel("estimate")).toBe("Estimate")
    expect(getServicePriceTypeLabel("quote")).toBe("Quote")
    expect(incorporation ? getServicePriceDisplay(incorporation) : "").toBe("From $1,250 + disbursements")
    expect(getServicePriceDisplay({ ...serviceCatalog[0], price: undefined, priceType: "quote" })).toBe(
      "Quoted after review"
    )
  })
})
