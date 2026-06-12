import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import {
  PortalBadge,
  PortalCard,
  PortalCardContent,
  PortalEmptyState,
  PortalPageHeader,
} from "src/components/portal/PortalDesignSystem"
import { PortalWorkspaceShell } from "src/components/portal/PortalWorkspaceShell"
import { getPreviewPortalSession, isPreviewPortalAccessEnabled } from "src/lib/auth/config"
import { getPortalSession, isClientPortalSession } from "src/lib/auth/session"
import { getDocumentList } from "src/lib/portal/documentSource"

export const metadata: Metadata = {
  title: "Documents",
}

export const dynamic = "force-dynamic"

type DocumentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const session = (await getPortalSession()) ?? (isPreviewPortalAccessEnabled() ? getPreviewPortalSession() : null)

  if (!session) redirect("/sign-in")
  if (!isClientPortalSession(session)) redirect("/intake")

  const params = await searchParams
  const query = typeof params.search === "string" ? params.search.trim().toLowerCase() : ""
  const owner = typeof params.owner === "string" ? params.owner : ""

  const { documents: lawyerDocs, isMock } = await getDocumentList()

  const allDocs = lawyerDocs.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())

  const filteredDocs = allDocs.filter((doc) => {
    const matchesQuery =
      !query ||
      doc.filename.toLowerCase().includes(query) ||
      doc.matterKey.toLowerCase().includes(query) ||
      doc.addedByName.toLowerCase().includes(query)
    const matchesOwner =
      !owner || (owner === "client" && doc.uploadedByClient) || (owner === "firm" && !doc.uploadedByClient)
    return matchesQuery && matchesOwner
  })

  return (
    <PortalWorkspaceShell active="documents" session={session}>
      <div className="space-y-6">
        <PortalPageHeader
          eyebrow="Documents"
          title="Documents"
          description="Review documents shared by Levine Law and materials uploaded from your workspace."
        />

        {isMock ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
            Preview data — document API not yet connected.
          </div>
        ) : null}

        <PortalCard>
          <PortalCardContent>
            <form method="GET" action="/corporate/app/documents" className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <label>
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">
                  Search
                </span>
                <input
                  type="search"
                  name="search"
                  defaultValue={typeof params.search === "string" ? params.search : ""}
                  placeholder="Search documents, matters, or authors"
                  className="focus:border-brand-navy focus:ring-brand-navy w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-1 focus:outline-none"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.12em] text-stone-400 uppercase">
                  Added by
                </span>
                <select
                  name="owner"
                  defaultValue={owner}
                  className="focus:border-brand-navy focus:ring-brand-navy w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:ring-1 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="firm">Levine Law</option>
                  <option value="client">You</option>
                </select>
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-brand-navy hover:bg-brand-navy-dark w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors md:w-auto"
                >
                  Filter
                </button>
              </div>
            </form>
          </PortalCardContent>
        </PortalCard>

        {filteredDocs.length === 0 ? (
          <PortalEmptyState
            title={allDocs.length === 0 ? "No documents shared yet" : "No documents match your filters"}
            description={
              allDocs.length === 0
                ? "Documents shared by Levine Law, plus materials you upload to matters, will appear here."
                : "Try clearing the search term or changing the added-by filter."
            }
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left">
                    <th className="px-5 py-3 font-semibold text-stone-600">Document</th>
                    <th className="px-5 py-3 font-semibold text-stone-600">Matter</th>
                    <th className="px-5 py-3 font-semibold text-stone-600">Date added</th>
                    <th className="px-5 py-3 font-semibold text-stone-600">Added by</th>
                    <th className="px-5 py-3 text-right font-semibold text-stone-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-stone-50">
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-stone-950">{doc.filename}</span>
                          {doc.uploadedByClient ? <PortalBadge>Uploaded by you</PortalBadge> : null}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/corporate/app/matters/${encodeURIComponent(doc.matterKey)}`}
                          className="text-brand-navy font-medium underline-offset-2 hover:underline"
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
                            className="text-brand-navy hover:text-brand-navy-dark font-semibold transition-colors"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-stone-300">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PortalWorkspaceShell>
  )
}
