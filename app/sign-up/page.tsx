import type { Metadata } from "next"
import Link from "next/link"

import { AuthSplit } from "src/components/portal/AuthSplit"
import { SignUpForm } from "src/components/SignUpForm"
import { findLeadService } from "src/lib/services/leadServices"

export const metadata: Metadata = {
  title: "Create Account — Levine Law",
}

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> }

function param(params: Record<string, string | string[] | undefined> | undefined, key: string): string | undefined {
  const value = params?.[key]
  return typeof value === "string" ? value.slice(0, 200) : undefined
}

/** Arriving by a service entry link (/go/<service>) carries the service, name and email. */
export default async function SignUpPage({ searchParams }: PageProps) {
  const params = await searchParams
  const service = findLeadService(param(params, "service"))

  return (
    <AuthSplit
      title="Create your account"
      points={["Flat-fee corporate work", "For founders and entrepreneurs across Ontario", "Handled by real lawyers"]}
      cardTitle="Your details"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href={service ? `/sign-in?service=${service.slug}` : "/sign-in"}
            className="text-brand-blue font-semibold underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm
        service={service ? { slug: service.slug, title: service.title } : undefined}
        defaultName={param(params, "name")}
        defaultEmail={param(params, "email")}
      />
    </AuthSplit>
  )
}
