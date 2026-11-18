"use client"

import { useFormStatus } from "react-dom"

import { brandButton } from "src/components/brand/Brand"
import { cn } from "@/lib/utils"

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
      className={cn(brandButton, "bg-brand-blue hover:bg-brand-navy w-full")}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}
