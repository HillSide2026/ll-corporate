"use client"

import { useState } from "react"

import { getServiceBySlug } from "src/lib/services/catalog"

export function EngagementClient({ serviceSlug }: { serviceSlug?: string }) {
  const [accepted, setAccepted] = useState(false)
  const [pending, setPending] = useState(false)

  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined

  function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    // TODO: server action → record acceptance + set role=client → redirect /corporate/app
    setTimeout(() => {
      setPending(false)
      setAccepted(true)
    }, 800)
  }

  if (accepted) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="rounded border border-green-200 bg-green-50 px-6 py-10 text-center shadow-sm">
          <p className="text-xl font-semibold text-stone-900">Engagement confirmed.</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Your service engagement with Levine Law has been recorded. Levine Law will follow up to confirm next steps.
          </p>
          <a
            href="/corporate/app"
            className="mt-6 inline-flex rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
          >
            Go to portal workspace
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-navy uppercase">Final step</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">Service engagement</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Review the terms below and confirm your engagement with Levine Law.
        </p>
      </div>

      <div className="rounded border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-5">
          <p className="text-sm font-semibold text-stone-900">Levine Law — Service Engagement</p>
          {service && <p className="mt-1 text-sm text-stone-500">Service: {service.title}</p>}
        </div>

        <div className="space-y-5 px-6 py-6 text-sm leading-7 text-stone-700">
          <p>
            This service engagement confirms that you are engaging Levine Law to provide the legal services described
            below. By accepting, you agree to engage Levine Law on the terms set out in this document.
          </p>

          {service ? (
            <>
              <div>
                <p className="font-semibold text-stone-900">Services to be provided</p>
                <ul className="mt-2 space-y-1">
                  {service.scope.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-1 shrink-0 text-brand-navy" aria-hidden="true">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-stone-900">Scope and assumptions</p>
                <ul className="mt-2 space-y-1 text-stone-600">
                  {service.assumptions.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-1 shrink-0 text-stone-400" aria-hidden="true">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-stone-900">Fees</p>
                <p className="mt-1 text-stone-600">
                  {service.price ?? "Fees will be quoted following receipt of the required intake information."}
                </p>
              </div>
            </>
          ) : (
            <p className="text-stone-500 italic">Service details will appear here once intake is complete.</p>
          )}

          <div>
            <p className="font-semibold text-stone-900">Important notices</p>
            <p className="mt-1 text-stone-600">
              This engagement does not create an ongoing lawyer-client relationship beyond the described services.
              Levine Law reserves the right to decline to act or withdraw from this engagement in accordance with its
              professional obligations. This engagement is subject to Levine Law&apos;s standard terms of engagement.
            </p>
          </div>
        </div>

        <div className="border-t border-stone-200 px-6 py-5">
          <form onSubmit={handleAccept} className="space-y-4">
            <label className="flex cursor-pointer gap-3 rounded border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-600">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
              />
              <span>
                I have read and agree to the terms of this service engagement. I understand this engagement does not
                create an ongoing lawyer-client relationship beyond the described scope.
              </span>
            </label>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Confirming..." : "Accept and confirm engagement"}
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-stone-400">
        Your acceptance is recorded with a timestamp. Levine Law will follow up to confirm receipt.
      </p>
    </div>
  )
}
