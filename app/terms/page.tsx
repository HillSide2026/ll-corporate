import type { Metadata } from "next"

import { Eyebrow } from "src/components/brand/Brand"
import { PortalBrandHeader } from "src/components/portal/PortalBrandHeader"
import { TERMS_TEXT, TERMS_VERSION } from "src/lib/portal/terms"

export const metadata: Metadata = { title: "Terms of Use — Levine Law" }

export default function TermsPage() {
  return (
    <main className="min-h-dvh bg-stone-50">
      <PortalBrandHeader className="max-w-3xl" />
      <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Eyebrow rule>Levine Law Portal</Eyebrow>
        <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-stone-950">Terms of Use</h1>
        {TERMS_VERSION ? (
          <p className="mt-3 text-sm text-stone-500">Version {TERMS_VERSION}</p>
        ) : (
          <p className="mt-6 text-[15px] leading-7 text-stone-600">The Terms of Use are being finalized.</p>
        )}
        <div className="mt-10 space-y-8">
          {TERMS_TEXT.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-xl font-semibold text-stone-950">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-3 text-[15px] leading-7 text-stone-700">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}
