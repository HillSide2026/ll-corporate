import { get, put } from "@vercel/blob"

import { env } from "env.mjs"

export class PortalBlobNotConfiguredError extends Error {
  constructor() {
    super("Vercel Blob storage is not configured.")
    this.name = "PortalBlobNotConfiguredError"
  }
}

export function isPortalBlobConfigured(): boolean {
  return Boolean(env.BLOB_READ_WRITE_TOKEN)
}

function safeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-")
}

export async function uploadPortalDocumentBlob({
  file,
  matterKey,
  uploadedBySubject,
}: {
  file: File
  matterKey: string
  uploadedBySubject: string
}) {
  if (!isPortalBlobConfigured()) throw new PortalBlobNotConfiguredError()

  const pathname = `portal-documents/${encodeURIComponent(matterKey)}/${encodeURIComponent(uploadedBySubject)}/${Date.now()}-${safeFilename(file.name)}`

  return put(pathname, file, {
    access: "private",
    addRandomSuffix: true,
    cacheControlMaxAge: 60,
    contentType: file.type || "application/octet-stream",
  })
}

export async function getPortalDocumentBlob(pathname: string) {
  if (!isPortalBlobConfigured()) throw new PortalBlobNotConfiguredError()
  return get(pathname, { access: "private" })
}
