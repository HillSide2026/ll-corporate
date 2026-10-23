"use server"

import { AuthError } from "next-auth"

import { createUser, getUserByEmail } from "src/lib/db/users"
import { TERMS_VERSION } from "src/lib/portal/terms"
import { signIn } from "./auth"
import { afterSignInPath } from "./redirects"

export type RegisterState = {
  error?: string
  field?: "name" | "email" | "password" | "confirmPassword" | "acceptTerms"
} | null

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
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
  if (formData.get("acceptTerms") !== "on") {
    return { error: "You must agree to the Terms of Use to create an account.", field: "acceptTerms" }
  }

  // A database failure must show a message, not crash the page
  try {
    const existing = await getUserByEmail(email)
    if (existing) {
      return { error: "An account with this email address already exists.", field: "email" }
    }

    await createUser({ email, name, password, termsVersion: TERMS_VERSION ?? "unpublished" })
  } catch (err) {
    console.error("registerAction: account database unavailable", err)
    return { error: "We could not create your account right now. Please try again later." }
  }

  try {
    await signIn("credentials", { email, password, redirectTo: afterSignInPath(formData.get("service")) })
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created but sign-in failed. Please sign in to continue." }
    }
    throw err
  }

  // signIn always throws a redirect on success — unreachable
  return null
}
