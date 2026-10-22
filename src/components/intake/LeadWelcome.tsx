import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Mail } from "lucide-react"

import { lawyers } from "src/lib/portal/team"
import { type LeadService, leadServices } from "src/lib/services/leadServices"

const steps = [
  { title: "Choose a service", body: "Pick the closest match below." },
  { title: "Conflict check", body: "Tell us who is involved. Nothing is shared, signed or paid yet." },
  { title: "Confirm and agree", body: "We confirm the right service and fee, then you sign and pay." },
  { title: "Lawyer handles everything", body: "Follow your file's progress here." },
]

function StartLink({ service }: { service: LeadService }) {
  return (
    <Link
      href={`/intake/start/${service.slug}`}
      className="bg-brand-navy hover:bg-brand-blue focus-visible:ring-brand-blue/40 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      Get started
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  )
}

function ServiceCard({ service }: { service: LeadService }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(29,71,113,0.08)]">
      <div className="grid md:grid-cols-[1.5fr_1fr]">
        <div className="p-7 md:p-9">
          <p className="text-brand-blue text-[11px] font-semibold tracking-[0.18em] uppercase">{service.category}</p>
          <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight text-stone-950">{service.title}</h3>
          <p className="mt-3 max-w-prose text-[15px] leading-7 text-stone-600">{service.summary}</p>
          <ul className="mt-6 space-y-2.5">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-stone-700">
                <Check className="text-brand-blue mt-1 size-4 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6 border-t border-stone-100 bg-stone-50/80 p-7 md:border-t-0 md:border-l md:p-9">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase">Fee</p>
            {service.price ? (
              <>
                <p className="font-display mt-1.5 text-2xl font-semibold text-stone-950">
                  {service.price.split(" + ")[0]}
                </p>
                {service.price.includes(" + ") ? (
                  <p className="mt-1 text-sm text-stone-500">+ {service.price.split(" + ").slice(1).join(" + ")}</p>
                ) : null}
              </>
            ) : (
              <>
                <p className="font-display mt-1.5 text-2xl font-semibold text-stone-950">Fixed fee</p>
                <p className="mt-1 text-sm text-stone-500">Quoted after your conflict check</p>
              </>
            )}
          </div>
          {service.addOns?.length ? (
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase">Optional add-ons</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
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
          <div className="mt-auto">
            <StartLink service={service} />
          </div>
        </div>
      </div>
    </article>
  )
}

export function LeadWelcome({ firstName }: { firstName?: string }) {
  return (
    <div className="space-y-16">
      <section className="bg-brand-navy relative overflow-hidden rounded-3xl px-7 py-10 text-white sm:px-12 sm:py-14">
        <div
          aria-hidden="true"
          className="bg-brand-blue/40 pointer-events-none absolute -top-32 -right-24 size-96 rounded-full blur-3xl"
        />
        <div className="relative grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-brand-red h-0.5 w-8" aria-hidden="true" />
              <p className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                Corporate law services
              </p>
            </div>
            <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              {firstName ? `Welcome, ${firstName}.` : "Welcome."}
            </h1>
            {/* Draft mission line, pending ML1 approval */}
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              Levine Law helps founders and business owners set up, run and grow their companies on sound legal footing.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase">Our lawyers</p>
            <ul className="mt-4 space-y-4">
              {lawyers.map((lawyer) => (
                <li key={lawyer.name} className="flex items-center gap-4">
                  <Image
                    src={lawyer.photo}
                    alt={lawyer.name}
                    width={72}
                    height={72}
                    className="size-[72px] rounded-full object-cover ring-2 ring-white/25"
                  />
                  <div>
                    <p className="font-display text-lg font-semibold">{lawyer.name}</p>
                    <p className="text-sm text-white/70">{lawyer.title}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-white/55">Licensed by the Law Society of Ontario</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-950">Ready to get started?</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
          Flat-fee corporate work for founders and entrepreneurs across Ontario, handled by real lawyers. Choose a
          service to get started.
        </p>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="border-brand-navy text-brand-navy flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold">
                  {index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <span className="hidden h-px flex-1 bg-stone-300 lg:block" aria-hidden="true" />
                ) : null}
              </div>
              <p className="mt-4 text-sm font-semibold text-stone-950">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-stone-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="services" className="space-y-6">
        <h2 id="services" className="sr-only">
          Services
        </h2>
        {leadServices.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-dashed border-stone-300 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-stone-950">Not sure which service you need?</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Send a short note. Please don&apos;t include details of your matter until we&apos;ve confirmed we can act
            for you.
          </p>
        </div>
        <a
          href="mailto:matthew@levinelegal.ca?subject=Which%20service%20do%20I%20need%3F"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-400"
        >
          <Mail className="size-4" aria-hidden="true" />
          Email Levine Law
        </a>
      </section>
    </div>
  )
}
