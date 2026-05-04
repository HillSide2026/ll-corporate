import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"

import { SiteFooter } from "src/components/SiteFooter"

export const metadata: Metadata = {
  title: "Corporate Health Check",
  description:
    "A focused review of your corporate records, governance, agreements, and legal infrastructure — designed for growing private companies before a transaction, financing, or major decision.",
}

const problemCards = [
  {
    heading: "Financing or investment",
    body: "Corporate gaps can slow down diligence or create avoidable negotiation issues.",
  },
  {
    heading: "Growth or restructuring",
    body: "Old records and informal decisions can make new structures harder to implement.",
  },
  {
    heading: "Founder, shareholder, or board changes",
    body: "Unclear governance can create friction when roles, ownership, or authority shift.",
  },
]

const reviewItems = [
  {
    heading: "Corporate records",
    body: "Minute books, registers, resolutions, and government filings.",
  },
  {
    heading: "Share structure",
    body: "Issued shares, ownership records, option arrangements, and capitalization questions.",
  },
  {
    heading: "Governance",
    body: "Director, officer, shareholder, and approval mechanics.",
  },
  {
    heading: "Commercial Agreements",
    body: "Key contracts, customer/vendor agreements, and recurring risk terms.",
  },
  {
    heading: "Contractor / Employee Agreements",
    body: "Key contracts, customer/vendor agreements, and recurring risk terms.",
  },
  {
    heading: "Priority risks",
    body: "A practical summary of gaps, issues, and recommended next steps.",
  },
]

const steps = [
  {
    number: "01",
    heading: "Initial intake",
    body: "We understand the company, context, and reason for the review.",
  },
  {
    number: "02",
    heading: "Document and records review",
    body: "We review key corporate materials, agreements, and related information.",
  },
  {
    number: "03",
    heading: "Risk and gap assessment",
    body: "We identify issues that may affect governance, financing, transactions, or operations.",
  },
  {
    number: "04",
    heading: "Priority action plan",
    body: "You receive a practical summary of findings and recommended next steps.",
  },
]

const fitCards = [
  "Preparing for financing or investor diligence",
  "Cleaning up records before a transaction",
  "Growing beyond informal founder-led governance",
  "Managing shareholder, director, or ownership changes",
]

export default function CorporateHealthCheckPage() {
  return (
    <main className="min-h-dvh bg-white text-stone-800">
      {/* Nav */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Image src="/levine-llp-logo.svg" alt="Levine LLP" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-stone-600 transition-colors hover:text-stone-900">
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

      {/* 1 — Hero */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-start">
            {/* Left */}
            <div className="flex-1">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
                Corporate Health Check
              </p>
              <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
                Know whether your corporate structure can support what comes next.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-500">
                A focused review of corporate records, governance, agreements, and legal infrastructure. Designed for
                growing private companies before a transaction, financing, expansion, or major decision.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#inquire"
                  className="inline-flex items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
                >
                  Learn More About the Health Check
                </a>
                <a
                  href="/corporate"
                  className="inline-flex items-center justify-center rounded border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
                >
                  For Existing Clients: Access Portal
                </a>
              </div>
            </div>

            {/* Right — checklist card */}
            <div className="w-full shrink-0 lg:w-72">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
                  Health Check Review
                </p>
                <ul className="space-y-3">
                  {["Corporate records", "Share structure", "Key agreements", "Governance gaps", "Action priorities"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium text-stone-700">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                          <svg viewBox="0 0 12 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1,5 4,8 11,1" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Why It Matters */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Why It Matters</p>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-stone-900">
              Small corporate gaps become expensive when the business gets serious.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-500">
              Missing records, unclear approvals, outdated agreements, or incomplete governance often go unnoticed until
              diligence, financing, a shareholder issue, or a strategic transaction brings them to the surface.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {problemCards.map((card) => (
              <div key={card.heading} className="rounded-xl border border-stone-200 bg-white p-7">
                <h3 className="mb-3 text-base font-semibold leading-tight text-stone-900">{card.heading}</h3>
                <p className="text-sm leading-6 text-stone-500">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — What We Review */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">What We Review</p>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-stone-900">
              A structured review of the legal infrastructure behind your business.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviewItems.map((item) => (
              <div key={item.heading} className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                  <svg viewBox="0 0 12 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1,5 4,8 11,1" />
                  </svg>
                </span>
                <div>
                  <h3 className="mb-1 text-sm font-semibold leading-tight text-stone-900">{item.heading}</h3>
                  <p className="text-sm leading-6 text-stone-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — First CTA / Opt-In with GHL form */}
      <section id="inquire" className="bg-gray-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Interested in a Corporate Health Check?
            </h2>
            <p className="mt-4 text-stone-500">
              Share your details and we&apos;ll send information about scope, process, timing, and whether the Health
              Check is the right fit for your business.
            </p>
          </div>
          <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/xKjce4uPtz3tWVDyHpVy"
              className="block w-full border-0"
              height="620"
              id="inline-xKjce4uPtz3tWVDyHpVy-health"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Inquiries Form - LL LLP"
              data-height="420"
              data-layout-iframe-id="inline-xKjce4uPtz3tWVDyHpVy-health"
              data-form-id="xKjce4uPtz3tWVDyHpVy"
              title="Inquiries Form - LL LLP"
            />
          </div>
        </div>
        <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
      </section>

      {/* 5 — How It Works */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Process</p>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-stone-900">
              A focused process designed to produce practical next steps.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number}>
                <p className="mb-3 text-3xl font-semibold leading-none tracking-tight text-brand-navy/20">
                  {step.number}
                </p>
                <h3 className="mb-2 text-base font-semibold leading-tight text-stone-900">{step.heading}</h3>
                <p className="text-sm leading-6 text-stone-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Who It's For */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Best Fit</p>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-stone-900">
              Built for Private Companies Approaching a Meaningful Corporate Milestone.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fitCards.map((card) => (
              <div key={card} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-6 py-5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                  <svg viewBox="0 0 12 10" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1,5 4,8 11,1" />
                  </svg>
                </span>
                <p className="text-sm font-medium leading-6 text-stone-700">{card}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Final CTA */}
      <section className="bg-gray-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Find out whether your corporate structure is ready.
            </h2>
            <p className="mt-4 text-stone-500">
              Request information about the Corporate Health Check and we&apos;ll follow up with scope, process, and fit.
            </p>
          </div>
          <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <iframe
              src="https://api.leadconnectorhq.com/widget/form/xKjce4uPtz3tWVDyHpVy"
              className="block w-full border-0"
              height="620"
              id="inline-xKjce4uPtz3tWVDyHpVy-health-2"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Inquiries Form - LL LLP"
              data-height="420"
              data-layout-iframe-id="inline-xKjce4uPtz3tWVDyHpVy-health-2"
              data-form-id="xKjce4uPtz3tWVDyHpVy"
              title="Inquiries Form - LL LLP"
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
