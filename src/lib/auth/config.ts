import { env } from "env.mjs"

import { type PortalSession } from "./session"

export function isKeycloakConfigured() {
  return Boolean(env.AUTH_KEYCLOAK_ISSUER && env.AUTH_KEYCLOAK_ID && env.AUTH_KEYCLOAK_SECRET)
}

export function isPreviewPortalAccessEnabled() {
  return env.LL_CORPORATE_ENABLE_PREVIEW_ACCESS === true
}

export function getPreviewPortalSession(): PortalSession {
  return {
    identity: {
      subject: "preview-client",
      displayName: "Preview Client",
      email: "preview.client@levinellp.example",
    },
  }
}
