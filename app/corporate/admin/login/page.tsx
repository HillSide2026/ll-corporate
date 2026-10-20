import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { env } from "env.mjs"
import { getAdminSession } from "src/lib/auth/adminAuth"
import { isKeycloakConfigured } from "src/lib/auth/config"
import { adminLogin, adminSignInWithKeycloak } from "./actions"

export const metadata: Metadata = { title: "Admin Sign In" }

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { isAdmin } = await getAdminSession()
  if (isAdmin) redirect("/corporate/admin")

  const sp = await searchParams
  const hasError = sp.error === "1"
  const keycloakConfigured = isKeycloakConfigured()
  const tokenConfigured = Boolean(env.PORTAL_ADMIN_TOKEN)

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm px-6">
        <p className="text-brand-navy text-sm font-semibold">Levine Law</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">Admin access</h1>
        <p className="mt-2 text-sm text-stone-500">
          {keycloakConfigured
            ? "Sign in with a Levine Law account that holds the portal_admin role."
            : "Enter the admin token to continue."}
        </p>

        {hasError ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {keycloakConfigured ? "That account does not have admin access." : "Incorrect token. Try again."}
          </p>
        ) : null}

        {keycloakConfigured ? (
          <form action={adminSignInWithKeycloak} className="mt-6">
            <button
              type="submit"
              className="bg-brand-navy hover:bg-brand-navy-dark w-full rounded py-3 text-sm font-semibold text-white transition-colors"
            >
              Sign in with Levine Law account
            </button>
          </form>
        ) : null}

        {tokenConfigured || !keycloakConfigured ? (
          <form action={adminLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="token" className="mb-1.5 block text-sm font-medium text-stone-700">
                Admin token
              </label>
              <input
                id="token"
                type="password"
                name="token"
                autoComplete="current-password"
                required
                className="focus:border-brand-navy focus:ring-brand-navy w-full rounded border border-stone-200 px-4 py-3 text-sm text-stone-900 focus:ring-1 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-navy hover:bg-brand-navy-dark w-full rounded py-3 text-sm font-semibold text-white transition-colors"
            >
              Sign in
            </button>
          </form>
        ) : null}
      </div>
    </main>
  )
}
