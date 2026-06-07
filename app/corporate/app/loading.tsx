export default function PortalLoading() {
  return (
    <div
      className="grid min-h-dvh bg-stone-100 text-stone-950 lg:grid-cols-[272px_1fr]"
      aria-busy="true"
      aria-label="Loading portal"
    >
      <aside className="hidden border-r border-stone-200 bg-white lg:block">
        <div className="border-b border-stone-100 px-5 py-5">
          <div className="h-9 w-36 animate-pulse rounded bg-stone-200" />
        </div>
        <div className="space-y-2 px-3 py-5">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-10 animate-pulse rounded-md bg-stone-100" />
          ))}
        </div>
      </aside>
      <main>
        <div className="border-b border-stone-200 bg-white px-5 py-4 md:px-8">
          <div className="h-4 w-56 animate-pulse rounded bg-stone-200" />
          <div className="mt-2 h-3 w-80 max-w-full animate-pulse rounded bg-stone-100" />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <div className="h-9 w-64 animate-pulse rounded bg-stone-200" />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-lg border border-stone-200 bg-white" />
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            <div className="h-80 animate-pulse rounded-lg border border-stone-200 bg-white" />
            <div className="h-80 animate-pulse rounded-lg border border-stone-200 bg-white" />
          </div>
        </div>
      </main>
    </div>
  )
}
