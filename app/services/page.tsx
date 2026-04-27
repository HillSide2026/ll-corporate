import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { SiteFooter } from "src/components/SiteFooter"
import { getServicePriceDisplay, getServicePriceTypeLabel, serviceCatalog } from "src/lib/services/catalog"

export const metadata: Metadata = {
  title: "Corporate Services",
  description: "Browse Levine LLP corporate services with scope, assumptions, pricing, and turnaround details.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-dvh bg-white text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/levine-llp-logo.svg" alt="Levine LLP" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="font-medium text-brand-navy">
              Services
            </Link>
            <Link href="/#industries" className="text-stone-600 transition-colors hover:text-stone-900">
              Industries
            </Link>
            <Link href="/#insights" className="text-stone-600 transition-colors hover:text-stone-900">
              Insights
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

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand-navy uppercase">Corporate Services</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900">
            Choose the right corporate service.
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-500">
            Review scope, assumptions, pricing, and turnaround before signing in to request limited-scope corporate work
            from Levine LLP.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {serviceCatalog.map((service) => (
            <article key={service.slug} className="rounded border border-stone-200 bg-stone-50 px-5 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-500">{service.description}</p>
                </div>
                <p className="shrink-0 rounded bg-brand-navy/10 px-3 py-2 text-sm font-semibold text-brand-navy">
                  {getServicePriceTypeLabel(service.priceType)}
                </p>
              </div>

              <dl className="mt-5 grid gap-3 text-sm text-stone-500">
                <div>
                  <dt className="font-semibold text-stone-900">Pricing</dt>
                  <dd className="mt-1">{getServicePriceDisplay(service)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-900">Turnaround</dt>
                  <dd className="mt-1">{service.turnaround}</dd>
                </div>
              </dl>

              <Link
                href={`/services/${service.slug}`}
                className="mt-5 inline-flex rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
              >
                View service details
              </Link>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
