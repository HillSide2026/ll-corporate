"use client"

import { useActionState, useState } from "react"

import { brandButton } from "src/components/brand/Brand"
import { type ConflictFormState, submitConflictCheck } from "src/lib/intake/conflictActions"
import type { LeadService } from "src/lib/services/leadServices"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function FieldError({ state, field }: { state: ConflictFormState; field: string }) {
  if (state?.field !== field) return null
  return <p className="text-destructive mt-1.5 text-xs">{state.error}</p>
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-stone-500">{children}</p>
}

const inputClass = "h-11 rounded-lg bg-white"

function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors",
        selected
          ? "border-brand-navy bg-brand-navy text-white"
          : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
      )}
    >
      {children}
    </button>
  )
}

export function ConflictCheckForm({ service, defaultName }: { service: LeadService; defaultName?: string }) {
  const [state, action, pending] = useActionState(submitConflictCheck, null)
  const [otherSide, setOtherSide] = useState<"yes" | "no" | null>(null)

  return (
    <form action={action} className="space-y-7">
      <input type="hidden" name="serviceSlug" value={service.slug} />

      {state?.error && !state.field ? (
        <div
          role="alert"
          className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm"
        >
          {state.error}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="cc-name">Your full legal name</Label>
        <Input
          id="cc-name"
          name="applicantName"
          autoComplete="name"
          defaultValue={defaultName}
          required
          className={inputClass}
          aria-invalid={state?.field === "applicantName" || undefined}
        />
        <FieldError state={state} field="applicantName" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-company">{service.conflict.companyLabel}</Label>
        <Input id="cc-company" name="companyName" autoComplete="organization" className={inputClass} />
        <Hint>{service.conflict.companyHint}</Hint>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-related">{service.conflict.partiesLabel}</Label>
        <Textarea id="cc-related" name="relatedParties" rows={4} className="rounded-lg bg-white" />
        <Hint>{service.conflict.partiesHint}</Hint>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-900">Is anyone on the other side?</legend>
        <Hint>For example, a departing shareholder or the other party to a deal.</Hint>
        <div className="flex gap-2">
          <ChoiceButton selected={otherSide === "yes"} onClick={() => setOtherSide("yes")}>
            Yes
          </ChoiceButton>
          <ChoiceButton selected={otherSide === "no"} onClick={() => setOtherSide("no")}>
            No
          </ChoiceButton>
        </div>
        {otherSide === "yes" ? (
          <div className="space-y-1.5 pt-2">
            <Label htmlFor="cc-adverse">Who is on the other side?</Label>
            <Textarea id="cc-adverse" name="adverseParties" rows={3} className="rounded-lg bg-white" />
            <Hint>Full names of people or companies, one per line.</Hint>
          </div>
        ) : null}
      </fieldset>

      <div className="rounded-xl border border-stone-200 bg-stone-50 p-5">
        <label className="flex items-start gap-3 text-sm leading-6 text-stone-700">
          <input
            type="checkbox"
            name="acknowledged"
            required
            className="accent-brand-navy mt-1 size-4 shrink-0"
            aria-invalid={state?.field === "acknowledged" || undefined}
          />
          <span>
            I understand that Levine Law is not my lawyer until it confirms it can act and I sign an engagement letter,
            and that I should not send details of my matter before then.
          </span>
        </label>
        <FieldError state={state} field="acknowledged" />
      </div>

      <button type="submit" disabled={pending} className={cn(brandButton, "w-full sm:w-auto")}>
        {pending ? "Sending..." : "Request conflict check"}
      </button>
    </form>
  )
}
