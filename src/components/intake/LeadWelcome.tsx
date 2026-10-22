import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, ChevronDown } from "lucide-react"

import { leadFaqs } from "src/lib/portal/leadFaqs"
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

function NavyPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`bg-brand-navy relative overflow-hidden rounded-3xl px-7 py-10 text-white sm:px-12 sm:py-14 ${className ?? ""}`}
    >
      <div
        aria-hidden="true"
        className="bg-brand-blue/40 pointer-events-none absolute -top-32 -right-24 size-96 rounded-full blur-3xl"
      />
      <div className="relative">{children}</div>
    </section>
  )
}

export function LeadWelcome({ firstName }: { firstName?: string }) {
  return (
    <div className="space-y-16">
      <NavyPanel>
        <div className="flex items-center gap-3">
          <span className="bg-brand-red h-0.5 w-8" aria-hidden="true" />
          <p className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">Corporate law services</p>
        </div>
        <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          {firstName ? `Welcome, ${firstName}.` : "Welcome."}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
          Levine Law helps founders and entrepreneurs set up, run and grow their companies on sound legal footing.
        </p>
      </NavyPanel>

      <section>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-950">Ready to get started?</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
          Flat-fee corporate work for founders and entrepreneurs across Ontario, handled by real lawyers. Choose a
          service to get started.
        </p>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title}>
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

      <NavyPanel>
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase">Our lawyers</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight">Your file is handled by a lawyer</h2>
        </div>
        <ul className="mt-10 flex flex-col items-center justify-center gap-10 sm:flex-row sm:gap-20">
          {lawyers.map((lawyer) => (
            <li key={lawyer.name} className="flex flex-col items-center text-center">
              <Image
                src={lawyer.photo}
                alt={lawyer.name}
                width={160}
                height={160}
                className="ring-brand-blue size-40 rounded-full object-cover ring-4"
              />
              <p className="font-display mt-5 text-xl font-semibold">{lawyer.name}</p>
              <p className="mt-1 text-sm text-white/70">{lawyer.title}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-xs text-white/55">Licensed by the Law Society of Ontario</p>
      </NavyPanel>

      <section aria-labelledby="services" className="space-y-6">
        <h2 id="services" className="sr-only">
          Services
        </h2>
        {leadServices.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </section>

      <section aria-labelledby="faqs">
        <h2 id="faqs" className="font-display text-center text-3xl font-semibold tracking-tight text-stone-950">
          FAQs
        </h2>
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {leadFaqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] open:shadow-[0_8px_24px_rgba(29,71,113,0.08)]"
            >
              <summary className="text-brand-navy flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  className="size-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-6 pb-5 text-[15px] leading-7 text-stone-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
