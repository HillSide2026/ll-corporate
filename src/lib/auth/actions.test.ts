// @vitest-environment node

import { describe, expect, it, vi } from "vitest"

import { signIn, signOut } from "./auth"
import { signInWithKeycloak, signOutFromPortal } from "./actions"

vi.mock("./auth", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

describe("auth actions", () => {
  it("starts the Keycloak sign-in flow for the protected portal", async () => {
    await signInWithKeycloak()

    expect(signIn).toHaveBeenCalledWith("keycloak", { redirectTo: "/corporate/app" })
  })

  it("signs out to the public portal entry", async () => {
    await signOutFromPortal()

    expect(signOut).toHaveBeenCalledWith({ redirectTo: "/corporate" })
  })
})
