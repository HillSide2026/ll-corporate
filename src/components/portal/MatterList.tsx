import Link from "next/link"

import type { CaseInstance } from "src/lib/contracts"
import { getMatterList } from "src/lib/portal/matterSource"
import { cx, PortalBadge, PortalEmptyState } from "./PortalDesignSystem"

type MatterListProps = {
  accessToken: string | null
  filterState?: string
  filterSearch?: string
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "No due date"
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

function matterStateTone(state: CaseInstance["matterState"]): "navy" | "gold" | "neutral" {
  switch (state) {
    case "Active":
      return "navy"
    case "Pending":
      return "gold"
    default:
      return "neutral"
  }
}

export async function MatterList({ accessToken, filterState, filterSearch }: MatterListProps) {
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

  if (filterState) {
    matters = matters.filter((matter) => matter.matterState === filterState)
  }

  if (filterSearch) {
    const query = filterSearch.toLowerCase()
    matters = matters.filter(
      (matter) =>
        (matter.businessKey ?? "").toLowerCase().includes(query) ||
        (matter.matterType ?? "").toLowerCase().includes(query) ||
        (matter.nextActionSummary ?? "").toLowerCase().includes(query)
    )
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-5 py-4 text-sm">
        <p className="font-semibold text-amber-900">Unable to load matters</p>
        <p className="mt-1 text-amber-700">{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isMock ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          Preview data — connect LL-task-tracker to show live matters.
        </div>
      ) : null}

      {matters.length === 0 ? (
        <PortalEmptyState
          title={filterState || filterSearch ? "No matching matters" : "No matters found"}
          description={
            filterState || filterSearch
              ? "Try adjusting the status filter or search term."
              : "Matters opened by Levine Law will appear here once available."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.15fr_1.4fr_0.8fr_0.7fr] gap-4 border-b border-stone-100 bg-stone-50 px-5 py-3 text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase lg:grid">
            <span>Matter</span>
            <span>Next action</span>
            <span>Owner / due</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-stone-100">
            {matters.map((matter, index) => {
              const key = matter.businessKey ?? `matter-${index}`
              const clientAction = matter.nextActionOwnerType === "Client"
              return (
                <Link
                  key={key}
                  href={`/corporate/app/matters/${encodeURIComponent(key)}`}
                  className="grid gap-4 px-5 py-5 transition hover:bg-stone-50 lg:grid-cols-[1.15fr_1.4fr_0.8fr_0.7fr] lg:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-950">{key}</p>
                    {matter.matterType ? <p className="mt-1 text-sm text-stone-500">{matter.matterType}</p> : null}
                  </div>
                  <p className="text-sm leading-6 text-stone-600">
                    {matter.nextActionSummary ?? "No next action on file."}
                  </p>
                  <div className="text-sm text-stone-500">
                    <p className={cx(clientAction && "font-semibold text-amber-700")}>
                      {matter.nextActionOwnerType ?? "Levine Law"}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">{formatDate(matter.nextActionDueAt)}</p>
                  </div>
                  <div className="lg:text-right">
                    {matter.matterState ? (
                      <PortalBadge tone={matterStateTone(matter.matterState)}>{matter.matterState}</PortalBadge>
                    ) : null}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
