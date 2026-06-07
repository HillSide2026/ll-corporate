export const MAX_PORTAL_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024

export const ALLOWED_PORTAL_DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
])

export function validatePortalDocumentFile(file: File): void {
  if (!file.name || file.size === 0) {
    throw new Error("No file selected.")
  }

  if (!ALLOWED_PORTAL_DOCUMENT_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Upload a PDF, DOCX, or image.")
  }

  if (file.size > MAX_PORTAL_DOCUMENT_SIZE_BYTES) {
    throw new Error("File exceeds the 10 MB limit.")
  }
}
