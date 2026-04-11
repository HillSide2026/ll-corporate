const boundaryItems = [
  "ll-task-tracker remains the system of record.",
  "Client data appears only after backend contracts exist.",
  "Workflow, state, and permission decisions stay out of the frontend.",
]

const pendingAreas = ["Matters", "Documents", "Requests", "Account"]

export function PortalShell() {
  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Levine LLP</p>
            <h1 className="mt-1 text-3xl font-semibold">Corporate Portal</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-neutral-600">
            Secure client access is being prepared. Matter, document, request, and account records will appear only
            after client-safe backend contracts are available.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <nav
          aria-label="Portal sections"
          className="border-b border-neutral-200 pb-5 lg:border-r lg:border-b-0 lg:pr-6"
        >
          <p className="text-xs font-semibold text-neutral-500 uppercase">Portal</p>
          <ul className="mt-4 space-y-2">
            {pendingAreas.map((area) => (
              <li key={area}>
                <span className="block rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500">
                  {area}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="portal-foundation-heading" className="space-y-8">
          <div>
            <p className="text-sm font-medium text-emerald-700">Foundation mode</p>
            <h2 id="portal-foundation-heading" className="mt-2 text-2xl font-semibold">
              Portal shell ready for contract-first implementation
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
              This surface is intentionally empty of client records, workflow actions, and operational decisions until
              `ll-task-tracker` provides the corresponding client-safe contracts.
            </p>
          </div>

          <div className="grid gap-3">
            {boundaryItems.map((item) => (
              <p
                key={item}
                className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700"
              >
                {item}
              </p>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
