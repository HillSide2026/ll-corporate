import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Portal Access Request",
}

export default function PortalOnboardingPage() {
  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm font-semibold text-brand-navy underline-offset-2 hover:underline">
          Levine Law Client Portal
        </Link>

        <div className="mt-8 rounded border border-stone-200 bg-white px-6 py-6 md:px-8 md:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">Portal access</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">Request portal access.</h1>
          <p className="mt-4 text-sm leading-6 text-stone-500">
            Requesting portal access does not create a lawyer-client relationship. Levine Law reviews requests before
            granting access or accepting an engagement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/corporate"
              className="inline-flex items-center justify-center rounded bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Sign In
            </Link>
            <Link
              href="/#notice"
              className="inline-flex items-center justify-center rounded border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Review Notice
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
