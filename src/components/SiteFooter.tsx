import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <p className="text-sm font-semibold text-stone-900">Levine Law</p>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Corporate, contract, and financial services counsel for growing businesses.
            </p>
            <p className="mt-4 text-sm text-stone-400">Toronto, Ontario</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-500">
            <Link href="/#client-portal" className="transition-colors hover:text-stone-900">
              Client portal
            </Link>
            <Link href="/#request-access" className="transition-colors hover:text-stone-900">
              Request access
            </Link>
            <Link href="/#notice" className="transition-colors hover:text-stone-900">
              Notice
            </Link>
            <Link href="/sign-in" className="transition-colors hover:text-stone-900">
              Sign in
            </Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-stone-200 pt-6">
          <p className="text-xs text-stone-400">© 2026 Levine Law. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
