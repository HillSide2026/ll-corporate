import { redirect } from "next/navigation"

// Closed until the conflict check clears (ML1 2026-10-22): no click-to-accept engagement
// before Levine Law confirms it can act. EngagementClient is kept for the post-clearance step.
export default function EngagementPage() {
  redirect("/intake/catalog")
}
