import { NextRequest } from "next/server"

import { authBasePath, handlers } from "src/lib/auth/auth"

const internalAuthPath = "/api/auth"

function withExternalAuthPath(request: NextRequest) {
  const url = new URL(request.url)

  if (url.pathname.startsWith(internalAuthPath)) {
    url.pathname = url.pathname.replace(internalAuthPath, authBasePath)
  }

  return new NextRequest(url, request)
}

export async function GET(request: NextRequest) {
  return handlers.GET(withExternalAuthPath(request))
}

export async function POST(request: NextRequest) {
  return handlers.POST(withExternalAuthPath(request))
}
