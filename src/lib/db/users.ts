import { sql } from "@vercel/postgres"
import { compare, hash } from "bcryptjs"

export type User = {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

type UserWithHash = User & { password_hash: string }

export async function getUserByEmail(email: string): Promise<UserWithHash | null> {
  const result = await sql<UserWithHash>`
    SELECT id, email, name, role, password_hash, created_at
    FROM users
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `
  return result.rows[0] ?? null
}

export async function createUser(input: { email: string; name: string; password: string }): Promise<User> {
  const passwordHash = await hash(input.password, 12)
  const result = await sql<User>`
    INSERT INTO users (email, name, password_hash)
    VALUES (${input.email.toLowerCase()}, ${input.name}, ${passwordHash})
    RETURNING id, email, name, role, created_at
  `
  return result.rows[0]!
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash)
}
