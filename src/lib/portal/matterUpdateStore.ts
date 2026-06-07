import type { PortalIdentity } from "src/lib/auth/session"
import { recordAuditEvent } from "./auditLog"
import { isPortalDatabaseConfigured, requirePortalDatabase } from "./portalDb"

export type MatterUpdate = {
  id: string
  matterKey: string
  body: string
  addedAt: string
  authorName: string
}

type MatterUpdateRow = {
  id: string
  matter_key: string
  body: string
  added_at: Date | string
  author_name: string
}

function mapMatterUpdate(row: MatterUpdateRow): MatterUpdate {
  return {
    id: row.id,
    matterKey: row.matter_key,
    body: row.body,
    addedAt: row.added_at instanceof Date ? row.added_at.toISOString() : row.added_at,
    authorName: row.author_name,
  }
}

export function isMatterUpdateStoreConfigured(): boolean {
  return isPortalDatabaseConfigured()
}

export async function addMatterUpdate(update: Omit<MatterUpdate, "id">, actor?: PortalIdentity): Promise<MatterUpdate> {
  const db = requirePortalDatabase()
  const id = `UPDATE-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const result = await db.sql<MatterUpdateRow>`
    insert into portal_matter_updates (
      id,
      matter_key,
      body,
      author_name,
      author_subject,
      added_at
    )
    values (
      ${id},
      ${update.matterKey},
      ${update.body},
      ${update.authorName},
      ${actor?.subject ?? null},
      ${update.addedAt}
    )
    returning id, matter_key, body, added_at, author_name
  `

  await recordAuditEvent({
    action: "matter_update_created",
    actor: { identity: actor, role: "admin" },
    matterKey: update.matterKey,
    resourceId: id,
    resourceType: "matter_update",
  })

  return mapMatterUpdate(result.rows[0]!)
}

export async function getMatterUpdates(matterKey: string): Promise<MatterUpdate[]> {
  const db = requirePortalDatabase()
  const result = await db.sql<MatterUpdateRow>`
    select id, matter_key, body, added_at, author_name
    from portal_matter_updates
    where matter_key = ${matterKey}
    order by added_at desc
  `
  return result.rows.map(mapMatterUpdate)
}
