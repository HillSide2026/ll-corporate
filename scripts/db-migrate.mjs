import { createPool } from "@vercel/postgres"

const pool = createPool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL,
})

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

console.log("Migration complete: users table ready.")
await pool.end()
