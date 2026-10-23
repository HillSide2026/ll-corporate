import type { LeadService } from "src/lib/services/leadServices"

export type ScreeningAnswers = Record<string, string>

/**
 * Reads a service's routing questions from the conflict check form. Every question must
 * be answered with one of its options; returns null if any is missing or not an option.
 */
export function parseScreening(service: LeadService, formData: FormData): ScreeningAnswers | null {
  const answers: ScreeningAnswers = {}
  for (const question of service.screening ?? []) {
    const value = String(formData.get(`screening.${question.name}`) ?? "")
    if (!question.options.includes(value)) return null
    answers[question.name] = value
  }
  return answers
}
