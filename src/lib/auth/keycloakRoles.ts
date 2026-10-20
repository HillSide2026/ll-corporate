import type { PortalRole } from "./session"

/** Keycloak role that grants the lawyer-facing admin surface. */
export const PORTAL_ADMIN_ROLE = "portal_admin"

/** Keycloak roles that map to portal audience tiers (LLP-037 ADR-006). */
export const PORTAL_CLIENT_ROLE = "portal_client"
export const PORTAL_TEAMMATE_ROLE = "portal_teammate"

type KeycloakAccessClaims = {
  realm_access?: { roles?: unknown }
  resource_access?: Record<string, { roles?: unknown } | undefined>
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

/**
 * Reads realm roles and this client's roles from a Keycloak access token.
 *
 * The token is decoded, not verified: it is only ever read server-side, straight
 * from the token endpoint response during sign-in, never from the browser.
 * Returns [] for anything that is not a well-formed JWT.
 */
export function readKeycloakRoles(accessToken: string, clientId?: string): string[] {
  const payload = accessToken.split(".")[1]
  if (!payload) return []

  let claims: KeycloakAccessClaims
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as KeycloakAccessClaims
  } catch {
    return []
  }

  const realmRoles = toStringArray(claims.realm_access?.roles)
  const clientRoles = clientId ? toStringArray(claims.resource_access?.[clientId]?.roles) : []
  return Array.from(new Set([...realmRoles, ...clientRoles]))
}

/** Client outranks teammate if a user somehow holds both. No portal role → undefined (routed to intake). */
export function portalRoleFromKeycloakRoles(roles: string[]): PortalRole | undefined {
  if (roles.includes(PORTAL_CLIENT_ROLE)) return "client"
  if (roles.includes(PORTAL_TEAMMATE_ROLE)) return "teammate"
  return undefined
}
