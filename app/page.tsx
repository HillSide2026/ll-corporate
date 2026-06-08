import Link from "next/link"

import { SiteFooter } from "src/components/SiteFooter"
import { PublicHeader } from "src/components/PublicHeader"
import { PortalAccessRequestForm } from "src/components/PortalAccessRequestForm"

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-white text-stone-800">
      <PublicHeader current="home" />

      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        {/* Subtle top-left decorative gradient */}
        <div
          className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #1D4771 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Client Access</p>
          <h1 className="text-ink mx-auto mt-5 max-w-4xl text-5xl leading-tight font-semibold tracking-tight sm:text-6xl lg:text-[4.5rem]">
            Access The Levine Law Workspace
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-500">
            Request portal access to view documents, submit requests, track matters, and communicate securely with
            Levine Law through our digital client portal.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#request-access"
              className="bg-brand-navy hover:bg-brand-navy-dark inline-flex items-center justify-center rounded-md px-7 py-3.5 text-sm font-semibold text-white transition-colors"
            >
              Request Access
            </a>
            <a
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-md border border-stone-300 px-7 py-3.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      {/* 2. Navy band */}
      <section className="border-y border-brand-navy bg-brand-navy py-5">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-sm leading-6 text-white">
            Levine Law supports clients as fractional counsel across corporate, contract, and financial services
            matters.
          </p>
        </div>
      </section>

      {/* 3. Feature: Secure Document Access */}
      <section id="client-portal" className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            <div className="lg:flex-1">
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Document Access</p>
              <h2 className="text-ink mt-3 text-3xl font-semibold leading-tight tracking-tight">
                Secure Document Access
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-500">
                Receive and access documents shared with you through a secure workspace.
              </p>
            </div>
            <div className="lg:flex-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-navy">
                <DocumentsVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature: Submit Requests */}
      <section className="bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-center">
            <div className="lg:flex-1">
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Legal Advice</p>
              <h2 className="text-ink mt-3 text-3xl font-semibold leading-tight tracking-tight">Submit Requests</h2>
              <p className="mt-4 text-base leading-7 text-stone-500">
                Initiate legal requests, intake forms, and service workflows online.
              </p>
            </div>
            <div className="lg:flex-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-navy">
                <RequestsVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feature: Track Matters */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            <div className="lg:flex-1">
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">
                Matter Management
              </p>
              <h2 className="text-ink mt-3 text-3xl font-semibold leading-tight tracking-tight">Track Matters</h2>
              <p className="mt-4 text-base leading-7 text-stone-500">
                Monitor the status of active matters and ongoing legal work.
              </p>
            </div>
            <div className="lg:flex-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-navy">
                <MattersVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature: Centralized Communications */}
      <section className="bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-center">
            <div className="lg:flex-1">
              <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">
                Secure Communications
              </p>
              <h2 className="text-ink mt-3 text-3xl font-semibold leading-tight tracking-tight">
                Centralized Communications
              </h2>
              <p className="mt-4 text-base leading-7 text-stone-500">
                Maintain a single record of updates, requests, and firm communications.
              </p>
            </div>
            <div className="lg:flex-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-navy">
                <CommunicationsVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How We Work */}
      <section className="bg-brand-navy py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-white/60 uppercase">How We Work</p>
            <h2 className="mt-3 text-3xl leading-tight font-semibold tracking-tight text-white">
              Ongoing legal support and representation
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              Levine Law supports clients as fractional counsel across corporate, contract, and financial services
              matters.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Request Access */}
      <section id="request-access" className="bg-white py-20 md:py-24">
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
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <PortalAccessRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Notice */}
      <section id="notice" className="border-t border-stone-100 bg-stone-50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Notice</p>
            <h2 className="text-ink mt-3 text-xl font-semibold tracking-tight">
              No Lawyer-Client Relationship
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Use of the Levine Law client portal, or submission of a request through this website, does not create a
              lawyer-client relationship, retainer, engagement, or any obligation on the part of Levine Law. No
              confidential information should be transmitted until a formal engagement has been confirmed in writing
              by Levine Law.
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Portal access is granted at the sole discretion of Levine Law. All communications and documents shared
              through the portal are subject to the terms of any applicable engagement agreement.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Final Portal CTA */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <p className="text-brand-navy text-[11px] font-semibold tracking-[0.24em] uppercase">Client Portal</p>
            <h2 className="text-ink mt-3 text-2xl leading-tight font-semibold tracking-tight">
              Ready to access your Levine Law workspace?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#request-access"
                className="bg-brand-navy hover:bg-brand-navy-dark inline-flex items-center justify-center rounded-md px-7 py-3.5 text-sm font-semibold text-white transition-colors"
              >
                Request Access
              </a>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-md border border-stone-300 px-7 py-3.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
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

/* ─── Feature Illustrations ─────────────────────────────────────────── */

