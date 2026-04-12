/**
 * Cross-domain conversion command and event types.
 *
 * All cross-domain object transitions use these explicit contracts.
 * Implicit stage sync and implicit Matter creation are prohibited.
 *
 * Canonical spec: contracts/domain/conversions.yaml (LL-task-tracker)
 *
 * Rules:
 * - All commands are idempotent (idempotencyKey required).
 * - Canonical object creation completes first in the owning domain.
 * - Backlink updates are secondary and retryable.
 * - Backlink failure must never cause duplicate canonical object creation.
 * - requestedBy is required on all commands (audit identity).
 */

// ── Commands ──────────────────────────────────────────────────────────────────

/**
 * Explicit command to create a Matter from a qualified Opportunity.
 * Issues to POST /matter/from-opportunity on ll-task-tracker.
 *
 * Idempotent: duplicate requests with the same idempotencyKey return the existing Matter.
 * On success: OpportunityConvertedToMatterEvent is emitted.
 */
export type CreateMatterFromOpportunityCommand = {
  opportunityId: string
  primaryContactId: string
  /**
   * Caller-supplied stable key. Recommend using opportunityId.
   * Duplicates return the existing Matter rather than creating a new one.
   */
  idempotencyKey: string
  /** Optional initial Matter type classification. Set by Matter domain if not provided. */
  matterType?: string | null
  /** Authenticated user or service identity initiating the command. */
  requestedBy: string
  notes?: string | null
}

/**
 * Explicit command to create a commercial Opportunity from a ProductOrder.
 * Issues to the commercial system's intake API.
 *
 * Requires a separate engagement decision — ProductOrder does NOT automatically
 * create an Opportunity.
 * On success: ProductOrderConvertedToOpportunityEvent is emitted.
 */
export type CreateOpportunityFromProductOrderCommand = {
  productOrderId: string
  primaryContactId: string
  idempotencyKey: string
  requestedBy: string
  notes?: string | null
}

/**
 * Explicit command to associate an existing ProductOrder with an existing Matter.
 * Issues to POST /case/{businessKey}/link-product-order/{productOrderId} on ll-task-tracker.
 *
 * Does NOT create a Matter.
 * Does NOT allow ProductOrder status to affect Matter state.
 * On success: ProductOrderLinkedToMatterEvent is emitted.
 */
export type LinkProductOrderToMatterCommand = {
  productOrderId: string
  /** The Matter's businessKey in ll-task-tracker. */
  matterId: string
  idempotencyKey: string
  /** Nature of the link (e.g. "related_service", "associated_product"). */
  linkType?: string
  requestedBy: string
}

// ── Events ────────────────────────────────────────────────────────────────────

/**
 * Domain event emitted after successful CreateMatterFromOpportunity.
 * Kafka topic: opportunity-converted-to-matter (published by ll-task-tracker)
 *
 * On receipt:
 * - Commercial system records matterId on the Opportunity.
 * - Opportunity opportunityStatus transitions to "Converted".
 */
export type OpportunityConvertedToMatterEvent = {
  eventId: string
  opportunityId: string
  /** The new Matter's businessKey. Use as canonical identifier. */
  matterId: string
  /** Always "Onboarding" for newly created Matters. */
  matterLifecycleStage: "Onboarding"
  /** Always "Pending" for newly created Matters. */
  matterState: "Pending"
  originContactId?: string | null
  requestedBy?: string
  idempotencyKey?: string
  occurredAt: string
  /** True if this was an idempotent replay of an existing conversion. */
  idempotent?: boolean
}

/**
 * Domain event emitted after successful CreateOpportunityFromProductOrder.
 * Kafka topic: product-order-converted-to-opportunity (published by commercial system)
 *
 * On receipt:
 * - ll-corporate records convertedOpportunityId on the ProductOrder.
 * - No Matter exists at this point.
 */
export type ProductOrderConvertedToOpportunityEvent = {
  eventId: string
  productOrderId: string
  /** The new Opportunity's ID in the commercial system. */
  opportunityId: string
  primaryContactId?: string | null
  requestedBy?: string
  idempotencyKey?: string
  occurredAt: string
}

/**
 * Domain event emitted after successful LinkProductOrderToMatter.
 * Kafka topic: product-order-linked-to-matter (published by ll-task-tracker)
 *
 * On receipt:
 * - ll-corporate records convertedMatterId on the ProductOrder.
 * - This link does NOT imply the ProductOrder created the Matter.
 * - This link does NOT permit ProductOrder status to influence Matter state.
 */
export type ProductOrderLinkedToMatterEvent = {
  eventId: string
  productOrderId: string
  matterId: string
  linkType?: string | null
  requestedBy?: string
  idempotencyKey?: string
  occurredAt: string
}

// ── Conversion results ────────────────────────────────────────────────────────

/**
 * Response from POST /matter/from-opportunity.
 * Contains the Matter identity and initial state for backlink recording.
 */
export type MatterCreationResult = {
  matterId: string
  matterType?: string | null
  /** Always "Onboarding". */
  matterLifecycleStage: "Onboarding"
  /** Always "Pending". */
  matterState: "Pending"
  originOpportunityId: string
  originContactId?: string | null
  createdAt: string
  /** True if an existing Matter was returned due to idempotency key match. */
  idempotent: boolean
}

/**
 * Error response for failed conversion commands.
 * existingMatterId is present when OPPORTUNITY_ALREADY_CONVERTED —
 * use it to retrieve the existing Matter rather than retrying.
 */
export type ConversionError = {
  code:
    | "OPPORTUNITY_NOT_FOUND"
    | "OPPORTUNITY_NOT_QUALIFIED"
    | "OPPORTUNITY_ALREADY_CONVERTED"
    | "MATTER_NOT_FOUND"
    | "DUPLICATE_IDEMPOTENCY_KEY_CONFLICT"
    | "AUTHORIZATION_DENIED"
    | "VALIDATION_ERROR"
  message: string
  idempotencyKey?: string | null
  existingMatterId?: string | null
}
