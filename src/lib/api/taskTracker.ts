/**
 * API adapter for LL-task-tracker case engine.
 *
 * All responses are validated at the boundary with Zod before being returned.
 * A shape mismatch throws a ContractViolationError — it will never silently pass
 * malformed data into the application.
 *
 * Auth: pass the Keycloak access token obtained from getAccessToken() (server-only).
 * If the token is null the request is not made and null is returned.
 */

import { env } from "env.mjs"
import {
  CaseInstancePageSchema,
  CaseInstanceSchema,
  TaskListSchema,
} from "../contracts/schemas"
import type {
  AdminTransition,
  AdminTransitionRequest,
  CaseInstance,
  CaseInstancePage,
  CaseListParams,
  Task,
} from "../contracts/index"

// ── Error types ────────────────────────────────────────────────────────────────

export class ContractViolationError extends Error {
  constructor(
    public readonly endpoint: string,
    public readonly cause: unknown,
  ) {
    super(
      `Contract violation on ${endpoint}: response shape did not match the declared schema. ` +
        `This means LL-task-tracker returned an unexpected shape — update src/lib/contracts/ ` +
        `to match the current API version.`,
    )
    this.name = "ContractViolationError"
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
  ) {
    super(`${endpoint} returned HTTP ${status}`)
    this.name = "ApiError"
  }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function getBaseUrl(): string | null {
  return env.LL_TASK_TRACKER_API_BASE_URL ?? null
}

async function apiFetch(
  accessToken: string,
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const base = getBaseUrl()
  if (!base) {
    throw new Error(
      "LL_TASK_TRACKER_API_BASE_URL is not configured. Cannot call the case engine.",
    )
  }
  const url = `${base.replace(/\/$/, "")}${path}`
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  })
}

function buildQuery(params: Record<string, string | undefined>): string {
  const q = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      q.set(key, value)
    }
  }
  const s = q.toString()
  return s ? `?${s}` : ""
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * GET /case — paginated list of case instances.
 *
 * Validates response with CaseInstancePageSchema.
 * Throws ContractViolationError if response shape does not match.
 */
export async function listCases(
  accessToken: string,
  params: CaseListParams = {},
): Promise<CaseInstancePage> {
  const query = buildQuery(params as Record<string, string | undefined>)
  const res = await apiFetch(accessToken, `/case${query}`)
  if (!res.ok) throw new ApiError(res.status, "GET /case")
  const json: unknown = await res.json()
  const result = CaseInstancePageSchema.safeParse(json)
  if (!result.success) throw new ContractViolationError("GET /case", result.error)
  return result.data
}

/**
 * GET /case/{businessKey} — single case instance.
 *
 * Returns null for 404. Validates response with CaseInstanceSchema.
 */
export async function getCase(
  accessToken: string,
  businessKey: string,
): Promise<CaseInstance | null> {
  const res = await apiFetch(accessToken, `/case/${encodeURIComponent(businessKey)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new ApiError(res.status, `GET /case/${businessKey}`)
  const json: unknown = await res.json()
  const result = CaseInstanceSchema.safeParse(json)
  if (!result.success)
    throw new ContractViolationError(`GET /case/${businessKey}`, result.error)
  return result.data
}

/**
 * GET /task?businessKey={id} — tasks for a case.
 *
 * Validates response with TaskListSchema.
 */
export async function listTasks(accessToken: string, businessKey: string): Promise<Task[]> {
  const res = await apiFetch(accessToken, `/task?businessKey=${encodeURIComponent(businessKey)}`)
  if (!res.ok) throw new ApiError(res.status, "GET /task")
  const json: unknown = await res.json()
  const result = TaskListSchema.safeParse(json)
  if (!result.success) throw new ContractViolationError("GET /task", result.error)
  return result.data
}

/**
 * POST /case/{businessKey}/transition/{transitionName}
 *
 * Applies a named lifecycle transition. Returns the updated case instance.
 * Authorization (whether the transition is allowed) is decided by the backend.
 */
export async function transitionCase(
  accessToken: string,
  businessKey: string,
  transition: AdminTransition,
  request?: AdminTransitionRequest,
): Promise<CaseInstance> {
  const res = await apiFetch(
    accessToken,
    `/case/${encodeURIComponent(businessKey)}/transition/${transition}`,
    {
      method: "POST",
      body: request ? JSON.stringify(request) : undefined,
    },
  )
  if (!res.ok)
    throw new ApiError(res.status, `POST /case/${businessKey}/transition/${transition}`)
  const json: unknown = await res.json()
  const result = CaseInstanceSchema.safeParse(json)
  if (!result.success)
    throw new ContractViolationError(
      `POST /case/${businessKey}/transition/${transition}`,
      result.error,
    )
  return result.data
}
