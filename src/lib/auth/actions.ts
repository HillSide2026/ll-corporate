"use server"

import { env } from "env.mjs"
import { redirect } from "next/navigation"

import { signIn, signOut } from "./auth"
import { isKeycloakConfigured, isPreviewPortalAccessEnabled } from "./config"

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