function DocumentsVisual() {
  return (
    <svg
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <radialGradient id="doc-glow" cx="35%" cy="30%" r="55%">
        <stop offset="0%" stopColor="#2d7bc4" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#2d7bc4" stopOpacity="0" />
      </radialGradient>
      <rect width="480" height="360" fill="url(#doc-glow)" />

      {/* Dot grid */}
      <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.07" />
      </pattern>
      <rect width="480" height="360" fill="url(#dots)" />

      {/* Back document — rotated */}
      <g transform="translate(260,48) rotate(10)">
        <rect width="130" height="170" rx="5" fill="white" fillOpacity="0.07" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
        <line x1="18" y1="36" x2="112" y2="36" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
        <line x1="18" y1="54" x2="112" y2="54" stroke="white" strokeOpacity="0.13" strokeWidth="1.5" />
        <line x1="18" y1="72" x2="85" y2="72" stroke="white" strokeOpacity="0.13" strokeWidth="1.5" />
        <line x1="18" y1="90" x2="112" y2="90" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
      </g>

      {/* Mid document */}
      <g transform="translate(175,65) rotate(-4)">
        <rect width="140" height="185" rx="5" fill="white" fillOpacity="0.11" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
        <rect x="0" y="0" width="140" height="32" rx="5" fill="white" fillOpacity="0.08" />
        <line x1="16" y1="52" x2="124" y2="52" stroke="white" strokeOpacity="0.28" strokeWidth="1.5" />
        <line x1="16" y1="70" x2="124" y2="70" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
        <line x1="16" y1="88" x2="95" y2="88" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
        <line x1="16" y1="106" x2="124" y2="106" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
      </g>

      {/* Front document */}
      <g transform="translate(75,80)">
        <rect width="165" height="210" rx="6" fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
        {/* Header bar */}
        <rect x="0" y="0" width="165" height="38" rx="6" fill="white" fillOpacity="0.1" />
        <rect x="14" y="13" width="76" height="10" rx="3" fill="white" fillOpacity="0.45" />
        {/* Body lines */}
        <line x1="14" y1="62" x2="151" y2="62" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" />
        <line x1="14" y1="80" x2="151" y2="80" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="14" y1="98" x2="115" y2="98" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
        <line x1="14" y1="116" x2="151" y2="116" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <line x1="14" y1="134" x2="128" y2="134" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
        <line x1="14" y1="152" x2="151" y2="152" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
        <line x1="14" y1="170" x2="90" y2="170" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
      </g>

      {/* Shield with lock */}
      <g transform="translate(302,208)">
        <path d="M38,0 L76,14 L76,42 C76,64 38,80 38,80 C38,80 0,64 0,42 L0,14 Z" fill="white" fillOpacity="0.92" />
        <rect x="20" y="34" width="36" height="28" rx="4" fill="#1D4771" />
        <path d="M25,34 L25,27 C25,18 51,18 51,27 L51,34" fill="none" stroke="#1D4771" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="38" cy="48" r="5" fill="white" fillOpacity="0.85" />
        <line x1="38" y1="53" x2="38" y2="59" stroke="white" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function RequestsVisual() {
  return (
    <svg
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <radialGradient id="req-glow" cx="70%" cy="25%" r="55%">
        <stop offset="0%" stopColor="#2d7bc4" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2d7bc4" stopOpacity="0" />
      </radialGradient>
      <rect width="480" height="360" fill="url(#req-glow)" />
      <pattern id="dots2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.07" />
      </pattern>
      <rect width="480" height="360" fill="url(#dots2)" />

      {/* Clipboard body */}
      <rect x="120" y="44" width="240" height="280" rx="8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />

      {/* Clipboard top clip */}
      <rect x="186" y="36" width="108" height="24" rx="7" fill="white" fillOpacity="0.25" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />

      {/* Form fields */}
      <text x="140" y="92" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="system-ui, sans-serif" letterSpacing="0.1em">FULL NAME</text>
      <rect x="140" y="98" width="200" height="24" rx="4" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1" />

      <text x="140" y="142" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="system-ui, sans-serif" letterSpacing="0.1em">EMAIL ADDRESS</text>
      <rect x="140" y="148" width="200" height="24" rx="4" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1" />

      <text x="140" y="192" fill="white" fillOpacity="0.45" fontSize="9" fontFamily="system-ui, sans-serif" letterSpacing="0.1em">DESCRIPTION</text>
      <rect x="140" y="198" width="200" height="62" rx="4" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1" />

      {/* Submit button */}
      <rect x="140" y="284" width="200" height="36" rx="5" fill="white" fillOpacity="0.88" />
      <text x="240" y="307" fill="#1D4771" fontSize="12" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="600">Submit Request</text>

      {/* Checkmark badge top-right */}
      <circle cx="376" cy="78" r="38" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="376" cy="78" r="26" fill="white" fillOpacity="0.88" />
      <path d="M362,78 L372,90 L390,64" fill="none" stroke="#1D4771" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MattersVisual() {
  return (
    <svg
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <radialGradient id="mat-glow" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stopColor="#2d7bc4" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2d7bc4" stopOpacity="0" />
      </radialGradient>
      <rect width="480" height="360" fill="url(#mat-glow)" />
      <pattern id="dots3" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.07" />
      </pattern>
      <rect width="480" height="360" fill="url(#dots3)" />

      {/* Matter card */}
      <rect x="56" y="44" width="370" height="78" rx="8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      {/* Status pill — active */}
      <rect x="74" y="62" width="52" height="20" rx="10" fill="#2d7bc4" fillOpacity="0.7" />
      <text x="100" y="76" fill="white" fontSize="9" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="600">ACTIVE</text>
      <text x="74" y="104" fill="white" fillOpacity="0.7" fontSize="11" fontFamily="system-ui, sans-serif">Corporate Restructuring — Q3 2025</text>
      <rect x="298" y="68" width="110" height="8" rx="4" fill="white" fillOpacity="0.12" />
      <rect x="298" y="68" width="72" height="8" rx="4" fill="white" fillOpacity="0.55" />

      {/* Matter card 2 */}
      <rect x="56" y="140" width="370" height="78" rx="8" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
      <rect x="74" y="158" width="62" height="20" rx="10" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <text x="105" y="172" fill="white" fillOpacity="0.6" fontSize="9" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="600">REVIEW</text>
      <text x="74" y="200" fill="white" fillOpacity="0.55" fontSize="11" fontFamily="system-ui, sans-serif">Software Licence Agreement — Nov 2025</text>
      <rect x="298" y="164" width="110" height="8" rx="4" fill="white" fillOpacity="0.12" />
      <rect x="298" y="164" width="40" height="8" rx="4" fill="white" fillOpacity="0.35" />

      {/* Matter card 3 */}
      <rect x="56" y="236" width="370" height="78" rx="8" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
      <rect x="74" y="254" width="58" height="20" rx="10" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      <text x="103" y="268" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="system-ui, sans-serif" textAnchor="middle" fontWeight="600">CLOSED</text>
      <text x="74" y="296" fill="white" fillOpacity="0.35" fontSize="11" fontFamily="system-ui, sans-serif">NDA Review — Aug 2025</text>
      <rect x="298" y="260" width="110" height="8" rx="4" fill="white" fillOpacity="0.12" />
      <rect x="298" y="260" width="110" height="8" rx="4" fill="white" fillOpacity="0.2" />
    </svg>
  )
}

function CommunicationsVisual() {
  return (
    <svg
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <radialGradient id="comm-glow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#2d7bc4" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#2d7bc4" stopOpacity="0" />
      </radialGradient>
      <rect width="480" height="360" fill="url(#comm-glow)" />
      <pattern id="dots4" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="white" fillOpacity="0.07" />
      </pattern>
      <rect width="480" height="360" fill="url(#dots4)" />

      {/* Hub at center */}
      <circle cx="240" cy="180" r="46" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="240" cy="180" r="30" fill="white" fillOpacity="0.25" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" />
      {/* Levine Law "LL" monogram hint */}
      <text x="240" y="187" fill="white" fillOpacity="0.9" fontSize="16" fontFamily="Georgia, serif" textAnchor="middle" fontWeight="700">LL</text>

      {/* Connecting lines to satellite nodes */}
      <line x1="240" y1="150" x2="240" y2="72" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="240" y1="210" x2="240" y2="288" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="210" y1="162" x2="120" y2="108" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="270" y1="162" x2="360" y2="108" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="210" y1="198" x2="120" y2="252" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="270" y1="198" x2="360" y2="252" stroke="white" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />

      {/* Satellite nodes — message bubbles */}
      {/* Top */}
      <rect x="196" y="38" width="88" height="46" rx="8" fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
      <line x1="210" y1="55" x2="272" y2="55" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" />
      <line x1="210" y1="68" x2="255" y2="68" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />

      {/* Bottom */}
      <rect x="196" y="276" width="88" height="46" rx="8" fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
      <line x1="210" y1="293" x2="272" y2="293" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" />
      <line x1="210" y1="306" x2="248" y2="306" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />

      {/* Upper-left */}
      <rect x="76" y="80" width="88" height="46" rx="8" fill="white" fillOpacity="0.14" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      <line x1="90" y1="97" x2="152" y2="97" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
      <line x1="90" y1="110" x2="134" y2="110" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* Upper-right */}
      <rect x="316" y="80" width="88" height="46" rx="8" fill="white" fillOpacity="0.14" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
      <line x1="330" y1="97" x2="392" y2="97" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
      <line x1="330" y1="110" x2="374" y2="110" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* Lower-left */}
      <rect x="76" y="234" width="88" height="46" rx="8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <line x1="90" y1="251" x2="152" y2="251" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
      <line x1="90" y1="264" x2="128" y2="264" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />

      {/* Lower-right */}
      <rect x="316" y="234" width="88" height="46" rx="8" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <line x1="330" y1="251" x2="392" y2="251" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
      <line x1="330" y1="264" x2="368" y2="264" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
    </svg>
  )
}
