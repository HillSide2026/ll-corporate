import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { ConflictRequest } from "src/lib/intake/conflictRequestStore"
import { leadServices } from "src/lib/services/leadServices"
import { ConflictCheckView, showsSellingPoints } from "./ConflictCheckView"

// The forms post to server actions; the view's own logic is what is tested here
vi.mock("./ConflictCheckForm", () => ({ ConflictCheckForm: () => <div>conflict form</div> }))
vi.mock("./OnboardingDetailsForm", () => ({ OnboardingDetailsForm: () => <div>details form</div> }))

const service = leadServices.find((s) => s.slug === "incorporation")!

function request(status: ConflictRequest["status"]): ConflictRequest {
  return {
    id: "CC-1",
    userId: "user-1",
    userEmail: "jane@example.com",
    serviceCode: "CORP-001",
    serviceSlug: "incorporation",
    applicantName: "Jane Founder",
    companyName: null,
    relatedParties: "John Cofounder",
    adverseParties: null,
    status,
    decidedAt: null,
    createdAt: "2026-11-25T12:00:00Z",
    source: null,
    screening: null,
    engagedAt: null,
    finalServiceCode: null,
    feeCents: null,
    clioMatter: null,
    paidAt: null,
    completedAt: null,
    hours: null,
  }
}

const heading = `Why Levine Law for ${service.title}`

describe("offer selling points", () => {
  it("every offer has selling points", () => {
    for (const offer of leadServices) expect(offer.sellingPoints.length).toBeGreaterThan(0)
  })

  it("are not shown before the conflict check is sent", () => {
    render(<ConflictCheckView service={service} request={null} email="jane@example.com" />)
    expect(screen.queryByRole("heading", { name: heading })).toBeNull()
    expect(showsSellingPoints(null)).toBe(false)
  })

  it("are shown once the conflict check is sent", () => {
    render(<ConflictCheckView service={service} request={request("pending")} email="jane@example.com" />)
    expect(screen.getByRole("heading", { name: heading })).toBeTruthy()
    expect(screen.getByText(service.sellingPoints[0]!)).toBeTruthy()
  })

  it("stay shown after the check clears", () => {
    expect(showsSellingPoints(request("cleared"))).toBe(true)
  })

  it("are not shown when Levine Law cannot act", () => {
    render(<ConflictCheckView service={service} request={request("declined")} email="jane@example.com" />)
    expect(screen.queryByRole("heading", { name: heading })).toBeNull()
  })
})
