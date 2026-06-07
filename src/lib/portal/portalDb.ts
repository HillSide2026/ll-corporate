import { createPool } from "@vercel/postgres"

import { env } from "env.mjs"

export class PortalDatabaseNotConfiguredError extends Error {
  constructor() {
    super("Portal database is not configured.")
    this.name = "PortalDatabaseNotConfiguredError"
  }
}

export function isPortalDatabaseConfigured(): boolean {
  return Boolean(env.PORTAL_DATABASE_URL || env.POSTGRES_URL)
}

export function isPortalMockFallbackEnabled(): boolean {
  return env.PORTAL_ENABLE_MOCK_FALLBACK === true || env.LL_CORPORATE_ENABLE_PREVIEW_ACCESS === true
}

export function requirePortalDatabase() {
  const connectionString = env.PORTAL_DATABASE_URL ?? env.POSTGRES_URL
  if (!connectionString) throw new PortalDatabaseNotConfiguredError()
  return createPool({ connectionString })
}
