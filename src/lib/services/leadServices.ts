/**
 * Services offered to leads (prospect tier) on the portal welcome page.
 * ML1 2026-10-22: CORP-001, CORP-002 (founders tier), CORP-003, CORP-006 and CORP-009.
 * Codes are SERVICES_REGISTRY.json codes in ll-secondbrain.
 */
export type LeadService = {
  code: string
  slug: string
  category: string
  title: string
  summary: string
  includes: string[]
  /** Omitted until ML1 sets the fee; the page then says the fee is confirmed before payment. */
  price?: string
  addOns?: string[]
}

export const leadServices: LeadService[] = [
  {
    code: "CORP-001",
    slug: "incorporation",
    category: "New company",
    title: "Incorporation",
    summary: "Start an Ontario or federal corporation with the right share structure and a complete minute book from day one.",
    includes: [
      "Articles of incorporation and filing",
      "By-laws and organizing resolutions",
      "Share, director and officer registers",
      "Minute book set up and ready to maintain",
    ],
    price: "From $1,250 + disbursements",
    addOns: [
      "GST/HST registration",
      "CRA representative authorization",
      "Extra-provincial registration",
      "Non-standard share structure",
    ],
  },
  {
    code: "CORP-002",
    slug: "founders-shareholder-agreement",
    category: "Co-founders",
    title: "Founders' Shareholder Agreement",
    summary: "Agree on ownership, vesting, decisions and exits before they become disputes.",
    includes: ["Two or three founders", "Vesting and departure terms", "Decision-making and deadlock rules"],
  },
  {
    code: "CORP-003",
    slug: "new-shareholder",
    category: "Ownership change",
    title: "New Shareholder Admission",
    summary: "Bring in a new shareholder with the approvals, share issuance or transfer, and registers done properly.",
    includes: ["Board and shareholder approvals", "Share issuance or transfer", "Updated registers and certificates"],
  },
  {
    code: "CORP-006",
    slug: "corporate-maintenance",
    category: "Annual plan",
    title: "Corporate Maintenance",
    summary: "Keep your company in good standing every year without having to think about it.",
    includes: ["Annual resolutions", "Annual return filing", "Minute book kept current"],
  },
  {
    code: "CORP-009",
    slug: "corporate-checkup",
    category: "Records review",
    title: "Corporate CheckUp",
    summary: "A lawyer reviews your corporate records and tells you what is missing or out of date, and what it takes to fix it.",
    includes: ["Minute book and register review", "Public record comparison", "Written list of gaps and fixes"],
  },
]
