"use client"

import { useActionState, useState } from "react"

import { brandButton } from "src/components/brand/Brand"
import { SALUTATIONS } from "src/lib/intake/onboardingDetails"
import { type OnboardingFormState, submitOnboardingDetails } from "src/lib/intake/onboardingActions"
import type { LeadService } from "src/lib/services/leadServices"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const inputClass = "h-11 rounded-lg bg-white"

function FieldError({ state, field }: { state: OnboardingFormState; field: string }) {
  if (state?.field !== field) return null
  return <p className="text-destructive mt-1.5 text-xs">{state.error}</p>
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-stone-500">{children}</p>
}

function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors",
        selected
          ? "border-brand-blue bg-brand-blue text-white"
          : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
      )}
    >
      {children}
    </button>
  )
}

/**
 * Who the engagement letter is for and who signs it, asked once the conflict check has
 * cleared (LLP-055, ML1 2026-11-18). Never matter details.
 */
export function OnboardingDetailsForm({ service, email }: { service: LeadService; email: string }) {
  const [state, action, pending] = useActionState(submitOnboardingDetails, null)
  const [capacity, setCapacity] = useState<"personal" | "corporation" | null>(null)
  const [salutation, setSalutation] = useState<string | null>(null)
  const [otherOfficer, setOtherOfficer] = useState(false)

  return (
    <form action={action} className="space-y-7">
      <input type="hidden" name="serviceSlug" value={service.slug} />
      <input type="hidden" name="signingCapacity" value={capacity ?? ""} />
      <input type="hidden" name="salutation" value={salutation ?? ""} />

      {state?.error && !state.field ? (
        <div
          role="alert"
          className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm"
        >
          {state.error}
        </div>
      ) : null}

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-900">Who is signing the engagement letter?</legend>
        <div className="flex flex-wrap gap-2">
          <ChoiceButton selected={capacity === "personal"} onClick={() => setCapacity("personal")}>
            Me, personally
          </ChoiceButton>
          <ChoiceButton selected={capacity === "corporation"} onClick={() => setCapacity("corporation")}>
            Me, for a corporation
          </ChoiceButton>
        </div>
        <FieldError state={state} field="signingCapacity" />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-900">How should we address you?</legend>
        <div className="flex flex-wrap gap-2">
          {SALUTATIONS.map((s) => (
            <ChoiceButton key={s} selected={salutation === s} onClick={() => setSalutation(s)}>
              {s}
            </ChoiceButton>
          ))}
        </div>
        <FieldError state={state} field="salutation" />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ob-first">First name</Label>
          <Input id="ob-first" name="clientFirstName" autoComplete="given-name" required className={inputClass} />
          <FieldError state={state} field="clientFirstName" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-surname">Surname</Label>
          <Input id="ob-surname" name="clientSurname" autoComplete="family-name" required className={inputClass} />
          <FieldError state={state} field="clientSurname" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ob-email">Email for documents and advice</Label>
        <Input id="ob-email" name="clientEmail" type="email" defaultValue={email} className={inputClass} />
        <FieldError state={state} field="clientEmail" />
      </div>

      {capacity === "corporation" ? (
        <div className="space-y-5 rounded-xl border border-stone-200 bg-stone-50 p-5">
          <div className="space-y-1.5">
            <Label htmlFor="ob-corp">Corporation&apos;s full legal name</Label>
            <Input id="ob-corp" name="corporationName" autoComplete="organization" className={inputClass} />
            <Hint>As it appears on the articles, for example &quot;1234567 Ontario Inc.&quot;</Hint>
            <FieldError state={state} field="corporationName" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ob-title">Your title</Label>
            <Input id="ob-title" name="signerTitle" autoComplete="organization-title" className={inputClass} />
            <FieldError state={state} field="signerTitle" />
          </div>
          <label className="flex items-start gap-3 text-sm leading-6 text-stone-700">
            <input type="checkbox" name="signingAuthority" className="accent-brand-blue mt-1 size-4 shrink-0" />
            <span>I have authority to bind the corporation.</span>
          </label>
          <FieldError state={state} field="signingAuthority" />
        </div>
      ) : null}

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-stone-900">Will someone else give us instructions?</legend>
        <Hint>If not, we take instructions from you.</Hint>
        <div className="flex gap-2">
          <ChoiceButton selected={!otherOfficer} onClick={() => setOtherOfficer(false)}>
            No
          </ChoiceButton>
          <ChoiceButton selected={otherOfficer} onClick={() => setOtherOfficer(true)}>
            Yes
          </ChoiceButton>
        </div>
        {otherOfficer ? (
          <div className="grid gap-5 pt-2 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="ob-io-name">Full name</Label>
              <Input id="ob-io-name" name="instructingOfficerName" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-io-title">Title</Label>
              <Input id="ob-io-title" name="instructingOfficerTitle" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-io-email">Email</Label>
              <Input id="ob-io-email" name="instructingOfficerEmail" type="email" className={inputClass} />
              <FieldError state={state} field="instructingOfficerEmail" />
            </div>
          </div>
        ) : null}
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className={cn(brandButton, "bg-brand-blue hover:bg-brand-navy w-full sm:w-auto")}
      >
        {pending ? "Sending..." : "Send Details"}
      </button>
    </form>
  )
}
