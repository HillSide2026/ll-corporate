import type { Metadata } from "next"
import Link from "next/link"

import { PortalBrandHeader } from "src/components/portal/PortalBrandHeader"
import { SignUpForm } from "src/components/SignUpForm"

export const metadata: Metadata = {
  title: "Create Account — Levine Law",
}

export default function SignUpPage() {
  return (
    <main className="min-h-dvh bg-stone-50">
      <PortalBrandHeader />

      <div className="flex min-h-[calc(100dvh-65px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Create your account</h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Access the Levine Law portal to browse services and complete intake.
            </p>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white px-6 py-7 shadow-sm">
            <SignUpForm />
          </div>

          <p className="mt-5 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-brand-navy font-semibold underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
