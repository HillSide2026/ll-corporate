import { Check, CircleCheck, Clock, Lock, ShieldCheck } from "lucide-react"

import { brandCard, Eyebrow, NavyPanel } from "src/components/brand/Brand"
import type { ConflictRequest } from "src/lib/intake/conflictRequestStore"
import type { LeadService } from "src/lib/services/leadServices"
import { cn } from "@/lib/utils"
import { ConflictCheckForm } from "./ConflictCheckForm"

const nextSteps = [
  "We run the conflict check.",
  "We email you to confirm the right service and its fixed fee.",
  "You sign the engagement letter and pay here.",
]

/**
 * Where the lead is in the three steps: done steps are ticked, the current one is
 * marked "Now". Before submitting, nothing has started; the confidentiality note
 * only makes sense next to the form.
 */
function NextStepsPanel({ request }: { request: ConflictRequest | null }) {
  const current = !request ? -1 : request.status === "cleared" ? 1 : 0
  return (
    <section className={cn(brandCard, "p-7 sm:p-9")}>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-950">
        {request ? "Where things stand" : "What happens next"}
      </h2>
      <ol className="mt-6 grid gap-6 sm:grid-cols-3">
        {nextSteps.map((step, index) => {
          const done = index < current
          const now = index === current
          return (
            <li key={step} className="flex items-start gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  done
                    ? "border-brand-navy bg-brand-navy text-white"
                    : now
                      ? "border-brand-blue text-brand-blue"
                      : "border-brand-navy text-brand-navy",
                  index > current && current >= 0 && "border-stone-300 text-stone-400"
                )}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <div className="pt-1">
                {now || done ? (
                  <p
                    className={cn(
                      "text-[11px] font-semibold tracking-[0.16em] uppercase",
                      now ? "text-brand-blue" : "text-stone-500"
                    )}
                  >
                    {now ? "Now" : "Done"}
                  </p>
                ) : null}
                <p
                  className={cn(
                    "text-sm leading-6",
                    done ? "text-stone-500" : "text-stone-700",
                    index > current && current >= 0 && "text-stone-500"
                  )}
                >
                  {step}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
      {!request ? (
        <div className="mt-7 flex items-start gap-3 border-t border-stone-100 pt-5">
          <Lock className="text-brand-blue mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-stone-600">
            What you tell us here is confidential and used only to check for conflicts.
          </p>
        </div>
      ) : null}
    </section>
  )
}

function StatusCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className={cn(brandCard, "p-7 sm:p-9")}>
      <span className="flex size-12 items-center justify-center rounded-xl bg-stone-100">{icon}</span>
      <h2 className="font-display mt-5 text-2xl font-semibold tracking-tight text-stone-950">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-stone-600">{children}</div>
    </section>
  )
}

function RequestStatus({ request, email }: { request: ConflictRequest; email: string }) {
  if (request.status === "cleared") {
    return (
      <StatusCard icon={<CircleCheck className="size-6 text-emerald-600" />} title="We can act for you">
        <p>
          The conflict check is complete. Next, we will contact you at{" "}
          <span className="font-medium text-stone-900">{email}</span> to confirm the service you need and its fee. The
          service you chose here is a starting point, and we may suggest a different one.
        </p>
        <p>Once we agree, you will sign the engagement letter and pay here.</p>
      </StatusCard>
    )
  }

  if (request.status === "declined") {
    return (
      <StatusCard icon={<ShieldCheck className="size-6 text-stone-500" />} title="We are unable to act for you">
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
            className="text-brand-blue font-medium underline underline-offset-4"
          >
            Referral Service
          </a>{" "}
          can help you find another lawyer.
        </p>
      </StatusCard>
    )
  }

  return (
    <StatusCard icon={<Clock className="text-brand-blue size-6" />} title="Conflict check in progress">
      <p>
        Thanks{request.applicantName ? `, ${request.applicantName.split(/\s+/)[0]}` : ""}. We are checking that we can
        act for you. We will contact you at <span className="font-medium text-stone-900">{email}</span> once it is done,
        and you can check back here at any time.
      </p>
      <p>Please don&apos;t send details of your matter until we confirm.</p>
    </StatusCard>
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
    <div className="space-y-10">
      <NavyPanel>
        <Eyebrow tone="dark" rule>
          Step 2 · Conflict check
        </Eyebrow>
        <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{service.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">{service.why}</p>
      </NavyPanel>

      <div className="space-y-8">
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
          <section className={cn(brandCard, "p-7 sm:p-9")}>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-950">Who is involved?</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-stone-600">
              Before we can act for you, we must confirm we don&apos;t already act for anyone whose interests conflict
              with yours. Tell us only who is involved, not what the matter is about. Nothing is signed or paid at this
              step.
            </p>
            <div className="mt-7 max-w-2xl">
              <ConflictCheckForm service={service} defaultName={defaultName} />
            </div>
          </section>
        )}
        {request?.status === "declined" ? null : <NextStepsPanel request={request} />}
      </div>
    </div>
  )
}
