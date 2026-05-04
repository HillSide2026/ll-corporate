import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { adminLogin } from "./actions"

export const metadata: Metadata = { title: "Admin Sign In" }

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { isAdmin } = await getAdminSession()
  if (isAdmin) redirect("/corporate/admin")

  const sp = await searchParams
  const hasError = sp.error === "1"

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm px-6">
        <p className="text-sm font-semibold text-brand-navy">Levine LLP</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">Admin access</h1>
        <p className="mt-2 text-sm text-stone-500">Enter the admin token to continue.</p>

        {hasError ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Incorrect token. Try again.
          </p>
        ) : null}

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
              className="w-full rounded border border-stone-200 px-4 py-3 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-brand-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}
