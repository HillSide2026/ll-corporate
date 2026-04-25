import { render, screen } from "@testing-library/react"
import { redirect } from "next/navigation"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"

import PreviewPortalPage from "./page"

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))

vi.mock("src/lib/auth/config", () => ({
  getPreviewPortalSession: vi.fn(() => ({
    identity: {
      subject: "preview-client",
      displayName: "Preview Client",
      email: "preview.client@levinellp.example",
    },
  })),
  isPreviewPortalAccessEnabled: vi.fn(),
}))

vi.mock("src/components/portal/PortalShell", () => ({
  PortalShell: ({
    previewMode,
    session,
  }: {
    previewMode?: boolean
    session: ReturnType<typeof getPreviewPortalSession>
  }) => (
    <div>
      <h1>Preview portal shell</h1>
      <p>{previewMode ? "preview enabled" : "preview disabled"}</p>
      <p>{session.identity.email}</p>
    </div>
  ),
}))

describe("PreviewPortalPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("redirects when preview access is disabled", () => {
    vi.mocked(isPreviewPortalAccessEnabled).mockReturnValue(false)

    expect(() => PreviewPortalPage()).toThrow("redirect:/corporate?error=PreviewAccessDisabled")
    expect(redirect).toHaveBeenCalledWith("/corporate?error=PreviewAccessDisabled")
  })

  it("renders the portal shell with the preview session when enabled", () => {
    vi.mocked(isPreviewPortalAccessEnabled).mockReturnValue(true)

    render(<>{PreviewPortalPage()}</>)

    expect(screen.getByRole("heading", { name: "Preview portal shell" })).toBeInTheDocument()
    expect(screen.getByText("preview enabled")).toBeInTheDocument()
    expect(screen.getByText("preview.client@levinellp.example")).toBeInTheDocument()
  })
})
