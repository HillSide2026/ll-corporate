import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { getAdminSession } from "src/lib/auth/adminAuth"
import { getMatterByKey } from "src/lib/portal/matterSource"
import { getMatterUpdateList } from "src/lib/portal/matterUpdateSource"
import { postMatterUpdate, adminUploadDocument } from "src/lib/portal/adminActions"

type AdminMatterPageProps = {
  params: Promise<{ key: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: AdminMatterPageProps): Promise<Metadata> {
  const { key } = await params
  return { title: `Admin — ${decodeURIComponent(key)}` }
}

function formatDate(iso: string | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
}

export default async function AdminMatterPage({ params, searchParams }: AdminMatterPageProps) {
  const { isAdmin } = await getAdminSession()
  if (!isAdmin) redirect("/corporate/admin/login")

  const { key } = await params
  const businessKey = decodeURIComponent(key)
  const sp = await searchParams
  const justUpdated = sp.updated === "1"
  const justUploaded = sp.uploaded === "1"

  const result = await getMatterByKey(null, businessKey)
  if (!result.matter) notFound()

  const { matter, isMock } = result
  const { updates } = getMatterUpdateList(businessKey, isMock)

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <section className="mx-auto max-w-5xl px-6 py-10">
        <nav className="text-sm">
          <Link
            href="/corporate/admin"
            className="font-semibold text-brand-navy transition-colors hover:text-brand-navy-dark"
          >
            ← Admin home
          </Link>
        </nav>

        {isMock ? (
          <p className="mt-6 text-xs text-stone-400">Preview data — connect LL-task-tracker for live matters.</p>
        ) : null}

        {justUpdated ? (
          <div className="mt-6 rounded border border-green-200 bg-green-50 px-5 py-4 text-sm">
            <p className="font-semibold text-green-900">Update posted</p>
            <p className="mt-1 text-green-700">The client will see this update on their matter detail page.</p>
          </div>
        ) : null}

        {justUploaded ? (
          <div className="mt-6 rounded border border-green-200 bg-green-50 px-5 py-4 text-sm">
            <p className="font-semibold text-green-900">Document uploaded</p>
            <p className="mt-1 text-green-700">The document is now visible in the client&apos;s documents list.</p>
          </div>
        ) : null}

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy">Matter</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">{businessKey}</h1>
          {matter.matterType ? <p className="mt-1 text-sm text-stone-400">{matter.matterType}</p> : null}
          {matter.matterState ? (
            <p className="mt-2 text-xs text-stone-500">State: {matter.matterState} · {matter.adminState}</p>
          ) : null}
          {matter.nextActionSummary ? (
            <p className="mt-2 text-sm text-stone-600">Next action: {matter.nextActionSummary}</p>
          ) : null}
        </div>

        {/* Existing updates */}
        <div className="mt-10">
          <h2 className="text-base font-semibold text-stone-900">Posted updates</h2>
          {updates.length === 0 ? (
            <p className="mt-3 text-sm text-stone-400">No updates posted yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {updates.map((u) => (
                <li key={u.id} className="rounded border border-stone-100 bg-white px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-900">{u.authorName}</span>
                    <span className="text-xs text-stone-400">{formatDate(u.addedAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{u.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Post a new update */}
        <div className="mt-8 rounded border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-base font-semibold text-stone-900">Post an update</h2>
          <p className="mt-1 text-sm text-stone-500">
            Visible to the client on their matter detail page immediately after posting.
          </p>
          <form action={postMatterUpdate} className="mt-5 space-y-4">
            <input type="hidden" name="matterKey" value={businessKey} />
            <div>
              <label htmlFor="authorName" className="mb-1.5 block text-sm font-medium text-stone-700">
                Your name
              </label>
              <input
                id="authorName"
                name="authorName"
                type="text"
                defaultValue="M. Levine"
                required
                className="w-full max-w-xs rounded border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div>
              <label htmlFor="body" className="mb-1.5 block text-sm font-medium text-stone-700">
                Update
              </label>
              <textarea
                id="body"
                name="body"
                rows={4}
                required
                placeholder="Describe what's happening with this matter…"
                className="w-full resize-y rounded border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <button
              type="submit"
              className="rounded bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
            >
              Post update
            </button>
          </form>
        </div>

        {/* Upload a document */}
        <div className="mt-6 rounded border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-base font-semibold text-stone-900">Upload a document</h2>
          <p className="mt-1 text-sm text-stone-500">
            Shared with the client immediately. PDF, DOCX, or image — 10 MB max.
          </p>
          <form action={adminUploadDocument} className="mt-5 space-y-4">
            <input type="hidden" name="matterKey" value={businessKey} />
            <div>
              <label htmlFor="uploadAuthorName" className="mb-1.5 block text-sm font-medium text-stone-700">
                Your name
              </label>
              <input
                id="uploadAuthorName"
                name="authorName"
                type="text"
                defaultValue="M. Levine"
                required
                className="w-full max-w-xs rounded border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                name="file"
                accept=".pdf,.docx,image/*"
                required
                className="block text-sm text-stone-600 file:mr-3 file:rounded file:border file:border-stone-300 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-stone-700 file:transition-colors file:hover:bg-stone-50"
              />
              <button
                type="submit"
                className="rounded border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
