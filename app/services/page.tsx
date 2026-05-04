import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"

import { SiteFooter } from "src/components/SiteFooter"

export const metadata: Metadata = {
  title: "Fractional Counsel",
  description:
    "Levine LLP provides fractional corporate, contract, and financial services counsel for companies that need practical legal support without building a full in-house legal function.",
}

const plans = [
  {
    name: "Essential Counsel",
    tagline: "Reliable access to business legal support for lean, early-stage companies.",
    bestFor: "Early-stage or lean companies with periodic legal needs.",
    engagement: "Scoped monthly counsel",
    features: [
      "Routine contract review",
      "Corporate maintenance questions",
      "Basic governance support",
      "Occasional founder and operator advice",
    ],
    cta: "Discuss Essential Counsel",
    recommended: false,
  },
  {
    name: "Growth Counsel",
    tagline: "Ongoing legal support across contracts, corporate matters, and financial services workflows.",
    bestFor: "Growing businesses with recurring legal needs across multiple areas.",
    engagement: "Custom monthly engagement",
    features: [
      "Commercial contract drafting and review",
      "Governance and shareholder matters",
      "Regulatory and payment-adjacent support",
      "Monthly legal prioritization calls",
      "Coordination with external specialists",
    ],
    cta: "Discuss Growth Counsel",
    recommended: true,
  },
  {
    name: "Strategic Counsel",
    tagline: "Integrated legal strategy for complex operating, investor, or regulated environments.",
    bestFor: "Companies with cross-border, investor, or financial services complexity.",
    engagement: "Custom monthly engagement",
    features: [
      "Complex commercial agreements",
      "Investor and fund-related structuring support",
      "Cross-border corporate coordination",
      "Financial services and payment-flow issue spotting",
      "Ongoing legal strategy with leadership",
    ],
    cta: "Discuss Strategic Counsel",
    recommended: false,
  },
]

const steps = [
  {
    number: "01",
    heading: "Understand your business",
    body: "We take time to understand your contracts, corporate structure, and risk profile before advising.",
  },
  {
    number: "02",
    heading: "Define scope and rhythm",
    body: "We agree on a monthly scope and communication cadence that fits how your business operates.",
  },
  {
    number: "03",
    heading: "Ongoing access",
    body: "You get continuous access for recurring legal priorities — not one-off tickets and waiting queues.",
  },
  {
    number: "04",
    heading: "Separate projects when needed",
    body: "Discrete matters like filings or one-off documents can still be scoped and handled separately.",
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-dvh bg-white text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Image src="/logos/levine-law-wordmark-navy-transparent.png" alt="Levine Law" width={1080} height={600} className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="font-medium text-brand-navy">
              Services
            </Link>
            <Link href="/industries" className="text-stone-600 transition-colors hover:text-stone-900">
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

      {/* Hero */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Fractional Counsel</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
            Ongoing legal support for businesses that need more than one-off answers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-500">
            Levine LLP provides fractional corporate, contract, and financial services counsel for companies that need
            practical legal support without building a full in-house legal function.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:matthew@levinelegal.ca"
              className="inline-flex items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Book a Consultation
            </a>
            <a
              href="#counsel-models"
              className="inline-flex items-center justify-center rounded border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Compare Counsel Models
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Counsel Models</p>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Choose the counsel model that fits your operating reality.
            </h2>
            <p className="mt-4 text-stone-500">
              Each model is designed around recurring access, business context, and practical legal execution — not
              isolated legal tasks.
            </p>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section id="counsel-models" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={[
                  "relative flex flex-col rounded-2xl border p-8 transition",
                  plan.recommended
                    ? "border-brand-navy shadow-md hover:border-brand-navy-dark hover:shadow-lg"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md",
                ].join(" ")}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-8">
                    <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-white">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-semibold leading-tight text-stone-900">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{plan.tagline}</p>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-stone-400">Best for</p>
                  <p className="mt-1 text-sm text-stone-600">{plan.bestFor}</p>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-stone-400">Engagement</p>
                  <p className="mt-1 text-sm font-medium text-stone-700">{plan.engagement}</p>

                  <ul className="mt-6 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-stone-600">
                        <span className="mt-0.5 shrink-0 text-brand-navy">—</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="mailto:matthew@levinelegal.ca"
                  className={[
                    "mt-8 inline-flex w-full items-center justify-center rounded px-5 py-3 text-sm font-semibold transition-colors",
                    plan.recommended
                      ? "bg-brand-navy text-white hover:bg-brand-navy-dark"
                      : "border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50",
                  ].join(" ")}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Process</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              How fractional counsel works
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="rounded-xl border border-stone-200 bg-white p-6">
                <p className="mb-3 text-2xl font-semibold leading-none tracking-tight text-brand-navy/30">
                  {step.number}
                </p>
                <h3 className="mb-2 text-base font-semibold leading-tight text-stone-900">{step.heading}</h3>
                <p className="text-sm leading-6 text-stone-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Check callout */}
      <section className="bg-white py-12 md:py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-stone-200 bg-stone-50 px-8 py-7 sm:flex-row">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Corporate Health Check</p>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                Not sure whether your existing structure is ready for what&apos;s next? Start with a focused review.
              </p>
            </div>
            <Link
              href="/corporate-health-check"
              className="shrink-0 inline-flex items-center justify-center rounded border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              Learn about the Health Check
            </Link>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section className="bg-gray-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Get In Touch</p>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Discuss your legal setup
            </h2>
            <p className="mt-4 text-stone-500">
              Tell us a bit about your business and we&apos;ll follow up with the appropriate next step.
            </p>
          </div>
          <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/xKjce4uPtz3tWVDyHpVy"
              className="block w-full border-0"
              height="620"
              id="inline-xKjce4uPtz3tWVDyHpVy"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Inquiries Form - LL LLP"
              data-height="420"
              data-layout-iframe-id="inline-xKjce4uPtz3tWVDyHpVy"
              data-form-id="xKjce4uPtz3tWVDyHpVy"
              title="Inquiries Form - LL LLP"
            />
          </div>
        </div>
        <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
      </section>

      {/* Portal Note */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Existing Clients</p>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Need a specific filing or document?
            </h2>
            <p className="mt-4 text-stone-500">
              Existing clients can request specific corporate filings, document updates, and limited-scope services
              directly through the client portal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/corporate"
                className="inline-flex items-center justify-center rounded border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
              >
                Access Client Portal
              </a>
              <Link
                href="/corporate-health-check"
                className="inline-flex items-center justify-center rounded border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
              >
                Corporate Health Check
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
