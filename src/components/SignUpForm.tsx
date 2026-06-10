"use client"

import { useActionState, useRef } from "react"

import { registerAction, RegisterState } from "src/lib/auth/registerAction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function FieldError({ state, field }: { state: RegisterState; field: string }) {
  if (state?.field !== field) return null
  return <p className="mt-1.5 text-xs text-destructive">{state.error}</p>
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
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="su-name">Full name</Label>
        <Input
          id="su-name"
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
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-confirm">Confirm password</Label>
        <Input
          id="su-confirm"
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

      <Button type="submit" disabled={pending} className="mt-2 h-10 w-full">
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
