import { render, screen } from "@testing-library/react"
import { notFound, redirect } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getPortalSession, type PortalSession } from "src/lib/auth/session"

import ServiceRequestPage, { generateMetadata } from "./page"

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("not-found")
  }),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))

vi.mock("src/lib/auth/session", () => ({
  getPortalSession: vi.fn(),
}))

const session: PortalSession = {
  identity: {
    subject: "user-123",
    displayName: "Client User",
    email: "client@example.com",
  },
}

describe("ServiceRequestPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getPortalSession).mockResolvedValue(session)
  })

  it("generates request metadata from the selected service", async () => {
    await expect(generateMetadata({ params: Promise.resolve({ slug: "share-issuance" }) })).resolves.toMatchObject({
      title: "Request Share Issuance",
    })
  })

  it("redirects unauthenticated users to the corporate sign-in page", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(null)

    await expect(ServiceRequestPage({ params: Promise.resolve({ slug: "incorporation" }) })).rejects.toThrow(
      "redirect:/corporate"
    )
    expect(redirect).toHaveBeenCalledWith("/corporate")
  })

  it("renders the authenticated request shell without submitting anything", async () => {
    const page = await ServiceRequestPage({ params: Promise.resolve({ slug: "incorporation" }) })

    render(page)

    expect(screen.getByRole("heading", { name: "Incorporation" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Limited-scope acknowledgement" })).toBeInTheDocument()
    expect(screen.getByText(/Submitting a request does not mean work has started/)).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Service inputs" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Submit request not enabled yet" })).toBeDisabled()
    expect(screen.getByText(/LL-task-tracker remains the system of record/)).toBeInTheDocument()
  })

  it("shows not found for unknown service slugs", async () => {
    await expect(ServiceRequestPage({ params: Promise.resolve({ slug: "missing-service" }) })).rejects.toThrow(
      "not-found"
    )
    expect(notFound).toHaveBeenCalled()
  })
})
