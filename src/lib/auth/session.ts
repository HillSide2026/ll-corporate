import { getToken } from "next-auth/jwt"
import { headers } from "next/headers"
import { auth } from "./auth"

export type PortalIdentity = {
  subject: string
  displayName?: string
  email?: string
  role?: string
}

export type PortalSession = {
  identity: PortalIdentity
}

export async function getPortalSession(): Promise<PortalSession | null> {
  const session = await auth()
  const subject = session?.user?.id

  if (!subject) {
    return null
  }

  return {
    identity: {
      subject,
      displayName: session.user?.name ?? undefined,
      email: session.user?.email ?? undefined,
      role: session.user?.role ?? undefined,
    },
  }
}

/**
 * Portal audience tiers (LLP-037 ADR-006).
 *
 * - prospect: unretained visitor; routed to intake
 * - client: the client's Instructing Officer; full workspace and client actions
 * - teammate: an authorized person at the client without instructing authority;
 *   sees the workspace but cannot submit requests or upload documents
 */
export type PortalRole = "prospect" | "client" | "teammate"

/** True for the Instructing Officer only. Gates instructing actions (requests, uploads). */
export function isClientPortalSession(session: PortalSession): boolean {
  return session.identity.role === "client"
}

/** True for the client teammate tier. */
export function isTeammatePortalSession(session: PortalSession): boolean {
  return session.identity.role === "teammate"
}

/** True for anyone entitled to view the client workspace: client or teammate. */
export function isWorkspacePortalSession(session: PortalSession): boolean {
  return isClientPortalSession(session) || isTeammatePortalSession(session)
}

/**
 * Returns the Keycloak access token for server-side API calls.
 *
 * Server-only. Never call from client components.
 * Returns null if no valid session exists (treat as unauthenticated).
 */
export async function getAccessToken(): Promise<string | null> {
  const reqHeaders = await headers()
  const token = await getToken({
    req: { headers: reqHeaders } as Parameters<typeof getToken>[0]["req"],
    secret: process.env.AUTH_SECRET ?? "",
  })
  return token?.accessToken ?? null
}

/**
 * Returns the Keycloak roles captured at sign-in, read from the encrypted
 * server-side JWT. Server-only. Returns [] when there is no Keycloak session.
 */
export async function getKeycloakRoles(): Promise<string[]> {
  const reqHeaders = await headers()
  const token = await getToken({
    req: { headers: reqHeaders } as Parameters<typeof getToken>[0]["req"],
    secret: process.env.AUTH_SECRET ?? "",
  })
  return token?.keycloakRoles ?? []
}
