import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { signOutFromPortal } from "src/lib/auth/actions"
import type { PortalSession } from "src/lib/auth/session"
import { cx } from "./PortalDesignSystem"

type PortalSection = "dashboard" | "matters" | "documents" | "requests" | "team" | "settings"

const navItems: Array<{
  key: PortalSection
  label: string
  href: string
  marker: string
}> = [
  { key: "dashboard", label: "Dashboard", href: "/corporate/app", marker: "D" },
  { key: "matters", label: "Matters", href: "/corporate/app/matters", marker: "M" },
  { key: "documents", label: "Documents", href: "/corporate/app/documents", marker: "F" },
  { key: "requests", label: "Requests", href: "/corporate/app/requests", marker: "R" },
  { key: "team", label: "Team / Contacts", href: "/corporate/app/scope", marker: "T" },
  { key: "settings", label: "Settings", href: "/corporate/app/settings", marker: "S" },
]

export function PortalWorkspaceShell({
  active,
  children,
  previewMode = false,
  session,
}: {
  active: PortalSection
  children: ReactNode
  previewMode?: boolean
  session: PortalSession
}) {
  const displayName = session.identity.displayName ?? session.identity.email ?? "Client"
  const email = session.identity.email ?? "Signed-in client"
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "LL"

  return (
    <main className="min-h-dvh bg-stone-100 text-stone-950">
      {previewMode ? (
        <div
          role="status"
          className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-sm font-medium text-amber-950"
        >
          Preview mode: this portal is using a mock session for development review only.
        </div>
      ) : null}

      <div className="grid min-h-dvh lg:grid-cols-[272px_1fr]">
        <aside className="border-b border-stone-200 bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
          <div className="flex h-full flex-col">
            <div className="border-b border-stone-100 px-5 py-5">
              <Link href="/corporate/app" className="flex items-center gap-3">
                <Image
                  src="/logos/levine-law-icon-navy.png"
                  alt="Levine Law"
                  width={500}
                  height={500}
                  className="h-9 w-9 rounded-md border border-stone-200 bg-white"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-950">Levine Law</p>
                  <p className="text-xs text-stone-500">Client Portal</p>
                </div>
              </Link>
            </div>

            <nav aria-label="Portal navigation" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
              <div>
                <p className="px-3 text-xs font-semibold tracking-[0.16em] text-stone-400 uppercase">Workspace</p>
                <ul className="mt-3 space-y-1">
                  {navItems.map((item) => {
                    const isActive = active === item.key
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cx(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-brand-navy text-white shadow-sm"
                              : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
                          )}
                        >
                          <span
                            className={cx(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[11px] font-semibold",
                              isActive
                                ? "border-white/20 bg-white/10 text-white"
                                : "text-brand-navy border-stone-200 bg-white"
                            )}
                            aria-hidden="true"
                          >
                            {item.marker}
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>

            <div className="border-t border-stone-100 p-3">
              <details className="group rounded-lg border border-stone-200 bg-stone-50">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3">
                  <span className="bg-brand-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-stone-950">{displayName}</span>
                    <span className="block truncate text-xs text-stone-500">{email}</span>
                  </span>
                  <span className="text-xs text-stone-400 group-open:rotate-180" aria-hidden="true">
                    v
                  </span>
                </summary>
                <div className="border-t border-stone-200 px-3 py-3">
                  {previewMode ? (
                    <a
                      href="/sign-in"
                      className="block rounded-md border border-stone-300 bg-white px-3 py-2 text-center text-sm font-medium text-stone-700 hover:border-stone-400"
                    >
                      Exit preview
                    </a>
                  ) : (
                    <form action={signOutFromPortal}>
                      <button
                        type="submit"
                        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:border-stone-400"
                      >
                        Sign out
                      </button>
                    </form>
                  )}
                </div>
              </details>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-16 flex-col justify-center gap-1 px-5 py-4 md:px-8">
              <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">
                Secure client workspace
              </p>
              <p className="text-sm text-stone-500">
                Matter updates, shared documents, requests, and Levine Law contacts.
              </p>
            </div>
          </header>
          <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8 md:py-8">{children}</div>
        </section>
      </div>
    </main>
  )
}
