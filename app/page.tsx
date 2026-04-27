import Image from "next/image"
import Link from "next/link"

import { SiteFooter } from "src/components/SiteFooter"

const serviceCategories = [
  {
    title: "Corporate Governance",
    description:
      "Shareholder agreements, director matters, equity structure, and corporate maintenance for private companies.",
  },
  {
    title: "Commercial Contracts",
    description:
      "Drafting and negotiating commercial agreements that allocate risk, revenue, and responsibility clearly.",
  },
  {
    title: "Fintech & Payments",
    description:
      "Legal support for businesses operating in regulated payment, banking, and financial services environments.",
  },
]

const legalFramework = [
  {
    title: "Corporate Structure",
    description: "Shareholders, directors, control, and governance frameworks.",
  },
  {
    title: "Contracts",
    description: "Commercial agreements that allocate risk, revenue, and responsibility.",
  },
  {
    title: "Financial Flows",
    description: "Payments, banking relationships, and movement of funds.",
  },
  {
    title: "Regulatory Overlay",
    description: "FINTRAC, AML obligations, MSB exposure, and compliance architecture.",
  },
]

const clientTypes = [
  {
    title: "Operators & Executives",
    description: "Running and scaling private companies.",
  },
  {
    title: "Fintech Platforms",
    description: "Businesses dealing with regulated financial flows.",
  },
  {
    title: "Investors & Funds",
    description: "Deploying capital into operating businesses.",
  },
  {
    title: "Cross-Border Businesses",
    description: "Managing multi-jurisdictional structures.",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-white text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Image
            src="/levine-llp-logo.svg"
            alt="Levine LLP"
            width={120}
            height={48}
            priority
            className="h-10 w-auto"
          />
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-stone-600 transition-colors hover:text-stone-900">
              Services
            </Link>
            <a href="#industries" className="text-stone-600 transition-colors hover:text-stone-900">
              Industries
            </a>
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

      {/* Hero */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-brand-navy uppercase">Levine LLP</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
            Corporate, Contract, and Financial Services Counsel for Growing Businesses.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-500">
            Levine Law advises executives, investors, and regulated businesses on corporate structure, commercial
            agreements, and financial services matters.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              View Services
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

      {/* Section 2: How We Help */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">How We Help</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {serviceCategories.map((item) => (
              <div key={item.title} className="rounded border border-stone-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How Legal Work Actually Fits Together */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">How Legal Work Actually Fits Together</h2>
          <p className="mt-3 max-w-2xl text-stone-500">
            Corporate structure, contracts, and financial flows are interdependent. Legal issues rarely exist in
            isolation.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {legalFramework.map((item) => (
              <div key={item.title} className="rounded border border-stone-200 bg-stone-50 p-6">
                <h3 className="text-base font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Client Tools */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">Client Tools</h2>
          <div className="mt-8 max-w-sm">
            <div className="rounded border border-stone-200 bg-white p-6">
              <h3 className="text-base font-semibold text-stone-900">NDA Tool</h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Prepare a standard NDA for early-stage discussions.
              </p>
              <a
                href="/ndaesq"
                className="mt-4 inline-flex text-sm font-semibold text-brand-navy underline underline-offset-4 transition-colors hover:text-brand-navy-dark"
              >
                Open NDA Tool
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Who We Work With */}
      <section id="industries" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-stone-900">Who We Work With</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {clientTypes.map((item) => (
              <div key={item.title} className="rounded border border-stone-200 p-6">
                <h3 className="text-base font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Client Portal */}
      <section id="insights" className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-stone-900">Client Portal</h2>
            <p className="mt-3 text-stone-500">
              Access active matters, documents, and communications through the secure client workspace.
            </p>
            <a
              href="/corporate"
              className="mt-6 inline-flex items-center justify-center rounded border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              Access Client Portal
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
