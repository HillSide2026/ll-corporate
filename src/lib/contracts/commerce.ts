/**
 * Commerce domain types — ll-corporate consumer and serving surface.
 *
 * Domain owner: commerce backend / ll-corporate serving surface
 * Objects: Product, ProductOrder
 * Canonical spec: contracts/domain/objects.yaml (LL-task-tracker)
 *
 * Rules:
 * - productOrderStatus MUST NOT reuse Matter lifecycle or Matter state terminology.
 * - A ProductOrder is NOT a Matter.
 * - A ProductOrder does NOT create a Matter by default.
 * - convertedMatterId is null unless set via explicit LinkProductOrderToMatter command.
 * - Do NOT derive Matter state or lifecycle from ProductOrder status.
 */

// ── Enums ─────────────────────────────────────────────────────────────────────

/**
 * Commerce-only order progression status.
 * fieldName: productOrderStatus
 *
 * These are NOT Matter lifecycle stages. NOT Matter states.
 * NOT Opportunity pipeline stages.
 */
export type ProductOrderStatus =
  | "Created"
  | "Pending Payment"
  | "Paid"
  | "Fulfillment Pending"
  | "Fulfilled"
  | "Cancelled"
  | "Refunded"

export type PaymentStatus = "Unpaid" | "Pending" | "Paid" | "Failed" | "Refunded" | "Disputed"

export type FulfillmentStatus = "Pending" | "In Progress" | "Fulfilled" | "Failed"

export type ProductType = "Document" | "Consultation" | "Template" | "Service" | "Other"

// ── Objects ───────────────────────────────────────────────────────────────────

export type Product = {
  productId: string
  productType: ProductType
  name: string
  description?: string
  priceAmount?: number
  priceCurrency?: string
  active?: boolean
}

/**
 * A standalone product purchase made through the portal.
 * Domain owner: commerce backend / ll-corporate serving surface
 *
 * NOT a Matter. Does NOT create a Matter by default.
 * productOrderStatus uses Commerce vocabulary only.
 *
 * Origin linkage fields (originOpportunityId, convertedOpportunityId,
 * convertedMatterId) are nullable and set only through explicit approved paths.
 */
export type ProductOrder = {
  productOrderId: string
  productId: string
  productType: ProductType
  productName?: string
  /** Commerce-only status. Must never reuse Matter lifecycle or Matter state values. */
  productOrderStatus: ProductOrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  /** Reference to the commercial Contact identity of the purchaser. */
  customerContactId?: string
  /** Portal user identity (Keycloak subject). May differ from customerContactId. */
  portalUserId?: string
  priceAmount?: number
  priceCurrency?: string
  sourceChannel?: string
  purchasedAt: string
  /** When fulfillment/access was granted. Null until fulfilled. */
  accessGrantedAt?: string | null

  // ── Cross-domain linkage fields ─────────────────────────────────────────
  // All nullable. Set only through explicit approved conversion paths.

  /**
   * Set if this ProductOrder was sourced from an Opportunity.
   * Null for direct purchases.
   */
  originOpportunityId?: string | null
  /**
   * Set after CreateOpportunityFromProductOrder command succeeds.
   * Null by default. A ProductOrder does NOT automatically create an Opportunity.
   */
  convertedOpportunityId?: string | null
  /**
   * Set after LinkProductOrderToMatter command succeeds.
   * Null by default. A ProductOrder does NOT create a Matter.
   * Does not permit ProductOrder status to influence Matter state.
   */
  convertedMatterId?: string | null

  createdAt?: string
  updatedAt?: string
}

/**
 * Customer role — a party that has completed a product purchase.
 * Not automatically equivalent to a Contact (commercial) or Client (matter).
 */
export type Customer = {
  portalUserId: string
  /** May be linked to a commercial Contact, but not automatically equivalent. */
  contactId?: string | null
  displayName?: string
  email?: string
}
