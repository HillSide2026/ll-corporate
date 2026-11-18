import { describe, expect, it } from "vitest"

import type { ConflictRequest } from "./conflictRequestStore"
import { buildScorecard } from "./scorecard"

function request(overrides: Partial<ConflictRequest>): ConflictRequest {
  return {
    id: "CC-1",
    userId: "u1",
    userEmail: "a@example.com",
    serviceCode: "CORP-001",
    serviceSlug: "incorporation",
    applicantName: "A",
    companyName: null,
    relatedParties: null,
    adverseParties: null,
    status: "pending",
    decidedAt: null,
    createdAt: "2026-10-01T00:00:00.000Z",
    source: null,
    screening: null,
    engagedAt: null,
    finalServiceCode: null,
    feeCents: null,
    clioMatter: null,
    paidAt: null,
    completedAt: null,
    hours: null,
    ...overrides,
  }
}

describe("buildScorecard", () => {
  it("counts the funnel and works out fee per hour from completed jobs", () => {
    const rows = buildScorecard(
      [
        request({ id: "1" }),
        request({ id: "2", status: "declined" }),
        request({
          id: "3",
          status: "cleared",
          engagedAt: "2026-10-02T00:00:00.000Z",
          finalServiceCode: "CORP-001",
          feeCents: 150000,
          paidAt: "2026-10-03T00:00:00.000Z",
          completedAt: "2026-10-11T00:00:00.000Z",
          hours: 3,
        }),
        request({
          id: "4",
          status: "cleared",
          engagedAt: "2026-10-02T00:00:00.000Z",
          finalServiceCode: "CORP-009",
          feeCents: 250000,
        }),
      ],
      [{ serviceSlug: "incorporation", source: null, event: "started", count: 9 }],
      (item) => item.serviceSlug
    )

    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      started: 9,
      requested: 4,
      cleared: 2,
      declined: 1,
      engaged: 2,
      switched: 1,
      paid: 1,
      completed: 1,
      revenueCents: 150000,
      avgFeeCents: 150000,
      avgHours: 3,
      effectiveHourlyCents: 50000,
      avgDaysToComplete: 10,
    })
  })

  it("groups by source, with unknown sources as direct", () => {
    const rows = buildScorecard(
      [request({ id: "1", source: "newsletter" }), request({ id: "2" })],
      [],
      (item) => item.source ?? "direct"
    )
    expect(rows.map((r) => [r.key, r.requested])).toEqual([
      ["newsletter", 1],
      ["direct", 1],
    ])
  })
})
