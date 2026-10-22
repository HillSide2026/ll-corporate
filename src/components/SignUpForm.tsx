"use client"

import { useActionState, useRef } from "react"

import { brandButton } from "src/components/brand/Brand"
import { registerAction, RegisterState } from "src/lib/auth/registerAction"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

function FieldError({ state, field }: { state: RegisterState; field: string }) {
  if (state?.field !== field) return null
  return <p className="text-destructive mt-1.5 text-xs">{state.error}</p>
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(registerAction, null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  function checkMatch() {
    if (!confirmRef.current || !passwordRef.current) return
    const match = passwordRef.current.value === confirmRef.current.value
    confirmRef.current.setCustomValidity(match ? "" : "Passwords do not match.")
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error && !state.field ? (
        <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
          {state.error}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="su-name">Full name</Label>
        <Input
          id="su-name"
          className="h-11 rounded-lg"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={state?.field === "name" || undefined}
        />
        <FieldError state={state} field="name" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-email">Email address</Label>
        <Input
          id="su-email"
          className="h-11 rounded-lg"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={state?.field === "email" || undefined}
        />
        <FieldError state={state} field="email" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-password">Password</Label>
        <Input
          id="su-password"
          className="h-11 rounded-lg"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          ref={passwordRef}
          onChange={checkMatch}
          aria-invalid={state?.field === "password" || undefined}
        />
        {state?.field === "password" ? (
          <FieldError state={state} field="password" />
        ) : (
          <p className="text-muted-foreground text-xs">At least 8 characters.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-confirm">Confirm password</Label>
        <Input
          id="su-confirm"
          className="h-11 rounded-lg"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          ref={confirmRef}
          onChange={checkMatch}
          aria-invalid={state?.field === "confirmPassword" || undefined}
        />
        <FieldError state={state} field="confirmPassword" />
      </div>

      <button type="submit" disabled={pending} className={cn(brandButton, "mt-2 w-full")}>
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  )
}
