/**
 * Zod runtime validators for case engine API responses.
 *
 * Use these at the API adapter layer (src/lib/api/) to validate responses
 * from LL-task-tracker before passing data to the rest of the application.
 * This turns silent shape drift into loud, observable errors.
 *
 * Keep in sync with src/lib/contracts/index.ts.
 */

import { z } from "zod"

// ── Enums ─────────────────────────────────────────────────────────────────────

export const AdminStateSchema = z.enum([
  "Intake Review",
  "Awaiting Engagement",
  "Ready to Open",
  "Ready for Lawyer",
  "Waiting on Client",
  "Opened",
  "Active",
  "Maintenance Lawyer Review",
  "Maintenance Client Wait",
  "Waiting on External",
  "Closing Review",
  "Closed",
  "Archived",
])

export const AdminLifecycleStageSchema = z.enum([
  "Onboarding",
  "Opening",
  "Maintenance",
  "Closing",
  "Archived",
])

export const AdminHealthSchema = z.enum(["Green", "Amber", "Red"])

export const AdminHealthReasonCodeSchema = z.enum([
  "DUE_RISK",
  "WAITING_STALE",
  "CONTROL_INCOMPLETE",
  "MISSING_ADMIN_STATE",
  "MISSING_STAGE",
  "MISSING_NEXT_ACTION_SUMMARY",
  "MISSING_NEXT_ACTION_OWNER",
  "MISSING_RESPONSIBLE_LAWYER",
  "MISSING_WAITING_SINCE",
  "MISSING_RESUME_TO_STATE",
  "MISSING_EXPECTED_RESPONSE_AT",
  "STAGE_STATE_MISMATCH",
  "LAWYER_RESPONSE_STALE",
  "EXTERNAL_RESPONSE_STALE",
  "UNOWNED_ACTIVE_CASE",
  "INVALID_RESUME_TARGET",
  "MISSING_EXTERNAL_PARTY_REF",
])

export const AdminEventTypeSchema = z.enum([
  "CASE_CREATED",
  "STATE_CHANGED",
  "STAGE_CHANGED",
  "WAIT_STARTED",
  "WAIT_RESUMED",
  "NEXT_ACTION_SET",
  "OWNER_ASSIGNED",
  "LAWYER_HANDOFF_SENT",
  "LAWYER_HANDOFF_RETURNED",
  "OVERRIDE_APPLIED",
  "CASE_OPENED",
  "CASE_ACTIVATED",
])

export const NextActionOwnerTypeSchema = z.enum([
  "Admin",
  "Lawyer",
  "Client",
  "External",
  "System",
])

export const AdminTransitionSchema = z.enum([
  "submitIntakeReview",
  "markAwaitingEngagement",
  "markReadyToOpen",
  "sendToLawyerReview",
  "lawyerApproveOpen",
  "lawyerReturnForFixes",
  "startClientWait",
  "resumeFromClientWait",
  "activateMatter",
  "updateMaintenanceControl",
  "sendToMaintenanceLawyerReview",
  "lawyerReturnToActive",
  "startMaintenanceClientWait",
  "resumeFromMaintenanceClientWait",
  "startExternalWait",
  "resumeFromExternalWait",
  "lawyerRequestClientFollowup",
  "lawyerRequestExternalFollowup",
])

export const CaseStatusSchema = z.enum(["open", "closed"])

// ── Component objects ─────────────────────────────────────────────────────────

export const CaseOwnerSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
})

export const CaseAttributeSchema = z.object({
  name: z.string(),
  value: z.string(),
  type: z.string().optional(),
})

export const CaseDocumentSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  size: z.string().optional(),
  base64: z.string().optional(),
})

export const CaseCommentSchema = z.object({
  id: z.string().optional(),
  body: z.string().optional(),
  userName: z.string().optional(),
  userId: z.string().optional(),
  parentId: z.string().optional(),
  createdAt: z.string().optional(),
  caseId: z.string().optional(),
})

export const AdminEventSchema = z.object({
  eventType: AdminEventTypeSchema.optional(),
  occurredAt: z.string().optional(),
  actorType: z.string().optional(),
  actorId: z.string().optional(),
  actorName: z.string().optional(),
  fromState: z.string().optional(),
  toState: z.string().optional(),
  fromStage: z.string().optional(),
  toStage: z.string().optional(),
  reasonCode: z.string().optional(),
  note: z.string().optional(),
})

// ── Primary domain object ──────────────────────────────────────────────────────

export const CaseInstanceSchema = z.object({
  businessKey: z.string().optional(),
  caseDefinitionId: z.string().optional(),
  stage: AdminLifecycleStageSchema.optional(),
  status: CaseStatusSchema.optional(),
  owner: CaseOwnerSchema.optional(),
  comments: z.array(CaseCommentSchema).optional(),
  documents: z.array(CaseDocumentSchema).optional(),
  attributes: z.array(CaseAttributeSchema).optional(),
  queueId: z.string().optional(),
  adminState: AdminStateSchema.optional(),
  adminHealth: AdminHealthSchema.optional(),
  healthReasonCodes: z.array(AdminHealthReasonCodeSchema).optional(),
  healthEvaluatedAt: z.string().optional(),
  staleSince: z.string().optional(),
  malformedCase: z.boolean().optional(),
  adminOwnerId: z.string().optional(),
  adminOwnerName: z.string().optional(),
  responsibleLawyerId: z.string().optional(),
  responsibleLawyerName: z.string().optional(),
  nextActionOwnerType: NextActionOwnerTypeSchema.optional(),
  nextActionOwnerRef: z.string().optional(),
  nextActionSummary: z.string().optional(),
  nextActionDueAt: z.string().optional(),
  waitingReasonCode: z.string().optional(),
  waitingReasonText: z.string().optional(),
  waitingSince: z.string().optional(),
  expectedResponseAt: z.string().optional(),
  externalPartyRef: z.string().optional(),
  resumeToState: z.string().optional(),
  lastStateChangedAt: z.string().optional(),
  openedAt: z.string().optional(),
  adminEvents: z.array(AdminEventSchema).optional(),
  // Domain vocabulary fields (contract 1.1.0)
  matterType: z.string().optional(),
  matterState: z.enum(["Pending", "Active", "Closed", "Archived"]).optional(),
  originOpportunityId: z.string().nullable().optional(),
  originContactId: z.string().nullable().optional(),
  originProductOrderId: z.string().nullable().optional(),
})

