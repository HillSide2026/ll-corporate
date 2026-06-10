"use client"

import { useActionState } from "react"

type SignUpState = { error?: string } | null

async function stubRegisterAction(_prev: SignUpState, _data: FormData): Promise<SignUpState> {
  return { error: "Account creation will be enabled shortly." }
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(stubRegisterAction, null)

  return (
    <form action={action} className="space-y-4">
      {state?.error ? (
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
          className="w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
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
          className="w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
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
          className="w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        <p className="mt-1.5 text-xs text-stone-400">At least 8 characters.</p>
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
