import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { ConflictRequestCard } from "src/components/intake/ConflictRequestCard"
import { type ConflictRequest, listConflictRequests } from "src/lib/intake/conflictRequestStore"

export const metadata: Metadata = { title: "Conflict Checks — Levine Law Admin" }

export const dynamic = "force-dynamic"

export default async function AdminConflictsPage() {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  let requests: ConflictRequest[] = []
  let unavailable = false
  try {
    requests = await listConflictRequests()
  } catch (err) {
    console.error("AdminConflictsPage: conflict request store unavailable", err)
    unavailable = true
  }
  const pending = requests.filter((r) => r.status === "pending").length

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link href="/corporate/admin" className="text-brand-navy text-sm font-semibold">
            Levine Law Admin
          </Link>
          <h1 className="mt-0.5 text-lg font-semibold text-stone-900">Conflict checks</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <p className="text-sm text-stone-500">
          Run each name through Clio&apos;s conflict search, then clear or decline. The lead sees the result on their
          conflict check page. After clearing, email them to confirm the right service and fee before sending an
          engagement letter. {pending} pending.
        </p>

        {unavailable ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            The conflict check table is unavailable. Check that intake_conflict_requests exists in the portal database.
          </p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-stone-400">No conflict check requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((request) => (
              <ConflictRequestCard key={request.id} request={request} />
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
