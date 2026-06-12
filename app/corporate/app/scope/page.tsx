import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import {
  PortalBadge,
  PortalButton,
  PortalCard,
  PortalCardContent,
  PortalCardDescription,
  PortalCardHeader,
  PortalCardTitle,
  PortalEmptyState,
  PortalPageHeader,
  PortalStatCard,
} from "src/components/portal/PortalDesignSystem"
import { PortalWorkspaceShell } from "src/components/portal/PortalWorkspaceShell"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getAccessToken, getPortalSession, isClientPortalSession } from "src/lib/auth/session"
import { type CounselModel, getCounselProfile } from "src/lib/portal/counselProfileSource"
import { getMatterList } from "src/lib/portal/matterSource"

export const metadata: Metadata = { title: "Team / Contacts" }

export const dynamic = "force-dynamic"

function modelTone(model: CounselModel): "navy" | "gold" | "neutral" {
  switch (model) {
    case "Essential":
      return "neutral"
    case "Growth":
      return "navy"
    case "Strategic":
      return "gold"
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "long" })
}

export default async function ScopePage() {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/sign-in")
  if (!isClientPortalSession(session)) redirect("/intake")

  const accessToken = await getAccessToken()
  const { profile, isMock: profileMock } = getCounselProfile()
  const { matters, isMock: mattersMock } = await getMatterList(accessToken)

  const activeMatters = matters.filter((matter) => matter.matterState === "Active")
  const pendingMatters = matters.filter((matter) => matter.matterState === "Pending")

  return (
    <PortalWorkspaceShell active="team" session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Team / Contacts"
          title="Team / Contacts"
          description="Your Levine Law relationship contact, engagement context, and current work coverage."
          action={<PortalButton href="/corporate/app/requests/new">Open a matter</PortalButton>}
        />

        {profileMock || mattersMock ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            Preview data — connect live sources to show real relationship details.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <PortalStatCard
            label="Active matters"
            value={activeMatters.length}
            detail="Current matters in progress."
            tone="navy"
          />
          <PortalStatCard
            label="Pending matters"
            value={pendingMatters.length}
            detail="Awaiting review or opening."
            tone="gold"
          />
          <PortalStatCard
            label="Counsel model"
            value={profile.model}
            detail={`Since ${formatDate(profile.startedAt)}.`}
            tone="green"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Primary contact</PortalCardTitle>
              <PortalCardDescription>Your main Levine Law contact for portal matters.</PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <div className="flex items-start gap-4">
                <div className="bg-brand-navy flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  ML
                </div>
                <div>
                  <p className="text-lg font-semibold text-stone-950">{profile.lawyerName}</p>
                  <div className="mt-2">
                    <PortalBadge tone={modelTone(profile.model)}>{profile.model} Counsel</PortalBadge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone-600">{profile.description}</p>
                </div>
              </div>
            </PortalCardContent>
          </PortalCard>

          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>What is covered</PortalCardTitle>
              <PortalCardDescription>Current relationship scope shown for orientation.</PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <ul className="grid gap-3 md:grid-cols-2">
                {profile.scopeItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-6 text-stone-700"
                  >
                    <span className="bg-brand-navy mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </PortalCardContent>
          </PortalCard>
        </div>

        <PortalCard>
          <PortalCardHeader
            action={
              <PortalButton href="/corporate/app/matters" tone="secondary">
                All matters
              </PortalButton>
            }
          >
            <PortalCardTitle>Current work coverage</PortalCardTitle>
            <PortalCardDescription>Active and pending matters connected to your workspace.</PortalCardDescription>
          </PortalCardHeader>
          <PortalCardContent>
            {activeMatters.length + pendingMatters.length === 0 ? (
              <PortalEmptyState
                title="No current matters"
                description="Accepted matters and pending work will appear here once available."
                action={<PortalButton href="/corporate/app/requests/new">Open a matter</PortalButton>}
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {[...activeMatters, ...pendingMatters].map((matter, index) => {
                  const key = matter.businessKey ?? `matter-${index}`
                  return (
                    <Link
                      key={key}
                      href={`/corporate/app/matters/${encodeURIComponent(key)}`}
                      className="hover:border-brand-navy/30 rounded-lg border border-stone-200 bg-white px-4 py-4 transition hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-stone-950">{key}</p>
                          {matter.matterType ? (
                            <p className="mt-1 text-sm text-stone-500">{matter.matterType}</p>
                          ) : null}
                        </div>
                        {matter.matterState ? (
                          <PortalBadge tone={matter.matterState === "Active" ? "navy" : "gold"}>
                            {matter.matterState}
                          </PortalBadge>
                        ) : null}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </PortalCardContent>
        </PortalCard>
      </div>
    </PortalWorkspaceShell>
  )
}
