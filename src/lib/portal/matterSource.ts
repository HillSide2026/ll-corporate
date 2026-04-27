/**
 * TEMPORARY — preview / development fallback only.
 *
 * Single source-of-truth for matter data fetching in the portal.
 *
 * Live path:  LL_TASK_TRACKER_API_BASE_URL set AND accessToken present
 *             → calls LL-task-tracker via the taskTracker adapter.
 *
 * Mock path:  LL_TASK_TRACKER_API_BASE_URL not set OR accessToken is null
 *             → returns data from mockMatters.ts.
 *
 * The isMock flag in each return value is forwarded to the UI so a
 * "preview data" notice can be shown to reviewers.
 *
 * To remove once LL-task-tracker is deployed and Keycloak is configured:
 *   1. Delete this file and src/lib/portal/mockMatters.ts.
 *   2. In MatterList.tsx, call listCases() directly (restore accessToken: string).
 *   3. In matters/[key]/page.tsx, call getCase() directly (restore null-token guard).
 *   4. Remove the isMock banner from both components.
 */

import { env } from "env.mjs"

import { getCase, listCases } from "src/lib/api/taskTracker"
import type { CaseInstance } from "src/lib/contracts"
import { MOCK_MATTERS } from "./mockMatters"

function isLiveApiAvailable(accessToken: string | null): accessToken is string {
  return Boolean(env.LL_TASK_TRACKER_API_BASE_URL) && accessToken !== null
}

export type MatterListResult = {
  matters: CaseInstance[]
  isMock: boolean
}

export type MatterDetailResult = {
  matter: CaseInstance | null
  isMock: boolean
}

/**
 * Returns the list of open matters.
 * Falls back to mock data when the API is unavailable or token is absent.
 */
export async function getMatterList(accessToken: string | null): Promise<MatterListResult> {
  if (isLiveApiAvailable(accessToken)) {
    const page = await listCases(accessToken, { status: "open" })
    return { matters: page.data, isMock: false }
  }
  return { matters: [...MOCK_MATTERS], isMock: true }
}

/**
 * Returns a single matter by businessKey.
 * Falls back to mock data when the API is unavailable or token is absent.
 * Returns null matter when the key is not found (404 from live API, or missing from mock set).
 */
export async function getMatterByKey(
  accessToken: string | null,
  businessKey: string,
): Promise<MatterDetailResult> {
  if (isLiveApiAvailable(accessToken)) {
    const matter = await getCase(accessToken, businessKey)
    return { matter, isMock: false }
  }
  const matter = MOCK_MATTERS.find((m) => m.businessKey === businessKey) ?? null
  return { matter, isMock: true }
}
