import { describe, expect, it } from "vitest"

import { normalizeRef } from "./attribution"

describe("normalizeRef", () => {
  it("keeps simple source codes, lower-cased", () => {
    expect(normalizeRef("Newsletter")).toBe("newsletter")
    expect(normalizeRef("msb-partner-01")).toBe("msb-partner-01")
  })

  it("drops anything that is not a plain code", () => {
    expect(normalizeRef("")).toBeNull()
    expect(normalizeRef(null)).toBeNull()
    expect(normalizeRef("<script>")).toBeNull()
    expect(normalizeRef("a".repeat(41))).toBeNull()
    expect(normalizeRef("-leading")).toBeNull()
  })
})
