"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import type { CorporateService } from "src/lib/services/catalog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

export function QuestionnaireClient({ service }: { service: CorporateService }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const total = service.requiredInputs.length
  const currentPrompt = service.requiredInputs[step]
  const isLast = step === total - 1
  const progress = Math.round(((step + 1) / total) * 100)

  function handleNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = String(new FormData(e.currentTarget).get("answer") ?? "").trim()
    setAnswers((prev) => ({ ...prev, [step]: value }))

    if (isLast) {
      window.location.href = `/intake/engagement?service=${service.slug}`
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <Link
          href="/intake/catalog"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="size-4" />
          Back to catalog
        </Link>
        <p className="text-primary mt-4 text-[11px] font-semibold tracking-[0.22em] uppercase">{service.title}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Intake questionnaire</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Answer each question to the best of your ability. Levine Law will follow up if more detail is needed.
        </p>
      </div>

      <div className="mb-6 space-y-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            Question {step + 1} of {total}
          </span>
          <span>{progress}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <form onSubmit={handleNext}>
          <CardHeader>
            <Label htmlFor="answer" className="text-foreground text-base font-medium">
              {currentPrompt}
            </Label>
          </CardHeader>
          <CardContent>
            <Textarea
              id="answer"
              name="answer"
              rows={4}
              defaultValue={answers[step] ?? ""}
              required
              placeholder="Enter your answer here..."
              className="resize-y"
            />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            {step > 0 ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft />
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button type="submit">{isLast ? "Review and continue" : "Continue"}</Button>
          </CardFooter>
        </form>
      </Card>

      <details className="mt-4">
        <summary className="bg-card ring-foreground/10 hover:bg-muted/50 cursor-pointer rounded-lg border px-4 py-3 text-sm font-medium ring-1">
          What does {service.title} include?
        </summary>
        <div className="bg-card ring-foreground/10 mt-1 rounded-lg border px-4 py-4 ring-1">
          <ul className="space-y-1.5">
            {service.scope.map((item) => (
              <li key={item} className="text-muted-foreground flex gap-2.5 text-sm">
                <span className="text-primary mt-0.5 shrink-0" aria-hidden="true">
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}
