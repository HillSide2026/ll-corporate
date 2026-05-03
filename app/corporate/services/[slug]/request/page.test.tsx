import { render, screen } from "@testing-library/react"
import { notFound, redirect } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getPortalSession, type PortalSession } from "src/lib/auth/session"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"

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

vi.mock("src/lib/auth/config", () => ({
  getPreviewPortalSession: vi.fn(() => ({
    identity: {
      subject: "preview-client",
      displayName: "Preview Client",
      email: "preview.client@levinellp.example",
    },
  })),
  isPreviewPortalAccessEnabled: vi.fn(() => false),
}))

vi.mock("src/lib/services/actions", () => ({
  submitServiceRequest: vi.fn(),
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
    vi.mocked(isPreviewPortalAccessEnabled).mockReturnValue(false)
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

  it("renders the authenticated request form for the selected service", async () => {
    const page = await ServiceRequestPage({ params: Promise.resolve({ slug: "incorporation" }) })

    render(page)

    expect(screen.getByRole("heading", { name: "Incorporation" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Provide required information" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Acknowledgement" })).toBeInTheDocument()
    expect(screen.getByText(/Submitting this request does not mean work has started/)).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Start incorporation request" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Start incorporation request" })).not.toBeDisabled()
  })

  it("renders the request form with a preview session when preview access is enabled", async () => {
    vi.mocked(getPortalSession).mockResolvedValue(null)
    vi.mocked(isPreviewPortalAccessEnabled).mockReturnValue(true)

    const page = await ServiceRequestPage({ params: Promise.resolve({ slug: "incorporation" }) })
    render(page)

    expect(getPreviewPortalSession).toHaveBeenCalled()
    expect(screen.getByRole("heading", { name: "Incorporation" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Start incorporation request" })).toBeInTheDocument()
  })

  it("shows not found for unknown service slugs", async () => {
    await expect(ServiceRequestPage({ params: Promise.resolve({ slug: "missing-service" }) })).rejects.toThrow(
      "not-found"
    )
    expect(notFound).toHaveBeenCalled()
  })
})
