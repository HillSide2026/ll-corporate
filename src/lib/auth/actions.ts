"use server"

import { AuthError } from "next-auth"
import { env } from "env.mjs"
import { redirect } from "next/navigation"

import { signIn, signOut } from "./auth"
import { isKeycloakConfigured, isPreviewPortalAccessEnabled } from "./config"

export async function signInWithCredentials(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/auth/after-sign-in",
    })
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/sign-in?error=CredentialsSignIn")
    }
    throw err
  }
}

export async function signInWithKeycloak() {
  if (!isKeycloakConfigured()) {
    redirect("/sign-in?error=Configuration")
  }

  await signIn("keycloak", { redirectTo: "/auth/after-sign-in" })
}

export async function previewPortalAccess() {
  if (!isPreviewPortalAccessEnabled()) {
    redirect("/sign-in?error=PreviewAccessDisabled")
  }

  redirect("/corporate/preview")
}

export async function signOutFromPortal() {
  await signOut({ redirectTo: env.LL_CORPORATE_LOGOUT_REDIRECT_URL ?? "/sign-in" })
}
