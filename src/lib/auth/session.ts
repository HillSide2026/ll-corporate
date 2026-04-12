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
