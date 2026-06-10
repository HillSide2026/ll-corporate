import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { IntakeShell } from "src/components/intake/IntakeShell"
import { QuestionnaireClient } from "src/components/intake/QuestionnaireClient"
import { getServiceBySlug } from "src/lib/services/catalog"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  return { title: service ? `Intake — ${service.title}` : "Intake" }
}

export default async function QuestionnairePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  return (
    <IntakeShell active="questionnaire">
      <QuestionnaireClient service={service} />
    </IntakeShell>
  )
}
