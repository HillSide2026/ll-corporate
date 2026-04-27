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
    ? "We could not complete sign-in. Please try again, or contact Levine LLP if this keeps happening."
    : undefined
}

export function PortalEntry({ authError, previewAccessEnabled = false }: PortalEntryProps) {
  const authErrorMessage = getAuthErrorMessage(authError)
  const keycloakConfigured = isKeycloakConfigured()

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
        <p className="text-sm font-medium text-brand-navy">Levine LLP</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Client Portal</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          Sign in to view your matters, documents, and requests.
        </p>

        {authErrorMessage ? (
          <div
            role="alert"
            className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
          >
            {authErrorMessage}
          </div>
        ) : null}

        <form action={signInWithCredentials} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <SignInButton label="Sign in" pendingLabel="Signing in..." />
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
          <form action={previewPortalAccess} className="mt-4">
            <button
              type="submit"
              className="rounded-md border border-stone-300 bg-white px-5 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-stone-400"
            >
              Preview portal
            </button>
            <p className="mt-2 text-xs leading-5 text-stone-400">
              Preview mode uses a mock session for review only.
            </p>
          </form>
        ) : null}
      </section>
    </main>
  )
}
