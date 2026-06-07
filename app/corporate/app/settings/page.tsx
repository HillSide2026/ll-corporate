import type { Metadata } from "next"
import { redirect } from "next/navigation"

import {
  PortalBadge,
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

export const metadata: Metadata = { title: "Settings" }

export default async function SettingsPage() {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)
  if (!session) redirect("/sign-in")

  return (
    <PortalWorkspaceShell active="settings" session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Settings"
          title="Settings"
          description="Review your portal profile and security context. Preference changes will be enabled after backend account settings are approved."
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Profile</PortalCardTitle>
              <PortalCardDescription>
                Identity information provided by the portal sign-in session.
              </PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">Display name</dt>
                  <dd className="mt-1 text-sm font-medium text-stone-950">
                    {session.identity.displayName ?? "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">Email</dt>
                  <dd className="mt-1 text-sm font-medium text-stone-950">
                    {session.identity.email ?? "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">Portal subject</dt>
                  <dd className="mt-1 text-sm font-medium break-all text-stone-950">{session.identity.subject}</dd>
                </div>
              </dl>
            </PortalCardContent>
          </PortalCard>

          <PortalCard>
            <PortalCardHeader>
              <PortalCardTitle>Security</PortalCardTitle>
              <PortalCardDescription>
                Account security is managed by Levine Law portal identity configuration.
              </PortalCardDescription>
            </PortalCardHeader>
            <PortalCardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-stone-950">Authentication</p>
                    <p className="mt-1 text-xs text-stone-500">
                      Keycloak-backed identity is the intended production source of truth.
                    </p>
                  </div>
                  <PortalBadge tone="navy">Managed</PortalBadge>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-stone-950">Notifications</p>
                    <p className="mt-1 text-xs text-stone-500">
                      Portal notification preferences require backend approval before activation.
                    </p>
                  </div>
                  <PortalBadge>Planned</PortalBadge>
                </div>
              </div>
            </PortalCardContent>
          </PortalCard>
        </div>
      </div>
    </PortalWorkspaceShell>
  )
}
