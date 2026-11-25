import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { IntakeShell } from "src/components/intake/IntakeShell"
import { getPortalSession } from "src/lib/auth/session"
import { type ConflictRequest, listConflictRequestsForUser } from "src/lib/intake/conflictRequestStore"
import { getOnboardingDetails } from "src/lib/intake/onboardingStore"
import { leadServices } from "src/lib/services/leadServices"

export const metadata: Metadata = { title: "My requests" }

export const dynamic = "force-dynamic"

type Row = { request: ConflictRequest; letterReleased: boolean }

function statusLabel(row: Row): string {
  if (row.request.status === "declined") return "We are unable to act for you"
  if (row.request.status === "cleared") return row.letterReleased ? "Engagement letter issued" : "We can act for you"
  return "Conflict check in progress"
}

function sentOn(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", dateStyle: "long" }).format(new Date(iso))
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="grid gap-1 sm:grid-cols-[200px_1fr]">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="text-sm whitespace-pre-line text-stone-900">{value}</dd>
    </div>
  )
}

export default async function MyRequestsPage() {
  const session = await getPortalSession()
  if (!session?.identity.email) redirect("/sign-in")

  let rows: Row[] = []
  let unavailable = false
  try {
    const requests = await listConflictRequestsForUser(session.identity.subject)
    rows = await Promise.all(
      requests.map(async (request) => {
        if (request.status !== "cleared") return { request, letterReleased: false }
        // A missing onboarding table must not hide the list
        const details = await getOnboardingDetails(request.id).catch(() => null)
        return { request, letterReleased: Boolean(details?.releasedAt) }
      })
    )
  } catch (err) {
    console.error("MyRequestsPage: conflict request store unavailable", err)
    unavailable = true
  }

  return (
    <IntakeShell active="requests" showProgress={false}>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-950">My requests</h1>
      <p className="mt-3 text-[15px] leading-7 text-stone-600">
        Each request you have sent, where it stands, and what you told us.
      </p>

      {unavailable ? (
        <p role="alert" className="mt-8 text-sm text-stone-600">
          We could not load your requests right now. Please try again later.
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-stone-600">
          You have not sent a request yet.{" "}
          <Link href="/intake/catalog" className="text-brand-blue font-medium underline underline-offset-4">
            Choose a service
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {rows.map((row) => {
            const { request } = row
            const service = leadServices.find((s) => s.slug === request.serviceSlug)
            const answers = Object.entries(request.screening ?? {}).map(([name, answer]) => ({
              label: service?.screening?.find((q) => q.name === name)?.label ?? name,
              answer,
            }))
            return (
              <li key={request.id} className="rounded-xl border border-stone-200 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold text-stone-950">{service?.title ?? request.serviceSlug}</h2>
                  <span className="text-sm text-stone-500">Sent {sentOn(request.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-stone-700">{statusLabel(row)}</p>
                <dl className="mt-4 space-y-2">
                  <Detail label="Your name" value={request.applicantName} />
                  <Detail label={service?.conflict.companyLabel ?? "Company"} value={request.companyName} />
                  <Detail label={service?.conflict.partiesLabel ?? "People involved"} value={request.relatedParties} />
                  <Detail label="Other side" value={request.adverseParties ?? "None"} />
                  {answers.map((a) => (
                    <Detail key={a.label} label={a.label} value={a.answer} />
                  ))}
                </dl>
                {service ? (
                  <Link
                    href={`/intake/start/${service.slug}`}
                    className="text-brand-blue mt-4 inline-block text-sm font-medium underline underline-offset-4"
                  >
                    Open this request
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </IntakeShell>
  )
}
