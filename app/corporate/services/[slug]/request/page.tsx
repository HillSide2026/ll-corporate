import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { submitServiceRequest } from "src/lib/services/actions"
import { getServiceBySlug, getServicePriceDisplay } from "src/lib/services/catalog"

type ServiceRequestPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: ServiceRequestPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return { title: "Service Request" }
  }

  return {
    title: `Request ${service.title}`,
    description: `Submit a request for ${service.title} through the Levine LLP client portal.`,
  }
}

export default async function ServiceRequestPage({ params }: ServiceRequestPageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/corporate")
  }

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link
            href="/corporate/app/requests"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← Requests
          </Link>
          <Link
            href="/corporate/app"
            className="rounded-md border border-stone-300 bg-white px-4 py-2 font-medium text-stone-700 transition-colors hover:border-stone-400"
          >
            Portal home
          </Link>
        </nav>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">Request service</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900">{service.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-500">{service.description}</p>
        </div>

        {/* Service summary */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Pricing snapshot</h2>
            <p className="mt-2 text-sm text-stone-500">{getServicePriceDisplay(service)}</p>
            <h2 className="mt-4 text-sm font-semibold text-stone-900">Turnaround</h2>
            <p className="mt-2 text-sm text-stone-500">{service.turnaround}</p>
          </div>

          <div className="rounded-md border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Scope</h2>
            <ul className="mt-2 space-y-1">
              {service.scope.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-stone-500">
                  <span className="mt-0.5 shrink-0 text-brand-navy">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Assumptions */}
        <div className="mt-4 rounded-md border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-sm font-semibold text-stone-900">Assumptions and exclusions</h2>
          <ul className="mt-2 space-y-1">
            {service.assumptions.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-stone-500">
                <span className="mt-0.5 shrink-0 text-stone-300">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Request form */}
        <form action={submitServiceRequest} className="mt-8">
          <input type="hidden" name="serviceSlug" value={service.slug} />

          <div className="rounded-md border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-base font-semibold text-stone-900">Provide required information</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Fill in the fields below so your lawyer can begin work once the request is reviewed.
            </p>

            <div className="mt-6 space-y-5">
              {service.requiredInputs.map((label, index) => (
                <div key={index}>
                  <label
                    htmlFor={`field_${index}`}
                    className="mb-1.5 block text-sm font-medium text-stone-700"
                  >
                    {label}
                  </label>
                  <textarea
                    id={`field_${index}`}
                    name={`field_${index}`}
                    rows={2}
                    required
                    className="w-full resize-y rounded-md border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Acknowledgement + submit */}
          <div className="mt-5 rounded-md border border-stone-200 bg-white px-5 py-5">
            <h2 className="text-sm font-semibold text-stone-900">Acknowledgement</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              Submitting this request does not mean work has started. Levine LLP will review the request and confirm
              next steps, pricing, and timeline before proceeding.
            </p>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="acknowledged"
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand-navy"
              />
              <span className="text-sm text-stone-700">
                I understand the scope and assumptions above, and that this is a request for review — not a
                confirmed engagement.
              </span>
            </label>

            <button
              type="submit"
              className="mt-6 rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              {service.ctaLabel}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
