/**
 * TEMPORARY — in-memory store for lawyer-posted matter updates.
 *
 * Persists for the lifetime of the Node.js process. Resets on server restart
 * or serverless cold start. Replace with a real database before production use.
 *
 * The lawyer-facing form to post updates is Phase 3. This store holds updates
 * added programmatically or via the future admin surface.
 *
 * To remove:
 *   1. Replace addMatterUpdate / getMatterUpdates with real DB calls.
 *   2. Delete this file and matterUpdateSource.ts.
 */

export type MatterUpdate = {
  id: string
  matterKey: string
  body: string
  addedAt: string
  authorName: string
}

const store = new Map<string, MatterUpdate>()

export function addMatterUpdate(update: Omit<MatterUpdate, "id">): MatterUpdate {
  const id = `UPDATE-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const stored: MatterUpdate = { id, ...update }
  store.set(id, stored)
  return stored
}

export function getMatterUpdates(matterKey: string): MatterUpdate[] {
  return Array.from(store.values())
    .filter((u) => u.matterKey === matterKey)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
}
