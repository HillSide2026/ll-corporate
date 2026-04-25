import { previewPortalAccess, signInWithKeycloak } from "src/lib/auth/actions"
import { SignInButton } from "./SignInButton"

const portalHighlights = [
  {
    title: "Manage Matters",
    description: "View client-safe matter updates and stay current on the work Levine LLP is handling for you.",
    cta: "Sign in to continue →",
  },
  {
    title: "Access Client Documents",
    description: "Review, download, or upload documents securely once document access is enabled for your account.",
    cta: "Sign in to continue →",
  },
  {
    title: "Submit Requests",
    description: "Send requests or updates to the legal team from one secure place as portal services come online.",
    cta: "Sign in to continue →",
  },
]

type PortalEntryProps = {
  authError?: string
  previewAccessEnabled?: boolean
}

function getAuthErrorMessage(authError?: string) {
  if (authError === "Configuration") {
    return "Portal sign-in is not fully configured yet. Please use preview access if it is enabled, or contact Levine LLP if you need help."
  }

  if (authError === "PreviewAccessDisabled") {
    return "Preview access is not enabled for this environment. Please use secure sign-in when authentication is configured."
  }

  return authError
    ? "We could not complete sign-in. Please try again, or contact Levine LLP if this keeps happening."
    : undefined
}

export function PortalEntry({ authError, previewAccessEnabled = false }: PortalEntryProps) {
  const authErrorMessage = getAuthErrorMessage(authError)

  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-950">
      <section className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-6 py-12">
        <p className="text-sm font-medium text-emerald-700">Levine LLP</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">Client Portal</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700">
          Sign in securely to view your client portal, including open matters, shared documents, and requests for the
          Levine LLP team.
        </p>

        {authErrorMessage ? (
          <div
            role="alert"
            className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
          >
            {authErrorMessage}
          </div>
        ) : null}

        <form action={signInWithKeycloak} className="mt-8">
          <SignInButton />
        </form>

        {previewAccessEnabled ? (
          <form action={previewPortalAccess} className="mt-3">
            <button
              type="submit"
              className="rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400"
            >
              Preview portal
            </button>
            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Preview mode uses a mock session for review only. Do not use it for real client authentication.
            </p>
          </form>
        ) : null}

        <div className="mt-6 rounded-md border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-950">Also available</p>
          <p className="mt-2">
            Need a one-off NDA? Use the separate Levine LLP{" "}
            <a
              href="/nda"
              className="font-medium text-emerald-700 underline underline-offset-2 transition-colors hover:text-emerald-800"
            >
              NDA Generator
            </a>
            .
          </p>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-sm font-semibold text-neutral-700">Everything you need. All in one secure place.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {portalHighlights.map((item) => (
              <li
                key={item.title}
                className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-500"
              >
                <p className="font-semibold text-neutral-950">{item.title}</p>
                <p className="mt-2 leading-6">{item.description}</p>
                <p className="mt-3 font-medium text-emerald-700">{item.cta}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
