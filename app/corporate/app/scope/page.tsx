import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { getAccessToken } from "src/lib/auth/session"
import { getCounselProfile, type CounselModel } from "src/lib/portal/counselProfileSource"
import { getMatterList } from "src/lib/portal/matterSource"

export const metadata: Metadata = { title: "Scope" }

export const dynamic = "force-dynamic"

function modelBadgeColor(model: CounselModel): string {
  switch (model) {
    case "Essential": return "bg-stone-100 text-stone-600"
    case "Growth": return "bg-brand-navy/10 text-brand-navy"
    case "Strategic": return "bg-amber-50 text-amber-700"
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "long" })
}

export default async function ScopePage() {
  const session =
    (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/corporate")

  const accessToken = await getAccessToken()
  const { profile, isMock: profileMock } = getCounselProfile()
  const { matters, isMock: mattersMock } = await getMatterList(accessToken)

  const activeMatters = matters.filter((m) => m.matterState === "Active")
  const pendingMatters = matters.filter((m) => m.matterState === "Pending")

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm">
          <Link
            href="/corporate/app"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← Portal home
          </Link>
        </nav>

        {profileMock || mattersMock ? (
          <p className="mt-6 text-xs text-stone-400">Preview data — connect live data sources to show real scope.</p>
        ) : null}

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">Counsel Relationship</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-stone-900">Your Scope</h1>
            <span className={`rounded px-2 py-1 text-xs font-medium ${modelBadgeColor(profile.model)}`}>
              {profile.model} Counsel
            </span>
          </div>
          <p className="mt-2 text-sm text-stone-400">
            With {profile.lawyerName} · Since {formatDate(profile.startedAt)}
          </p>
        </div>

        {/* Counsel description */}
        <div className="mt-8 rounded border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-sm font-semibold text-stone-900">About this engagement</h2>
          <p className="mt-2 text-sm leading-6 text-stone-500">{profile.description}</p>
        </div>

        {/* What's in scope */}
        <div className="mt-4 rounded border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-sm font-semibold text-stone-900">What&apos;s in scope</h2>
          <ul className="mt-3 space-y-2">
            {profile.scopeItems.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-stone-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Active matters summary */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-stone-900">
            Active matters{" "}
            <span className="text-sm font-normal text-stone-400">({activeMatters.length})</span>
          </h2>
          {activeMatters.length === 0 ? (
            <p className="mt-3 text-sm text-stone-400">No active matters at this time.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {activeMatters.map((matter, i) => {
                const key = matter.businessKey ?? `matter-${i}`
                return (
                  <li key={key} className="flex items-center justify-between gap-4 rounded border border-stone-200 bg-white px-5 py-4">
                    <div>
                      <Link
                        href={`/corporate/app/matters/${encodeURIComponent(key)}`}
                        className="text-sm font-semibold text-brand-navy underline-offset-2 hover:underline"
                      >
                        {key}
                      </Link>
                      {matter.matterType ? (
                        <p className="mt-0.5 text-xs text-stone-400">{matter.matterType}</p>
                      ) : null}
                    </div>
                    {matter.nextActionOwnerType === "Client" ? (
                      <span className="shrink-0 rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        Action needed
                      </span>
                    ) : (
                      <span className="shrink-0 rounded bg-stone-100 px-2 py-1 text-xs text-stone-400">
                        In progress
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Pending matters */}
        {pendingMatters.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-base font-semibold text-stone-900">
              Pending{" "}
              <span className="text-sm font-normal text-stone-400">({pendingMatters.length})</span>
            </h2>
            <ul className="mt-4 space-y-2">
              {pendingMatters.map((matter, i) => {
                const key = matter.businessKey ?? `matter-${i}`
                return (
                  <li key={key} className="rounded border border-stone-200 bg-white px-5 py-4">
                    <Link
                      href={`/corporate/app/matters/${encodeURIComponent(key)}`}
                      className="text-sm font-semibold text-brand-navy underline-offset-2 hover:underline"
                    >
                      {key}
                    </Link>
                    {matter.matterType ? (
                      <p className="mt-0.5 text-xs text-stone-400">{matter.matterType}</p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}

        {/* Open a matter CTA */}
        <div className="mt-10 rounded border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-sm font-semibold text-stone-900">Need something not covered here?</h2>
          <p className="mt-2 text-sm text-stone-500">
            Open a matter request and your lawyer will assess whether it fits within scope or requires a
            separate arrangement.
          </p>
          <Link
            href="/corporate/app/requests/new"
            className="mt-4 inline-flex items-center justify-center rounded border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
          >
            Open a matter
          </Link>
        </div>
      </section>
    </main>
  )
}
