import { render, screen } from "@testing-library/react"
import { redirect } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getPortalSession, type PortalSession } from "src/lib/auth/session"

import PortalAppPage from "./page"

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))

vi.mock("src/lib/auth/session", () => ({
  getPortalSession: vi.fn(),
  getAccessToken: vi.fn().mockResolvedValue(null),
  isClientPortalSession: (session: PortalSession) => session.identity.role === "client",
}))

vi.mock("src/components/portal/PortalShell", () => ({
  PortalShell: ({ session }: { session: PortalSession }) => (
    <div>
      <h1>Protected portal shell</h1>
      <p>{session.identity.email}</p>
      <button>Sign out</button>
    </div>
  ),
}))

const session: PortalSession = {
  identity: {
    subject: "user-123",
    displayName: "Client User",
    email: "client@example.com",
    role: "client",
  },
}

const prospectSession: PortalSession = {
  identity: {
    subject: "user-456",
    displayName: "Prospect User",
    email: "prospect@example.com",
    role: "prospect",
  },
}

describe("PortalAppPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirects unauthenticated users to the corporate sign-in page", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(null)

    await expect(PortalAppPage({ searchParams: Promise.resolve({}) })).rejects.toThrow("redirect:/sign-in")
    expect(redirect).toHaveBeenCalledWith("/sign-in")
  })

  it("renders the protected shell for authenticated users", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(session)

    const page = await PortalAppPage({ searchParams: Promise.resolve({}) })
    render(page)

    expect(screen.getByRole("heading", { name: "Protected portal shell" })).toBeInTheDocument()
    expect(screen.getByText("client@example.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
  })

  it("redirects non-client users to intake", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(prospectSession)

    await expect(PortalAppPage({ searchParams: Promise.resolve({}) })).rejects.toThrow("redirect:/intake")
    expect(redirect).toHaveBeenCalledWith("/intake")
  })
})
