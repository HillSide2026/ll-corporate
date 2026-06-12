import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PortalShell } from "./PortalShell"

vi.mock("src/lib/auth/actions", () => ({
  signOutFromPortal: vi.fn(),
}))

const session = {
  identity: {
    subject: "user-123",
    displayName: "Client User",
    email: "client@example.com",
  },
}

describe("PortalShell", () => {
  it("renders the protected Levine Law portal shell without domain data", () => {
    render(<PortalShell session={session} />)

    expect(screen.getByRole("heading", { name: "Welcome back, Client User" })).toBeInTheDocument()
    expect(screen.getByText("Client User")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Exit preview" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "NDA Tool" })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/corporate/app")
    expect(screen.getByRole("link", { name: "Matters" })).toHaveAttribute("href", "/corporate/app/matters")
    expect(screen.getByRole("link", { name: "Documents" })).toHaveAttribute("href", "/corporate/app/documents")
    expect(screen.getByRole("link", { name: "Requests" })).toHaveAttribute("href", "/corporate/app/requests")
    expect(screen.getByRole("link", { name: "Team / Contacts" })).toHaveAttribute("href", "/corporate/app/scope")
    expect(screen.getByRole("link", { name: "Open a matter" })).toHaveAttribute("href", "/corporate/app/requests/new")
  })

  it("clearly indicates preview mode without showing the real sign-out action", () => {
    render(<PortalShell previewMode session={session} />)

    expect(screen.getByRole("status")).toHaveTextContent(
      "Preview mode: this portal is using a mock session for development review only."
    )
    expect(screen.getByRole("link", { name: "Exit preview" })).toHaveAttribute("href", "/sign-in")
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument()
  })
})
