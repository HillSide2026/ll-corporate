/**
 * TEMPORARY — in-memory store for submitted intake requests.
 *
 * Persists for the lifetime of the Node.js process. Resets on server restart
 * or serverless cold start. Replace with a real database before production use.
 *
 * Follows the same provisional pattern as mockMatters.ts.
 *
 * To remove:
 *   1. Replace addRequest / getRequests with real DB calls.
 *   2. Delete this file.
 */

import type { IntakeRequestContract } from "src/lib/contracts/intake"

export type RequestStatus = "Received" | "In Review" | "Complete"

export type StoredRequest = {
  id: string
  contract: IntakeRequestContract
  status: RequestStatus
}

const store = new Map<string, StoredRequest>()

export function addRequest(contract: IntakeRequestContract): StoredRequest {
  const id = `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const stored: StoredRequest = { id, contract, status: "Received" }
  store.set(id, stored)
  return stored
}

export function getRequests(): StoredRequest[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.contract.createdAt).getTime() - new Date(a.contract.createdAt).getTime(),
  )
}
