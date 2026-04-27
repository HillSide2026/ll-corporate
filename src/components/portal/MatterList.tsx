import Link from "next/link"

import type { CaseInstance } from "src/lib/contracts"
import { getMatterList } from "src/lib/portal/matterSource"

// TEMPORARY: accepts string | null — null triggers mock data via matterSource.
// Once LL-task-tracker is live, narrow this back to string and call listCases() directly.
type MatterListProps = {
  accessToken: string | null
}

function matterStateBadge(state: CaseInstance["matterState"]) {
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

export async function MatterList({ accessToken }: MatterListProps) {
  let matters: CaseInstance[] = []
  let isMock = false
  let errorMessage: string | null = null

  try {
    const result = await getMatterList(accessToken)
    matters = result.matters
    isMock = result.isMock
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "An unexpected error occurred."
  }

  if (errorMessage) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 px-4 py-4 text-sm">
        <p className="font-semibold text-amber-900">Unable to load matters</p>
        <p className="mt-1 text-amber-700">{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* TEMPORARY: remove this notice once live API is connected */}
      {isMock ? (
        <p className="text-xs text-stone-400">
          Preview data — connect LL-task-tracker to show live matters.
        </p>
      ) : null}

      {matters.length === 0 ? (
        <p className="text-sm text-stone-400">No active matters found.</p>
      ) : (
        <ul className="space-y-3">
          {matters.map((matter, i) => {
            const key = matter.businessKey ?? `matter-${i}`
            return (
              <li key={key} className="rounded border border-stone-200 bg-white px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/corporate/app/matters/${encodeURIComponent(key)}`}
                      className="text-sm font-semibold text-brand-navy underline-offset-2 hover:underline"
                    >
                      {key}
                    </Link>
                    {matter.nextActionSummary ? (
                      <p className="mt-1 text-sm leading-5 text-stone-600">{matter.nextActionSummary}</p>
                    ) : null}
                    {matter.responsibleLawyerName ? (
                      <p className="mt-2 text-xs text-stone-400">Lawyer: {matter.responsibleLawyerName}</p>
                    ) : null}
                  </div>
                  {matter.matterState ? (
                    <span
                      className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${matterStateBadge(matter.matterState)}`}
                    >
                      {matter.matterState}
                    </span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
