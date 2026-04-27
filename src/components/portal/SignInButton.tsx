"use client"

import { useFormStatus } from "react-dom"

export function SignInButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-busy={pending}
      disabled={pending}
      className="rounded-md bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Opening secure sign-in..." : "Sign in securely"}
    </button>
  )
}
