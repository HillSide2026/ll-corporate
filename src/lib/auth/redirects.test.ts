import { describe, expect, it } from "vitest"

import { afterSignInPath } from "./redirects"

describe("afterSignInPath", () => {
  it("keeps a known lead service through sign-in", () => {
    expect(afterSignInPath("letter-of-intent")).toBe("/auth/after-sign-in?service=letter-of-intent")
  })

  it("drops anything that is not a lead service", () => {
    expect(afterSignInPath("https://example.com")).toBe("/auth/after-sign-in")
    expect(afterSignInPath(null)).toBe("/auth/after-sign-in")
  })
})
