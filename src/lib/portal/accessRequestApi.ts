import { env } from "env.mjs"
import { z } from "zod"

export const PortalAccessRequestStatusSchema = z.enum(["pending", "reviewing", "approved", "rejected", "provisioned"])

export type PortalAccessRequestStatus = z.infer<typeof PortalAccessRequestStatusSchema>

export const PortalAccessRequestSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  company: z.string(),
  phone: z.string(),
  description: z.string(),
  status: PortalAccessRequestStatusSchema,
  submittedAt: z.string(),
  legalAcknowledgedAt: z.string(),
  reviewedAt: z.string().optional(),
  reviewedBy: z.string().optional(),
  internalNote: z.string().optional(),
  keycloakUserId: z.string().optional(),
})

export type PortalAccessRequest = z.infer<typeof PortalAccessRequestSchema>

export type CreatePortalAccessRequestInput = {
  fullName: string
  email: string
  company: string
  phone: string
  description: string
  legalAcknowledgedAt: string
}

export type UpdatePortalAccessRequestInput = {
  status: PortalAccessRequestStatus
  internalNote?: string
  reviewedBy?: string
  keycloakUserId?: string
}

const PortalAccessRequestListSchema = z.object({
  requests: z.array(PortalAccessRequestSchema),
})

export class PortalAccessRequestApiNotConfiguredError extends Error {
  constructor() {
    super("Portal access request API is not configured.")
    this.name = "PortalAccessRequestApiNotConfiguredError"
  }
}

export class PortalAccessRequestApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string
  ) {
    super(`${endpoint} returned HTTP ${status}`)
    this.name = "PortalAccessRequestApiError"
  }
}

export class PortalAccessRequestContractError extends Error {
  constructor(
    public readonly endpoint: string,
    public readonly cause: unknown
  ) {
    super(`${endpoint} returned an invalid portal access request shape.`)
    this.name = "PortalAccessRequestContractError"
  }
}

function getApiConfig(): { baseUrl: string; token: string } | null {
  const baseUrl = env.PORTAL_ACCESS_REQUEST_API_BASE_URL
  const token = env.PORTAL_ACCESS_REQUEST_API_TOKEN
  if (!baseUrl || !token) return null
  return { baseUrl: baseUrl.replace(/\/$/, ""), token }
}

export function isPortalAccessRequestApiConfigured(): boolean {
  return getApiConfig() !== null
}

async function accessRequestFetch(path: string, init?: RequestInit): Promise<Response> {
  const config = getApiConfig()
  if (!config) throw new PortalAccessRequestApiNotConfiguredError()

  return fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`,
      ...init?.headers,
    },
  })
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null
  return response.json()
}

export async function createPortalAccessRequest(input: CreatePortalAccessRequestInput): Promise<PortalAccessRequest> {
  const endpoint = "POST /portal-access-requests"
  const response = await accessRequestFetch("/portal-access-requests", {
    method: "POST",
    body: JSON.stringify({
      type: "portal_access_request",
      ...input,
    }),
  })
  if (!response.ok) throw new PortalAccessRequestApiError(response.status, endpoint)

  const json = await readJson(response)
  const result = PortalAccessRequestSchema.safeParse(json)
  if (!result.success) throw new PortalAccessRequestContractError(endpoint, result.error)
  return result.data
}

export async function listPortalAccessRequests(): Promise<PortalAccessRequest[]> {
  const endpoint = "GET /portal-access-requests"
  const response = await accessRequestFetch("/portal-access-requests", { method: "GET" })
  if (!response.ok) throw new PortalAccessRequestApiError(response.status, endpoint)

  const json = await readJson(response)
  const result = PortalAccessRequestListSchema.safeParse(json)
  if (!result.success) throw new PortalAccessRequestContractError(endpoint, result.error)
  return result.data.requests
}

export async function updatePortalAccessRequest(
  id: string,
  input: UpdatePortalAccessRequestInput
): Promise<PortalAccessRequest> {
  const endpoint = `PATCH /portal-access-requests/${id}`
  const response = await accessRequestFetch(`/portal-access-requests/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new PortalAccessRequestApiError(response.status, endpoint)

  const json = await readJson(response)
  const result = PortalAccessRequestSchema.safeParse(json)
  if (!result.success) throw new PortalAccessRequestContractError(endpoint, result.error)
  return result.data
}
