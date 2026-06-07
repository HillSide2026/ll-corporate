import type { PortalDocument as MockPortalDocument } from "./mockDocuments"
import { MOCK_DOCUMENTS } from "./mockDocuments"
import { getPortalDocuments, type PortalDocumentRecord } from "./documentStore"
import { isPortalDatabaseConfigured, isPortalMockFallbackEnabled } from "./portalDb"

export type { PortalDocumentRecord as PortalDocument }

export type DocumentListResult = {
  documents: PortalDocumentRecord[]
  isMock: boolean
}

export async function getDocumentList(): Promise<DocumentListResult> {
  if (isPortalDatabaseConfigured()) {
    return { documents: await getPortalDocuments(), isMock: false }
  }

  if (isPortalMockFallbackEnabled()) {
    return {
      documents: MOCK_DOCUMENTS.map((doc: MockPortalDocument) => ({
        ...doc,
        uploadedByClient: false,
      })),
      isMock: true,
    }
  }

  throw new Error("Portal document storage is not configured.")
}
