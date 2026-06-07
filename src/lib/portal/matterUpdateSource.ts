import { MOCK_MATTER_UPDATES } from "./mockMatterUpdates"
import { getMatterUpdates, type MatterUpdate } from "./matterUpdateStore"
import { isPortalDatabaseConfigured, isPortalMockFallbackEnabled } from "./portalDb"

export type { MatterUpdate }

export async function getMatterUpdateList(
  matterKey: string,
  isMock: boolean
): Promise<{ updates: MatterUpdate[]; isMock: boolean }> {
  if (isPortalDatabaseConfigured()) {
    return { updates: await getMatterUpdates(matterKey), isMock: false }
  }

  if (isMock && isPortalMockFallbackEnabled()) {
    return {
      updates: MOCK_MATTER_UPDATES.filter((u) => u.matterKey === matterKey),
      isMock: true,
    }
  }

  return { updates: [], isMock: false }
}
