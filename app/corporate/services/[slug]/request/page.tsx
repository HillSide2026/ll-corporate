import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getPortalSession } from "src/lib/auth/session"
import { getServiceBySlug, getServicePriceDisplay } from "src/lib/services/catalog"

type ServiceRequestPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: ServiceRequestPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: "Service Request",
    }
  }

  return {
    title: `Request ${service.title}`,
    description: `Review limited-scope request details for ${service.title}.`,
  }
}

export default async function ServiceRequestPage({ params }: ServiceRequestPageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const session = await getPortalSession()

  if (!session) {
    redirect("/corporate")
  }

  return (
    <main className="min-h-dvh bg-neutral-50 text-neutral-950">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <Link href={`/services/${service.slug}`} className="font-semibold text-emerald-700 hover:text-emerald-800">
            Back to service details
          </Link>
          <Link
            href="/corporate/app"
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 font-medium text-neutral-800 transition-colors hover:border-neutral-400"
          >
            Portal home
          </Link>
        </nav>

        <div className="mt-14">
          <p className="text-sm font-medium tracking-[0.18em] text-emerald-700 uppercase">Request service</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">{service.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700">{service.description}</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="rounded-md border border-neutral-200 bg-white px-5 py-5">
            <h2 className="text-lg font-semibold text-neutral-950">Selected service</h2>
            <dl className="mt-4 grid gap-3 text-sm text-neutral-700">
              <div>
                <dt className="font-semibold text-neutral-950">Pricing snapshot</dt>
                <dd className="mt-1">{getServicePriceDisplay(service)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-950">Turnaround</dt>
                <dd className="mt-1">{service.turnaround}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-md border border-neutral-200 bg-white px-5 py-5">
            <h2 className="text-lg font-semibold text-neutral-950">Limited-scope acknowledgement</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-700">
              Submitting a request does not mean work has started. Levine LLP will review the request and confirm next
              steps.
            </p>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              This request shell will capture the client acknowledgement timestamp once submission is connected to the
              intake contract.
            </p>
          </section>
        </div>

        <section className="mt-8 rounded-md border border-neutral-200 bg-white px-5 py-5">
          <h2 className="text-lg font-semibold text-neutral-950">Service inputs</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700">
            The intake form is not active yet. These are the inputs Levine LLP expects to collect before this request
            can be submitted.
          </p>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-neutral-700 md:grid-cols-2">
            {service.requiredInputs.map((input) => (
              <li key={input} className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3">
                {input}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-md border border-neutral-200 bg-white px-5 py-5">
          <h2 className="text-lg font-semibold text-neutral-950">Contract boundary</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-700">
            ll-corporate will package the request after the intake contract is connected. LL-task-tracker remains the
            system of record for matter creation, workflow, tasks, status, and execution.
          </p>
          <button
            type="button"
            disabled
            className="mt-5 rounded-md bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-500"
          >
            Submit request not enabled yet
          </button>
        </section>
      </section>
    </main>
  )
}
