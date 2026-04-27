export default function PortalLoading() {
  return (
    <div className="min-h-dvh bg-stone-50" aria-busy="true" aria-label="Loading portal">
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-stone-200" />
            <div className="h-7 w-36 animate-pulse rounded bg-stone-200" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-stone-200" />
        </div>
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded border border-stone-200 bg-stone-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
