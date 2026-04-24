const serviceHighlights = [
  {
    title: "Corporate Maintenance",
    description: "Annual resolutions, record updates, minute book support, and day-to-day governance work.",
  },
  {
    title: "Transaction Support",
    description: "Practical legal support for financings, commercial arrangements, and time-sensitive closings.",
  },
  {
    title: "Client Portal",
    description: "A secure workspace for updates, shared documents, and requests with the Levine LLP team.",
  },
]

const engagementPrinciples = [
  "Responsive advice grounded in how businesses actually operate.",
  "Clear next steps for founders, operators, and in-house teams.",
  "Secure client access for ongoing corporate matters and document flow.",
]

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-stone-950 text-stone-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.22),transparent_60%)]" />

        <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-8">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-8 text-sm text-stone-300 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold uppercase tracking-[0.24em] text-emerald-300">Levine LLP</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">
                Corporate counsel for growing companies, with a secure workspace for active client matters.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-3">
              <a
                href="/corporate"
                className="rounded-full border border-white/15 px-4 py-2 font-medium text-stone-100 transition-colors hover:border-emerald-300 hover:text-emerald-200"
              >
                Client Portal
              </a>
              <a
                href="/nda"
                className="rounded-full border border-white/10 px-4 py-2 font-medium text-stone-300 transition-colors hover:border-stone-200 hover:text-stone-100"
              >
                NDA Generator
              </a>
            </nav>
          </header>

          <div className="grid flex-1 gap-12 py-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,28rem)] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-300">Corporate Law</p>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Business counsel built for momentum, not bottlenecks.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
                Levine LLP helps companies stay current, move decisively, and keep legal work organized without losing
                clarity along the way.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/corporate"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-stone-950 transition-transform hover:-translate-y-0.5 hover:bg-emerald-200"
                >
                  Enter Corporate Portal
                </a>
                <a
                  href="/nda"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  Launch NDA Generator
                </a>
              </div>

              <ul className="mt-10 grid gap-3 text-sm text-stone-300">
                {engagementPrinciples.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">How We Help</p>
              <div className="mt-6 grid gap-4">
                {serviceHighlights.map((item) => (
                  <section key={item.title} className="rounded-2xl border border-white/8 bg-stone-900/70 p-5">
                    <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-300">{item.description}</p>
                  </section>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
                <p className="text-sm font-semibold text-emerald-200">Existing client?</p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  Open the secure portal to review updates, access shared materials, or send requests to the Levine LLP
                  team.
                </p>
                <a
                  href="/corporate"
                  className="mt-4 inline-flex text-sm font-semibold text-emerald-200 underline underline-offset-4 hover:text-emerald-100"
                >
                  Go to secure sign-in
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
