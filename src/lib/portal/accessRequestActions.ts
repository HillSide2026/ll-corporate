"use server"

import { env } from "env.mjs"

import {
  createPortalAccessRequest,
  isPortalAccessRequestApiConfigured,
  PortalAccessRequestApiError,
  PortalAccessRequestApiNotConfiguredError,
} from "./accessRequestApi"
import { sendPortalNotification } from "./portalNotifications"

export type PortalAccessRequestState = {
  status: "idle" | "submitted" | "not_configured" | "error"
  message?: string
  mailtoHref?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function buildMailtoHref(payload: {
  company: string
  description: string
  email: string
  fullName: string
  phone: string
}) {
  const subject = "Portal access request"
  const body = [
    "Portal access request",
    "",
    `Full name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Company / organization: ${payload.company}`,
    `Phone: ${payload.phone}`,
    "",
    "Brief description / reason for portal access:",
    payload.description,
    "",
    "Acknowledgment:",
    "I understand that requesting portal access does not create a lawyer-client relationship, retainer, engagement, or obligation on the part of Levine Law.",
  ].join("\n")

  return `mailto:matthew@levinelegal.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function submitLegacyWebhook(payload: {
  company: string
  description: string
  email: string
  fullName: string
  legalAcknowledgedAt: string
  phone: string
}): Promise<boolean> {
  if (!env.PORTAL_ACCESS_REQUEST_WEBHOOK_URL) return false

  const response = await fetch(env.PORTAL_ACCESS_REQUEST_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.PORTAL_ACCESS_REQUEST_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${env.PORTAL_ACCESS_REQUEST_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify({
      type: "portal_access_request",
      ...payload,
    }),
  })

  return response.ok
}

export async function submitPortalAccessRequest(
  _previousState: PortalAccessRequestState,
  formData: FormData
): Promise<PortalAccessRequestState> {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const company = String(formData.get("company") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const legalNotice = formData.get("legalNotice") === "on"

  if (!fullName || !email || !company || !phone || !description || !legalNotice) {
    return {
      status: "error",
      message: "Complete all fields and acknowledge the legal notice before submitting.",
    }
  }

  if (!emailPattern.test(email)) {
    return { status: "error", message: "Enter a valid email address." }
  }

  const mailtoHref = buildMailtoHref({ company, description, email, fullName, phone })
  const payload = {
    company,
    description,
    email,
    fullName,
    legalAcknowledgedAt: new Date().toISOString(),
    phone,
  }

  if (isPortalAccessRequestApiConfigured()) {
    try {
      const request = await createPortalAccessRequest(payload)
      await sendPortalNotification({
        type: "portal_access_request_created",
        requestId: request.id,
        email: request.email,
        fullName: request.fullName,
        status: request.status,
      })

      return {
        status: "submitted",
        message:
          "Your portal access request has been submitted. This does not create a lawyer-client relationship. Levine Law will review your request and contact you if appropriate.",
      }
    } catch (error) {
      if (error instanceof PortalAccessRequestApiNotConfiguredError || error instanceof PortalAccessRequestApiError) {
        return {
          status: "error",
          message:
            "Portal access request submission failed. Use the email handoff below or contact Levine Law directly.",
          mailtoHref,
        }
      }

      throw error
    }
  }

  if (env.PORTAL_ACCESS_REQUEST_WEBHOOK_URL) {
    const submitted = await submitLegacyWebhook(payload)
    if (submitted) {
      return {
        status: "submitted",
        message:
          "Your portal access request has been submitted. This does not create a lawyer-client relationship. Levine Law will review your request and contact you if appropriate.",
      }
    }

    return {
      status: "error",
      message: "Portal access request submission failed. Use the email handoff below or contact Levine Law directly.",
      mailtoHref,
    }
  }

  return {
    status: "not_configured",
    message:
      "Portal access request submission is not configured yet. Use the email handoff below to send this request directly to Levine Law.",
    mailtoHref,
  }
}
