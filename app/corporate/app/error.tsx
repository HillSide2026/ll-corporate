"use client"

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-dvh bg-stone-50 px-6 py-20">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-navy uppercase">Portal</p>
        <h2 className="mt-3 text-2xl font-semibold text-stone-900">Something went wrong</h2>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          {error.message || "An unexpected error occurred while loading the portal."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={reset}
            className="rounded border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          >
            Try again
          </button>
          <a
            href="/corporate"
            className="rounded border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400"
          >
            Back to sign-in
          </a>
        </div>
      </div>
    </div>
  )
}
