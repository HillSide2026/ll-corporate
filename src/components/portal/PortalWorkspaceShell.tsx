import type { ReactNode } from "react"
import { Settings } from "lucide-react"

import { signOutFromPortal } from "src/lib/auth/actions"
import type { PortalSession } from "src/lib/auth/session"
import { isMattersAndDocumentsEnabled } from "src/lib/portal/features"
import { ContentFooter, SELF_FOOTED } from "src/components/brand/PortalFooter"
import { NavyRail, navyRailButton, NavyRailLink, PortalLogo } from "./NavyRail"
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
]
// Settings sits apart, near the foot of the navy column, with a gear icon (ML1 2026-11-18).
const settingsHref = "/corporate/app/settings"

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
  const showMattersAndDocuments = isMattersAndDocumentsEnabled()
  const visibleNavItems = showMattersAndDocuments
    ? navItems
    : navItems.filter((item) => item.key !== "matters" && item.key !== "documents")
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
    <main {...SELF_FOOTED} className="min-h-dvh bg-stone-50 text-stone-950">
      {previewMode ? (
        <div
          role="status"
          className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-sm font-medium text-amber-950"
        >
          Preview mode: this portal is using a mock session for development review only.
        </div>
      ) : null}

      <div className="grid min-h-dvh lg:grid-cols-[232px_1fr]">
        <div className="bg-brand-navy">
          <NavyRail
            homeHref="/corporate/app"
            label="Client Portal"
            footer={
              <div className="space-y-3">
                <NavyRailLink href={settingsHref} active={active === "settings"}>
                  <Settings className="size-5 shrink-0" aria-hidden="true" />
                  <span>Settings</span>
                </NavyRailLink>
                <details className="group rounded-lg border border-white/15 bg-white/5">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3">
                    <span className="text-brand-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold">
                      {initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">{displayName}</span>
                      <span className="block truncate text-xs text-white/60">{email}</span>
                    </span>
                    <span className="text-xs text-white/50 group-open:rotate-180" aria-hidden="true">
                      v
                    </span>
                  </summary>
                  <div className="border-t border-white/15 px-3 py-3">
                    {previewMode ? (
                      <a href="/sign-in" className={cx(navyRailButton, "block text-center")}>
                        Exit preview
                      </a>
                    ) : (
                      <form action={signOutFromPortal}>
                        <button type="submit" className={navyRailButton}>
                          Sign out
                        </button>
                      </form>
                    )}
                  </div>
                </details>
              </div>
            }
          >
            <ul className="space-y-1">
              {visibleNavItems.map((item) => {
                const isActive = active === item.key
                return (
                  <li key={item.key}>
                    <NavyRailLink href={item.href} active={isActive}>
                      <span
                        className={cx(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded border text-[11px] font-semibold",
                          isActive ? "border-white/40 bg-white/15 text-white" : "border-white/20 text-white/70"
                        )}
                        aria-hidden="true"
                      >
                        {item.marker}
                      </span>
                      <span>{item.label}</span>
                    </NavyRailLink>
                  </li>
                )
              })}
            </ul>
          </NavyRail>
        </div>

        <section className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
              <div className="flex flex-col gap-1">
                <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">
                  Secure client workspace
                </p>
                <p className="text-sm text-stone-500">
                  {showMattersAndDocuments
                    ? "Matter updates, shared documents, requests, and Levine Law contacts."
                    : "Requests, resources, and your Levine Law contacts."}
                </p>
              </div>
              <PortalLogo href="/corporate/app" />
            </div>
          </header>
          <div className="mx-auto w-full max-w-7xl flex-1 px-5 py-6 md:px-8 md:py-8">{children}</div>
          <ContentFooter className="max-w-7xl px-5 md:px-8" />
        </section>
      </div>
    </main>
  )
}
