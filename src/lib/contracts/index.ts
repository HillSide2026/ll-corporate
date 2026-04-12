/**
 * Case Engine API contract types — ll-corporate consumer side.
 *
 * These types are derived from the LL-task-tracker OpenAPI spec at:
 *   contracts/openapi/case-engine-api.yaml (version 1.1.0)
 *
 * Rules:
 * - Do NOT extend or modify these types in feature code.
 * - Do NOT add fields that the backend does not return.
 * - Do NOT infer lifecycle state, permissions, or action eligibility from these types.
 *   All authorization and command eligibility is owned by the backend.
 * - When the backend changes the contract, update this file AND bump SUPPORTED_CONTRACT_VERSION.
 * - Use domain-qualified field names (matterLifecycleStage, matterState, adminState)
 *   — never bare "stage" or "status" in cross-domain contexts.
 *
 * Domain authority: contracts/domain/AUTHORITY-MAP.md (LL-task-tracker)
 * See contracts/COMPATIBILITY.md in LL-task-tracker for the change policy.
 */

// ── Enums ─────────────────────────────────────────────────────────────────────

/**
 * Serialized values from Java AdminState enum (via @SerializedName).
 * These are the exact strings returned by the API — do not remap them.
 */
export type AdminState =
  | "Intake Review"
  | "Awaiting Engagement"
  | "Ready to Open"
  | "Ready for Lawyer"
  | "Waiting on Client"
  | "Opened"
  | "Active"
  | "Maintenance Lawyer Review"
  | "Maintenance Client Wait"
  | "Waiting on External"
  | "Closing Review"
  | "Closed"
  | "Archived"

export type AdminLifecycleStage =
  | "Onboarding"
  | "Opening"
  | "Maintenance"
  | "Closing"
  | "Archived"

export type AdminHealth = "Green" | "Amber" | "Red"

export type AdminHealthReasonCode =
  | "DUE_RISK"
  | "WAITING_STALE"
  | "CONTROL_INCOMPLETE"
  | "MISSING_ADMIN_STATE"
  | "MISSING_STAGE"
  | "MISSING_NEXT_ACTION_SUMMARY"
  | "MISSING_NEXT_ACTION_OWNER"
  | "MISSING_RESPONSIBLE_LAWYER"
  | "MISSING_WAITING_SINCE"
  | "MISSING_RESUME_TO_STATE"
  | "MISSING_EXPECTED_RESPONSE_AT"
  | "STAGE_STATE_MISMATCH"
  | "LAWYER_RESPONSE_STALE"
  | "EXTERNAL_RESPONSE_STALE"
  | "UNOWNED_ACTIVE_CASE"
  | "INVALID_RESUME_TARGET"
  | "MISSING_EXTERNAL_PARTY_REF"

export type AdminEventType =
  | "CASE_CREATED"
  | "STATE_CHANGED"
  | "STAGE_CHANGED"
  | "WAIT_STARTED"
  | "WAIT_RESUMED"
  | "NEXT_ACTION_SET"
  | "OWNER_ASSIGNED"
  | "LAWYER_HANDOFF_SENT"
  | "LAWYER_HANDOFF_RETURNED"
  | "OVERRIDE_APPLIED"
  | "CASE_OPENED"
  | "CASE_ACTIVATED"

export type NextActionOwnerType = "Admin" | "Lawyer" | "Client" | "External" | "System"

export type AdminTransition =
  | "submitIntakeReview"
  | "markAwaitingEngagement"
  | "markReadyToOpen"
  | "sendToLawyerReview"
  | "lawyerApproveOpen"
  | "lawyerReturnForFixes"
  | "startClientWait"
  | "resumeFromClientWait"
  | "activateMatter"
  | "updateMaintenanceControl"
  | "sendToMaintenanceLawyerReview"
  | "lawyerReturnToActive"
  | "startMaintenanceClientWait"
  | "resumeFromMaintenanceClientWait"
  | "startExternalWait"
  | "resumeFromExternalWait"
  | "lawyerRequestClientFollowup"
  | "lawyerRequestExternalFollowup"

export type CaseStatus = "open" | "closed"

/**
 * Canonical cross-domain Matter status projection.
 * fieldName: matterState
 * For newly created Matters: Pending
 * Domain owner: ll-task-tracker
 *
 * This is the simplified status for non-Matter-domain consumers.
 * The internal adminState field remains the authoritative operational granularity.
 * Spec: contracts/domain/vocabulary.yaml#MatterState
 */
export type MatterState = "Pending" | "Active" | "Closed" | "Archived"

// ── Component objects ─────────────────────────────────────────────────────────

export type CaseOwner = {
  id: string
  name?: string
  email?: string
  phone?: string
}

export type CaseAttribute = {
  name: string
  value: string
  type?: string
}

export type CaseDocument = {
  name?: string
  /** MIME type or document category */
  type?: string
  size?: string
  /** Present only in upload requests; omitted from list responses */
  base64?: string
}

