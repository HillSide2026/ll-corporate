import { signInWithKeycloak } from "src/lib/auth/actions"

const pendingModules = ["Matters", "Documents", "Requests", "Account"]

export function PortalEntry() {
  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-950">
      <section className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-6 py-12">
        <p className="text-sm font-medium text-emerald-700">Levine LLP</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight">Corporate Portal</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700">
          Secure access for corporate clients. Sign in with Levine LLP identity services to view the protected portal
          shell.
        </p>

        <form action={signInWithKeycloak} className="mt-8">
          <button
            type="submit"
            className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 rounded-md border border-neutral-200 bg-white px-4 py-4 text-sm text-neutral-700">
          <p className="font-semibold text-neutral-950">Also available</p>
          <p className="mt-2">
            Need a one-off NDA? Use the separate Levine LLP{" "}
            <a
              href="/nda"
              className="font-medium text-emerald-700 underline underline-offset-2 transition-colors hover:text-emerald-800"
            >
              NDA Generator
            </a>
            .
          </p>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-sm font-semibold text-neutral-700">Available after backend contract integration</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {pendingModules.map((moduleName) => (
              <li
                key={moduleName}
                className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-500"
              >
                {moduleName}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
