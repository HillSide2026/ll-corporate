import { type DefaultSession } from "next-auth"
import { type JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    /** Keycloak access token. Available server-side only — not exposed to the client session. */
    accessToken?: string
  }
}