export type CaseComment = {
  id?: string
  body?: string
  userName?: string
  userId?: string
  /** Set when this comment replies to another */
  parentId?: string
  createdAt?: string
  caseId?: string
}

export type AdminEvent = {
  eventType?: AdminEventType
  occurredAt?: string
  actorType?: string
  actorId?: string
  actorName?: string
  fromState?: string
  toState?: string
  fromStage?: string
  toStage?: string
  reasonCode?: string
  note?: string
}

// ── Primary domain object ──────────────────────────────────────────────────────

/**
 * A matter (case instance) as returned by the case engine.
 *
 * All lifecycle fields (adminState, adminHealth, nextAction*, waiting*, etc.) are
 * read-only from this consumer's perspective. Never derive permissions or action
 * eligibility from them — that is backend-owned logic.
 */
export type CaseInstance = {
  businessKey?: string
  caseDefinitionId?: string
  stage?: AdminLifecycleStage
  status?: CaseStatus
  owner?: CaseOwner
  comments?: CaseComment[]
  documents?: CaseDocument[]
  attributes?: CaseAttribute[]
  queueId?: string

  // Admin lifecycle — read-only display fields
  adminState?: AdminState
  adminHealth?: AdminHealth
  healthReasonCodes?: AdminHealthReasonCode[]
  healthEvaluatedAt?: string
  staleSince?: string
  malformedCase?: boolean
  adminOwnerId?: string
  adminOwnerName?: string
  responsibleLawyerId?: string
  responsibleLawyerName?: string
  nextActionOwnerType?: NextActionOwnerType
  nextActionOwnerRef?: string
  nextActionSummary?: string
  nextActionDueAt?: string
  waitingReasonCode?: string
  waitingReasonText?: string
  waitingSince?: string
  expectedResponseAt?: string
  externalPartyRef?: string
  resumeToState?: string
  lastStateChangedAt?: string
  openedAt?: string
  adminEvents?: AdminEvent[]

  // ── Domain vocabulary fields (added in contract 1.1.0) ─────────────────
  /**
   * Classification of the type of engagement. Set by the Matter domain only.
   * Does not define lifecycle stage or state.
   * PRODUCT is explicitly excluded.
   * fieldName: matterType
   */
  matterType?: string
  /**
   * Canonical cross-domain Matter status.
   * fieldName: matterState (spec-canonical)
   * Derived from adminState + status. For non-Matter-domain display use.
   * adminState remains the authoritative operational field.
   */
  matterState?: MatterState

  // ── Origin linkage (nullable — set only through explicit approved paths) ─
  /**
   * ID of the Opportunity this Matter was created from.
   * Null for Matters not created via CreateMatterFromOpportunity.
   */
  originOpportunityId?: string | null
  /**
   * Commercial Contact ID of the primary contact.
   * Null if not set at creation.
   */
  originContactId?: string | null
  /**
   * ProductOrder ID explicitly linked to this Matter.
   * Null by default. Set only via LinkProductOrderToMatter.
   * A ProductOrder does NOT create a Matter.
   */
  originProductOrderId?: string | null
}

// ── Task ──────────────────────────────────────────────────────────────────────

/** A Camunda human task associated with a case workflow. */
export type Task = {
  id?: string
  name?: string
  description?: string
  owner?: string
  assignee?: string
  priority?: string
  tenantId?: string
  executionId?: string
  processInstanceId?: string
  processDefinitionId?: string
  caseInstanceId?: string
  caseDefinitionId?: string
  taskDefinitionKey?: string
  formKey?: string
  created?: string
  due?: string
  followUp?: string
}

// ── Pagination ─────────────────────────────────────────────────────────────────

export type PageCursors = {
  /** Cursor for the previous page. Empty string when no previous page. */
  before: string
  /** Cursor for the next page. Empty string when no next page. */
  after: string
}

export type PageInfo = {
  hasNext: boolean
  hasPrevious: boolean
  cursors: PageCursors
}

export type Page<T> = {
  data: T[]
  paging: PageInfo
}

export type CaseInstancePage = Page<CaseInstance>

// ── Requests ───────────────────────────────────────────────────────────────────

/** Optional body for POST /case/{businessKey}/transition/{transitionName} */
export type AdminTransitionRequest = {
  note?: string
  nextActionOwnerType?: NextActionOwnerType
  nextActionOwnerRef?: string
  nextActionSummary?: string
  nextActionDueAt?: string
  waitingReasonCode?: string
  waitingReasonText?: string
  expectedResponseAt?: string
  externalPartyRef?: string
  resumeToState?: string
}

/** Query parameters for GET /case */
export type CaseListParams = {
  status?: CaseStatus
  caseDefinitionId?: string
  adminState?: AdminState
  adminHealth?: AdminHealth
  nextActionOwnerType?: NextActionOwnerType
  queueId?: string
  adminOwnerId?: string
  healthReasonCode?: AdminHealthReasonCode
  malformedCase?: string
  exceptionOnly?: string
  before?: string
  after?: string
  sort?: string
  limit?: string
}
