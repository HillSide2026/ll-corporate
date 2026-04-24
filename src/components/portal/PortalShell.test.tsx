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
    expect(screen.getByRole("link", { name: "NDA Generator" })).toHaveAttribute("href", "/nda")
    expect(screen.getByRole("heading", { name: "Matters" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Documents" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Requests" })).toBeInTheDocument()
    expect(screen.getByText(/Matter, task, and workflow state remains managed by LL-task-tracker/)).toBeInTheDocument()
  })
})
