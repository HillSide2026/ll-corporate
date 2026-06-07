import Image from "next/image"
import Link from "next/link"

import { SiteFooter } from "src/components/SiteFooter"
import { PortalAccessRequestForm } from "src/components/PortalAccessRequestForm"

const portalCapabilities = [
  {
    title: "Secure Document Access",
    description: "Receive and access documents shared with you through a secure workspace.",
  },
  {
    title: "Submit Requests",
    description: "Initiate legal requests, intake forms, and service workflows online.",
  },
  {
    title: "Track Matters",
    description: "Monitor the status of active matters and ongoing legal work.",
  },
  {
    title: "Centralized Communications",
    description: "Maintain a single record of updates, requests, and firm communications.",
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
            <a href="#portal-capabilities" className="hidden text-stone-600 transition-colors hover:text-stone-900 sm:inline">
              Portal
            </a>
            <a href="#request-access" className="hidden text-stone-600 transition-colors hover:text-stone-900 sm:inline">
              Request Access
            </a>
            <a
              href="/corporate"
              className="rounded border border-brand-navy px-4 py-2 font-medium text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="bg-white py-24 text-center md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Secure Client Portal</p>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-6xl">
            Access Your Levine Law Workspace
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-500">
            Request portal access to view documents, submit requests, track matters, and communicate securely with
            Levine Law through our digital client portal.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#request-access"
              className="inline-flex items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Request Portal Access
            </a>
            <a
              href="/corporate"
              className="inline-flex items-center justify-center rounded border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Sign In
            </a>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-xs leading-5 text-stone-400">
            Requesting portal access is for administrative review only and does not create a lawyer-client
            relationship, retainer, engagement, or obligation on the part of Levine Law.
          </p>
        </div>
      </section>

      {/* 2. Portal Capabilities */}
      <section id="portal-capabilities" className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Client Workspace</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              What Clients Can Do In The Portal
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-500">
              Use one secure workspace to manage access, requests, matter updates, and firm communications.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {portalCapabilities.map((item) => (
              <div key={item.title} className="rounded border border-stone-200 bg-white p-6 text-center transition hover:border-stone-300 hover:shadow-md">
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
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Account Access</p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Existing Clients Sign In Here
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-500">
              Use your portal credentials to access the client workspace for documents, requests, matter updates, and
              secure communications.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded border border-stone-200 bg-white p-6 text-center transition hover:border-stone-300 hover:shadow-md md:p-8">
            <h3 className="text-xl font-semibold leading-tight text-stone-900">Secure Portal Access</h3>
            <p className="mt-3 text-sm leading-6 text-stone-500">
              Sign in if you already have a Levine Law portal account. New users can request access below to begin
              administrative review.
            </p>
            <Link
              href="/corporate"
              className="mt-6 inline-flex items-center justify-center rounded bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Sign In
            </Link>
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

      {/* 5. Request Access */}
      <section id="request-access" className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Request Access</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-stone-900">
                Request portal access
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-500">
                Use this form to request access to the client portal. Levine Law reviews requests before granting
                access or accepting any engagement.
              </p>
              <p className="mt-4 text-sm leading-6 text-stone-500">
                Requesting access does not create a lawyer-client relationship, retainer, engagement, or obligation on
                the part of Levine Law.
              </p>
            </div>
            <div className="rounded border border-stone-200 bg-white p-6 text-left shadow-sm md:p-8">
              <PortalAccessRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Notice */}
      <section id="notice" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl rounded border border-stone-200 bg-stone-50 px-6 py-6 md:px-8 md:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">Notice</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-stone-900">Notice</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Levine Law Client Portal access requests are provided for administrative convenience and access to digital
              services after review.
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Requesting portal access does not: Create a lawyer-client relationship; Retain Levine Law as legal counsel;
              Constitute legal advice; Guarantee representation; Create an engagement agreement. A lawyer-client
              relationship is established only after Levine Law has completed its intake and conflict review processes
              and a formal engagement has been accepted.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Final Portal CTA */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-stone-900">
              Ready to access your Levine Law workspace?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#request-access"
                className="inline-flex items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
              >
                Request Portal Access
              </a>
              <Link
                href="/corporate"
                className="inline-flex items-center justify-center rounded border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
