import type { PortalIdentity } from "src/lib/auth/session"
import { isPortalDatabaseConfigured, requirePortalDatabase } from "./portalDb"

export type AuditActor = {
  identity?: PortalIdentity
  role: "client" | "lawyer" | "admin" | "system"
}

export async function recordAuditEvent({
  action,
  actor,
  matterKey,
  metadata = {},
  resourceId,
  resourceType,
}: {
  action: string
  actor: AuditActor
  matterKey?: string
  metadata?: Record<string, unknown>
  resourceId?: string
  resourceType: string
}): Promise<void> {
  if (!isPortalDatabaseConfigured()) return

  const db = requirePortalDatabase()
  await db.sql`
    insert into portal_audit_events (
      actor_subject,
      actor_email,
      actor_role,
      action,
      resource_type,
      resource_id,
      matter_key,
      metadata
    )
    values (
      ${actor.identity?.subject ?? null},
      ${actor.identity?.email ?? null},
      ${actor.role},
      ${action},
      ${resourceType},
      ${resourceId ?? null},
      ${matterKey ?? null},
      ${JSON.stringify(metadata)}::jsonb
    )
  `
}
