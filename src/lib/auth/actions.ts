"use server"

import { env } from "env.mjs"

import { signIn, signOut } from "./auth"

export async function signInWithKeycloak() {
  await signIn("keycloak", { redirectTo: env.LL_CORPORATE_POST_LOGIN_REDIRECT_URL ?? "/corporate/app" })
}

export async function signOutFromPortal() {
  await signOut({ redirectTo: env.LL_CORPORATE_LOGOUT_REDIRECT_URL ?? "/corporate" })
}
