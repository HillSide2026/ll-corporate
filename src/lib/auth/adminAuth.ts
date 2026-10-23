/**
 * Admin session check for the lawyer-facing admin surface.
 *
 * Primary: a Keycloak session whose access token carries the "portal_admin"
 * realm or client role (LLP-037 ADR-006).
 *
 * Fallback, until Keycloak roles are configured in every environment: the
 * PORTAL_ADMIN_TOKEN cookie. Once portal_admin is assigned in Keycloak, unset
 * PORTAL_ADMIN_TOKEN and delete the cookie path below.
 *
 * Preview mode (open access with a visible warning) applies only in local
 * development (NODE_ENV=development) when neither Keycloak nor
 * PORTAL_ADMIN_TOKEN is configured. Deployed builds deny instead.
 */

import { cookies } from "next/headers"

import { env } from "env.mjs"
import { isKeycloakConfigured } from "./config"
import { PORTAL_ADMIN_ROLE } from "./keycloakRoles"
import { getKeycloakRoles } from "./session"

export type AdminSession = {
  isAdmin: boolean
  isPreview: boolean
}

const ADMIN_COOKIE = "ll_admin_token"

export async function getAdminSession(): Promise<AdminSession> {
  const keycloakConfigured = isKeycloakConfigured()

  if (keycloakConfigured) {
    const roles = await getKeycloakRoles()
    if (roles.includes(PORTAL_ADMIN_ROLE)) {
      return { isAdmin: true, isPreview: false }
    }
  }

  const configuredToken = env.PORTAL_ADMIN_TOKEN

  if (!configuredToken) {
    // Nothing configured: open preview, but only in local development. A deployed
    // portal with no admin credential must deny, never fall open.
    const localPreview = !keycloakConfigured && process.env.NODE_ENV === "development"
    return localPreview ? { isAdmin: true, isPreview: true } : { isAdmin: false, isPreview: false }
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
