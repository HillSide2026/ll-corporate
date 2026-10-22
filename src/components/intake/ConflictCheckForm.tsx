"use client"

import { useActionState } from "react"

import { type ConflictFormState, submitConflictCheck } from "src/lib/intake/conflictActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function FieldError({ state, field }: { state: ConflictFormState; field: string }) {
  if (state?.field !== field) return null
  return <p className="mt-1.5 text-xs text-destructive">{state.error}</p>
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-stone-500">{children}</p>
}

export function ConflictCheckForm({ serviceSlug, defaultName }: { serviceSlug: string; defaultName?: string }) {
  const [state, action, pending] = useActionState(submitConflictCheck, null)

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="serviceSlug" value={serviceSlug} />

      {state?.error && !state.field ? (
        <div role="alert" className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
          aria-invalid={state?.field === "applicantName" || undefined}
        />
        <FieldError state={state} field="applicantName" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-company">Company name</Label>
        <Input id="cc-company" name="companyName" autoComplete="organization" />
        <Hint>Leave blank if the company does not exist yet. Include any proposed name.</Hint>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-related">Other people and companies involved</Label>
        <Textarea id="cc-related" name="relatedParties" rows={4} />
        <Hint>Shareholders, directors, officers, co-founders or investors. One per line.</Hint>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cc-adverse">Anyone on the other side</Label>
        <Textarea id="cc-adverse" name="adverseParties" rows={3} />
        <Hint>For example, a departing shareholder or the other party to a deal. Leave blank if none.</Hint>
      </div>

      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
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

      <Button type="submit" disabled={pending} className="bg-brand-navy hover:bg-brand-navy-dark h-11 w-full text-sm font-semibold sm:w-auto sm:px-6">
        {pending ? "Sending..." : "Request conflict check"}
      </Button>
    </form>
  )
}
