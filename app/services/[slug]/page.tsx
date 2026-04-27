import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { SiteFooter } from "src/components/SiteFooter"
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
    <main className="min-h-dvh bg-white text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/levine-llp-logo.svg" alt="Levine LLP" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="font-medium text-brand-navy transition-colors hover:text-brand-navy-dark">
              Services
            </Link>
            <a
              href="/corporate"
              className="rounded border border-brand-navy px-4 py-2 font-medium text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              Client Portal
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-navy uppercase">Corporate Service</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900">{service.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-500">{service.description}</p>
        </div>

        <dl className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded border border-stone-200 bg-stone-50 px-4 py-4">
            <dt className="text-sm font-semibold text-stone-900">Price type</dt>
            <dd className="mt-2 text-sm text-stone-500">{getServicePriceTypeLabel(service.priceType)}</dd>
          </div>
          <div className="rounded border border-stone-200 bg-stone-50 px-4 py-4">
            <dt className="text-sm font-semibold text-stone-900">Pricing</dt>
            <dd className="mt-2 text-sm text-stone-500">{getServicePriceDisplay(service)}</dd>
          </div>
          <div className="rounded border border-stone-200 bg-stone-50 px-4 py-4">
            <dt className="text-sm font-semibold text-stone-900">Turnaround</dt>
            <dd className="mt-2 text-sm text-stone-500">{service.turnaround}</dd>
          </div>
        </dl>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <section className="rounded border border-stone-200 bg-stone-50 px-5 py-5">
            <h2 className="text-lg font-semibold text-stone-900">Scope</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-500">
              {service.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded border border-stone-200 bg-stone-50 px-5 py-5">
            <h2 className="text-lg font-semibold text-stone-900">Assumptions</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-500">
              {service.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded border border-stone-200 bg-stone-50 px-5 py-5">
            <h2 className="text-lg font-semibold text-stone-900">Required inputs</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-500">
              {service.requiredInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 rounded border border-stone-200 bg-stone-50 px-5 py-5">
          <h2 className="text-lg font-semibold text-stone-900">Request this service</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-500">
            Intake submission is not enabled yet. Levine LLP will connect this service to a defined request contract
            before accepting structured submissions through the portal.
          </p>
          {session ? (
            <Link
              href={`/corporate/services/${service.slug}/request`}
              className="mt-5 inline-flex rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              {service.ctaLabel}
            </Link>
          ) : (
            <a
              href="/corporate"
              className="mt-5 inline-flex rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Sign in to request this service
            </a>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
