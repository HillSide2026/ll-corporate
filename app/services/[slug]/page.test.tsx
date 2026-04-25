import { render, screen } from "@testing-library/react"
import { notFound } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getPortalSession, type PortalSession } from "src/lib/auth/session"

import ServiceDetailPage, { generateMetadata } from "./page"

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("not-found")
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

describe("ServiceDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getPortalSession).mockResolvedValue(null)
  })

  it("generates metadata from the catalog", async () => {
    await expect(generateMetadata({ params: Promise.resolve({ slug: "share-issuance" }) })).resolves.toMatchObject({
      title: "Share Issuance",
    })
  })

  it("renders a catalog service detail page with sign-in CTA for unauthenticated users", async () => {
    const page = await ServiceDetailPage({ params: Promise.resolve({ slug: "incorporation" }) })

    render(page)

    expect(screen.getByRole("heading", { name: "Incorporation" })).toBeInTheDocument()
    expect(screen.getByText("From $1,250 + disbursements")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Scope" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Assumptions" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Required inputs" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Sign in to request this service" })).toHaveAttribute("href", "/corporate")
  })

  it("links authenticated users to the intake request shell", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(session)

    const page = await ServiceDetailPage({ params: Promise.resolve({ slug: "director-officer-change" }) })
    render(page)

    expect(screen.getByRole("link", { name: "Start change request" })).toHaveAttribute(
      "href",
      "/corporate/services/director-officer-change/request"
    )
  })

  it("shows not found for unknown service slugs", async () => {
    await expect(ServiceDetailPage({ params: Promise.resolve({ slug: "missing-service" }) })).rejects.toThrow(
      "not-found"
    )
    expect(notFound).toHaveBeenCalled()
  })
})
