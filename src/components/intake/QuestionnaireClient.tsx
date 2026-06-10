"use client"

import { useState } from "react"
import Link from "next/link"

import type { CorporateService } from "src/lib/services/catalog"

export function QuestionnaireClient({ service }: { service: CorporateService }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const total = service.requiredInputs.length
  const currentPrompt = service.requiredInputs[step]
  const isLast = step === total - 1
  const progress = Math.round((step / total) * 100)

  function handleNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = String(new FormData(e.currentTarget).get("answer") ?? "").trim()
    setAnswers((prev) => ({ ...prev, [step]: value }))

    if (isLast) {
      // TODO: submit answers to server → redirect to engagement
      window.location.href = `/intake/engagement?service=${service.slug}`
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <Link href="/intake/catalog" className="text-sm font-medium text-stone-500 hover:text-stone-700">
          ← Back to catalog
        </Link>
        <p className="mt-4 text-[11px] font-semibold tracking-[0.24em] text-brand-navy uppercase">
          {service.title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">Intake questionnaire</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Answer each question to the best of your ability. Levine Law will follow up if more detail is needed.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-stone-700">
            Question {step + 1} of {total}
          </p>
          <p className="text-sm text-stone-400">{progress}% complete</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-brand-navy transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded border border-stone-200 bg-white px-6 py-7 shadow-sm">
        <form onSubmit={handleNext} className="space-y-5">
          <div>
            <label htmlFor="answer" className="block text-base font-medium text-stone-900">
              {currentPrompt}
            </label>
            <textarea
              id="answer"
              name="answer"
              rows={4}
              defaultValue={answers[step] ?? ""}
              required
              className="mt-4 w-full resize-y rounded border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              placeholder="Enter your answer here..."
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-stone-100 pt-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-sm font-medium text-stone-500 hover:text-stone-700"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="submit"
              className="rounded bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              {isLast ? "Review and continue →" : "Continue →"}
            </button>
          </div>
        </form>
      </div>

      {/* Scope reference */}
      <details className="mt-4 rounded border border-stone-200 bg-white shadow-sm">
        <summary className="cursor-pointer px-5 py-3.5 text-sm font-medium text-stone-700 hover:text-stone-900">
          What does {service.title} include?
        </summary>
        <ul className="space-y-1.5 border-t border-stone-100 px-5 py-4">
          {service.scope.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-stone-600">
              <span className="mt-0.5 shrink-0 text-brand-navy" aria-hidden="true">
                ·
              </span>
              {item}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}
