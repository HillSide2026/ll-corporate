"use client"

import { useFormStatus } from "react-dom"

type SignInButtonProps = {
  label?: string
  pendingLabel?: string
}

export function SignInButton({ label = "Sign in securely", pendingLabel = "Signing in..." }: SignInButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-busy={pending}
      disabled={pending}
      className="bg-brand-navy hover:bg-brand-navy-dark inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
