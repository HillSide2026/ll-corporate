import { type NextRequest, NextResponse } from "next/server"

import { downloadOnboardingFile, getOnboardingDriveId, isSharePointConfigured } from "src/lib/api/sharepointGraph"
import { getPortalSession } from "src/lib/auth/session"
import { getLatestConflictRequest } from "src/lib/intake/conflictRequestStore"
import { getOnboardingDetails } from "src/lib/intake/onboardingStore"
import { leadServices } from "src/lib/services/leadServices"

type RouteProps = { params: Promise<{ slug: string }> }

/**
 * The lead's own released engagement letter (step 3, ML1 2026-11-25). The letter is found
 * only through the signed-in user's own conflict request, never from the request URL, and
 * only once MJL has released it. The file is fetched server-side; no SharePoint URL is
 * sent to the browser.
 */
export async function GET(_request: NextRequest, { params }: RouteProps) {
  const session = await getPortalSession()
  if (!session?.identity.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { slug } = await params
  const service = leadServices.find((s) => s.slug === slug)
  if (!service || !isSharePointConfigured()) return NextResponse.json({ error: "Not found" }, { status: 404 })

  try {
    const request = await getLatestConflictRequest(session.identity.subject, service.slug)
    const details = request?.status === "cleared" ? await getOnboardingDetails(request.id) : null
    if (!details?.releasedAt || !details.releasedItemId || details.userId !== session.identity.subject) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const driveId = await getOnboardingDriveId()
    if (!driveId) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const file = await downloadOnboardingFile(driveId, details.releasedItemId)
    const name = (details.releasedFileName ?? `${service.title} Engagement Letter.docx`).replace(/["\r\n]/g, "")
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Disposition": `attachment; filename="${name}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (err) {
    console.error("engagement letter download failed", err)
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
