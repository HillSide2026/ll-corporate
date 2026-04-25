import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PortalEntry } from "./PortalEntry"

vi.mock("src/lib/auth/actions", () => ({
  previewPortalAccess: vi.fn(),
  signInWithKeycloak: vi.fn(),
}))

describe("PortalEntry", () => {
  it("renders the public login entry without domain data", () => {
    render(<PortalEntry />)

    expect(screen.getByRole("heading", { name: "Client Portal" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in securely" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Preview portal" })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "NDA Generator" })).toHaveAttribute("href", "/nda")
    expect(screen.getByText("Everything you need. All in one secure place.")).toBeInTheDocument()
    expect(screen.getAllByText(/Sign in to continue/)).toHaveLength(3)
  })

  it("renders a plain-language sign-in error without provider details", () => {
    render(<PortalEntry authError="OAuthCallback" />)

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not complete sign-in. Please try again, or contact Levine LLP if this keeps happening."
    )
    expect(screen.queryByText("OAuthCallback")).not.toBeInTheDocument()
  })

  it("renders a plain-language auth configuration error", () => {
    render(<PortalEntry authError="Configuration" />)

    expect(screen.getByRole("alert")).toHaveTextContent("Portal sign-in is not fully configured yet.")
    expect(screen.queryByText("Configuration")).not.toBeInTheDocument()
  })

  it("shows preview portal access only when enabled", () => {
    render(<PortalEntry previewAccessEnabled />)

    expect(screen.getByRole("button", { name: "Preview portal" })).toBeInTheDocument()
    expect(screen.getByText(/Preview mode uses a mock session/)).toBeInTheDocument()
  })
})
