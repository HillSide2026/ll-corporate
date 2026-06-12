import { redirect } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getPortalSession, type PortalSession } from "src/lib/auth/session"

import AfterSignInPage from "./page"

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))

vi.mock("src/lib/auth/session", () => ({
  getPortalSession: vi.fn(),
  isClientPortalSession: (session: PortalSession) => session.identity.role === "client",
}))

const clientSession: PortalSession = {
  identity: {
    subject: "client-1",
    displayName: "Client User",
    email: "client@example.com",
    role: "client",
  },
}

const prospectSession: PortalSession = {
  identity: {
    subject: "prospect-1",
    displayName: "Prospect User",
    email: "prospect@example.com",
    role: "prospect",
  },
}

describe("AfterSignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirects clients to the portal workspace", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(clientSession)

    await expect(AfterSignInPage()).rejects.toThrow("redirect:/corporate/app")
    expect(redirect).toHaveBeenCalledWith("/corporate/app")
  })

  it("redirects non-client users to intake", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(prospectSession)

    await expect(AfterSignInPage()).rejects.toThrow("redirect:/intake")
    expect(redirect).toHaveBeenCalledWith("/intake")
  })

  it("redirects unauthenticated users to sign-in", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(null)

    await expect(AfterSignInPage()).rejects.toThrow("redirect:/sign-in")
    expect(redirect).toHaveBeenCalledWith("/sign-in")
  })
})
