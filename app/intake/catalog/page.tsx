import type { Metadata } from "next"

import { IntakeShell } from "src/components/intake/IntakeShell"
import { CatalogClient } from "src/components/intake/CatalogClient"

export const metadata: Metadata = { title: "Browse" }

export default function CatalogPage() {
  return (
    <IntakeShell active="browse">
      <CatalogClient />
    </IntakeShell>
  )
}
