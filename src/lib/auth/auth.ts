import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

import { env } from "env.mjs"

const missingKeycloakIssuer = "https://keycloak.example.invalid/realms/levine-llp"

export const authBasePath = "/corporate/api/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: authBasePath,
  trustHost: env.AUTH_TRUST_HOST,
  session: {
    strategy: "jwt",
  },
  providers: [
    Keycloak({
      clientId: env.AUTH_KEYCLOAK_ID ?? "missing-keycloak-client-id",
      clientSecret: env.AUTH_KEYCLOAK_SECRET ?? "missing-keycloak-client-secret",
      issuer: env.AUTH_KEYCLOAK_ISSUER ?? missingKeycloakIssuer,
    }),
  ],
  callbacks: {
    jwt({ token, account }) {
      // Capture the Keycloak access token on initial sign-in.
      // Stored only in the encrypted server-side JWT — never sent to the client.
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
