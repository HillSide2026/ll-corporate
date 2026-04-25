import { redirect } from "next/navigation"

import { PortalShell } from "src/components/portal/PortalShell"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"

export const dynamic = "force-dynamic"

export default function PreviewPortalPage() {
  if (!isPreviewPortalAccessEnabled()) {
    redirect("/corporate?error=PreviewAccessDisabled")
  }

  return <PortalShell previewMode session={getPreviewPortalSession()} />
}
