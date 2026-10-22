import Link from "next/link"
import { ArrowLeft, CircleCheck, Clock, ShieldCheck } from "lucide-react"

import type { ConflictRequest } from "src/lib/intake/conflictRequestStore"
import type { LeadService } from "src/lib/services/leadServices"
import { ConflictCheckForm } from "./ConflictCheckForm"

function StatusPanel({
  icon,
  tone,
  title,
  children,
}: {
  icon: React.ReactNode
  tone: "navy" | "green" | "stone"
  title: string
  children: React.ReactNode
}) {
  const tones = {
    navy: "border-brand-navy/20 bg-brand-navy/[0.03]",
    green: "border-emerald-200 bg-emerald-50/60",
    stone: "border-stone-200 bg-white",
  }
  return (
    <section className={`rounded-xl border p-6 sm:p-8 ${tones[tone]}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-stone-950">{title}</h2>
          <div className="space-y-3 text-[15px] leading-7 text-stone-600">{children}</div>
        </div>
      </div>
    </section>
  )
}

function RequestStatus({ request, email }: { request: ConflictRequest; email: string }) {
  if (request.status === "cleared") {
    return (
      <StatusPanel icon={<CircleCheck className="size-5 text-emerald-600" />} tone="green" title="We can act for you">
        <p>
          The conflict check is complete. Next, we will contact you at{" "}
          <span className="font-medium text-stone-900">{email}</span> to confirm the service you need and its fee. The
          service you chose here is a starting point, and we may suggest a different one.
        </p>
        <p>Once we agree, we will send your engagement letter and payment link.</p>
      </StatusPanel>
    )
  }

  if (request.status === "declined") {
    return (
      <StatusPanel
        icon={<ShieldCheck className="size-5 text-stone-500" />}
        tone="stone"
        title="We are unable to act for you"
      >
        <p>
          Levine Law cannot take on this matter. This is not a comment on your matter, and we have not reviewed it. We
          are not able to give reasons.
        </p>
        <p>
          The Law Society of Ontario&apos;s{" "}
          <a
            href="https://lso.ca/public-resources/finding-a-lawyer-or-paralegal/law-society-referral-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-navy font-medium underline underline-offset-4"
          >
            Referral Service
          </a>{" "}
          can help you find another lawyer.
        </p>
      </StatusPanel>
    )
  }

  return (
    <StatusPanel icon={<Clock className="text-brand-navy size-5" />} tone="navy" title="Conflict check in progress">
      <p>
        Thanks{request.applicantName ? `, ${request.applicantName.split(/\s+/)[0]}` : ""}. We are checking that we can
        act for you. We will contact you at <span className="font-medium text-stone-900">{email}</span> once it is done,
        and you can check back here at any time.
      </p>
      <p>Please don&apos;t send details of your matter until we confirm.</p>
    </StatusPanel>
  )
}

export function ConflictCheckView({
  service,
  request,
  email,
  defaultName,
  unavailable = false,
}: {
  service: LeadService
  request: ConflictRequest | null
  email: string
  defaultName?: string
  unavailable?: boolean
}) {
  return (
    <div className="space-y-8">
      <Link
        href="/intake/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-950"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All services
      </Link>

      <header>
        <p className="text-brand-navy text-xs font-semibold tracking-[0.18em] uppercase">Step 2 · Conflict check</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">{service.title}</h1>
        <p className="mt-2 text-sm text-stone-500">Fixed fee, quoted after your conflict check</p>
      </header>

      {unavailable ? (
        <div
          role="alert"
          className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm"
        >
          This page is unavailable right now. Please try again later.
        </div>
      ) : request ? (
        <RequestStatus request={request} email={email} />
      ) : (
        <section className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight text-stone-950">Who is involved?</h2>
          <p className="mt-2 text-[15px] leading-7 text-stone-600">
            Before we can act for you, we must confirm we don&apos;t already act for anyone on the other side. Tell us
            only <span className="font-medium text-stone-900">who</span> is involved, not what the matter is about.
            Nothing is signed or paid at this step.
          </p>
          <div className="mt-6">
            <ConflictCheckForm serviceSlug={service.slug} defaultName={defaultName} />
          </div>
        </section>
      )}
    </div>
  )
}
