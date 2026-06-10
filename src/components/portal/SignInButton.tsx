"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

type SignInButtonProps = {
  label?: string
  pendingLabel?: string
}

export function SignInButton({ label = "Sign in securely", pendingLabel = "Signing in..." }: SignInButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-busy={pending} disabled={pending} className="h-10 w-full">
      {pending ? pendingLabel : label}
    </Button>
  )
}
