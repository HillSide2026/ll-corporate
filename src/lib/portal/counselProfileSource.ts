/**
 * TEMPORARY — mock counsel profile for the Scope summary page.
 *
 * In Phase 3+, this would be read from a real data source (Keycloak claims,
 * task tracker client record, or a simple config store). For now it returns
 * hardcoded mock data based on the Growth Counsel model.
 *
 * To remove:
 *   1. Replace getCounselProfile() with a real API or config lookup.
 *   2. Delete this file.
 */

export type CounselModel = "Essential" | "Growth" | "Strategic"

export type CounselProfile = {
  model: CounselModel
  startedAt: string
  lawyerName: string
  description: string
  scopeItems: string[]
}

const MOCK_PROFILE: CounselProfile = {
  model: "Growth",
  startedAt: "2026-01-15T00:00:00Z",
  lawyerName: "M. Levine",
  description:
    "Ongoing legal support across corporate, contracts, and financial services matters — structured around your business operations.",
  scopeItems: [
    "Corporate governance and ongoing maintenance",
    "Commercial contract review and negotiation",
    "Shareholder, director, and equity matters",
    "Financial services and payment-flow issue spotting",
    "Priority advisory on business decisions with legal implications",
  ],
}

export function getCounselProfile(): { profile: CounselProfile; isMock: boolean } {
  // TEMPORARY: always returns mock. Replace with real fetch.
  return { profile: MOCK_PROFILE, isMock: true }
}
