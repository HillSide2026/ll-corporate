import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <p className="text-sm font-semibold text-white">Levine Law</p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Corporate Governance and Financial Services Counsel to Valued Clients
            </p>
            <p className="mt-4 text-sm text-white/40">Toronto, Ontario</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
            <Link href="/sign-in" className="transition-colors hover:text-white">
              Sign In
            </Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs text-white/35">© 2026 Levine Law. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
