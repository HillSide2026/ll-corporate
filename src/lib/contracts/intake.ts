import { z } from "zod"

import { type PortalIdentity } from "src/lib/auth/session"
import {
  type CorporateService,
  getServicePriceDisplay,
  type ServicePriceType,
  type ServiceSlug,
} from "src/lib/services/catalog"

export const IntakeRequestSourceSchema = z.literal("ll-corporate")

export const IntakeClientIdentitySchema = z.object({
  subject: z.string().min(1),
  displayName: z.string().optional(),
  email: z.string().email().optional(),
})

export const IntakePricingSnapshotSchema = z.object({
  priceType: z.enum(["fixed", "estimate", "quote"]),
  price: z.string().optional(),
  priceDisplay: z.string().min(1),
})

export const IntakeRequestContractSchema = z.object({
  serviceSlug: z.string().min(1),
  serviceTitle: z.string().min(1),
  clientIdentity: IntakeClientIdentitySchema,
  pricingSnapshot: IntakePricingSnapshotSchema,
  scopeSnapshot: z.array(z.string().min(1)).min(1),
  assumptionsSnapshot: z.array(z.string().min(1)).min(1),
  inputPayload: z.record(z.string(), z.unknown()),
  engagementAcknowledgedAt: z.string().datetime(),
  source: IntakeRequestSourceSchema,
  createdAt: z.string().datetime(),
})

export type IntakeRequestSource = z.infer<typeof IntakeRequestSourceSchema>

export type IntakeClientIdentity = z.infer<typeof IntakeClientIdentitySchema>

export type IntakePricingSnapshot = {
  priceType: ServicePriceType
  price?: string
  priceDisplay: string
}

export type IntakeRequestContract = z.infer<typeof IntakeRequestContractSchema> & {
  serviceSlug: ServiceSlug
  pricingSnapshot: IntakePricingSnapshot
}

type CreateIntakeRequestContractParams = {
  service: CorporateService
  clientIdentity: PortalIdentity
  inputPayload: Record<string, unknown>
  engagementAcknowledgedAt: string
  createdAt: string
}

export function validateIntakeRequestContract(value: unknown) {
  return IntakeRequestContractSchema.safeParse(value)
}

export function createIntakeRequestContract({
  clientIdentity,
  createdAt,
  engagementAcknowledgedAt,
  inputPayload,
  service,
}: CreateIntakeRequestContractParams): IntakeRequestContract {
  return {
    serviceSlug: service.slug,
    serviceTitle: service.title,
    clientIdentity,
    pricingSnapshot: {
      priceType: service.priceType,
      price: service.price,
      priceDisplay: getServicePriceDisplay(service),
    },
    scopeSnapshot: [...service.scope],
    assumptionsSnapshot: [...service.assumptions],
    inputPayload,
    engagementAcknowledgedAt,
    source: "ll-corporate",
    createdAt,
  }
}
