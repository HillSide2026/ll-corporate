/**
 * TEMPORARY — in-memory store for client-initiated counsel matter requests.
 *
 * Distinct from requestStore.ts (fixed-fee service requests). These are
 * open-ended requests for fractional counsel engagement.
 *
 * Persists for the lifetime of the Node.js process. Replace with a real
 * database before production use.
 *
 * To remove:
 *   1. Replace add/get functions with real DB calls.
 *   2. Delete this file.
 */

import type { PortalIdentity } from "src/lib/auth/session"

export type MatterRequestCategory = "Corporate" | "Contract" | "Financial Services"

export type MatterRequestStatus = "Received" | "In Review" | "Accepted" | "Declined"

export type MatterRequest = {
  id: string
  category: MatterRequestCategory
  description: string
  attachmentFilename: string | null
  submittedAt: string
  clientIdentity: PortalIdentity
  status: MatterRequestStatus
}

const store = new Map<string, MatterRequest>()

export function addMatterRequest(
  request: Omit<MatterRequest, "id" | "status">,
): MatterRequest {
  const id = `MR-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const stored: MatterRequest = { id, status: "Received", ...request }
  store.set(id, stored)
  return stored
}

export function getMatterRequests(): MatterRequest[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )
}

export function getMatterRequestById(id: string): MatterRequest | undefined {
  return store.get(id)
}
