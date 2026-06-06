"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

type RegistrationErrors = Partial<
  Record<"fullName" | "email" | "company" | "phone" | "password" | "confirmPassword" | "legalNotice", string>
>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function PortalRegistrationForm() {
  const router = useRouter()
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [success, setSuccess] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const fullName = String(form.get("fullName") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const company = String(form.get("company") ?? "").trim()
    const phone = String(form.get("phone") ?? "").trim()
    const password = String(form.get("password") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")
    const legalNotice = form.get("legalNotice") === "on"

    const nextErrors: RegistrationErrors = {}

    if (!fullName) nextErrors.fullName = "Full name is required."
    if (!email) {
      nextErrors.email = "Email address is required."
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address."
    }
    if (!company) nextErrors.company = "Company or organization is required."
    if (!phone) nextErrors.phone = "Phone number is required."
    if (!password) nextErrors.password = "Password is required."
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password."
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match."
    }
    if (!legalNotice) {
      nextErrors.legalNotice = "You must acknowledge the account creation notice."
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSuccess(false)
      return
    }

    setSuccess(true)
    window.setTimeout(() => {
      router.push("/corporate/onboarding")
    }, 1400)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {success ? (
        <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800">
          Your portal account has been created. Account access does not create a lawyer-client relationship. Levine Law
          will review any submitted requests before accepting an engagement.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <FieldErrorInput
          id="fullName"
          label="Full name"
          name="fullName"
          autoComplete="name"
          error={errors.fullName}
        />
        <FieldErrorInput
          id="email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          error={errors.email}
        />
        <FieldErrorInput
          id="company"
          label="Company / organization"
          name="company"
          autoComplete="organization"
          error={errors.company}
        />
        <FieldErrorInput
          id="phone"
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          error={errors.phone}
        />
        <FieldErrorInput
          id="password"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          error={errors.password}
        />
        <FieldErrorInput
          id="confirmPassword"
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
      </div>

      <div>
        <label className="flex gap-3 rounded border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-6 text-stone-600">
          <input
            type="checkbox"
            name="legalNotice"
            className="mt-1 h-4 w-4 shrink-0 rounded border-stone-300 text-brand-navy focus:ring-brand-navy"
          />
          <span>
            I understand that creating a portal account does not create a lawyer-client relationship, retainer,
            engagement, or obligation on the part of Levine Law.
          </span>
        </label>
        {errors.legalNotice ? <p className="mt-2 text-sm text-red-600">{errors.legalNotice}</p> : null}
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark md:w-auto"
      >
        Create Account
      </button>
    </form>
  )
}

function FieldErrorInput({
  autoComplete,
  error,
  id,
  label,
  name,
  type = "text",
}: {
  autoComplete?: string
  error?: string
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
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
