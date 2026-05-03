import Link from "next/link"
import { Suspense } from "react"

import { signOutFromPortal } from "src/lib/auth/actions"
import { type PortalSession } from "src/lib/auth/session"
import { MatterList } from "./MatterList"

type PortalShellProps = {
  session: PortalSession
  previewMode?: boolean
  accessToken?: string | null
}

function MatterListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading matters">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded border border-stone-200 bg-stone-100" />
      ))}
    </div>
  )
}

export function PortalShell({ previewMode = false, session, accessToken = null }: PortalShellProps) {
  const displayName = session.identity.displayName ?? session.identity.email ?? "Signed-in client"

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      {previewMode ? (
        <div role="status" className="bg-amber-50 px-6 py-3 text-sm font-medium text-amber-950">
          Preview mode: this portal is using a mock session for development review only.
        </div>
      ) : null}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-navy">Levine LLP</p>
            <h1 className="mt-1 text-3xl font-semibold text-stone-900">Client Portal</h1>
            {previewMode ? <p className="mt-2 text-sm font-medium text-amber-700">Preview mode</p> : null}
          </div>
          <div className="flex flex-col gap-3 text-sm text-stone-500 md:items-end">
            <p>
              Signed in as <span className="font-medium text-stone-900">{displayName}</span>
            </p>
            {session.identity.email ? <p>{session.identity.email}</p> : null}
            {previewMode ? (
              <a
                href="/corporate"
                className="rounded-md border border-stone-300 bg-white px-3 py-2 font-medium text-stone-700 transition-colors hover:border-stone-400"
              >
                Exit preview
              </a>
            ) : (
              <form action={signOutFromPortal}>
                <button
                  type="submit"
                  className="rounded-md border border-stone-300 bg-white px-3 py-2 font-medium text-stone-700 transition-colors hover:border-stone-400"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <nav
          aria-label="Portal navigation"
          className="border-b border-stone-200 pb-5 lg:border-r lg:border-b-0 lg:pr-6"
        >
          <p className="text-xs font-semibold uppercase text-stone-400">Portal</p>
          <ul className="mt-4 space-y-2">
            <li>
              <span className="block rounded-md border border-brand-navy/20 bg-brand-navy/5 px-3 py-2 text-sm font-medium text-brand-navy">
                Matters
              </span>
            </li>
            <li>
              <Link
                href="/corporate/app/documents"
                className="block rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
              >
                Documents
              </Link>
            </li>
            <li>
              <Link
                href="/corporate/app/requests"
                className="block rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
              >
                Requests
              </Link>
            </li>
          </ul>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase text-stone-400">Tools</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/ndaesq"
                  className="block rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-brand-navy transition-colors hover:border-brand-navy"
                >
                  NDA Tool
                </a>
                <p className="mt-2 text-xs leading-5 text-stone-400">Separate service mounted at /ndaesq.</p>
              </li>
            </ul>
          </div>
        </nav>

        <section aria-labelledby="portal-home-heading" className="space-y-10">
          <div>
            <p className="text-sm font-medium text-brand-navy">Welcome back</p>
            <h2 id="portal-home-heading" className="mt-2 text-2xl font-semibold text-stone-900">
              Good to see you, {displayName}
            </h2>
          </div>

          {/* Matters */}
          <div>
            <h3 className="text-base font-semibold text-stone-900">Matters</h3>
            <div className="mt-4">
              <Suspense fallback={<MatterListSkeleton />}>
                <MatterList accessToken={accessToken} />
              </Suspense>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-base font-semibold text-stone-900">Documents</h3>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Access documents shared by your counsel — agreements, filings, and supporting materials.
            </p>
            <Link
              href="/corporate/app/documents"
              className="mt-3 inline-flex text-sm font-semibold text-brand-navy underline-offset-2 hover:underline"
            >
              View documents →
            </Link>
          </div>

          {/* Requests */}
          <div>
            <h3 className="text-base font-semibold text-stone-900">Requests</h3>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Submit limited-scope service requests or track the status of existing ones.
            </p>
            <Link
              href="/corporate/app/requests"
              className="mt-3 inline-flex text-sm font-semibold text-brand-navy underline-offset-2 hover:underline"
            >
              View requests →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
