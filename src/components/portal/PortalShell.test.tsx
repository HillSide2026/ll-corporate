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

    expect(screen.getByRole("heading", { name: "Corporate Portal" })).toBeInTheDocument()
    expect(screen.getByText("Client User")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "NDA Generator" })).toHaveAttribute("href", "/nda")
    expect(screen.getByText("ll-task-tracker remains the system of record.")).toBeInTheDocument()
    expect(screen.getByText("Workflow, state, and permission decisions stay out of the frontend.")).toBeInTheDocument()
  })
})
