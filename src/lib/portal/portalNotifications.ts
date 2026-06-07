import { env } from "env.mjs"

type PortalNotificationPayload = {
  type: "portal_access_request_created" | "portal_access_request_status_changed"
  requestId: string
  email: string
  fullName: string
  status?: string
}

export async function sendPortalNotification(payload: PortalNotificationPayload): Promise<void> {
  const url = env.PORTAL_NOTIFICATION_WEBHOOK_URL
  if (!url) return

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.PORTAL_NOTIFICATION_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${env.PORTAL_NOTIFICATION_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    console.warn(`Portal notification webhook returned HTTP ${response.status} for ${payload.type}`)
  }
}
