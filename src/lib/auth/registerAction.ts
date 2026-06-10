"use server"

import { AuthError } from "next-auth"

import { env } from "env.mjs"
import { createUser, getUserByEmail } from "src/lib/db/users"
import { signIn } from "./auth"

export type RegisterState = {
  error?: string
  field?: "name" | "email" | "password" | "confirmPassword"
} | null

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!name) return { error: "Full name is required.", field: "name" }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address.", field: "email" }
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", field: "password" }
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", field: "confirmPassword" }
  }

  const existing = await getUserByEmail(email)
  if (existing) {
    return { error: "An account with this email address already exists.", field: "email" }
  }

  await createUser({ email, name, password })

  try {
    await signIn("credentials", { email, password, redirectTo: env.LL_CORPORATE_POST_LOGIN_REDIRECT_URL ?? "/corporate/app" })
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created but sign-in failed. Please sign in to continue." }
    }
    throw err
  }

  // signIn always throws a redirect on success — unreachable
  return null
}
