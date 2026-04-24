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
  },
}

describe("PortalAppPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirects unauthenticated users to the corporate sign-in page", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(null)

    await expect(PortalAppPage()).rejects.toThrow("redirect:/corporate")
    expect(redirect).toHaveBeenCalledWith("/corporate")
  })

  it("renders the protected shell for authenticated users", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(session)

    const page = await PortalAppPage()
    render(page)

    expect(screen.getByRole("heading", { name: "Protected portal shell" })).toBeInTheDocument()
    expect(screen.getByText("client@example.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
  })
})
