import { getToken } from "next-auth/jwt"
import { headers } from "next/headers"
import { auth } from "./auth"

export type PortalIdentity = {
  subject: string
  displayName?: string
  email?: string
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
    },
  }
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
