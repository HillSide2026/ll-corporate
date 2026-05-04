/**
 * TEMPORARY — in-memory store for submitted intake requests.
 *
 * Persists for the lifetime of the Node.js process. Resets on server restart
 * or serverless cold start. Replace with a real database before production use.
 *
 * Follows the same provisional pattern as mockMatters.ts.
 *
 * To remove:
 *   1. Replace addRequest / getRequests / getRequestById with real DB calls.
 *   2. Delete this file.
 */

import type { IntakeRequestContract } from "src/lib/contracts/intake"

export type RequestStatus = "Received" | "In Review" | "Complete"

export type RequestAttachment = {
  filename: string
  addedAt: string
}

export type StoredRequest = {
  id: string
  contract: IntakeRequestContract
  status: RequestStatus
  attachment: RequestAttachment | null
}

const store = new Map<string, StoredRequest>()

export function addRequest(
  contract: IntakeRequestContract,
  attachment?: RequestAttachment,
): StoredRequest {
  const id = `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const stored: StoredRequest = { id, contract, status: "Received", attachment: attachment ?? null }
  store.set(id, stored)
  return stored
}

export function getRequests(): StoredRequest[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.contract.createdAt).getTime() - new Date(a.contract.createdAt).getTime(),
  )
}

export function getRequestById(id: string): StoredRequest | undefined {
  return store.get(id)
}
