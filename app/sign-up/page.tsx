import type { Metadata } from "next"
import Link from "next/link"

import { AuthSplit } from "src/components/portal/AuthSplit"
import { SignUpForm } from "src/components/SignUpForm"

export const metadata: Metadata = {
  title: "Create Account — Levine Law",
}

export default function SignUpPage() {
  return (
    <AuthSplit
      title="Create your account"
      points={["Flat-fee corporate work", "For founders and entrepreneurs across Ontario", "Handled by real lawyers"]}
      cardTitle="Your details"
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-brand-blue font-semibold underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthSplit>
  )
}
