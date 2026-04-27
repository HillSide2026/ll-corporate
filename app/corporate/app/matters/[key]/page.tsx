import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import type { AdminEvent, CaseInstance } from "src/lib/contracts"
import { getAccessToken, getPortalSession } from "src/lib/auth/session"
import { getMatterByKey } from "src/lib/portal/matterSource"

type MatterDetailPageProps = {
  params: Promise<{ key: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: MatterDetailPageProps): Promise<Metadata> {
  const { key } = await params
  return { title: `Matter ${decodeURIComponent(key)}` }
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

function matterStateBadge(state: CaseInstance["matterState"]): string {
  switch (state) {
    case "Active":
      return "bg-brand-navy/10 text-brand-navy"
    case "Pending":
      return "bg-amber-50 text-amber-700"
    case "Closed":
    case "Archived":
      return "bg-stone-100 text-stone-400"
    default:
      return "bg-stone-100 text-stone-500"
  }
}

function EventLog({ events }: { events: AdminEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-stone-400">No events recorded.</p>
  }

  const sorted = [...events].sort((a, b) => {
    if (!a.occurredAt) return 1
    if (!b.occurredAt) return -1
    return b.occurredAt.localeCompare(a.occurredAt)
  })

  return (
    <ol className="space-y-3">
      {sorted.map((event, i) => (
        <li key={i} className="flex gap-4 text-sm">
          <span className="w-28 shrink-0 text-stone-400">{formatDate(event.occurredAt)}</span>
          <div className="min-w-0">
            <span className="font-medium text-stone-900">{event.eventType ?? "Event"}</span>
            {event.fromState && event.toState ? (
              <span className="ml-2 text-stone-400">
                {event.fromState} → {event.toState}
              </span>
            ) : null}
            {event.actorName ? <span className="ml-2 text-stone-400">by {event.actorName}</span> : null}
            {event.note ? <p className="mt-1 text-stone-500">{event.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default async function MatterDetailPage({ params }: MatterDetailPageProps) {
  const { key } = await params
  const businessKey = decodeURIComponent(key)

  const session = await getPortalSession()
  if (!session) {
    redirect("/corporate")
  }

  // accessToken is null in preview mode — getMatterByKey falls back to mock data.
  // TEMPORARY: once Keycloak is configured, this will return a real token and hit
  // the live LL-task-tracker API instead.
  const accessToken = await getAccessToken()

  let matter: CaseInstance | null = null
  let isMock = false
  let errorMessage: string | null = null

  try {
    const result = await getMatterByKey(accessToken, businessKey)
    matter = result.matter
    isMock = result.isMock
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to load matter."
  }

  if (!matter && !errorMessage) {
    notFound()
  }

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link
            href="/corporate/app"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← Portal home
          </Link>
        </nav>

        {/* TEMPORARY: remove this notice once live API is connected */}
        {isMock ? (
          <p className="mt-6 text-xs text-stone-400">
            Preview data — connect LL-task-tracker to show live matter details.
          </p>
        ) : null}

        {errorMessage ? (
          <div className="mt-14 rounded border border-amber-200 bg-amber-50 px-5 py-5 text-sm text-amber-900">
            <p className="font-semibold">Unable to load matter</p>
            <p className="mt-1 text-amber-700">{errorMessage}</p>
          </div>
        ) : matter ? (
          <>
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-navy uppercase">Matter</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold text-stone-900">{matter.businessKey ?? businessKey}</h1>
                {matter.matterState ? (
                  <span className={`rounded px-2 py-1 text-xs font-medium ${matterStateBadge(matter.matterState)}`}>
                    {matter.matterState}
                  </span>
                ) : null}
              </div>
              {matter.matterType ? (
                <p className="mt-2 text-sm text-stone-400">{matter.matterType}</p>
              ) : null}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-stone-200 bg-white px-5 py-5">
                <h2 className="text-sm font-semibold text-stone-900">Next action</h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {matter.nextActionSummary ?? "No next action on file."}
                </p>
                {matter.nextActionOwnerType ? (
                  <p className="mt-2 text-xs text-stone-400">Owner: {matter.nextActionOwnerType}</p>
                ) : null}
                {matter.nextActionDueAt ? (
                  <p className="mt-1 text-xs text-stone-400">Due: {formatDate(matter.nextActionDueAt)}</p>
                ) : null}
              </div>

              <div className="rounded border border-stone-200 bg-white px-5 py-5">
                <h2 className="text-sm font-semibold text-stone-900">Status</h2>
                {matter.adminState ? (
                  <p className="mt-2 text-sm text-stone-500">{matter.adminState}</p>
                ) : null}
                {matter.waitingReasonText ? (
                  <p className="mt-2 text-sm text-stone-500">{matter.waitingReasonText}</p>
                ) : null}
                {matter.responsibleLawyerName ? (
                  <p className="mt-3 text-xs text-stone-400">Lawyer: {matter.responsibleLawyerName}</p>
                ) : null}
                {!matter.adminState && !matter.waitingReasonText && !matter.responsibleLawyerName ? (
                  <p className="mt-2 text-sm text-stone-400">No status detail available.</p>
                ) : null}
              </div>
            </div>

            <div className="mt-8 rounded border border-stone-200 bg-white px-5 py-5">
              <h2 className="text-base font-semibold text-stone-900">Event log</h2>
              <div className="mt-4">
                <EventLog events={matter.adminEvents ?? []} />
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  )
}
