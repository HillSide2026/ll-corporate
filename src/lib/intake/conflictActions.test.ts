// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest"

import { decideConflictCheck, submitConflictCheck } from "./conflictActions"

const mocks = vi.hoisted(() => ({
  getPortalSession: vi.fn(),
  getAdminSession: vi.fn(),
  createConflictRequest: vi.fn(),
  getLatestConflictRequest: vi.fn(),
  decideConflictRequest: vi.fn(),
  sendPortalNotification: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({ get: (name: string) => (name === "ll_ref" ? { value: "MSB-Partner" } : undefined) })),
}))
vi.mock("src/lib/auth/session", () => ({ getPortalSession: mocks.getPortalSession }))
vi.mock("src/lib/auth/adminAuth", () => ({ getAdminSession: mocks.getAdminSession }))
vi.mock("src/lib/portal/portalNotifications", () => ({ sendPortalNotification: mocks.sendPortalNotification }))
vi.mock("./conflictRequestStore", () => ({
  createConflictRequest: mocks.createConflictRequest,
  getLatestConflictRequest: mocks.getLatestConflictRequest,
  decideConflictRequest: mocks.decideConflictRequest,
}))

function conflictFormData(overrides: Record<string, string | null> = {}) {
  const values: Record<string, string | null> = {
    serviceSlug: "incorporation",
    applicantName: "Jane Founder",
    companyName: "Acme Ltd.",
    relatedParties: "John Cofounder",
    adverseParties: "",
    acknowledged: "on",
    ...overrides,
  }
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) {
    if (value !== null) formData.set(key, value)
  }
  return formData
}

describe("submitConflictCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getPortalSession.mockResolvedValue({ identity: { subject: "user-1", email: "jane@example.com" } })
    mocks.getLatestConflictRequest.mockResolvedValue(null)
    mocks.createConflictRequest.mockResolvedValue({
      id: "CC-1",
      userEmail: "jane@example.com",
      applicantName: "Jane Founder",
      status: "pending",
    })
    mocks.sendPortalNotification.mockResolvedValue(undefined)
  })

  it("records the parties and returns the lead to the status page", async () => {
    await expect(submitConflictCheck(null, conflictFormData())).rejects.toThrow("REDIRECT:/intake/start/incorporation")

    expect(mocks.createConflictRequest).toHaveBeenCalledWith({
      userId: "user-1",
      userEmail: "jane@example.com",
      serviceCode: "CORP-001",
      serviceSlug: "incorporation",
      applicantName: "Jane Founder",
      companyName: "Acme Ltd.",
      relatedParties: "John Cofounder",
      adverseParties: undefined,
      source: "msb-partner",
    })
    expect(mocks.sendPortalNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: "intake_conflict_request_created", requestId: "CC-1" })
    )
  })

  it("requires the acknowledgement", async () => {
    const result = await submitConflictCheck(null, conflictFormData({ acknowledged: null }))

    expect(result).toEqual({ error: "Please confirm you have read the note above.", field: "acknowledged" })
    expect(mocks.createConflictRequest).not.toHaveBeenCalled()
  })

  it("does not create a second request for the same service", async () => {
    mocks.getLatestConflictRequest.mockResolvedValue({ id: "CC-0", status: "declined" })

    await expect(submitConflictCheck(null, conflictFormData())).rejects.toThrow("REDIRECT:/intake/start/incorporation")
    expect(mocks.createConflictRequest).not.toHaveBeenCalled()
  })

  it("returns an error instead of throwing when the database is unavailable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    mocks.getLatestConflictRequest.mockRejectedValue(new Error("missing_connection_string"))

    const result = await submitConflictCheck(null, conflictFormData())

    expect(result).toEqual({ error: "We could not send your request right now. Please try again later." })
  })
})

describe("decideConflictCheck", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("refuses anyone who is not an admin", async () => {
    mocks.getAdminSession.mockResolvedValue({ isAdmin: false, isPreview: false })
    const formData = new FormData()
    formData.set("id", "CC-1")
    formData.set("decision", "cleared")

    await expect(decideConflictCheck(formData)).rejects.toThrow("REDIRECT:/corporate/admin/login")
    expect(mocks.decideConflictRequest).not.toHaveBeenCalled()
  })
})
