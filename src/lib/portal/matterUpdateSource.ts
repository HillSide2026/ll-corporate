/**
 * TEMPORARY — abstraction layer for matter updates.
 * Returns mock data in preview mode; live store data otherwise.
 * Same pattern as matterSource.ts and documentSource.ts.
 *
 * To remove:
 *   1. Call getMatterUpdates() from matterUpdateStore directly, or replace
 *      with a real API call once the lawyer admin surface posts real updates.
 *   2. Delete this file and mockMatterUpdates.ts.
 */

import { MOCK_MATTER_UPDATES } from "./mockMatterUpdates"
import { getMatterUpdates, type MatterUpdate } from "./matterUpdateStore"

export type { MatterUpdate }

export function getMatterUpdateList(
  matterKey: string,
  isMock: boolean,
): { updates: MatterUpdate[]; isMock: boolean } {
  if (isMock) {
    return {
      updates: MOCK_MATTER_UPDATES.filter((u) => u.matterKey === matterKey),
      isMock: true,
    }
  }
  return { updates: getMatterUpdates(matterKey), isMock: false }
}
