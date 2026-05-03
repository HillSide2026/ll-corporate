import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import ServicesPage from "./page"

describe("ServicesPage", () => {
  it("renders the fractional counsel service page", () => {
    render(<ServicesPage />)

    expect(screen.getByRole("heading", { name: /Ongoing legal support/ })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Essential Counsel" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Growth Counsel" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Strategic Counsel" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "How fractional counsel works" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Need a specific filing or document?" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Access Client Portal" })).toHaveAttribute("href", "/corporate")
  })
})
