"use client"

import { useFormStatus } from "react-dom"

export function SignInButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-busy={pending}
      disabled={pending}
      className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-wait disabled:bg-emerald-900 disabled:text-emerald-50"
    >
      {pending ? "Opening secure sign-in..." : "Sign in securely"}
    </button>
  )
}
