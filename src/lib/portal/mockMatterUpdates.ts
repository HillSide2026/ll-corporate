/**
 * TEMPORARY — mock matter updates for preview mode.
 * Mirrors mock matter keys in mockMatters.ts.
 * Delete when lawyer admin surface is live and real updates exist.
 */

import type { MatterUpdate } from "./matterUpdateStore"

export const MOCK_MATTER_UPDATES: readonly MatterUpdate[] = [
  {
    id: "UPDATE-001",
    matterKey: "MATTER-2026-001",
    body: "Reviewed the draft shareholder agreement. Three open points before final execution: the drag-along threshold, right of first refusal mechanics, and the definition of permitted transfers. Will circulate a marked-up version by end of week.",
    addedAt: "2026-04-28T16:00:00Z",
    authorName: "M. Levine",
  },
  {
    id: "UPDATE-002",
    matterKey: "MATTER-2026-001",
    body: "Incorporation documents filed with the provincial registry. Certificate of incorporation expected within 5–7 business days. Will forward once received.",
    addedAt: "2026-03-15T10:00:00Z",
    authorName: "M. Levine",
  },
  {
    id: "UPDATE-003",
    matterKey: "MATTER-2026-002",
    body: "Share issuance resolution prepared and ready for director approval. Please confirm current board composition before we circulate for signatures.",
    addedAt: "2026-04-05T14:30:00Z",
    authorName: "M. Levine",
  },
]
