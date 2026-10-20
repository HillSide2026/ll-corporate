"use server"

import { redirect } from "next/navigation"
import { setAdminSessionCookie } from "src/lib/auth/adminAuth"
import { signIn } from "src/lib/auth/auth"
import { isKeycloakConfigured } from "src/lib/auth/config"

export async function adminSignInWithKeycloak(): Promise<void> {
  if (!isKeycloakConfigured()) {
    redirect("/corporate/admin/login?error=1")
  }

  await signIn("keycloak", { redirectTo: "/corporate/admin" })
}

export async function adminLogin(formData: FormData): Promise<void> {
  const token = formData.get("token")
  if (typeof token !== "string" || !token) {
    redirect("/corporate/admin/login?error=1")
  }

  const success = await setAdminSessionCookie(token)
  if (!success) {
    redirect("/corporate/admin/login?error=1")
  }

  redirect("/corporate/admin")
}

export async function adminLogout(): Promise<void> {
  const { clearAdminSessionCookie } = await import("src/lib/auth/adminAuth")
  await clearAdminSessionCookie()
  redirect("/corporate/admin/login")
}
