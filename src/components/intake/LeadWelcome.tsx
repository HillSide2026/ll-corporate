import Image from "next/image"
import Link from "next/link"
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ClipboardCheck,
  type LucideIcon,
  UserPlus,
  Users,
} from "lucide-react"

import { brandButton, Eyebrow, NavyPanel } from "src/components/brand/Brand"
import { cn } from "@/lib/utils"
import { leadFaqs } from "src/lib/portal/leadFaqs"
import { lawyers } from "src/lib/portal/team"
import { type LeadService, leadServices } from "src/lib/services/leadServices"

const steps = [
  { title: "Choose a service", body: "Pick the closest match below." },
  { title: "Conflict check", body: "Tell us who is involved. Nothing is shared, signed or paid yet." },
  { title: "Confirm and agree", body: "We email you the engagement letter. You sign and pay by email." },
  { title: "Lawyer handles everything", body: "Follow your file's progress here." },
]

const serviceIcons: Record<string, LucideIcon> = {
  incorporation: Building2,
  "founders-shareholder-agreement": Users,
  "new-shareholder": UserPlus,
  "corporate-checkup": ClipboardCheck,
}

function ServiceRow({ service }: { service: LeadService }) {
  const Icon = serviceIcons[service.slug] ?? Building2
  return (
    <article className="group hover:border-brand-blue/30 grid gap-6 rounded-2xl border border-stone-200 bg-white p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:shadow-[0_10px_30px_rgba(29,71,113,0.10)] md:grid-cols-[1.25fr_1fr_auto] md:items-center md:gap-10 md:p-8">
      <div className="flex items-start gap-5">
        <span className="bg-brand-blue/10 text-brand-blue flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-brand-blue text-[11px] font-semibold tracking-[0.18em] uppercase">{service.category}</p>
          <h3 className="font-display mt-1.5 text-2xl font-semibold tracking-tight text-stone-950">{service.title}</h3>
          <p className="mt-2 text-[15px] leading-7 text-stone-600">{service.summary}</p>
        </div>
      </div>
      <ul className="space-y-2 border-stone-100 md:border-l md:pl-10">
        {service.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-stone-700">
            <Check className="text-brand-blue mt-1 size-4 shrink-0" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <Link href={`/intake/start/${service.slug}`} className={cn(brandButton, "bg-brand-blue hover:bg-brand-navy")}>
        Get started
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </article>
  )
}

/** Inner column shared by every full-width section on the page. */
const column = "mx-auto w-full max-w-5xl px-6"

/**
 * The lead welcome page: one full-width brand section opens it, then white and light-stone
 * sections. Navy appears only in the opening section (ML1 2026-10-22: sections, not cards;
 * less dark blue).
 */
export function LeadWelcome({ firstName }: { firstName?: string }) {
  return (
    <div className="bg-white">
      <NavyPanel bleed className="px-0 py-16 sm:px-0 sm:py-24">
        <div className={column}>
          <Eyebrow tone="dark" rule>
            Corporate law services
          </Eyebrow>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            {firstName ? `Welcome, ${firstName}.` : "Welcome."}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Levine Law helps founders and entrepreneurs set up, run and grow their companies on sound legal footing.
          </p>
          <a
            href="#services"
            className="text-brand-navy mt-8 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/90"
          >
            View services
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
      </NavyPanel>

      <section className="py-16 sm:py-20">
        <div className={column}>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-950">Ready to get started?</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
            Flat-fee corporate work for founders and entrepreneurs across Ontario, handled by real lawyers. Choose a
            service to get started.
          </p>

          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <li key={step.title}>
                <div className="flex items-center gap-3">
                  <span className="border-brand-blue text-brand-blue flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold">
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
        </div>
      </section>

      <section className="border-y border-stone-200 bg-stone-50 py-16 sm:py-20">
        <div className={column}>
          <div className="text-center">
            <p className="text-brand-blue text-[11px] font-semibold tracking-[0.2em] uppercase">Our lawyers</p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-stone-950">
              Your file is handled by a lawyer
            </h2>
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
                <p className="font-display mt-5 text-xl font-semibold text-stone-950">{lawyer.name}</p>
                <p className="mt-1 text-sm text-stone-600">{lawyer.title}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-xs text-stone-500">Licensed by the Law Society of Ontario</p>
        </div>
      </section>

      <section aria-labelledby="services" id="services" className="scroll-mt-8 py-16 sm:py-20">
        <div className={column}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-950">Our services</h2>
            <p className="text-sm text-stone-500">Each service is a fixed fee, quoted after your conflict check.</p>
          </div>
          <div className="mt-8 space-y-5">
            {leadServices.map((service) => (
              <ServiceRow key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="faqs" className="border-t border-stone-200 bg-stone-50 py-16 sm:py-20">
        <div className={column}>
          <h2 id="faqs" className="font-display text-center text-3xl font-semibold tracking-tight text-stone-950">
            FAQs
          </h2>
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {leadFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] open:shadow-[0_8px_24px_rgba(29,71,113,0.08)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-medium text-stone-900 [&::-webkit-details-marker]:hidden">
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
        </div>
      </section>
    </div>
  )
}
