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
    <main className="min-h-dvh bg-white">
      {/* Two-column layout: navy brand panel + sign-in form */}
      <div className="flex min-h-dvh flex-col lg:flex-row">
        {/* Left — navy brand panel */}
        <div className="relative hidden overflow-hidden bg-brand-navy lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12">
          {/* Ambient radial highlight */}
          <div
            className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(45,123,196,0.5) 0%, transparent 65%)" }}
            aria-hidden="true"
          />
          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Logo */}
            <Link href="/" aria-label="Levine Law home" className="inline-block">
              <Image
                src="/logos/levine-law-wordmark-white-on-navy.png"
                alt="Levine Law"
                width={1080}
                height={600}
                priority
                className="h-10 w-auto"
              />
            </Link>

            {/* Headline */}
            <div className="mt-16">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-white/50 uppercase">Secure Client Portal</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white">
                Manage Legal Matters in One Secure Location
              </h1>
              <p className="mt-5 text-base leading-7 text-white/65">
                Access documents, submit requests, and stay informed about the status of legal matters through the
                Levine Law platform.
              </p>
            </div>

            {/* Feature list */}
            <ul className="mt-12 space-y-5">
              {[
                {
                  icon: (
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                  title: "Document Access",
                  detail: "Access documents shared through the platform.",
                },
                {
                  icon: (
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                  title: "Submit Requests",
                  detail: "Complete forms and provide information online.",
                },
                {
                  icon: (
                    <path
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                  title: "Matter Updates",
                  detail: "Real-time visibility into active legal matters.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white/80"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.6}
                    >
                      {item.icon}
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-sm text-white/55">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer note */}
          <p className="relative z-10 text-xs text-white/35">
            © 2026 Levine Law. Toronto, Ontario.
          </p>
        </div>

        {/* Right — sign-in form */}
        <div className="flex flex-1 flex-col">
          {/* Mobile header (hidden on lg) */}
          <header className="border-b border-stone-200 lg:hidden">
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" aria-label="Levine Law home">
                <Image
                  src="/logos/levine-law-wordmark-navy-transparent-2.png"
                  alt="Levine Law"
                  width={1080}
                  height={600}
                  priority
                  className="h-9 w-auto"
                />
              </Link>
            </div>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 py-12 lg:py-0">
            <div className="w-full max-w-sm">
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Levine Law</p>
              <h2 className="text-ink mt-3 text-2xl font-semibold tracking-tight">Existing Clients</h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Sign in to access documents, requests, matter updates, and communications through the Levine Law
                platform.
              </p>

              {authErrorMessage ? (
                <div
                  role="alert"
                  className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"
                >
                  {authErrorMessage}
                </div>
              ) : null}

              <form action={signInWithCredentials} className="mt-8 space-y-4">
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
                    className="focus:border-brand-navy focus:ring-brand-navy mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:outline-none"
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
                    className="focus:border-brand-navy focus:ring-brand-navy mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:outline-none"
                  />
                </div>
                <div className="pt-1">
                  <SignInButton label="Sign In" pendingLabel="Signing in..." />
                </div>
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
                    className="rounded-lg border border-stone-300 bg-white px-5 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-stone-400"
                  >
                    Preview portal
                  </button>
                  <p className="mt-2 text-xs leading-5 text-stone-400">
                    Preview mode uses a mock session for review only.
                  </p>
                </form>
              ) : null}

              <p className="mt-10 text-xs text-stone-400">
                Don&apos;t have access?{" "}
                <Link href="/#request-access" className="text-brand-navy font-medium hover:underline">
                  Request access
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
