export type PortalIdentity = {
  subject: string
  displayName?: string
  email?: string
}

export type PortalSession = {
  identity: PortalIdentity
}
