import { redirect } from "next/navigation"

// Closed until the conflict check clears (ML1 2026-10-22): no matter details before
// Levine Law confirms it can act. QuestionnaireClient is kept for the post-clearance step.
export default function QuestionnairePage() {
  redirect("/intake/catalog")
}
