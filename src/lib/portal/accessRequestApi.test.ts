// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest"

function requestFixture(overrides: Record<string, unknown> = {}) {
  return {
    id: "PAR-1",
    fullName: "Alex Client",
    email: "alex@example.com",
    company: "Example Co.",
    phone: "555-0100",
    description: "Requesting portal access for matter updates.",
    status: "pending",
    submittedAt: "2026-06-01T12:00:00.000Z",
    legalAcknowledgedAt: "2026-06-01T12:00:00.000Z",
    ...overrides,
  }
}

describe("access request API adapter", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it("requires both the API base URL and token", async () => {
    vi.stubEnv("PORTAL_ACCESS_REQUEST_API_BASE_URL", "https://intake.example.com")

    const { isPortalAccessRequestApiConfigured } = await import("./accessRequestApi")

    expect(isPortalAccessRequestApiConfigured()).toBe(false)
  })

  it("creates a portal access request through the configured API", async () => {
    vi.stubEnv("PORTAL_ACCESS_REQUEST_API_BASE_URL", "https://intake.example.com")
    vi.stubEnv("PORTAL_ACCESS_REQUEST_API_TOKEN", "secret")
    const fetchMock = vi.fn(async () => Response.json(requestFixture()))
    vi.stubGlobal("fetch", fetchMock)

    const { createPortalAccessRequest } = await import("./accessRequestApi")

    const request = await createPortalAccessRequest({
      fullName: "Alex Client",
      email: "alex@example.com",
      company: "Example Co.",
      phone: "555-0100",
      description: "Requesting portal access for matter updates.",
      legalAcknowledgedAt: "2026-06-01T12:00:00.000Z",
    })

    expect(request.id).toBe("PAR-1")
    expect(fetchMock).toHaveBeenCalledWith("https://intake.example.com/portal-access-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret",
      },
      body: expect.stringContaining('"type":"portal_access_request"'),
    })
  })

  it("lists portal access requests", async () => {
    vi.stubEnv("PORTAL_ACCESS_REQUEST_API_BASE_URL", "https://intake.example.com/")
    vi.stubEnv("PORTAL_ACCESS_REQUEST_API_TOKEN", "secret")
    const fetchMock = vi.fn(async () => Response.json({ requests: [requestFixture()] }))
    vi.stubGlobal("fetch", fetchMock)

    const { listPortalAccessRequests } = await import("./accessRequestApi")

    await expect(listPortalAccessRequests()).resolves.toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith("https://intake.example.com/portal-access-requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret",
      },
    })
  })

  it("updates the review status for a request", async () => {
    vi.stubEnv("PORTAL_ACCESS_REQUEST_API_BASE_URL", "https://intake.example.com")
    vi.stubEnv("PORTAL_ACCESS_REQUEST_API_TOKEN", "secret")
    const fetchMock = vi.fn(async () => Response.json(requestFixture({ status: "approved" })))
    vi.stubGlobal("fetch", fetchMock)

    const { updatePortalAccessRequest } = await import("./accessRequestApi")

    const request = await updatePortalAccessRequest("PAR-1", {
      status: "approved",
      internalNote: "Approved after review.",
    })

    expect(request.status).toBe("approved")
    expect(fetchMock).toHaveBeenCalledWith("https://intake.example.com/portal-access-requests/PAR-1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret",
      },
      body: JSON.stringify({
        status: "approved",
        internalNote: "Approved after review.",
      }),
    })
  })
})
