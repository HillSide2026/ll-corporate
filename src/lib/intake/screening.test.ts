import { describe, expect, it } from "vitest"

import { findLeadService } from "src/lib/services/leadServices"
import { parseScreening } from "./screening"

function form(values: Record<string, string>): FormData {
  const data = new FormData()
  for (const [key, value] of Object.entries(values)) data.set(key, value)
  return data
}

describe("parseScreening", () => {
  const review = findLeadService("letter-of-intent-review")!

  it("returns the answers when every question is answered with an option", () => {
    expect(parseScreening(review, form({ "screening.side": "Buying", "screening.signed": "Not yet" }))).toEqual({
      side: "Buying",
      signed: "Not yet",
    })
  })

  it("rejects a missing answer", () => {
    expect(parseScreening(review, form({ "screening.side": "Buying" }))).toBeNull()
  })

  it("rejects a value that is not an option", () => {
    expect(parseScreening(review, form({ "screening.side": "Leasing", "screening.signed": "Yes" }))).toBeNull()
  })

  it("returns no answers for a service without questions", () => {
    expect(parseScreening(findLeadService("incorporation")!, form({}))).toEqual({})
  })
})
