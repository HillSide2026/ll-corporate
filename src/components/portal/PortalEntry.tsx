import Image from "next/image"
import Link from "next/link"

import { previewPortalAccess, signInWithCredentials, signInWithKeycloak } from "src/lib/auth/actions"
import { isKeycloakConfigured } from "src/lib/auth/config"
import { SignInButton } from "./SignInButton"

type PortalEntryProps = {
  authError?: string
  previewAccessEnabled?: boolean
}

function getAuthErrorMessage(authError?: string) {
  if (authError === "CredentialsSignIn") {
    return "Incorrect email or password. Please try again."
  }
  if (authError === "PreviewAccessDisabled") {
    return "Preview access is not enabled for this environment."
  }
  return authError
    ? "We could not complete sign-in. Please try again, or contact Levine Law if this keeps happening."
    : undefined
}

export function PortalEntry({ authError, previewAccessEnabled = false }: PortalEntryProps) {
  const authErrorMessage = getAuthErrorMessage(authError)
  const keycloakConfigured = isKeycloakConfigured()

  return (
    <main className="min-h-dvh bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="shrink-0">
            <Image
              src="/logos/levine-law-wordmark-navy-transparent-2.png"
              alt="Levine Law"
              width={1080}
              height={600}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-57px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-navy uppercase">Levine Law</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">Sign in to your account</h1>
          </div>

          <div className="rounded border border-stone-200 bg-white px-6 py-7 shadow-sm">
            {authErrorMessage ? (
              <div
                role="alert"
                className="mb-5 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
              >
                {authErrorMessage}
              </div>
            ) : null}

            <form action={signInWithCredentials} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
              </div>
              <div className="pt-1">
                <SignInButton label="Sign in" pendingLabel="Signing in..." />
              </div>
            </form>

            {keycloakConfigured ? (
              <div className="mt-5 border-t border-stone-200 pt-5">
                <p className="mb-3 text-xs text-stone-400">Or sign in with your organisation account</p>
                <form action={signInWithKeycloak}>
                  <SignInButton label="Sign in with SSO" pendingLabel="Opening secure sign-in..." />
                </form>
              </div>
            ) : null}

            {previewAccessEnabled ? (
              <div className="mt-4 border-t border-stone-200 pt-4">
                <form action={previewPortalAccess}>
                  <button
                    type="submit"
                    className="w-full rounded border border-stone-300 bg-white px-5 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-stone-400"
                  >
                    Preview portal
                  </button>
                </form>
                <p className="mt-2 text-xs leading-5 text-stone-400">Preview mode uses a mock session for review only.</p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 space-y-2 text-center text-sm text-stone-500">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-semibold text-brand-navy underline-offset-4 hover:underline">
                Create one
              </Link>
            </p>
            <p>
              Trouble signing in?{" "}
              <a
                href="mailto:matthew@levinelegal.ca"
                className="font-semibold text-brand-navy underline-offset-4 hover:underline"
              >
                Email Levine Law
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
