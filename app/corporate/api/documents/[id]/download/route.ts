import { type NextRequest, NextResponse } from "next/server"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { getAccessToken, getPortalSession } from "src/lib/auth/session"
import { getPortalDocumentBlob } from "src/lib/portal/blobStorage"
import { getPortalDocumentById } from "src/lib/portal/documentStore"
import { getMatterByKey } from "src/lib/portal/matterSource"
import { recordAuditEvent } from "src/lib/portal/auditLog"

type DownloadRouteProps = {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: DownloadRouteProps) {
  const { id } = await params
  const [session, adminSession] = await Promise.all([getPortalSession(), getAdminSession()])
  const isRealAdmin = adminSession.isAdmin && !adminSession.isPreview

  if (!session && !isRealAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const document = await getPortalDocumentById(id)
  if (!document?.blobPathname) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  if (session && !isRealAdmin) {
    if (document.uploadedByClient && document.addedBySubject !== session.identity.subject) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!document.uploadedByClient) {
      const accessToken = await getAccessToken()
      const { matter } = await getMatterByKey(accessToken, document.matterKey)
      if (!matter) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const result = await getPortalDocumentBlob(document.blobPathname)
  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  await recordAuditEvent({
    action: "document_downloaded",
    actor: session ? { identity: session.identity, role: "client" } : { role: "admin" },
    matterKey: document.matterKey,
    metadata: { filename: document.filename },
    resourceId: document.id,
    resourceType: "document",
  })

  return new NextResponse(result.stream, {
    headers: {
      "Content-Disposition": `attachment; filename="${document.filename.replace(/"/g, "")}"`,
      "Content-Type": result.blob.contentType ?? document.contentType ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
