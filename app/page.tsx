import Link from "next/link"

import { SiteFooter } from "src/components/SiteFooter"
import { PublicHeader } from "src/components/PublicHeader"
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
      <PublicHeader current="home" />

      {/* 1. Hero */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Secure Client Portal</p>
          <h1 className="text-ink mt-5 max-w-4xl text-5xl leading-tight font-semibold tracking-tight sm:text-6xl">
            Access Your Levine Law Workspace
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            Request portal access to view documents, submit requests, track matters, and communicate securely with
            Levine Law through our digital client portal.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#request-access"
              className="bg-brand-navy hover:bg-brand-navy-dark inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Request Portal Access
            </a>
            <a
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-md border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Sign In
            </a>
          </div>
          <p className="mt-5 max-w-2xl text-xs leading-5 text-stone-400">
            Requesting portal access is for administrative review only and does not create a lawyer-client relationship,
            retainer, engagement, or obligation on the part of Levine Law.
          </p>
        </div>
      </section>

      {/* 2. Portal Capabilities */}
      <section className="border-border-subtle border-y bg-stone-50 py-6">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm leading-6 text-stone-600">
            Levine Law supports clients as fractional counsel across corporate, contract, and financial services
            matters.
          </p>
        </div>
      </section>

      <section id="client-portal" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Client Workspace</p>
              <h2 className="text-ink mt-3 text-2xl leading-tight font-semibold tracking-tight">
                What Clients Can Do In The Portal
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-stone-600">
                Use one secure workspace to manage access, requests, matter updates, and firm communications.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
              {portalCapabilities.map((item) => (
                <div
                  key={item.title}
                  className="rounded border border-stone-200 bg-white p-6 transition hover:border-stone-300"
                >
                  <h3 className="text-ink text-base leading-tight font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Digital First */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="border-border-subtle grid gap-8 border-y py-12 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Account Access</p>
              <h2 className="text-ink mt-3 text-2xl leading-tight font-semibold tracking-tight">
                Existing Clients Sign In Here
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-stone-600">
                Use your portal credentials to access documents, requests, matter updates, and secure communications.
              </p>
            </div>
            <Link
              href="/sign-in"
              className="bg-brand-navy hover:bg-brand-navy-dark inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 4. How We Work */}
      <section className="bg-brand-navy py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-white/75 uppercase">How We Work</p>
              <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-white">
                Ongoing legal support and representation
              </h2>
            </div>
            <p className="text-lg leading-8 text-white/75 lg:col-span-8">
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
            <div>
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Request Access</p>
              <h2 className="text-ink mt-3 text-3xl leading-tight font-semibold tracking-tight">
                Request portal access
              </h2>
              <p className="mt-4 text-sm leading-6 text-stone-600">
                Use this form to request access to the client portal. Levine Law reviews requests before granting access
                or accepting any engagement.
              </p>
              <p className="mt-4 text-sm leading-6 text-stone-600">
                Requesting access does not create a lawyer-client relationship, retainer, engagement, or obligation on
                the part of Levine Law.
              </p>
            </div>
            <div className="rounded border border-stone-200 bg-white p-6 text-left md:p-8">
              <PortalAccessRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Notice */}
      <section id="notice" className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="border-border-subtle mx-auto max-w-3xl border-y py-8">
            <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Notice</p>
            <h2 className="text-ink mt-3 text-2xl leading-tight font-semibold tracking-tight">Notice</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Levine Law Client Portal access requests are provided for administrative convenience and access to digital
              services after review.
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Requesting portal access does not: Create a lawyer-client relationship; Retain Levine Law as legal
              counsel; Constitute legal advice; Guarantee representation; Create an engagement agreement. A
              lawyer-client relationship is established only after Levine Law has completed its intake and conflict
              review processes and a formal engagement has been accepted.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Final Portal CTA */}
      <section className="bg-stone-50 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Client Portal</p>
            <h2 className="text-ink mt-3 text-2xl leading-tight font-semibold tracking-tight">
              Ready to access your Levine Law workspace?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#request-access"
                className="bg-brand-navy hover:bg-brand-navy-dark inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                Request Portal Access
              </a>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-white"
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
