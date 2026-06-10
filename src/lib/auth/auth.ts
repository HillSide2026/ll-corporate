import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Keycloak from "next-auth/providers/keycloak"

import { env } from "env.mjs"
import { getUserByEmail, verifyPassword } from "src/lib/db/users"

export const authBasePath = "/corporate/api/auth"

const keycloakProvider =
  env.AUTH_KEYCLOAK_ISSUER && env.AUTH_KEYCLOAK_ID && env.AUTH_KEYCLOAK_SECRET
    ? [Keycloak({ clientId: env.AUTH_KEYCLOAK_ID, clientSecret: env.AUTH_KEYCLOAK_SECRET, issuer: env.AUTH_KEYCLOAK_ISSUER })]
    : []

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: authBasePath,
  trustHost: env.AUTH_TRUST_HOST,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
        const password = String(credentials?.password ?? "")

        // Env-var credentials kept for admin/preview access
        if (env.PORTAL_CLIENT_EMAIL && env.PORTAL_CLIENT_PASSWORD) {
          if (email === env.PORTAL_CLIENT_EMAIL && password === env.PORTAL_CLIENT_PASSWORD) {
            return { id: "portal-client", email: env.PORTAL_CLIENT_EMAIL, name: "Client" }
          }
        }

        // DB-backed user authentication
        const user = await getUserByEmail(email).catch(() => null)
        if (!user) return null

        const valid = await verifyPassword(password, user.password_hash)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
    ...keycloakProvider,
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
