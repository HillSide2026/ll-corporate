"use client"

import { useActionState, useRef } from "react"

import { registerAction, RegisterState } from "src/lib/auth/registerAction"

const inputClass =
  "w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"

function fieldError(state: RegisterState, field: string) {
  return state?.field === field ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
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
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {state.error}
        </div>
      ) : null}

      <div>
        <label htmlFor="su-name" className="mb-1.5 block text-sm font-medium text-stone-700">
          Full name
        </label>
        <input
          id="su-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={`${inputClass} ${fieldError(state, "name")}`}
        />
        {state?.field === "name" ? <p className="mt-1.5 text-xs text-red-500">{state.error}</p> : null}
      </div>

      <div>
        <label htmlFor="su-email" className="mb-1.5 block text-sm font-medium text-stone-700">
          Email address
        </label>
        <input
          id="su-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={`${inputClass} ${fieldError(state, "email")}`}
        />
        {state?.field === "email" ? <p className="mt-1.5 text-xs text-red-500">{state.error}</p> : null}
      </div>

      <div>
        <label htmlFor="su-password" className="mb-1.5 block text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          id="su-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          ref={passwordRef}
          onChange={checkMatch}
          className={`${inputClass} ${fieldError(state, "password")}`}
        />
        {state?.field === "password" ? (
          <p className="mt-1.5 text-xs text-red-500">{state.error}</p>
        ) : (
          <p className="mt-1.5 text-xs text-stone-400">At least 8 characters.</p>
        )}
      </div>

      <div>
        <label htmlFor="su-confirm" className="mb-1.5 block text-sm font-medium text-stone-700">
          Confirm password
        </label>
        <input
          id="su-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          ref={confirmRef}
          onChange={checkMatch}
          className={`${inputClass} ${fieldError(state, "confirmPassword")}`}
        />
        {state?.field === "confirmPassword" ? (
          <p className="mt-1.5 text-xs text-red-500">{state.error}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  )
}
