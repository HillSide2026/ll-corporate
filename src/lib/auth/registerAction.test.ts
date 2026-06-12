// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest"

import { registerAction } from "./registerAction"

const dbMocks = vi.hoisted(() => ({
  createUser: vi.fn(),
  getUserByEmail: vi.fn(),
}))

const authMocks = vi.hoisted(() => ({
  signIn: vi.fn(),
}))

vi.mock("src/lib/db/users", () => ({
  createUser: dbMocks.createUser,
  getUserByEmail: dbMocks.getUserByEmail,
}))

vi.mock("./auth", () => ({
  signIn: authMocks.signIn,
}))

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {},
}))

function registrationFormData() {
  const formData = new FormData()
  formData.set("name", "New Prospect")
  formData.set("email", "Prospect@Example.com")
  formData.set("password", "password123")
  formData.set("confirmPassword", "password123")
  return formData
}

describe("registerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    dbMocks.getUserByEmail.mockResolvedValue(null)
    dbMocks.createUser.mockResolvedValue({
      id: "user-1",
      email: "prospect@example.com",
      name: "New Prospect",
      role: "prospect",
      created_at: "2026-06-10T00:00:00.000Z",
    })
  })

  it("creates a prospect account and signs in through the role router", async () => {
    await registerAction(null, registrationFormData())

    expect(dbMocks.getUserByEmail).toHaveBeenCalledWith("prospect@example.com")
    expect(dbMocks.createUser).toHaveBeenCalledWith({
      email: "prospect@example.com",
      name: "New Prospect",
      password: "password123",
    })
    expect(authMocks.signIn).toHaveBeenCalledWith("credentials", {
      email: "prospect@example.com",
      password: "password123",
      redirectTo: "/auth/after-sign-in",
    })
  })
})
