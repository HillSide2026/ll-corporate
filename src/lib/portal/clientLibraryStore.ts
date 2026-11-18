import type { PortalIdentity } from "src/lib/auth/session"
import { isPortalDatabaseConfigured, requirePortalDatabase } from "./portalDb"

/**
 * Client-to-library mapping (LLP-055, ML1 2026-11-18).
 *
 * Each client has one document library on the SharePoint Clients site. A
 * signed-in user reaches a library only through an active membership row here;
 * the browser never names a library or drive.
 *
 * Who sees it (ML1 2026-11-18): the client's Instructing Officer (portal tier
 * "client") and the client's teammates (tier "teammate"), unless the firm has
 * restricted that client to the Instructing Officer only (teammate_access false).
 *
 * Fails closed: any other tier, no active membership, a deactivated library, a
 * restricted library for a teammate, or more than one active membership all
 * return null, and the user sees no library documents.
 */

export type ClientLibrary = {
  clientKey: string
  clientName: string
  driveId: string
  teammateAccess: boolean
}

type ClientLibraryRow = {
  client_key: string
  client_name: string
  drive_id: string
  teammate_access: boolean
}

export async function getClientLibraryForIdentity(identity: PortalIdentity): Promise<ClientLibrary | null> {
  const { subject, role } = identity
  if (!subject || (role !== "client" && role !== "teammate")) return null
  if (!isPortalDatabaseConfigured()) return null

  const db = requirePortalDatabase()
  const result = await db.sql<ClientLibraryRow>`
    select l.client_key, l.client_name, l.drive_id, l.teammate_access
    from portal_client_memberships m
    join portal_client_libraries l on l.client_key = m.client_key
    where m.subject = ${subject}
      and m.revoked_at is null
      and l.deactivated_at is null
  `

  if (result.rows.length !== 1) return null
  const row = result.rows[0]!
  if (role === "teammate" && row.teammate_access !== true) return null

  return {
    clientKey: row.client_key,
    clientName: row.client_name,
    driveId: row.drive_id,
    teammateAccess: row.teammate_access === true,
  }
}
