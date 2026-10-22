import type { Metadata } from "next"

import { Eyebrow } from "src/components/brand/Brand"
import { PortalBrandHeader } from "src/components/portal/PortalBrandHeader"
import { TERMS_TEXT, TERMS_VERSION, type TermsBlock } from "src/lib/portal/terms"

export const metadata: Metadata = { title: "Terms of Use — Levine Law" }

function Block({ block }: { block: TermsBlock }) {
  if (block.type === "ul") {
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[15px] leading-7 text-stone-700">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  return <p className="mt-3 text-[15px] leading-7 text-stone-700">{block.text}</p>
}

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
        <div className="mt-8">
          {TERMS_TEXT.map((section, index) => (
            <section key={section.heading ?? `section-${index}`} className={section.level === 2 ? "mt-10" : "mt-6"}>
              {section.heading ? (
                section.level === 2 ? (
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-950">
                    {section.heading}
                  </h2>
                ) : (
                  <h3 className="text-base font-semibold text-stone-950">{section.heading}</h3>
                )
              ) : null}
              {section.blocks.map((block, blockIndex) => (
                <Block key={blockIndex} block={block} />
              ))}
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}
