export type ServicePriceType = "fixed" | "estimate" | "quote"

export type ServiceSlug =
  | "incorporation"
  | "director-officer-change"
  | "share-issuance"
  | "minute-book-update"
  | "annual-return-basic-filing"

export type CorporateService = {
  slug: ServiceSlug
  title: string
  description: string
  priceType: ServicePriceType
  price?: string
  turnaround: string
  scope: string[]
  assumptions: string[]
  requiredInputs: string[]
  ctaLabel: string
}

export function getServicePriceDisplay(service: CorporateService) {
  if (service.price) {
    return service.price
  }

  if (service.priceType === "quote") {
    return "Quoted after review"
  }

  return "Estimate provided after review"
}

export function getServicePriceTypeLabel(priceType: ServicePriceType) {
  if (priceType === "fixed") {
    return "Fixed fee"
  }

  if (priceType === "estimate") {
    return "Estimate"
  }

  return "Quote"
}

export const serviceCatalog: readonly CorporateService[] = [
  {
    slug: "incorporation",
    title: "Incorporation",
    description: "Set up a new corporation with the core documents needed to get started.",
    priceType: "estimate",
    price: "From $1,250 + disbursements",
    turnaround: "Typically 3-5 business days after required information is received.",
    scope: [
      "Prepare and file articles of incorporation.",
      "Prepare initial organizational resolutions.",
      "Create initial director and officer records.",
      "Provide a basic minute book package.",
    ],
    assumptions: [
      "One standard private corporation.",
      "No complex share structure or tax planning is included.",
      "Client provides complete shareholder, director, officer, and address information.",
    ],
    requiredInputs: [
      "Proposed corporation name or numbered company preference.",
      "Jurisdiction.",
      "Registered office address.",
      "Director and officer details.",
      "Shareholder and share structure details.",
    ],
    ctaLabel: "Start incorporation request",
  },
  {
    slug: "director-officer-change",
    title: "Director/Officer Change",
    description: "Update corporate records after directors or officers are appointed, removed, or changed.",
    priceType: "fixed",
    price: "$450 + disbursements",
    turnaround: "Typically 2-3 business days after required information is received.",
    scope: [
      "Prepare director or officer change resolutions.",
      "Update internal corporate records.",
      "Prepare basic filing instructions or filing materials where applicable.",
    ],
    assumptions: [
      "The corporation is already organized and in good standing.",
      "The change is not contested.",
      "No shareholder dispute, governance review, or tax advice is included.",
    ],
    requiredInputs: [
      "Corporation name.",
      "Current director and officer details.",
      "New or departing director and officer details.",
      "Effective date of the change.",
    ],
    ctaLabel: "Start change request",
  },
  {
    slug: "share-issuance",
    title: "Share Issuance",
    description: "Prepare records for a basic issuance of shares by an existing corporation.",
    priceType: "estimate",
    price: "From $650 + disbursements",
    turnaround: "Typically 3-5 business days after required information is received.",
    scope: [
      "Prepare share subscription or issuance records.",
      "Prepare director resolutions approving the issuance.",
      "Update securities register details provided by the client.",
    ],
    assumptions: [
      "The issuance is approved and not contested.",
      "No securities law exemption analysis beyond a basic private-company issuance is included.",
      "No valuation, tax, or shareholder agreement advice is included.",
    ],
    requiredInputs: [
      "Corporation name.",
      "Shareholder details.",
      "Class and number of shares.",
      "Issue price or stated consideration.",
      "Effective date.",
    ],
    ctaLabel: "Start share issuance request",
  },
  {
    slug: "minute-book-update",
    title: "Minute Book Update",
    description: "Bring corporate records up to date based on changes and documents provided by the client.",
    priceType: "estimate",
    price: "From $750 + disbursements",
    turnaround: "Typically 5-10 business days after required information is received.",
    scope: [
      "Review client-provided corporate records.",
      "Identify apparent gaps in standard minute book records.",
      "Prepare basic updating resolutions or registers where appropriate.",
    ],
    assumptions: [
      "Client provides existing records and known change history.",
      "No forensic reconstruction or dispute review is included.",
      "Additional work may be quoted if records are incomplete or inconsistent.",
    ],
    requiredInputs: [
      "Corporation name.",
      "Existing minute book or available corporate records.",
      "List of known changes since the last update.",
      "Current director, officer, and shareholder details.",
    ],
    ctaLabel: "Start update request",
  },
  {
    slug: "annual-return-basic-filing",
    title: "Annual Return / Basic Filing",
    description: "Prepare or support a basic recurring corporate filing for an existing corporation.",
    priceType: "fixed",
    price: "$350 + disbursements",
    turnaround: "Typically 2-3 business days after required information is received.",
    scope: [
      "Confirm basic corporate information for the filing.",
      "Prepare filing details based on client instructions.",
      "Provide confirmation or next steps after filing support is complete.",
    ],
    assumptions: [
      "The filing is routine and non-urgent.",
      "Corporate information is current and complete.",
      "No reinstatement, compliance remediation, or complex filing issue is included.",
    ],
    requiredInputs: [
      "Corporation name.",
      "Jurisdiction.",
      "Filing year or period.",
      "Current registered office and director details.",
    ],
    ctaLabel: "Start filing request",
  },
]

export function getServiceBySlug(slug: string): CorporateService | undefined {
  return serviceCatalog.find((service) => service.slug === slug)
}
