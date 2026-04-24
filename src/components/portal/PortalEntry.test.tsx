import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PortalEntry } from "./PortalEntry"

vi.mock("src/lib/auth/actions", () => ({
  signInWithKeycloak: vi.fn(),
}))

describe("PortalEntry", () => {
  it("renders the public login entry without domain data", () => {
    render(<PortalEntry />)

    expect(screen.getByRole("heading", { name: "Client Portal" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in securely" })).toBeInTheDocument()
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
})
