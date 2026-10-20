import { env } from "env.mjs"

/**
 * Matters and Documents are built but hidden (LLP-037 ADR-006, ML1 2026-10-20).
 *
 * The portal is for client experience, not necessarily client delivery. The
 * matter and document views stay in the codebase and are off unless
 * PORTAL_ENABLE_MATTERS_AND_DOCUMENTS=true. Turning them on is an ML1 decision.
 *
 * When off: the nav items and dashboard panels are not rendered, and the
 * client-facing routes return 404. The lawyer-facing admin surface is unaffected.
 */
export function isMattersAndDocumentsEnabled(): boolean {
  return env.PORTAL_ENABLE_MATTERS_AND_DOCUMENTS === true
}
