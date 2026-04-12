/**
 * Commercial domain types — ll-corporate consumer side.
 *
 * Domain owner: marketing/commercial system
 * Objects: Contact, Opportunity
 * Canonical spec: contracts/domain/objects.yaml (LL-task-tracker)
 *
 * Rules:
 * - ll-corporate consumes these from the commercial system API.
 *   It does NOT own these objects and may not write their canonical fields.
 * - Do NOT derive Matter lifecycle or state from these types.
 * - opportunityPipelineStage is commercial vocabulary ONLY — not Matter lifecycle.
 * - matterId on Opportunity is a read-only backlink; Matter is owned by ll-task-tracker.
 */

// ── Enums ─────────────────────────────────────────────────────────────────────

/**
 * Commercial-only pipeline progression stage for an Opportunity.
 * fieldName: opportunityPipelineStage
 *
 * These are pipeline stages, NOT Matter lifecycle stages.
 * "Onboarding" here is commercial relationship activation — distinct from
 * Matter lifecycle stage "Onboarding" in the Matter domain.
 */
export type OpportunityPipelineStage = "Intake" | "Onboarding"

export type OpportunityStatus = "Open" | "Converted" | "Closed Won" | "Closed Lost"

// ── Objects ───────────────────────────────────────────────────────────────────

/**
 * Commercial identity record for a person or entity.
 * Domain owner: marketing/commercial system
 * Creates a Matter: No
 */
export type Contact = {
  contactId: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  companyName?: string
  /** Acquisition channel (website, referral, organic, etc.) */
  sourceChannel?: string
  createdAt?: string
  updatedAt?: string
  /** IDs of Opportunities associated with this Contact */
  linkedOpportunityIds?: string[]
  /** Matter IDs (businessKey) linked through converted Opportunities. Read-only. */
  linkedMatterIds?: string[]
}

/**
 * A commercial engagement opportunity moving through a commercial pipeline.
 * Domain owner: marketing/commercial system
 *
 * An Opportunity is NOT a Matter.
 * opportunityPipelineStage is commercial vocabulary — not Matter lifecycle.
 * matterId is null until CreateMatterFromOpportunity conversion occurs.
 */
export type Opportunity = {
  opportunityId: string
  primaryContactId: string
  /** Commercial pipeline stage. Commercial vocabulary only — not Matter lifecycle. */
  opportunityPipelineStage: OpportunityPipelineStage
  opportunityStatus: OpportunityStatus
  /**
   * Anticipated Matter type if this Opportunity converts.
   * For display/routing purposes only — does NOT create a Matter.
   * The actual matterType is set by the Matter domain (ll-task-tracker) at creation.
   */
  matterType?: string
  /**
   * Set if this Opportunity was sourced from a ProductOrder via
   * CreateOpportunityFromProductOrder. Null for direct Opportunities.
   */
  originProductOrderId?: string | null
  /**
   * Set after successful CreateMatterFromOpportunity conversion.
   * References the Matter's businessKey in ll-task-tracker.
   * Null until conversion. Read-only after set — Matter is owned by ll-task-tracker.
   */
  matterId?: string | null
  qualificationNotes?: string
  assignedTo?: string
  createdAt?: string
  updatedAt?: string
  convertedAt?: string | null
}
