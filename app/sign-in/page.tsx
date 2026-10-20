import type { Metadata } from "next"

import { PortalEntry } from "src/components/portal/PortalEntry"
import { isPreviewPortalAccessEnabled } from "src/lib/auth/config"

export const metadata: Metadata = {
  title: "Sign In — Levine Law",
  description: "Sign in to the Levine Law client portal.",
}

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams
  const authError = typeof params?.error === "string" ? params.error : undefined

  return <PortalEntry authError={authError} previewAccessEnabled={isPreviewPortalAccessEnabled()} />
}
