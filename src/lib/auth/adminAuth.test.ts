// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  env: { PORTAL_ADMIN_TOKEN: undefined as string | undefined },
  isKeycloakConfigured: vi.fn(() => false),
}))

vi.mock("env.mjs", () => ({ env: mocks.env }))
vi.mock("next/headers", () => ({ cookies: vi.fn() }))
vi.mock("./config", () => ({ isKeycloakConfigured: mocks.isKeycloakConfigured }))
vi.mock("./session", () => ({ getKeycloakRoles: vi.fn(async () => []) }))

import { getAdminSession } from "./adminAuth"

describe("getAdminSession with no admin credential configured", () => {
  beforeEach(() => {
    mocks.env.PORTAL_ADMIN_TOKEN = undefined
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("denies on a deployed build instead of falling open", async () => {
    vi.stubEnv("NODE_ENV", "production")
    await expect(getAdminSession()).resolves.toEqual({ isAdmin: false, isPreview: false })
  })

  it("allows the preview only in local development", async () => {
    vi.stubEnv("NODE_ENV", "development")
    await expect(getAdminSession()).resolves.toEqual({ isAdmin: true, isPreview: true })
  })
})