// ── Task ──────────────────────────────────────────────────────────────────────

export const TaskSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  owner: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.string().optional(),
  tenantId: z.string().optional(),
  executionId: z.string().optional(),
  processInstanceId: z.string().optional(),
  processDefinitionId: z.string().optional(),
  caseInstanceId: z.string().optional(),
  caseDefinitionId: z.string().optional(),
  taskDefinitionKey: z.string().optional(),
  formKey: z.string().optional(),
  created: z.string().optional(),
  due: z.string().optional(),
  followUp: z.string().optional(),
})

// ── Pagination ────────────────────────────────────────────────────────────────

export const PageCursorsSchema = z.object({
  before: z.string(),
  after: z.string(),
})

export const PageInfoSchema = z.object({
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  cursors: PageCursorsSchema,
})

export const CaseInstancePageSchema = z.object({
  data: z.array(CaseInstanceSchema),
  paging: PageInfoSchema,
})

export const TaskListSchema = z.array(TaskSchema)

// ── Commercial domain Zod schemas ─────────────────────────────────────────────

export const OpportunityPipelineStageSchema = z.enum(["Intake", "Onboarding"])

export const OpportunityStatusSchema = z.enum([
  "Open",
  "Converted",
  "Closed Won",
  "Closed Lost",
])

export const ContactSchema = z.object({
  contactId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  sourceChannel: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  linkedOpportunityIds: z.array(z.string()).optional(),
  linkedMatterIds: z.array(z.string()).optional(),
})

export const OpportunitySchema = z.object({
  opportunityId: z.string(),
  primaryContactId: z.string(),
  opportunityPipelineStage: OpportunityPipelineStageSchema,
  opportunityStatus: OpportunityStatusSchema,
  matterType: z.string().optional(),
  originProductOrderId: z.string().nullable().optional(),
  matterId: z.string().nullable().optional(),
  qualificationNotes: z.string().optional(),
  assignedTo: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  convertedAt: z.string().nullable().optional(),
})

// ── Commerce domain Zod schemas ───────────────────────────────────────────────

export const ProductOrderStatusSchema = z.enum([
  "Created",
  "Pending Payment",
  "Paid",
  "Fulfillment Pending",
  "Fulfilled",
  "Cancelled",
  "Refunded",
])

export const PaymentStatusSchema = z.enum([
  "Unpaid",
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
  "Disputed",
])

export const FulfillmentStatusSchema = z.enum([
  "Pending",
  "In Progress",
  "Fulfilled",
  "Failed",
])

export const ProductTypeSchema = z.enum([
  "Document",
  "Consultation",
  "Template",
  "Service",
  "Other",
])

export const ProductSchema = z.object({
  productId: z.string(),
  productType: ProductTypeSchema,
  name: z.string(),
  description: z.string().optional(),
  priceAmount: z.number().optional(),
  priceCurrency: z.string().optional(),
  active: z.boolean().optional(),
})

export const ProductOrderSchema = z.object({
  productOrderId: z.string(),
  productId: z.string(),
  productType: ProductTypeSchema,
  productName: z.string().optional(),
  productOrderStatus: ProductOrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  fulfillmentStatus: FulfillmentStatusSchema,
  customerContactId: z.string().optional(),
  portalUserId: z.string().optional(),
  priceAmount: z.number().optional(),
  priceCurrency: z.string().optional(),
  sourceChannel: z.string().optional(),
  purchasedAt: z.string(),
  accessGrantedAt: z.string().nullable().optional(),
  originOpportunityId: z.string().nullable().optional(),
  convertedOpportunityId: z.string().nullable().optional(),
  convertedMatterId: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const ProductOrderListSchema = z.array(ProductOrderSchema)

// ── Conversion Zod schemas ────────────────────────────────────────────────────

export const MatterCreationResultSchema = z.object({
  matterId: z.string(),
  matterType: z.string().nullable().optional(),
  matterLifecycleStage: z.literal("Onboarding"),
  matterState: z.literal("Pending"),
  originOpportunityId: z.string(),
  originContactId: z.string().nullable().optional(),
  createdAt: z.string(),
  idempotent: z.boolean(),
})

export const ConversionErrorSchema = z.object({
  code: z.enum([
    "OPPORTUNITY_NOT_FOUND",
    "OPPORTUNITY_NOT_QUALIFIED",
    "OPPORTUNITY_ALREADY_CONVERTED",
    "MATTER_NOT_FOUND",
    "DUPLICATE_IDEMPOTENCY_KEY_CONFLICT",
    "AUTHORIZATION_DENIED",
    "VALIDATION_ERROR",
  ]),
  message: z.string(),
  idempotencyKey: z.string().nullable().optional(),
  existingMatterId: z.string().nullable().optional(),
})
