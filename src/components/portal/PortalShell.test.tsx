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
  it("renders the protected Levine LLP portal shell without domain data", () => {
    render(<PortalShell session={session} />)

    expect(screen.getByRole("heading", { name: "Client Portal" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Good to see you, Client User" })).toBeInTheDocument()
    expect(screen.getByText("Client User")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Exit preview" })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "NDA Tool" })).toHaveAttribute("href", "/ndaesq")
    expect(screen.getByRole("heading", { name: "Matters" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Documents" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Requests" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "View documents →" })).toHaveAttribute("href", "/corporate/app/documents")
    expect(screen.getByRole("link", { name: "View requests →" })).toHaveAttribute("href", "/corporate/app/requests")
  })

  it("clearly indicates preview mode without showing the real sign-out action", () => {
    render(<PortalShell previewMode session={session} />)

    expect(screen.getByRole("status")).toHaveTextContent(
      "Preview mode: this portal is using a mock session for development review only."
    )
    expect(screen.getByRole("link", { name: "Exit preview" })).toHaveAttribute("href", "/corporate")
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument()
  })
})
