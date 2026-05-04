import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import type { CaseInstance } from "src/lib/contracts"
import { getAdminSession } from "src/lib/auth/adminAuth"
import { getMatterList } from "src/lib/portal/matterSource"
import { getMatterRequests } from "src/lib/portal/matterRequestStore"
import { adminLogout } from "./login/actions"

export const metadata: Metadata = { title: "Admin — Levine LLP Portal" }

export const dynamic = "force-dynamic"

function matterStateBadge(state: CaseInstance["matterState"]): string {
  switch (state) {
    case "Active":
      return "bg-brand-navy/10 text-brand-navy"
    case "Pending":
      return "bg-amber-50 text-amber-700"
    case "Closed":
    case "Archived":
      return "bg-stone-100 text-stone-400"
    default:
      return "bg-stone-100 text-stone-500"
  }
}

function requestStatusBadge(status: string): string {
  switch (status) {
    case "Received": return "bg-amber-50 text-amber-700"
    case "In Review": return "bg-brand-navy/10 text-brand-navy"
    case "Accepted": return "bg-green-50 text-green-700"
    case "Declined": return "bg-stone-100 text-stone-400"
    default: return "bg-stone-100 text-stone-500"
  }
}

export default async function AdminHomePage() {
  const { isAdmin, isPreview } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const { matters, isMock } = await getMatterList(null)
  const matterRequests = getMatterRequests()

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-brand-navy">Levine LLP</p>
            <h1 className="mt-0.5 text-lg font-semibold text-stone-900">Admin</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {isPreview ? (
              <span className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                Preview — set PORTAL_ADMIN_TOKEN to require login
              </span>
            ) : (
              <form action={adminLogout}>
                <button
                  type="submit"
                  className="rounded border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-12">

        {/* Matters */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-stone-900">Active matters</h2>
            {isMock ? (
              <span className="text-xs text-stone-400">Preview data</span>
            ) : null}
          </div>
          {matters.length === 0 ? (
            <p className="mt-4 text-sm text-stone-400">No matters found.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {matters.map((matter, i) => {
                const key = matter.businessKey ?? `matter-${i}`
                return (
                  <li key={key}>
                    <Link
                      href={`/corporate/admin/matters/${encodeURIComponent(key)}`}
                      className="flex items-center justify-between gap-4 rounded border border-stone-200 bg-white px-5 py-4 transition hover:border-brand-navy/30 hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900">{key}</p>
                        {matter.matterType ? (
                          <p className="mt-0.5 text-sm text-stone-500">{matter.matterType}</p>
                        ) : null}
                        {matter.nextActionSummary ? (
                          <p className="mt-1 text-xs text-stone-400">{matter.nextActionSummary}</p>
                        ) : null}
                      </div>
                      {matter.matterState ? (
                        <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${matterStateBadge(matter.matterState)}`}>
                          {matter.matterState}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Client Matter Requests */}
        <section>
          <h2 className="text-base font-semibold text-stone-900">Counsel matter requests</h2>
          <p className="mt-1 text-sm text-stone-500">
            Open-ended requests from clients for fractional counsel engagement.
          </p>
          {matterRequests.length === 0 ? (
            <p className="mt-4 text-sm text-stone-400">No matter requests submitted yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {matterRequests.map((req) => (
                <li key={req.id} className="rounded border border-stone-200 bg-white px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900">{req.category}</p>
                      <p className="mt-1 text-xs text-stone-400">
                        {req.id} · {req.clientIdentity.displayName ?? req.clientIdentity.email} ·{" "}
                        {new Date(req.submittedAt).toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600 line-clamp-2">{req.description}</p>
                      {req.attachmentFilename ? (
                        <p className="mt-1 text-xs text-stone-400">Attachment: {req.attachmentFilename}</p>
                      ) : null}
                    </div>
                    <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${requestStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
