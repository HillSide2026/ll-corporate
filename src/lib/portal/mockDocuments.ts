/**
 * TEMPORARY — preview / development fallback only.
 *
 * Replace with a real document API call once the backend exposes a
 * document endpoint. Follows the same provisional pattern as mockMatters.ts.
 *
 * To remove:
 *   1. Delete this file and documentSource.ts.
 *   2. In documents/page.tsx, call the real API directly.
 */

export type PortalDocument = {
  id: string
  matterKey: string
  filename: string
  fileUrl: string
  addedAt: string
  addedByName: string
}

export const MOCK_DOCUMENTS: readonly PortalDocument[] = [
  {
    id: "doc-001",
    matterKey: "MATTER-2026-001",
    filename: "Shareholder Agreement (Draft).pdf",
    fileUrl: "#",
    addedAt: "2026-03-12T14:00:00Z",
    addedByName: "M. Levine",
  },
  {
    id: "doc-002",
    matterKey: "MATTER-2026-001",
    filename: "Incorporation Certificate.pdf",
    fileUrl: "#",
    addedAt: "2026-03-10T10:30:00Z",
    addedByName: "M. Levine",
  },
  {
    id: "doc-003",
    matterKey: "MATTER-2026-002",
    filename: "Share Issuance Resolution.pdf",
    fileUrl: "#",
    addedAt: "2026-04-02T09:15:00Z",
    addedByName: "M. Levine",
  },
]
