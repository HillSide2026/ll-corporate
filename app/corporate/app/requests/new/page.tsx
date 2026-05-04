import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { submitMatterRequest } from "./actions"

export const metadata: Metadata = { title: "Open a Matter" }

export const dynamic = "force-dynamic"

type NewRequestPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewMatterRequestPage({ searchParams }: NewRequestPageProps) {
  const session =
    (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/corporate")

  const sp = await searchParams
  const hasError = sp.error === "1"

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm">
          <Link
            href="/corporate/app/requests"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← Requests
          </Link>
        </nav>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">Open a matter</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
            Describe what your business needs. Your lawyer will review the request and follow up
            with whether it fits within your existing counsel scope or requires a separate engagement.
          </p>
        </div>

        {hasError ? (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Please fill in all required fields before submitting.
          </div>
        ) : null}

        <form action={submitMatterRequest} className="mt-8 space-y-5">

          {/* Category */}
          <div className="rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-base font-semibold text-stone-900">Category</h2>
            <p className="mt-1 text-sm text-stone-500">
              Select the area that best describes your need.
            </p>
            <div className="mt-4 space-y-2">
              {(["Corporate", "Contract", "Financial Services"] as const).map((cat) => (
                <label key={cat} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    required
                    className="h-4 w-4 accent-brand-navy"
                  />
                  <span className="text-sm font-medium text-stone-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-base font-semibold text-stone-900">Describe your need</h2>
            <p className="mt-1 text-sm text-stone-500">
              What is the business situation? What do you need your lawyer to address?
              Be as specific as useful — more context leads to a faster and more accurate response.
            </p>
            <textarea
              name="description"
              rows={6}
              required
              minLength={10}
              placeholder="E.g. We are raising a seed round and need to update our shareholders agreement, issue new shares to the investors, and confirm our option pool structure…"
              className="mt-4 w-full resize-y rounded border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>

          {/* Optional attachment */}
          <div className="rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Supporting document</h2>
            <p className="mt-1 text-sm text-stone-500">
              Optionally attach a document that gives context for this request. PDF, DOCX, or image — 10 MB max.
            </p>
            <div className="mt-4">
              <input
                type="file"
                name="attachment"
                accept=".pdf,.docx,image/*"
                className="block text-sm text-stone-600 file:mr-3 file:rounded file:border file:border-stone-300 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-stone-700 file:transition-colors file:hover:bg-stone-50"
              />
            </div>
          </div>

          {/* Acknowledgement + submit */}
          <div className="rounded border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Acknowledgement</h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Submitting this request opens a conversation with your lawyer — it does not confirm a new
              engagement or billing. Your lawyer will review and follow up with scope and next steps.
            </p>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="acknowledged"
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-navy"
              />
              <span className="text-sm text-stone-700">
                I understand this is a request for review, not a confirmed engagement.
              </span>
            </label>
            <button
              type="submit"
              className="mt-6 rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Submit matter request
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
