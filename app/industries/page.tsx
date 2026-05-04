import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"

import { SiteFooter } from "src/components/SiteFooter"

export const metadata: Metadata = {
  title: "Industries",
  description: "Levine LLP advises operators, fintech platforms, investors, and cross-border businesses on corporate, contract, and financial services matters.",
}

const clientTypes = [
  {
    title: "Operators & Executives",
    description: "Running and scaling private companies.",
    detail:
      "Founders and executives navigating shareholder disputes, equity restructuring, governance changes, and commercial contracts as the business grows.",
  },
  {
    title: "Fintech Platforms",
    description: "Businesses dealing with regulated financial flows.",
    detail:
      "Payment platforms, marketplace lenders, and financial services companies managing MSB obligations, FINTRAC compliance, and banking relationships.",
  },
  {
    title: "Investors & Funds",
    description: "Deploying capital into operating businesses.",
    detail:
      "Investment vehicles and family offices requiring shareholder agreement review, governance structuring, and deal documentation for private company transactions.",
  },
  {
    title: "Cross-Border Businesses",
    description: "Managing multi-jurisdictional structures.",
    detail:
      "Companies with operations, customers, or regulatory exposure across Canada, the US, and other jurisdictions requiring coordinated legal structure.",
  },
]

export default function IndustriesPage() {
  return (
    <main className="min-h-dvh bg-white text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/">
            <Image src="/logos/levine-law-wordmark-navy-transparent.png" alt="Levine Law" width={1080} height={600} className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-stone-600 transition-colors hover:text-stone-900">
              Services
            </Link>
            <Link href="/industries" className="font-medium text-brand-navy">
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Industries</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
            Who We Work With
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-500">
            Levine LLP advises a focused range of clients on corporate structure, commercial agreements, and financial
            services matters. Our work is best suited to businesses where legal issues are interconnected.
          </p>
        </div>
      </section>

      {/* Client Types */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Client Types</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              The businesses we advise
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-500">
              We work best with clients whose legal matters sit at the intersection of corporate structure, contracts,
              and financial services.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
            {clientTypes.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md"
              >
                <h3 className="mb-1 text-lg font-semibold leading-tight text-stone-900">{item.title}</h3>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-brand-navy">{item.description}</p>
                <p className="text-sm leading-6 text-stone-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Can Help */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Our Work</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              What we help with
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 transition hover:border-stone-300 hover:shadow-md">
              <h3 className="mb-2 text-base font-semibold leading-tight text-stone-900">Corporate Governance</h3>
              <p className="text-sm leading-6 text-stone-500">
                Shareholder agreements, director matters, equity structure, and corporate maintenance for private
                companies.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 transition hover:border-stone-300 hover:shadow-md">
              <h3 className="mb-2 text-base font-semibold leading-tight text-stone-900">Commercial Contracts</h3>
              <p className="text-sm leading-6 text-stone-500">
                Drafting and negotiating commercial agreements that allocate risk, revenue, and responsibility clearly.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 transition hover:border-stone-300 hover:shadow-md">
              <h3 className="mb-2 text-base font-semibold leading-tight text-stone-900">Fintech & Payments</h3>
              <p className="text-sm leading-6 text-stone-500">
                Legal support for businesses operating in regulated payment, banking, and financial services
                environments.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              View all services
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

      <SiteFooter />
    </main>
  )
}
