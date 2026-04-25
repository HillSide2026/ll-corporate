// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest"

import { redirect } from "next/navigation"
import { signIn, signOut } from "./auth"
import { isKeycloakConfigured, isPreviewPortalAccessEnabled } from "./config"
import { previewPortalAccess, signInWithKeycloak, signOutFromPortal } from "./actions"

vi.mock("./auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock("./config", () => ({
  isKeycloakConfigured: vi.fn(() => true),
  isPreviewPortalAccessEnabled: vi.fn(() => false),
}))

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isKeycloakConfigured).mockReturnValue(true)
    vi.mocked(isPreviewPortalAccessEnabled).mockReturnValue(false)
  })

  it("starts the Keycloak sign-in flow for the protected portal", async () => {
    await signInWithKeycloak()

    expect(signIn).toHaveBeenCalledWith("keycloak", { redirectTo: "/corporate/app" })
  })

  it("redirects to the public portal with a friendly configuration error when Keycloak is not configured", async () => {
    vi.mocked(isKeycloakConfigured).mockReturnValue(false)

    await expect(signInWithKeycloak()).rejects.toThrow("redirect:/corporate?error=Configuration")
    expect(redirect).toHaveBeenCalledWith("/corporate?error=Configuration")
    expect(signIn).not.toHaveBeenCalled()
  })

  it("routes preview access to the preview shell when enabled", async () => {
    vi.mocked(isPreviewPortalAccessEnabled).mockReturnValue(true)

    await expect(previewPortalAccess()).rejects.toThrow("redirect:/corporate/preview")
    expect(redirect).toHaveBeenCalledWith("/corporate/preview")
  })

  it("redirects preview access back to sign-in when preview access is disabled", async () => {
    vi.mocked(isPreviewPortalAccessEnabled).mockReturnValue(false)

    await expect(previewPortalAccess()).rejects.toThrow("redirect:/corporate?error=PreviewAccessDisabled")
    expect(redirect).toHaveBeenCalledWith("/corporate?error=PreviewAccessDisabled")
  })

  it("signs out to the public portal entry", async () => {
    await signOutFromPortal()

    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/corporate" })
  })
})
