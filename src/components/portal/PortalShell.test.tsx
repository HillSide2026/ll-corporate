import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PortalShell } from "./PortalShell"

describe("PortalShell", () => {
  it("renders the Levine LLP portal shell without domain data", () => {
    render(<PortalShell />)

    expect(screen.getByRole("heading", { name: "Corporate Portal" })).toBeInTheDocument()
    expect(screen.getByText("ll-task-tracker remains the system of record.")).toBeInTheDocument()
    expect(screen.getByText("Workflow, state, and permission decisions stay out of the frontend.")).toBeInTheDocument()
  })
})
