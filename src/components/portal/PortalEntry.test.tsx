import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PortalEntry } from "./PortalEntry"

vi.mock("src/lib/auth/actions", () => ({
  previewPortalAccess: vi.fn(),
  signInWithCredentials: vi.fn(),
  signInWithKeycloak: vi.fn(),
}))

vi.mock("src/lib/auth/config", () => ({
  isKeycloakConfigured: vi.fn(() => false),
}))

describe("PortalEntry", () => {
  it("renders the public login entry without domain data", () => {
    render(<PortalEntry />)

    expect(screen.getAllByText("Levine Law").length).toBeGreaterThan(0)
    expect(screen.getByRole("heading", { name: "Manage Legal Matters in One Secure Location" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Existing Clients" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Preview portal" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "NDA Generator" })).not.toBeInTheDocument()
    expect(
      screen.getByText(
        "Access documents, submit requests, and stay informed about the status of legal matters through the Levine Law platform."
      )
    ).toBeInTheDocument()
  })

  it("renders a plain-language sign-in error without provider details", () => {
    render(<PortalEntry authError="OAuthCallback" />)

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not complete sign-in. Please try again, or contact Levine Law if this keeps happening."
    )
    expect(screen.queryByText("OAuthCallback")).not.toBeInTheDocument()
  })

  it("renders a plain-language auth configuration error", () => {
    render(<PortalEntry authError="Configuration" />)

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not complete sign-in. Please try again, or contact Levine Law if this keeps happening."
    )
    expect(screen.queryByText("Configuration")).not.toBeInTheDocument()
  })

  it("shows preview portal access only when enabled", () => {
    render(<PortalEntry previewAccessEnabled />)

    expect(screen.getByRole("button", { name: "Preview portal" })).toBeInTheDocument()
    expect(screen.getByText(/Preview mode uses a mock session/)).toBeInTheDocument()
  })
})
