import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"

import { SiteFooter } from "src/components/SiteFooter"

export const metadata: Metadata = {
  title: "Corporate Health Check",
  description:
    "A structured legal review for private companies preparing their corporate, contractual, and governance foundations ahead of financing, transactions, or structural change.",
}

const coverageItems = [
  {
    heading: "Corporate records",
    body: "Minute books, registers, resolutions, and filings.",
  },
  {
    heading: "Share structure",
    body: "Ownership, issuances, options, and capitalization alignment.",
  },
  {
    heading: "Commercial agreements",
    body: "Key contracts and recurring commercial risk exposure.",
  },
  {
    heading: "Employment and contractors",
    body: "Core agreements and structural consistency.",
  },
  {
    heading: "Governance",
    body: "Director, officer, and approval frameworks.",
  },
  {
    heading: "Priority risks",
    body: "Clear identification of gaps and recommended next steps.",
  },
]

const steps = [
  {
    number: "01",
    heading: "Initial intake",
    body: "Company context and scope are established.",
  },
  {
    number: "02",
    heading: "Document and records review",
    body: "Core corporate materials and agreements are assessed.",
  },
  {
    number: "03",
    heading: "Risk and gap assessment",
    body: "Issues affecting governance, financing, or operations are identified.",
  },
  {
    number: "04",
    heading: "Priority action plan",
    body: "Findings are summarized with clear next steps.",
  },
]

const fitCards = [
  "Preparing for financing or investor diligence",
  "Cleaning up records before a transaction",
  "Moving beyond founder-led governance",
  "Managing shareholder or ownership changes",
]

export default function CorporateHealthCheckPage() {
  return (
    <main className="min-h-dvh bg-white text-stone-800">
      {/* Nav */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Image
              src="/logos/levine-law-wordmark-navy-transparent.png"
              alt="Levine Law"
              width={1080}
              height={600}
              className="h-10 w-auto"
            />
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
              className="border-brand-navy text-brand-navy hover:bg-brand-navy rounded border px-4 py-2 font-medium transition-colors hover:text-white"
            >
              Client Portal
            </a>
          </nav>
        </div>
      </header>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">
              Corporate health check
            </p>
            <h1 className="text-ink mt-4 max-w-3xl text-5xl font-semibold tracking-tight">
              A structured legal review for companies preparing for what comes next
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-stone-600">
              The Corporate Health Check is a structured legal review private companies use to prepare their corporate,
              contractual, and governance foundations ahead of financing, transactions, or structural change.
            </p>
            <a
              href="#inquire"
              className="bg-brand-navy hover:bg-brand-navy-dark mt-10 inline-flex items-center justify-center rounded px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Overview</p>
            <h2 className="text-ink mt-3 text-2xl font-semibold tracking-tight">A focused legal diagnostic</h2>
          </div>

          <div className="space-y-4 text-[15px] leading-7 text-stone-600 lg:col-span-8">
            <p>
              The Corporate Health Check is a defined, fixed-scope engagement designed to assess the core elements of a
              company's legal infrastructure.
            </p>
            <p>
              It is used to establish clarity across corporate records, ownership structure, key agreements, and
              governance before those elements are tested in financing, diligence, or operational change.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Coverage</p>
          <h2 className="text-ink mt-3 text-2xl font-semibold tracking-tight">
            Coverage across the company's legal foundation
          </h2>

          <div className="mt-10 grid gap-8 text-[15px] leading-7 text-stone-600 md:grid-cols-2">
            {coverageItems.map((item) => (
              <div key={item.heading}>
                <p className="text-ink font-semibold">{item.heading}</p>
                <p className="mt-1">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Why it matters</p>
          <h2 className="text-ink mt-3 text-2xl font-semibold tracking-tight">
            Corporate structure becomes visible at moments that matter
          </h2>
          <p className="mt-6 text-[15px] leading-7 text-stone-600">
            Gaps in records, governance, or agreements often remain unnoticed until financing, diligence, ownership
            changes, or strategic transactions bring them into focus.
          </p>
          <p className="mt-4 text-[15px] leading-7 text-stone-600">
            The Health Check ensures those moments are approached with clarity rather than reconstruction.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Process</p>
          <h2 className="text-ink mt-3 text-2xl font-semibold tracking-tight">A focused, structured engagement</h2>

          <div className="mt-10 space-y-6 text-[15px] leading-7 text-stone-600">
            {steps.map((step) => (
              <div key={step.number}>
                <p className="text-ink font-semibold">
                  {step.number} {step.heading}
                </p>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Best fit</p>
          <h2 className="text-ink mt-3 text-2xl font-semibold tracking-tight">
            Used by companies approaching meaningful corporate milestones
          </h2>

          <ul className="mt-6 space-y-3 text-[15px] leading-7 text-stone-600">
            {fitCards.map((card) => (
              <li key={card}>{card}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="inquire" className="bg-white py-20">
        <div className="mx-auto max-w-xl px-6">
          <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Contact</p>
          <h2 className="text-ink mt-3 text-2xl font-semibold tracking-tight">
            Request information about the Corporate Health Check
          </h2>
          <p className="mt-2 text-[15px] text-stone-600">
            Details are reviewed and follow-up is provided on scope, process, and fit.
          </p>

          <div className="mt-8 overflow-hidden rounded border border-stone-200 bg-white">
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

      <SiteFooter />
    </main>
  )
}
