import { type NextRequest, NextResponse } from "next/server"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { getAccessToken, getPortalSession, isWorkspacePortalSession } from "src/lib/auth/session"
import { getPortalDocumentBlob } from "src/lib/portal/blobStorage"
import { openClientLibraryFile } from "src/lib/api/sharepointGraph"
import { getClientLibraryForIdentity } from "src/lib/portal/clientLibraryStore"
import { CLIENT_LIBRARY_DOCUMENT_PREFIX, getPortalDocumentById } from "src/lib/portal/documentStore"
import { getMatterByKey } from "src/lib/portal/matterSource"
import { recordAuditEvent } from "src/lib/portal/auditLog"
import { isMattersAndDocumentsEnabled } from "src/lib/portal/features"

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
  if (!isRealAdmin && !isMattersAndDocumentsEnabled()) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }
  if (session && !isRealAdmin && !isWorkspacePortalSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (id.startsWith(CLIENT_LIBRARY_DOCUMENT_PREFIX)) {
    return downloadClientLibraryDocument(id.slice(CLIENT_LIBRARY_DOCUMENT_PREFIX.length), session)
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

/**
 * A file the firm shared in the user's client library on the SharePoint Clients
 * site (LLP-055, ML1 2026-11-18). The library comes only from the user's own
 * membership, never from the request, so an item id from another client's
 * library is looked up in this user's library and not found.
 */
async function downloadClientLibraryDocument(itemId: string, session: Awaited<ReturnType<typeof getPortalSession>>) {
  if (!isMattersAndDocumentsEnabled()) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }
  // Workspace users only (client, or teammate unless restricted). Firm staff use SharePoint itself.
  if (!session || !isWorkspacePortalSession(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const library = await getClientLibraryForIdentity(session.identity)
  if (!library) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  let opened: Awaited<ReturnType<typeof openClientLibraryFile>>
  try {
    opened = await openClientLibraryFile(library.driveId, itemId)
  } catch {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }
  if (!opened) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  await recordAuditEvent({
    action: "client_library_document_downloaded",
    actor: { identity: session.identity, role: "client" },
    metadata: { clientKey: library.clientKey, filename: opened.file.name, itemId },
    resourceId: `${CLIENT_LIBRARY_DOCUMENT_PREFIX}${itemId}`,
    resourceType: "document",
  })

  return new NextResponse(opened.stream, {
    headers: {
      "Content-Disposition": `attachment; filename="${opened.file.name.replace(/["\r\n]/g, "")}"`,
      "Content-Type": opened.file.contentType ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
