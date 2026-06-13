import { createPool } from "@vercel/postgres"
import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))

function requireConnectionString(name, value) {
  if (!value) {
    throw new Error(`${name} is not configured.`)
  }
  return value
}

async function migrateUsers() {
  const connectionString = requireConnectionString(
    "POSTGRES_URL or POSTGRES_URL_NON_POOLING",
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL,
  )
  const pool = createPool({ connectionString })

  await pool.sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`
  await pool.sql`
  CREATE TABLE IF NOT EXISTS users (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT        UNIQUE NOT NULL,
    name        TEXT        NOT NULL,
    password_hash TEXT      NOT NULL,
    role        TEXT        NOT NULL DEFAULT 'prospect',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`

  await pool.end()
  console.log("Migration complete: users table ready.")
}

async function migratePortal() {
  const connectionString = requireConnectionString(
    "PORTAL_DATABASE_URL, POSTGRES_URL_NON_POOLING, or POSTGRES_URL",
    process.env.PORTAL_DATABASE_URL ?? process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL,
  )
  const pool = createPool({ connectionString })
  const schema = await readFile(join(rootDir, "docs/portal-stage3-schema.sql"), "utf8")

  await pool.query(schema)
  await pool.end()
  console.log("Migration complete: portal Stage 3 schema ready.")
}

await migrateUsers()
await migratePortal()
