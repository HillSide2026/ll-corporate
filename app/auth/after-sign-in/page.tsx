import { redirect } from "next/navigation"

import { getPortalSession, isClientPortalSession } from "src/lib/auth/session"

export default async function AfterSignInPage() {
  const session = await getPortalSession()

  if (!session) {
    redirect("/sign-in")
  }

  if (isClientPortalSession(session)) {
    redirect("/corporate/app")
  }

  redirect("/intake")
}
