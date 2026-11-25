import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getOnboardingDriveId, getOnboardingItem, isSharePointConfigured } from "src/lib/api/sharepointGraph"
import { getAdminSession } from "src/lib/auth/adminAuth"
import { type ConflictRequest, listConflictRequests } from "src/lib/intake/conflictRequestStore"
import { clientNameOf } from "src/lib/intake/onboardingDetails"
import { listOnboardingDetails, type OnboardingDetails } from "src/lib/intake/onboardingStore"
import { releaseEngagementLetterAction } from "src/lib/intake/releaseActions"
import { leadServices } from "src/lib/services/leadServices"

export const metadata: Metadata = { title: "Engagement Letters — Levine Law Admin" }

export const dynamic = "force-dynamic"

type PageProps = { searchParams: Promise<{ error?: string; id?: string }> }

const STATUS_LABEL: Record<OnboardingDetails["sharepointStatus"], string> = {
  pending: "Not filed yet",
  uploaded: "Draft filed",
  no_template: "No Current template",
  not_configured: "SharePoint not configured",
  not_permitted: "Portal not permitted",
  error: "Error",
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Toronto",
  })
}

/** SharePoint links for the admin only; a lookup failure just leaves the link out. */
async function linkFor(driveId: string | null, itemId: string | null): Promise<string | null> {
  if (!driveId || !itemId) return null
  return getOnboardingItem(driveId, itemId)
    .then((item) => item.webUrl)
    .catch(() => null)
}

export default async function AdminOnboardingPage({ searchParams }: PageProps) {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")
  const { error, id: errorId } = await searchParams

  let rows: OnboardingDetails[] = []
  let requests: ConflictRequest[] = []
  let unavailable = false
  try {
    ;[rows, requests] = await Promise.all([listOnboardingDetails(), listConflictRequests()])
  } catch (err) {
    console.error("AdminOnboardingPage: onboarding store unavailable", err)
    unavailable = true
  }
  const byId = new Map(requests.map((r) => [r.id, r]))

  const driveId = isSharePointConfigured() ? await getOnboardingDriveId().catch(() => null) : null
  const links = await Promise.all(
    rows.map(async (row) => ({
      draft: row.sharepointStatus === "uploaded" ? await linkFor(driveId, row.sharepointItemId) : null,
      released: await linkFor(driveId, row.releasedItemId),
    }))
  )

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <Link href="/corporate/admin" className="text-brand-navy text-sm font-semibold">
            Levine Law Admin
          </Link>
          <h1 className="mt-0.5 text-lg font-semibold text-stone-900">Engagement letters</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
        <p className="text-sm text-stone-500">
          Each cleared lead&apos;s details, and the Draft letter the portal filed in the Onboarding library. Complete
          the Draft in SharePoint, then enter the Clio matter number and release it. Releasing files a new Current copy
          and shows it to the client; the Draft is not changed. Signing and payment are not handled here.
        </p>

        {error === "matter" ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Enter the Clio matter number in the form 24-256-00001.
          </p>
        ) : error === "preview" ? (
          <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Releases are disabled in local preview.
          </p>
        ) : error ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            That release could not be started. Reload the page and try again.
          </p>
        ) : null}

        {unavailable ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            The onboarding table is unavailable. Check that intake_onboarding_details exists in the portal database,
            with the step 3 columns from docs/portal-stage3-schema.sql.
          </p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-stone-400">No engagement letter details yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((row, i) => {
              const request = byId.get(row.conflictRequestId)
              const service = leadServices.find((s) => s.slug === request?.serviceSlug)
              const link = links[i]!
              return (
                <li key={row.id} className="rounded border border-stone-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-900">{clientNameOf(row)}</p>
                      <p className="mt-0.5 text-sm text-stone-500">
                        {service?.title ?? request?.serviceSlug ?? "Unknown offer"} ({service?.code ?? "?"}) ·{" "}
                        {row.signingCapacity === "corporation"
                          ? `Signs for the corporation: ${row.clientFirstName} ${row.clientSurname}${row.signerTitle ? `, ${row.signerTitle}` : ""}`
                          : "Signs personally"}
                      </p>
                      <p className="mt-0.5 text-sm text-stone-500">
                        Instructing officer: {row.instructingOfficerName}
                        {row.instructingOfficerTitle ? `, ${row.instructingOfficerTitle}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400">Details given {formatDate(row.createdAt)}</p>
                    </div>
                    <span className="rounded bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
                      {row.releasedAt ? "Released" : STATUS_LABEL[row.sharepointStatus]}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm text-stone-700">
                    {row.sharepointStatus !== "uploaded" && row.sharepointError ? (
                      <p className="text-red-700">{row.sharepointError}</p>
                    ) : null}
                    {row.sharepointFileName ? (
                      <p>
                        Draft:{" "}
                        {link.draft ? (
                          <a href={link.draft} className="text-brand-navy underline" target="_blank" rel="noreferrer">
                            {row.sharepointFileName}
                          </a>
                        ) : (
                          row.sharepointFileName
                        )}
                      </p>
                    ) : null}
                    {row.releasedAt ? (
                      <p>
                        Released {formatDate(row.releasedAt)} · Clio {row.matterNumber} ·{" "}
                        {link.released ? (
                          <a
                            href={link.released}
                            className="text-brand-navy underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {row.releasedFileName}
                          </a>
                        ) : (
                          row.releasedFileName
                        )}
                      </p>
                    ) : row.sharepointStatus === "uploaded" ? (
                      <>
                        {row.releaseError ? <p className="text-red-700">{row.releaseError}</p> : null}
                        {error === "matter" && errorId === row.id ? (
                          <p className="text-red-700">Enter the Clio matter number in the form 24-256-00001.</p>
                        ) : null}
                        <form action={releaseEngagementLetterAction} className="flex flex-wrap items-end gap-3">
                          <input type="hidden" name="id" value={row.id} />
                          <label className="text-xs text-stone-500">
                            Clio matter no.
                            <input
                              name="matterNumber"
                              required
                              placeholder="24-256-00001"
                              className="mt-1 block w-40 rounded border border-stone-300 bg-white px-3 py-2 text-sm"
                            />
                          </label>
                          <button
                            type="submit"
                            className="bg-brand-navy hover:bg-brand-navy-dark rounded px-4 py-2 text-sm font-semibold text-white transition-colors"
                          >
                            Approve and release to client
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}
