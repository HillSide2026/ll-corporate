import type { Metadata } from "next"

import { PortalEntry } from "src/components/portal/PortalEntry"
import { isPreviewPortalAccessEnabled } from "src/lib/auth/config"

export const metadata: Metadata = {
  title: "Corporate Portal",
  description: "Secure Levine LLP client portal access for corporate matters, documents, and requests.",
}

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function CorporatePortalPage({ searchParams }: PageProps) {
  const params = await searchParams
  const authError = typeof params?.error === "string" ? params.error : undefined

  return <PortalEntry authError={authError} previewAccessEnabled={isPreviewPortalAccessEnabled()} />
}
