/**
 * Admin session check for the lawyer-facing admin surface.
 *
 * Reads PORTAL_ADMIN_TOKEN from env. If the token is not configured, the
 * admin surface runs in preview mode (accessible without a password) with
 * a visible warning. Once PORTAL_ADMIN_TOKEN is set in Vercel, the login
 * form is required.
 *
 * Replace with a Keycloak role check once roles are configured:
 *   - Verify the session access token contains a "portal_admin" role claim
 *   - Remove the cookie-based token entirely
 */

import { cookies } from "next/headers"

import { env } from "env.mjs"

export type AdminSession = {
  isAdmin: boolean
  isPreview: boolean
}

const ADMIN_COOKIE = "ll_admin_token"

export async function getAdminSession(): Promise<AdminSession> {
  const configuredToken = env.PORTAL_ADMIN_TOKEN

  if (!configuredToken) {
    // No token configured — preview mode, allow all access.
    return { isAdmin: true, isPreview: true }
  }

  const cookieStore = await cookies()
  const stored = cookieStore.get(ADMIN_COOKIE)?.value
  return { isAdmin: stored === configuredToken, isPreview: false }
}

export async function setAdminSessionCookie(token: string): Promise<boolean> {
  const configuredToken = env.PORTAL_ADMIN_TOKEN
  if (!configuredToken || token !== configuredToken) return false

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/corporate/admin",
    // No maxAge — session cookie, expires on browser close.
  })
  return true
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}
