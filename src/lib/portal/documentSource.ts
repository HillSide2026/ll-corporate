/**
 * TEMPORARY — preview / development fallback only.
 *
 * Returns mock document data until a real document API endpoint is available.
 * Follows the same provisional pattern as matterSource.ts.
 *
 * To remove once document API is available:
 *   1. Delete this file and mockDocuments.ts.
 *   2. In documents/page.tsx, call the real API directly and remove isMock handling.
 */

import type { PortalDocument } from "./mockDocuments"
import { MOCK_DOCUMENTS } from "./mockDocuments"

export type { PortalDocument }

export type DocumentListResult = {
  documents: PortalDocument[]
  isMock: boolean
}

export async function getDocumentList(): Promise<DocumentListResult> {
  // TODO: replace with real API call when document endpoint is available.
  return { documents: [...MOCK_DOCUMENTS], isMock: true }
}
