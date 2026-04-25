import type { Metadata } from "next"
import Link from "next/link"

import { getServicePriceDisplay, getServicePriceTypeLabel, serviceCatalog } from "src/lib/services/catalog"

export const metadata: Metadata = {
  title: "Corporate Services",
  description: "Browse Levine LLP corporate services with scope, assumptions, pricing, and turnaround details.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-950">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <nav className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link href="/" className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800">
            Levine LLP
          </Link>
          <a
            href="/corporate"
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-800 transition-colors hover:border-neutral-400"
          >
            Client portal
          </a>
        </nav>

        <div className="mt-14 max-w-3xl">
          <p className="text-sm font-medium tracking-[0.18em] text-emerald-700 uppercase">Corporate Services</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Choose the right corporate service.</h1>
          <p className="mt-5 text-base leading-7 text-neutral-700">
            Review scope, assumptions, pricing, and turnaround before signing in to request limited-scope corporate work
            from Levine LLP.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {serviceCatalog.map((service) => (
            <article key={service.slug} className="rounded-md border border-neutral-200 bg-white px-5 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">{service.description}</p>
                </div>
                <p className="shrink-0 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                  {getServicePriceTypeLabel(service.priceType)}
                </p>
              </div>

              <dl className="mt-5 grid gap-3 text-sm text-neutral-700">
                <div>
                  <dt className="font-semibold text-neutral-950">Pricing</dt>
                  <dd className="mt-1">{getServicePriceDisplay(service)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-neutral-950">Turnaround</dt>
                  <dd className="mt-1">{service.turnaround}</dd>
                </div>
              </dl>

              <Link
                href={`/services/${service.slug}`}
                className="mt-5 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
              >
                View service details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
