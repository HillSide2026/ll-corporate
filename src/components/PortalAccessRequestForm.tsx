"use client"

import { useActionState } from "react"

import {
  type PortalAccessRequestState,
  submitPortalAccessRequest,
} from "src/lib/portal/accessRequestActions"

const initialState: PortalAccessRequestState = { status: "idle" }

export function PortalAccessRequestForm() {
  const [state, formAction, pending] = useActionState(submitPortalAccessRequest, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div
          className={[
            "rounded border px-4 py-3 text-sm leading-6",
            state.status === "submitted"
              ? "border-green-200 bg-green-50 text-green-800"
              : state.status === "not_configured"
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          <p>{state.message}</p>
          {state.mailtoHref ? (
            <a
              href={state.mailtoHref}
              className="mt-3 inline-flex rounded border border-current px-3 py-1.5 text-sm font-semibold"
            >
              Send request by email
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FieldInput id="fullName" label="Full name" name="fullName" autoComplete="name" />
        <FieldInput id="email" label="Email address" name="email" type="email" autoComplete="email" />
        <FieldInput id="company" label="Company / organization" name="company" autoComplete="organization" />
        <FieldInput id="phone" label="Phone number" name="phone" type="tel" autoComplete="tel" />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-stone-700">
          Brief description / reason for portal access
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className="w-full resize-y rounded border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      <div>
        <label className="flex gap-3 rounded border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-600">
          <input
            type="checkbox"
            name="legalNotice"
            required
            className="mt-1 h-4 w-4 shrink-0 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
          />
          <span>
            I understand that requesting portal access does not create a lawyer-client relationship, retainer,
            engagement, or obligation on the part of Levine Law.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
      >
        {pending ? "Submitting..." : "Request Portal Access"}
      </button>
    </form>
  )
}

function FieldInput({
  autoComplete,
  id,
  label,
  name,
  type = "text",
}: {
  autoComplete?: string
  id: string
  label: string
  name: string
  type?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
      />
    </div>
  )
}
