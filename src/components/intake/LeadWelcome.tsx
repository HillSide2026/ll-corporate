import Link from "next/link"
import { ArrowRight, Check, Mail, ShieldCheck } from "lucide-react"

import { type LeadService, leadServices } from "src/lib/services/leadServices"

const steps = [
  {
    title: "Choose a service",
    body: "Pick the closest match below. We confirm the right service and its fixed fee before you pay.",
  },
  {
    title: "Conflict check",
    body: "You tell us who is involved. We confirm we can act for you before you share details, sign or pay.",
  },
  {
    title: "Confirm, sign and pay",
    body: "We confirm the right service and fee with you, then you sign the engagement letter and pay.",
  },
  { title: "We get to work", body: "A lawyer handles your file, and you follow it here." },
]

function priceLabel(service: LeadService) {
  return service.price ?? "Fixed fee, confirmed before you pay"
}

function StartLink({ service, className }: { service: LeadService; className?: string }) {
  return (
    <Link
      href={`/intake/start/${service.slug}`}
      className={`bg-brand-navy hover:bg-brand-navy-dark focus-visible:ring-brand-navy/40 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:outline-none ${className ?? ""}`}
    >
      Get started
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  )
}

function IncludesList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-stone-700">
          <Check className="text-brand-navy mt-1 size-4 shrink-0" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function FeaturedService({ service }: { service: LeadService }) {
  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
        <div className="p-6 md:p-8">
          <p className="text-brand-navy text-xs font-semibold tracking-[0.16em] uppercase">{service.category}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">{service.title}</h3>
          <p className="mt-2 max-w-prose text-[15px] leading-7 text-stone-600">{service.summary}</p>
          <div className="mt-5">
            <IncludesList items={service.includes} />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 border-t border-stone-100 bg-stone-50/70 p-6 md:border-t-0 md:border-l md:p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">Fee</p>
            <p className="mt-1 text-lg font-semibold text-stone-950">{priceLabel(service)}</p>
            {service.addOns?.length ? (
              <div className="mt-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-stone-500 uppercase">Optional add-ons</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {service.addOns.map((addOn) => (
                    <li
                      key={addOn}
                      className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-600"
                    >
                      {addOn}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <StartLink service={service} className="w-full" />
        </div>
      </div>
    </article>
  )
}

function ServiceCard({ service }: { service: LeadService }) {
  return (
    <article className="flex flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-brand-navy text-xs font-semibold tracking-[0.16em] uppercase">{service.category}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-stone-950">{service.title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{service.summary}</p>
      <div className="mt-4 flex-1">
        <IncludesList items={service.includes} />
      </div>
      <div className="mt-6 flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-stone-900">{priceLabel(service)}</p>
        <StartLink service={service} />
      </div>
    </article>
  )
}

export function LeadWelcome({ firstName }: { firstName?: string }) {
  const [featured, ...others] = leadServices

  return (
    <div className="space-y-12">
      <section>
        <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">Corporate services</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          {firstName ? `Welcome, ${firstName}.` : "Welcome."}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
          Fixed-fee corporate work for Ontario and federal companies, handled by a lawyer. Choose a service to get
          started.
        </p>
      </section>

      <section aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className={`bg-white p-5 ${index === 1 ? "bg-brand-navy/[0.03]" : ""}`}>
              <div className="flex items-center gap-2.5">
                <span className="bg-brand-navy flex size-6 items-center justify-center rounded-full text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-stone-950">{step.title}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="services" className="space-y-5">
        <h2 id="services" className="text-lg font-semibold tracking-tight text-stone-950">
          Choose a service
        </h2>
        {featured ? <FeaturedService service={featured} /> : null}
        <div className="grid gap-5 md:grid-cols-2">
          {others.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-xl border border-stone-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-brand-navy mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-stone-950">Not sure which service you need?</p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Send a short note. Please don&apos;t include details of your matter until we&apos;ve confirmed we can
              act for you.
            </p>
          </div>
        </div>
        <a
          href="mailto:matthew@levinelegal.ca?subject=Which%20service%20do%20I%20need%3F"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:bg-stone-50"
        >
          <Mail className="size-4" aria-hidden="true" />
          Email Levine Law
        </a>
      </section>
    </div>
  )
}
