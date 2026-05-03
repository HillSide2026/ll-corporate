import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { getRequests, type RequestStatus } from "src/lib/portal/requestStore"
import { serviceCatalog } from "src/lib/services/catalog"

export const metadata: Metadata = {
  title: "Requests",
}

export const dynamic = "force-dynamic"

type RequestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

function statusBadge(status: RequestStatus): string {
  switch (status) {
    case "Received":
      return "bg-amber-50 text-amber-700"
    case "In Review":
      return "bg-brand-navy/10 text-brand-navy"
    case "Complete":
      return "bg-stone-100 text-stone-500"
  }
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const session =
    (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/corporate")
  }

  const params = await searchParams
  const justSubmitted = params.submitted === "1"

  const requests = getRequests()

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm">
          <Link
            href="/corporate/app"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← Portal home
          </Link>
        </nav>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">Requests</h1>
          <p className="mt-2 text-sm text-stone-500">
            Track submitted service requests and start new ones.
          </p>
        </div>

        {justSubmitted ? (
          <div className="mt-6 rounded border border-green-200 bg-green-50 px-5 py-4 text-sm">
            <p className="font-semibold text-green-900">Request submitted</p>
            <p className="mt-1 text-green-700">
              Your request has been received. We'll follow up with next steps shortly.
            </p>
          </div>
        ) : null}

        {/* Submitted requests */}
        <div className="mt-10">
          <h2 className="text-base font-semibold text-stone-900">Submitted requests</h2>
          {requests.length === 0 ? (
            <p className="mt-3 text-sm text-stone-400">No requests submitted yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {requests.map((req) => (
                <li key={req.id} className="rounded border border-stone-200 bg-white px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-900">{req.contract.serviceTitle}</p>
                      <p className="mt-1 text-xs text-stone-400">
                        {req.id} · Submitted {formatDate(req.contract.createdAt)}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        {req.contract.pricingSnapshot.priceDisplay}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${statusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Service catalog */}
        <div className="mt-14">
          <h2 className="text-base font-semibold text-stone-900">Available services</h2>
          <p className="mt-1 text-sm text-stone-500">
            Limited-scope services with defined scope, pricing, and turnaround.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCatalog.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/corporate/services/${service.slug}/request`}
                  className="block rounded border border-stone-200 bg-white px-5 py-4 transition hover:border-brand-navy/30 hover:shadow-sm"
                >
                  <p className="font-semibold text-stone-900">{service.title}</p>
                  <p className="mt-1 text-xs text-stone-500">{service.turnaround}</p>
                  <p className="mt-2 text-xs font-medium text-brand-navy">
                    {service.price ?? "Estimate on review"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
