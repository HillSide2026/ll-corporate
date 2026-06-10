"use client"

import { useState } from "react"
import Link from "next/link"

import { getServicePriceDisplay, serviceCatalog } from "src/lib/services/catalog"

const products = [
  {
    slug: "founders-pack",
    title: "Founders Pack",
    description:
      "Core legal documents for new companies — structured to move quickly from idea to incorporated entity with the right foundation in place.",
    price: "Contact for pricing",
    ghlUrl: "http://legal.levine-law.ca/ip1",
  },
  {
    slug: "founders-agreement",
    title: "Founders Agreement",
    description:
      "A founders-specific shareholders agreement establishing ownership, vesting, and decision-making from day one.",
    price: "Contact for pricing",
    ghlUrl: "http://legal.levine-law.ca/ip2",
  },
  {
    slug: "corporate-health-check",
    title: "Corporate Health Check",
    description:
      "A senior-level diagnostic of your company's corporate records and governance posture. Identifies gaps before they become problems.",
    price: "By consultation",
    inquiry: true,
  },
] as const

export function CatalogClient() {
  const [tab, setTab] = useState<"products" | "services">("products")

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-navy uppercase">Levine Law</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">Products and services</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Browse packaged products or select a service to begin intake.
        </p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-stone-200">
        {(["products", "services"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-brand-navy text-brand-navy"
                : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            {t === "products" ? "Products" : "Services"}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex flex-col rounded border border-stone-200 bg-white p-5 shadow-sm"
            >
              <p className="text-base font-semibold text-stone-900">{product.title}</p>
              <p className="mt-2 flex-1 text-sm leading-6 text-stone-500">{product.description}</p>
              <p className="mt-4 text-sm font-medium text-stone-600">{product.price}</p>
              <div className="mt-4">
                {"inquiry" in product ? (
                  <a
                    href="mailto:matthew@levinelegal.ca?subject=Corporate Health Check inquiry"
                    className="inline-flex w-full items-center justify-center rounded border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
                  >
                    Request a consultation
                  </a>
                ) : (
                  <a
                    href={"ghlUrl" in product ? product.ghlUrl : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
                  >
                    Purchase ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "services" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {serviceCatalog.map((service) => (
            <div
              key={service.slug}
              className="flex flex-col rounded border border-stone-200 bg-white p-5 shadow-sm"
            >
              <p className="text-base font-semibold text-stone-900">{service.title}</p>
              <p className="mt-2 flex-1 text-sm leading-6 text-stone-500">{service.description}</p>
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-stone-100 pt-4">
                <div>
                  <p className="text-sm font-medium text-stone-700">{getServicePriceDisplay(service)}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{service.turnaround}</p>
                </div>
                <Link
                  href={`/intake/questionnaire/${service.slug}`}
                  className="shrink-0 rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-dark"
                >
                  Get started
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
