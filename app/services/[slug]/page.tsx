import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getPortalSession } from "src/lib/auth/session"
import { getServiceBySlug, getServicePriceDisplay, getServicePriceTypeLabel } from "src/lib/services/catalog"

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: service.title,
    description: service.description,
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const session = await getPortalSession()

  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-950">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link href="/services" className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800">
            Services
          </Link>
          <a
            href="/corporate"
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-800 transition-colors hover:border-neutral-400"
          >
            Client portal
          </a>
        </nav>

        <div className="mt-14">
          <p className="text-sm font-medium tracking-[0.18em] text-emerald-700 uppercase">Corporate Service</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">{service.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700">{service.description}</p>
        </div>

        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-neutral-200 bg-white px-4 py-4">
            <dt className="text-sm font-semibold text-neutral-950">Price type</dt>
            <dd className="mt-2 text-sm text-neutral-700">{getServicePriceTypeLabel(service.priceType)}</dd>
          </div>
          <div className="rounded-md border border-neutral-200 bg-white px-4 py-4">
            <dt className="text-sm font-semibold text-neutral-950">Pricing</dt>
            <dd className="mt-2 text-sm text-neutral-700">{getServicePriceDisplay(service)}</dd>
          </div>
          <div className="rounded-md border border-neutral-200 bg-white px-4 py-4">
            <dt className="text-sm font-semibold text-neutral-950">Turnaround</dt>
            <dd className="mt-2 text-sm text-neutral-700">{service.turnaround}</dd>
          </div>
        </dl>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <section className="rounded-md border border-neutral-200 bg-white px-5 py-5">
            <h2 className="text-lg font-semibold text-neutral-950">Scope</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
              {service.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-md border border-neutral-200 bg-white px-5 py-5">
            <h2 className="text-lg font-semibold text-neutral-950">Assumptions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
              {service.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-md border border-neutral-200 bg-white px-5 py-5">
            <h2 className="text-lg font-semibold text-neutral-950">Required inputs</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
              {service.requiredInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 rounded-md border border-neutral-200 bg-white px-5 py-5">
          <h2 className="text-lg font-semibold text-neutral-950">Request this service</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700">
            Intake submission is not enabled yet. Levine LLP will connect this service to a defined request contract
            before accepting structured submissions through the portal.
          </p>
          {session ? (
            <button
              type="button"
              disabled
              className="mt-5 rounded-md bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-500"
            >
              Request flow coming soon
            </button>
          ) : (
            <a
              href="/corporate"
              className="mt-5 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Sign in to request this service
            </a>
          )}
        </div>
      </section>
    </main>
  )
}
