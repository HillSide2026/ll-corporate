import Image from "next/image"
import Link from "next/link"

import { SiteFooter } from "src/components/SiteFooter"

const clientTypes = [
  {
    title: "Operators & Executives",
    description: "Running and scaling private companies with ongoing legal needs.",
  },
  {
    title: "Digital Platforms",
    description: "Growing payment and financial services businesses.",
  },
  {
    title: "Investors & Funds",
    description: "Structuring and deploying capital into operating businesses.",
  },
  {
    title: "Cross-Border Businesses",
    description: "Managing multi-jurisdictional entities and contractual partnerships.",
  },
]

const engagementCards = [
  {
    label: "New Clients",
    title: "Fractional Counsel",
    description:
      "Ongoing legal support across corporate, contract, and financial services matters — structured around how each business operates.",
    cta: "Explore Counsel Models",
    href: "/services",
    primary: true,
  },
  {
    label: "Existing Clients",
    title: "Client Portal",
    description:
      "Access documents, request work, and manage ongoing matters through the secure client workspace.",
    cta: "Access Portal",
    href: "/corporate",
    primary: false,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-white text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Image
            src="/logos/levine-law-wordmark-navy-transparent.png"
            alt="Levine Law"
            width={1080}
            height={600}
            priority
            className="h-10 w-auto"
          />
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-stone-600 transition-colors hover:text-stone-900">
              Services
            </Link>
            <Link href="/industries" className="text-stone-600 transition-colors hover:text-stone-900">
              Industries
            </Link>
            <a href="#insights" className="text-stone-600 transition-colors hover:text-stone-900">
              Insights
            </a>
            <a
              href="/corporate"
              className="rounded border border-brand-navy px-4 py-2 font-medium text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              Client Portal
            </a>
          </nav>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Levine LLP</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
            High Quality Corporate and Financial Services Counsel
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-500">
            We advise executives and investors on corporate, contract, and financial services where legal work adds
            value.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Explore
            </Link>
            <a
              href="/corporate"
              className="inline-flex items-center justify-center rounded border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Client Portal
            </a>
          </div>
        </div>
      </section>

      {/* 2. Who We Work With */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Who We Work With</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Built for Dynamic Businesses.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-500">
              We work with entrepreneurial executives and investors so that their entire team can move forward with
              confidence.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {clientTypes.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md"
              >
                <h3 className="mb-2 text-base font-semibold leading-tight text-stone-900">{item.title}</h3>
                <p className="text-sm leading-6 text-stone-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Digital First */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Digital First</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Legal Support, Accessible Where You Work
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-500">
              Clients access matters, documents, and requests through Levine LLP's structured digital workspace.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md md:p-8">
            <h3 className="text-xl font-semibold leading-tight text-stone-900">Client Portal</h3>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Access active matters, documents, filings, communications, and service requests through the secure client
              workspace.
            </p>
            <a
              href="/corporate"
              className="mt-6 inline-flex items-center justify-center rounded bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Access Client Portal
            </a>
          </div>
        </div>
      </section>

      {/* 4. How We Work */}
      <section className="bg-gradient-to-l from-brand-navy to-brand-navy-dark py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">How We Work</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Ongoing legal support and representation
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/75">
              Levine Law supports clients as fractional counsel across corporate, contract, and financial services
              matters.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Digital Innovation */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
              Digital Innovation
            </p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Legal workflows, standardized and scalable.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-500">
              Levine LLP transforms common legal requests into structured digital workflows using playbooks and
              automation.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md md:p-8">
            <h3 className="text-xl font-semibold leading-tight text-stone-900">NDA Tool</h3>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Prepare a standard NDA for early-stage discussions through a guided digital workflow.
            </p>
            <a
              href="/ndaesq"
              className="mt-6 inline-flex items-center justify-center rounded border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Try NDA Tool
            </a>
          </div>
        </div>
      </section>

      {/* 6. How to Work With Us */}
      <section id="insights" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Engagement</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              How to work with us
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 md:gap-8">
            {engagementCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-md md:p-8"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-navy">{card.label}</p>
                <h3 className="mb-3 text-lg font-semibold leading-tight text-stone-900">{card.title}</h3>
                <p className="flex-1 text-sm leading-6 text-stone-500">{card.description}</p>
                <Link
                  href={card.href}
                  className={[
                    "mt-6 inline-flex w-full items-center justify-center rounded px-5 py-3 text-sm font-semibold transition-colors",
                    card.primary
                      ? "bg-brand-navy text-white hover:bg-brand-navy-dark"
                      : "border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-50",
                  ].join(" ")}
                >
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final Directional CTA */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Work with counsel that understands how your business actually operates.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:matthew@levinelegal.ca"
                className="inline-flex items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
              >
                Start a Conversation
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
