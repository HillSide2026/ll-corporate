import type { Metadata } from "next"
import Link from "next/link"

import { PortalAccessRequestForm } from "src/components/PortalAccessRequestForm"

export const metadata: Metadata = {
  title: "Portal Access Request",
}

export default function SignUpPage() {
  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Link href="/" className="text-brand-navy text-sm font-semibold underline-offset-2 hover:underline">
          Levine Law Client Portal
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded border border-stone-200 bg-white px-6 py-6 shadow-sm md:px-8 md:py-8">
            <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">Portal access</p>
            <h1 className="mt-3 text-3xl font-semibold text-stone-900">Request portal access.</h1>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Requesting portal access does not create a lawyer-client relationship. Levine Law reviews requests before
              granting access or accepting an engagement.
            </p>
            <div className="mt-6 border-t border-stone-200 pt-5">
              <p className="text-sm font-medium text-stone-900">Already have access?</p>
              <Link
                href="/sign-in"
                className="text-brand-navy mt-2 inline-flex text-sm font-semibold underline-offset-4 hover:underline"
              >
                Sign in to the client portal
              </Link>
            </div>
          </div>

          <div className="rounded border border-stone-200 bg-white px-6 py-6 shadow-sm md:px-8 md:py-8">
            <div className="mb-6 border-b border-stone-200 pb-5">
              <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">Access request</p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-900">Tell us who needs portal access.</h2>
              <p className="mt-3 text-sm leading-6 text-stone-500">
                Levine Law will review the request and follow up if portal access is appropriate.
              </p>
            </div>
            <PortalAccessRequestForm />
          </div>
        </div>
      </section>
    </main>
  )
}
