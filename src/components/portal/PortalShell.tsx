import { signOutFromPortal } from "src/lib/auth/actions"
import { type PortalSession } from "src/lib/auth/session"

const portalAreas = [
  {
    title: "Matters",
    description: "See client-safe matter updates and key next steps when matter access is connected.",
    nextAction: "Review your active and upcoming legal work once matter contracts are available.",
  },
  {
    title: "Documents",
    description: "Find secure document access, review, download, and upload tools as they become available.",
    nextAction: "Use this area for document exchange once document contracts are connected.",
  },
  {
    title: "Requests",
    description: "Send updates, questions, or new service requests to the Levine LLP team from one place.",
    nextAction: "Use this area for client requests once request intake is enabled.",
  },
]

type PortalShellProps = {
  session: PortalSession
}

export function PortalShell({ session }: PortalShellProps) {
  const displayName = session.identity.displayName ?? session.identity.email ?? "Signed-in client"

  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Levine LLP</p>
            <h1 className="mt-1 text-3xl font-semibold">Client Portal</h1>
          </div>
          <div className="flex flex-col gap-3 text-sm text-neutral-600 md:items-end">
            <p>
              Signed in as <span className="font-medium text-neutral-950">{displayName}</span>
            </p>
            {session.identity.email ? <p>{session.identity.email}</p> : null}
            <form action={signOutFromPortal}>
              <button
                type="submit"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 font-medium text-neutral-800 transition-colors hover:border-neutral-400"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <nav
          aria-label="Portal navigation"
          className="border-b border-neutral-200 pb-5 lg:border-r lg:border-b-0 lg:pr-6"
        >
          <p className="text-xs font-semibold text-neutral-500 uppercase">Portal</p>
          <ul className="mt-4 space-y-2">
            {portalAreas.map((area) => (
              <li key={area.title}>
                <span className="block rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500">
                  {area.title}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-xs font-semibold text-neutral-500 uppercase">Sibling apps</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/nda"
                  className="block rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-100"
                >
                  NDA Generator
                </a>
                <p className="mt-2 text-xs leading-5 text-neutral-500">Separate service mounted at /nda.</p>
              </li>
            </ul>
          </div>
        </nav>

        <section aria-labelledby="portal-home-heading" className="space-y-8">
          <div>
            <p className="text-sm font-medium text-emerald-700">Welcome back</p>
            <h2 id="portal-home-heading" className="mt-2 text-2xl font-semibold">
              Good to see you, {displayName}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
              Your portal home will bring together client-safe matter updates, document access, and requests as Levine
              LLP enables each service.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {portalAreas.map((area) => (
              <article key={area.title} className="rounded-md border border-neutral-200 bg-white px-4 py-4">
                <h3 className="text-base font-semibold text-neutral-950">{area.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{area.description}</p>
                <p className="mt-4 text-sm font-medium text-emerald-700">{area.nextAction}</p>
              </article>
            ))}
          </div>

          <div className="rounded-md border border-neutral-200 bg-white px-4 py-4 text-sm leading-6 text-neutral-700">
            Matter, task, and workflow state remains managed by LL-task-tracker. This portal only displays client-safe
            information after backend contracts are available.
          </div>
        </section>
      </div>
    </main>
  )
}
