/**
 * Party identity and linkage types.
 *
 * Defines how people/entities are identified and linked across system boundaries.
 * Cross-domain joins must use explicit linkage fields — never ad hoc name/email matching.
 *
 * Canonical spec: contracts/domain/AUTHORITY-MAP.md (LL-task-tracker)
 *
 * Role semantics:
 * - Contact: commercial identity (marketing/CRM system)
 * - Customer: party that has completed a product purchase (Commerce domain)
 * - Client: party associated with an active Matter (Matter domain)
 *
 * These roles are NOT automatically interchangeable.
 * A person may hold multiple roles simultaneously.
 * Do not collapse them into a single "user" type.
 */

// ── Roles ─────────────────────────────────────────────────────────────────────

/** All business roles a party may hold. Not mutually exclusive. */
export type PartyRole = "Contact" | "Customer" | "Client"

// ── Party identity carriers ───────────────────────────────────────────────────

/**
 * Portal identity — the authenticated user as seen by ll-corporate.
 * Source: Keycloak JWT (subject claim).
 * This is authentication identity, not business role identity.
 */
export type PortalIdentity = {
  /** Keycloak subject — stable authentication identity. */
  subject: string
  displayName?: string
  email?: string
}

/**
 * Commercial identity — a Contact in the commercial/CRM system.
 * Source: marketing/commercial system.
 * Not automatically equivalent to a portal user.
 */
export type CommercialIdentity = {
  contactId: string
  email?: string
  firstName?: string
  lastName?: string
}

/**
 * Cross-system identity reference.
 * Stores known IDs for a single real-world party across all systems.
 * All fields optional — a party may exist in some systems and not others.
 *
 * Used to resolve "who is this person across all our systems" without
 * collapsing the separate role identities.
 */
export type CrossSystemPartyRef = {
  /** Keycloak subject (portal auth identity). */
  portalUserId?: string
  /** Contact ID in the commercial/CRM system. */
  contactId?: string
  /** Business key of a Matter in ll-task-tracker (if this party is a Client). */
  matterId?: string
  /** ProductOrder IDs in the commerce system (if this party is a Customer). */
  productOrderIds?: string[]
  /**
   * Roles this party currently holds.
   * Populated from known system memberships — not inferred from single fields.
   */
  roles?: PartyRole[]
}

// ── Linkage fields ────────────────────────────────────────────────────────────

/**
 * Origin linkage carried on a Matter (CaseInstance) after conversion.
 * All fields optional — set only through explicit approved conversion paths.
 */
export type MatterOriginLinkage = {
  /** ID of the Opportunity this Matter was created from. */
  originOpportunityId?: string | null
  /** Commercial Contact ID of the primary contact. */
  originContactId?: string | null
  /** ProductOrder ID explicitly linked to this Matter (not the cause of creation). */
  originProductOrderId?: string | null
}

/**
 * Origin linkage carried on a ProductOrder.
 * All fields optional — set only through explicit approved conversion/link paths.
 */
export type ProductOrderLinkage = {
  /** Set if ProductOrder was sourced from an Opportunity. */
  originOpportunityId?: string | null
  /** Set after CreateOpportunityFromProductOrder command. Null by default. */
  convertedOpportunityId?: string | null
  /** Set after LinkProductOrderToMatter command. Null by default. */
  convertedMatterId?: string | null
}

/**
 * Linkage carried on an Opportunity.
 */
export type OpportunityLinkage = {
  /** Commercial Contact this Opportunity is for. */
  primaryContactId: string
  /** Set if Opportunity was sourced from a ProductOrder. */
  originProductOrderId?: string | null
  /** Set after CreateMatterFromOpportunity conversion. Null until converted. */
  matterId?: string | null
}
