import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession } from "src/lib/auth/session"
import { getDocumentList } from "src/lib/portal/documentSource"
import { getUploadedDocuments } from "src/lib/portal/uploadedDocumentStore"
import { getAdminDocuments } from "src/lib/portal/adminDocumentStore"

export const metadata: Metadata = {
  title: "Documents",
}

export const dynamic = "force-dynamic"

function formatDate(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

export default async function DocumentsPage() {
  const session =
    (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) {
    redirect("/corporate")
  }

  const { documents: lawyerDocs, isMock } = await getDocumentList()
  const clientDocs = getUploadedDocuments()
  const adminDocs = getAdminDocuments()

  // Merge and sort newest first. Admin docs appear as lawyer-uploaded; no "Uploaded by you" badge.
  const allDocs = [
    ...lawyerDocs.map((d) => ({ ...d, uploadedByClient: false as const })),
    ...adminDocs.map((d) => ({ ...d, uploadedByClient: false as const })),
    ...clientDocs,
  ].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm">
          <Link
            href="/corporate/app"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← Portal home
          </Link>
        </nav>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">Documents</h1>
          <p className="mt-2 text-sm text-stone-500">
            Documents shared by your counsel, plus materials you have uploaded to your matters.
          </p>
        </div>

        {isMock ? (
          <p className="mt-4 text-xs text-stone-400">Preview data — document API not yet connected.</p>
        ) : null}

        {allDocs.length === 0 ? (
          <p className="mt-10 text-sm text-stone-400">No documents have been shared yet.</p>
        ) : (
          <div className="mt-8 overflow-hidden rounded border border-stone-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left">
                  <th className="px-5 py-3 font-semibold text-stone-900">Document</th>
                  <th className="px-5 py-3 font-semibold text-stone-900">Matter</th>
                  <th className="px-5 py-3 font-semibold text-stone-900">Date added</th>
                  <th className="px-5 py-3 font-semibold text-stone-900">Added by</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {allDocs.map((doc) => (
                  <tr key={doc.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-5 py-4">
                      <span className="font-medium text-stone-900">{doc.filename}</span>
                      {doc.uploadedByClient ? (
                        <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-500">
                          Uploaded by you
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/corporate/app/matters/${encodeURIComponent(doc.matterKey)}`}
                        className="text-brand-navy underline-offset-2 hover:underline"
                      >
                        {doc.matterKey}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-stone-500">{formatDate(doc.addedAt)}</td>
                    <td className="px-5 py-4 text-stone-500">{doc.addedByName}</td>
                    <td className="px-5 py-4 text-right">
                      {doc.fileUrl !== "#" ? (
                        <a
                          href={doc.fileUrl}
                          className="font-medium text-brand-navy transition-colors hover:text-brand-navy-dark"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
