import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { SignUpForm } from "src/components/SignUpForm"

export const metadata: Metadata = {
  title: "Create Account — Levine Law",
}

export default function SignUpPage() {
  return (
    <main className="min-h-dvh bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="shrink-0">
            <Image
              src="/logos/levine-law-wordmark-navy-transparent-2.png"
              alt="Levine Law"
              width={1080}
              height={600}
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-57px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-navy uppercase">Levine Law</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">Create your account</h1>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Access the Levine Law portal to browse services, complete intake, and manage matters.
            </p>
          </div>

          <div className="rounded border border-stone-200 bg-white px-6 py-7 shadow-sm">
            <SignUpForm />
          </div>

          <p className="mt-5 text-center text-sm text-stone-500">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-brand-navy underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
