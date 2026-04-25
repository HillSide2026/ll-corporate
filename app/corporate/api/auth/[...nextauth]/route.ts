import { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { authBasePath, handlers } from "src/lib/auth/auth"

const internalAuthPath = "/api/auth"

function withExternalAuthPath(request: NextRequest) {
  const url = new URL(request.url)

  if (url.pathname.startsWith(internalAuthPath)) {
    url.pathname = url.pathname.replace(internalAuthPath, authBasePath)
  }

  return new NextRequest(url, request)
}

function redirectFriendlyAuthError(request: NextRequest) {
  const url = new URL(request.url)
  const isAuthErrorPath = url.pathname.endsWith("/api/auth/error")

  if (!isAuthErrorPath || url.searchParams.get("error") !== "Configuration") {
    return null
  }

  const redirectUrl = new URL("/corporate", request.url)
  redirectUrl.searchParams.set("error", "Configuration")
  return NextResponse.redirect(redirectUrl)
}

export async function GET(request: NextRequest) {
  const friendlyErrorRedirect = redirectFriendlyAuthError(request)

  if (friendlyErrorRedirect) {
    return friendlyErrorRedirect
  }

  return handlers.GET(withExternalAuthPath(request))
}

export async function POST(request: NextRequest) {
  return handlers.POST(withExternalAuthPath(request))
}
