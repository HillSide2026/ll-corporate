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
      redirectTo: env.LL_CORPORATE_POST_LOGIN_REDIRECT_URL ?? "/corporate/app",
    })
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/corporate?error=CredentialsSignIn")
    }
    throw err
  }
}

export async function signInWithKeycloak() {
  if (!isKeycloakConfigured()) {
    redirect("/corporate?error=Configuration")
  }

  await signIn("keycloak", { redirectTo: env.LL_CORPORATE_POST_LOGIN_REDIRECT_URL ?? "/corporate/app" })
}

export async function previewPortalAccess() {
  if (!isPreviewPortalAccessEnabled()) {
    redirect("/corporate?error=PreviewAccessDisabled")
  }

  redirect("/corporate/preview")
}

export async function signOutFromPortal() {
  await signOut({ redirectTo: env.LL_CORPORATE_LOGOUT_REDIRECT_URL ?? "/corporate" })
}
