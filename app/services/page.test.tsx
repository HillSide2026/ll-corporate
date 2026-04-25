import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { serviceCatalog } from "src/lib/services/catalog"

import ServicesPage from "./page"

describe("ServicesPage", () => {
  it("renders the public service menu from the catalog", () => {
    render(<ServicesPage />)

    expect(screen.getByRole("heading", { name: "Choose the right corporate service." })).toBeInTheDocument()

    const detailLinks = screen.getAllByRole("link", { name: "View service details" })

    for (const service of serviceCatalog) {
      expect(screen.getByRole("heading", { name: service.title })).toBeInTheDocument()
    }

    expect(detailLinks.map((link) => link.getAttribute("href"))).toEqual(
      serviceCatalog.map((service) => `/services/${service.slug}`)
    )
  })
})
