import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import {
  PortalButton,
  PortalCard,
  PortalCardContent,
  PortalCardDescription,
  PortalCardHeader,
  PortalCardTitle,
  PortalPageHeader,
} from "src/components/portal/PortalDesignSystem"
import { PortalWorkspaceShell } from "src/components/portal/PortalWorkspaceShell"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { submitServiceRequest } from "src/lib/services/actions"
import { getServiceBySlug, getServicePriceDisplay } from "src/lib/services/catalog"

type ServiceRequestPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: ServiceRequestPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return { title: "Service Request" }
  }

  return {
    title: `Request ${service.title}`,
    description: `Submit a request for ${service.title} through the Levine Law client portal.`,
  }
}

export default async function ServiceRequestPage({ params }: ServiceRequestPageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <PortalWorkspaceShell active="requests" session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Request service"
          title={service.title}
          description={service.description}
          action={
            <PortalButton href="/corporate/app/requests" tone="secondary">
              All requests
            </PortalButton>
          }
        />

        {/* Service summary */}
        <div className="grid gap-4 md:grid-cols-2">
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Pricing and turnaround</PortalCardTitle>
            </PortalCardHeader>
            <PortalCardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">Pricing snapshot</dt>
                  <dd className="mt-1 text-sm text-stone-600">{getServicePriceDisplay(service)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">Turnaround</dt>
                  <dd className="mt-1 text-sm text-stone-600">{service.turnaround}</dd>
                </div>
              </dl>
            </PortalCardContent>
          </PortalCard>

          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Scope</PortalCardTitle>
            </PortalCardHeader>
            <PortalCardContent>
              <ul className="space-y-2">
                {service.scope.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-stone-500">
                    <span className="bg-brand-navy mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </PortalCardContent>
          </PortalCard>
        </div>

        {/* Assumptions */}
        <PortalCard>
          <PortalCardHeader>
            <PortalCardTitle>Assumptions and exclusions</PortalCardTitle>
          </PortalCardHeader>
          <PortalCardContent>
            <ul className="space-y-2">
              {service.assumptions.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-stone-500">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                  {item}
                </li>
              ))}
            </ul>
          </PortalCardContent>
        </PortalCard>

        {/* Request form */}
        <form action={submitServiceRequest} className="space-y-5">
          <input type="hidden" name="serviceSlug" value={service.slug} />

          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Provide required information</PortalCardTitle>
              <PortalCardDescription>
                Fill in the fields below so Levine Law can review the request.
              </PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <div className="space-y-5">
                {service.requiredInputs.map((label, index) => (
                  <div key={index}>
                    <label htmlFor={`field_${index}`} className="mb-1.5 block text-sm font-medium text-stone-700">
                      {label}
                    </label>
                    <textarea
                      id={`field_${index}`}
                      name={`field_${index}`}
                      rows={2}
                      required
                      className="focus:border-brand-navy focus:ring-brand-navy w-full resize-y rounded-md border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </PortalCardContent>
          </PortalCard>

          {/* Optional attachment */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Supporting document</PortalCardTitle>
              <PortalCardDescription>
                Optionally attach a relevant document. PDF, DOCX, or image, 10 MB max.
              </PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <input
                type="file"
                name="attachment"
                accept=".pdf,.docx,image/*"
                className="block text-sm text-stone-600 file:mr-3 file:rounded file:border file:border-stone-300 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-stone-700 file:transition-colors file:hover:bg-stone-50"
              />
            </PortalCardContent>
          </PortalCard>

          {/* Acknowledgement + submit */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Acknowledgement</PortalCardTitle>
              <PortalCardDescription>
                Submitting this request does not mean work has started. Levine Law will confirm next steps before
                proceeding.
              </PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-4">
                <input
                  type="checkbox"
                  name="acknowledged"
                  required
                  className="accent-brand-navy mt-0.5 h-4 w-4 shrink-0"
                />
                <span className="text-sm text-stone-700">
                  I understand the scope and assumptions above, and that this is a request for review — not a confirmed
                  engagement.
                </span>
              </label>

              <button
                type="submit"
                className="bg-brand-navy hover:bg-brand-navy-dark mt-6 rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                {service.ctaLabel}
              </button>
            </PortalCardContent>
          </PortalCard>
        </form>
      </div>
    </PortalWorkspaceShell>
  )
}
