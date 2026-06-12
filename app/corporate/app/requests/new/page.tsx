import type { Metadata } from "next"
import { redirect } from "next/navigation"

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
import { getPortalSession, isClientPortalSession } from "src/lib/auth/session"
import { submitMatterRequest } from "./actions"

export const metadata: Metadata = { title: "Open a Matter" }

export const dynamic = "force-dynamic"

type NewRequestPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function NewMatterRequestPage({ searchParams }: NewRequestPageProps) {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/sign-in")
  if (!isClientPortalSession(session)) redirect("/intake")

  const sp = await searchParams
  const hasError = sp.error === "1"

  return (
    <PortalWorkspaceShell active="requests" session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Requests"
          title="Open a matter"
          description="Describe what your business needs. Levine Law will review and follow up with whether it fits within your existing counsel scope or requires a separate engagement."
          action={
            <PortalButton href="/corporate/app/requests" tone="secondary">
              All requests
            </PortalButton>
          }
        />

        {hasError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Please fill in all required fields before submitting.
          </div>
        ) : null}

        <form action={submitMatterRequest} className="space-y-5">
          {/* Category */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Category</PortalCardTitle>
              <PortalCardDescription>Select the area that best describes your need.</PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {(["Corporate", "Contract", "Financial Services"] as const).map((cat) => (
                  <label
                    key={cat}
                    className="hover:border-brand-navy/30 flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 transition"
                  >
                    <input type="radio" name="category" value={cat} required className="accent-brand-navy h-4 w-4" />
                    <span className="text-sm font-medium text-stone-700">{cat}</span>
                  </label>
                ))}
              </div>
            </PortalCardContent>
          </PortalCard>

          {/* Description */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Describe your need</PortalCardTitle>
              <PortalCardDescription>
                Include the business context, timing, and what you need Levine Law to review.
              </PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <label>
                <span className="mb-1.5 block text-sm font-medium text-stone-700">Description</span>
                <textarea
                  name="description"
                  rows={7}
                  required
                  minLength={10}
                  placeholder="E.g. We are raising a seed round and need to update our shareholders agreement, issue new shares to investors, and confirm our option pool structure."
                  className="focus:border-brand-navy focus:ring-brand-navy w-full resize-y rounded-md border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:outline-none"
                />
              </label>
              <p className="mt-2 text-xs text-stone-400">Minimum 10 characters.</p>
            </PortalCardContent>
          </PortalCard>

          {/* Optional attachment */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Supporting document</PortalCardTitle>
              <PortalCardDescription>
                Optionally attach context for this request. PDF, DOCX, or image, 10 MB max.
              </PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <input
                type="file"
                name="attachment"
                accept=".pdf,.docx,image/*"
                className="block text-sm text-stone-600 file:mr-3 file:rounded-md file:border file:border-stone-300 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-stone-700 file:transition-colors file:hover:bg-stone-50"
              />
            </PortalCardContent>
          </PortalCard>

          {/* Acknowledgement + submit */}
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Acknowledgement</PortalCardTitle>
              <PortalCardDescription>
                Submitting this request opens a review workflow. It does not confirm a new engagement or billing.
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
                <span className="text-sm leading-6 text-stone-700">
                  I understand this is a request for review, not a confirmed engagement.
                </span>
              </label>
              <button
                type="submit"
                className="bg-brand-navy hover:bg-brand-navy-dark mt-6 rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors"
              >
                Submit matter request
              </button>
            </PortalCardContent>
          </PortalCard>
        </form>
      </div>
    </PortalWorkspaceShell>
  )
}
