import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import {
  isPortalAccessRequestApiConfigured,
  listPortalAccessRequests,
  type PortalAccessRequest,
  type PortalAccessRequestStatus,
} from "src/lib/portal/accessRequestApi"
import { updateAccessRequestStatus } from "./actions"

export const metadata: Metadata = { title: "Portal Access Requests — Levine Law Admin" }

export const dynamic = "force-dynamic"

const statuses: PortalAccessRequestStatus[] = ["pending", "reviewing", "approved", "rejected", "provisioned"]

function statusBadge(status: PortalAccessRequestStatus): string {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700"
    case "reviewing":
      return "bg-brand-navy/10 text-brand-navy"
    case "approved":
      return "bg-green-50 text-green-700"
    case "rejected":
      return "bg-stone-100 text-stone-500"
    case "provisioned":
      return "bg-emerald-50 text-emerald-700"
    default:
      return "bg-stone-100 text-stone-500"
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

async function getRequests(): Promise<{
  requests: PortalAccessRequest[]
  error: string | null
}> {
  if (!isPortalAccessRequestApiConfigured()) {
    return {
      requests: [],
      error:
        "Portal access request API is not configured. Set PORTAL_ACCESS_REQUEST_API_BASE_URL and PORTAL_ACCESS_REQUEST_API_TOKEN to enable durable review.",
    }
  }

  try {
    return { requests: await listPortalAccessRequests(), error: null }
  } catch (error) {
    return {
      requests: [],
      error: error instanceof Error ? error.message : "Portal access requests could not be loaded.",
    }
  }
}

type AccessRequestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AccessRequestsPage({ searchParams }: AccessRequestsPageProps) {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const sp = await searchParams
  const justUpdated = sp.updated === "1"
  const invalidUpdate = sp.error === "invalid"
  const { requests, error } = await getRequests()

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm">
          <Link
            href="/corporate/admin"
            className="text-brand-navy hover:text-brand-navy-dark font-semibold transition-colors"
          >
            ← Admin
          </Link>
        </nav>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">Admin Review</p>
            <h1 className="mt-3 text-3xl font-semibold text-stone-900">Portal access requests</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Review public portal access requests before any Keycloak account is created or portal access is
              provisioned.
            </p>
          </div>
        </div>

        {justUpdated ? (
          <div className="mt-6 rounded border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
            Access request updated.
          </div>
        ) : null}

        {invalidUpdate ? (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Select a valid access request status before updating.
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
            {error}
          </div>
        ) : null}

        {!error && requests.length === 0 ? (
          <p className="mt-8 text-sm text-stone-400">No portal access requests found.</p>
        ) : null}

        {requests.length > 0 ? (
          <ul className="mt-8 space-y-4">
            {requests.map((request) => (
              <li key={request.id} className="rounded border border-stone-200 bg-white px-5 py-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base font-semibold text-stone-900">{request.fullName}</h2>
                      <span className={`rounded px-2 py-1 text-xs font-medium ${statusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">
                      {request.email} · {request.company} · {request.phone}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      {request.id} · submitted {formatDate(request.submittedAt)} · acknowledged{" "}
                      {formatDate(request.legalAcknowledgedAt)}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-600">{request.description}</p>
                    {request.internalNote ? (
                      <p className="mt-3 rounded bg-stone-50 px-3 py-2 text-sm leading-6 text-stone-600">
                        {request.internalNote}
                      </p>
                    ) : null}
                    {request.keycloakUserId ? (
                      <p className="mt-2 text-xs text-stone-400">Keycloak user: {request.keycloakUserId}</p>
                    ) : null}
                  </div>
                </div>

                <form
                  action={updateAccessRequestStatus}
                  className="mt-5 grid gap-3 border-t border-stone-100 pt-5 md:grid-cols-[180px_1fr_1fr_auto]"
                >
                  <input type="hidden" name="id" value={request.id} />
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-stone-500">Status</span>
                    <select
                      name="status"
                      defaultValue={request.status}
                      className="focus:border-brand-navy focus:ring-brand-navy w-full rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:ring-1 focus:outline-none"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-stone-500">Internal note</span>
                    <input
                      name="internalNote"
                      defaultValue={request.internalNote ?? ""}
                      className="focus:border-brand-navy focus:ring-brand-navy w-full rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:ring-1 focus:outline-none"
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs font-medium text-stone-500">Keycloak user ID</span>
                    <input
                      name="keycloakUserId"
                      defaultValue={request.keycloakUserId ?? ""}
                      className="focus:border-brand-navy focus:ring-brand-navy w-full rounded border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:ring-1 focus:outline-none"
                    />
                  </label>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-brand-navy hover:bg-brand-navy-dark w-full rounded px-4 py-2 text-sm font-semibold text-white transition-colors md:w-auto"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  )
}
