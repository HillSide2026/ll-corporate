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
    <main className="min-h-dvh bg-stone-100 text-stone-950">
      <section className="mx-auto grid min-h-dvh max-w-6xl items-center gap-8 px-6 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="max-w-xl">
          <p className="text-brand-navy text-xs font-semibold tracking-[0.2em] uppercase">Secure Client Portal</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
            Manage Legal Matters in One Secure Location
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-600">
            Access documents, submit requests, and stay informed about the status of legal matters through the Levine
            Law platform.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Document Access", detail: "Access documents shared through the platform." },
              { title: "Submit Requests", detail: "Complete forms and provide information online." },
              { title: "Matter Updates", detail: "Real-time visibility into active legal matters." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-stone-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-stone-950">{item.title}</p>
                <p className="mt-1 text-xs text-stone-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-brand-navy text-sm font-semibold">Levine Law</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Existing Clients</h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Sign in to access documents, requests, matter updates, and communications through the Levine Law platform.
          </p>

          {authErrorMessage ? (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
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
                className="focus:border-brand-navy focus:ring-brand-navy mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:outline-none"
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
                className="focus:border-brand-navy focus:ring-brand-navy mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:outline-none"
              />
            </div>
            <SignInButton label="Sign In" pendingLabel="Signing in..." />
          </form>

          {keycloakConfigured ? (
            <div className="mt-5 border-t border-stone-200 pt-5">
              <p className="mb-3 text-xs text-stone-400">Or sign in with your organisation account</p>
              <form action={signInWithKeycloak}>
                <SignInButton label="Sign In with SSO" pendingLabel="Opening secure sign-in..." />
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
              <p className="mt-2 text-xs leading-5 text-stone-400">Preview mode uses a mock session for review only.</p>
            </form>
          ) : null}
        </div>
      </section>
    </main>
  )
}
