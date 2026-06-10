"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function switchToHubMode() {
  const store = await cookies()
  store.set("intake_mode", "hub", { path: "/intake", httpOnly: true, sameSite: "lax" })
  redirect("/intake/catalog")
}

export async function switchToFunnelMode() {
  const store = await cookies()
  store.set("intake_mode", "funnel", { path: "/intake", httpOnly: true, sameSite: "lax" })
  redirect("/intake/catalog")
}
