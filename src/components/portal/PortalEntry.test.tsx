import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PortalEntry } from "./PortalEntry"

vi.mock("src/lib/auth/actions", () => ({
  signInWithKeycloak: vi.fn(),
}))

describe("PortalEntry", () => {
  it("renders the public login entry without domain data", () => {
    render(<PortalEntry />)

    expect(screen.getByRole("heading", { name: "Corporate Portal" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "NDA Generator" })).toHaveAttribute("href", "/nda")
    expect(screen.getByText("Available after backend contract integration")).toBeInTheDocument()
  })
})
