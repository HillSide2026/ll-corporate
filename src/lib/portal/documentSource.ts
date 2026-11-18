import type { PortalIdentity } from "src/lib/auth/session"
import { isSharePointConfigured } from "src/lib/api/sharepointGraph"
import type { PortalDocument as MockPortalDocument } from "./mockDocuments"
import { MOCK_DOCUMENTS } from "./mockDocuments"
import { getClientLibraryDocuments, getClientUploadedDocuments, type PortalDocumentRecord } from "./documentStore"
import { isPortalDatabaseConfigured, isPortalMockFallbackEnabled } from "./portalDb"

export type { PortalDocumentRecord as PortalDocument }

export type DocumentListResult = {
  documents: PortalDocumentRecord[]
  isMock: boolean
}

/**
 * The documents one signed-in user may see: copies the firm shared in their
 * client library on the SharePoint Clients site, plus what they uploaded
 * themselves. Nothing belonging to another client or another user.
 *
 * Before 2026-11-18 this returned every row in portal_documents for every
 * user. Firm-shared documents now come from the client library (LLP-055).
 */
export async function getDocumentList(identity: PortalIdentity): Promise<DocumentListResult> {
  if (isPortalDatabaseConfigured()) {
    const [shared, uploaded] = await Promise.all([
      isSharePointConfigured() ? getClientLibraryDocuments(identity) : Promise.resolve([]),
      getClientUploadedDocuments(identity.subject),
    ])
    return { documents: [...shared, ...uploaded], isMock: false }
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
