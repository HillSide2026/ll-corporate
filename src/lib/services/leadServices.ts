/**
 * Services offered to leads (prospect tier) on the portal welcome page.
 * ML1 2026-10-22: CORP-001, CORP-002 (founders tier), CORP-003 and CORP-009.
 * CORP-006 Corporate Maintenance is not offered to leads.
 * No prices or add-ons are shown; each fee is quoted after the conflict check (ML1 2026-10-22).
 * Codes are SERVICES_REGISTRY.json codes in ll-secondbrain.
 */
export type LeadService = {
  code: string
  slug: string
  category: string
  title: string
  summary: string
  includes: string[]
  /** Flat test fee (all in) for measuring profitability; not shown to leads. ML1 sets these. */
  testFeeCents?: number
  /** Why a client wants this service; shown on the conflict check page. Draft, pending ML1 review. */
  why: string
  /** Conflict check form wording for this service (ML1 2026-10-22). */
  conflict: { companyLabel: string; companyHint: string; partiesLabel: string; partiesHint: string }
  /** Routing questions asked with the conflict check. Never matter details (ML1 2026-10-22). */
  screening?: ScreeningQuestion[]
}

export type ScreeningQuestion = { name: string; label: string; options: string[] }

const buyingOrSelling: ScreeningQuestion = {
  name: "side",
  label: "Are you buying or selling?",
  options: ["Buying", "Selling"],
}

export const leadServices: LeadService[] = [
  {
    code: "CORP-001",
    slug: "incorporation",
    testFeeCents: 120000, // ML1 2026-10-22: $1,200 all in
    category: "New company",
    title: "Incorporation",
    summary:
      "Start an Ontario or federal corporation with the right share structure and a complete minute book from day one.",
    includes: [
      "Articles of incorporation and filing",
      "By-laws and organizing resolutions",
      "Share, director and officer registers",
      "Minute book set up and ready to maintain",
    ],
    why: "A corporation is a legal person separate from you. It can limit your personal liability for the business's debts, make it easier to bring in partners and investors, and open up tax planning that isn't available to a sole proprietor.",
    conflict: {
      companyLabel: "Proposed company name",
      companyHint: "Leave blank if you haven't chosen one yet.",
      partiesLabel: "Proposed shareholders and directors",
      partiesHint: "Full names, one per line.",
    },
  },
  {
    code: "CORP-002",
    slug: "founders-shareholder-agreement",
    category: "Co-founders",
    title: "Founders' Shareholder Agreement",
    summary: "Agree on ownership, vesting, decisions and exits before they become disputes.",
    includes: ["Two or three founders", "Vesting and departure terms", "Decision-making and deadlock rules"],
    why: "Without an agreement, the corporate statute and your articles decide what happens when founders disagree or one of you leaves. A shareholders' agreement sets ownership, vesting, decision-making and exits on your terms, while everyone is still aligned.",
    conflict: {
      companyLabel: "Company name",
      companyHint: "Include a proposed name if the company doesn't exist yet.",
      partiesLabel: "Your co-founders",
      partiesHint: "Full names, one per line.",
    },
  },
  {
    code: "CORP-003",
    slug: "new-shareholder",
    category: "Ownership change",
    title: "New Shareholder Admission",
    summary: "Bring in a new shareholder with the approvals, share issuance or transfer, and registers done properly.",
    includes: ["Board and shareholder approvals", "Share issuance or transfer", "Updated registers and certificates"],
    why: "A new shareholder changes who owns and controls the company. Admitting them properly, with the right approvals, share issuance or transfer and updated registers, keeps your records accurate and avoids disputes later about who owns what.",
    conflict: {
      companyLabel: "Company name",
      companyHint: "The company the new shareholder is joining.",
      partiesLabel: "Existing shareholders and the incoming shareholder",
      partiesHint: "Full names of people or companies, one per line.",
    },
  },
  {
    code: "CORP-009",
    slug: "corporate-checkup",
    category: "Records review",
    title: "Corporate CheckUp",
    summary:
      "A lawyer reviews your corporate records and tells you what is missing or out of date, and what it takes to fix it.",
    includes: ["Minute book and register review", "Public record comparison", "Written list of gaps and fixes"],
    why: "Gaps in corporate records tend to surface at the worst moment: a financing, a sale or a bank's due diligence. A CheckUp finds what is missing or out of date while it is still simple to fix.",
    conflict: {
      companyLabel: "Company name",
      companyHint: "The company whose records we will review.",
      partiesLabel: "Current shareholders, directors and officers",
      partiesHint: "Full names of people or companies, one per line.",
    },
  },
  // Private company M&A entry offers (ML1 2026-10-22). Neither has a registry code yet:
  // they are phases 1A and 1B of CORP-036 Share Purchase and CORP-037 Asset Purchase,
  // and their classification goes to the LLP-015 MS1 ruling. These codes are portal keys only.
  {
    code: "MA-LOI-PREP",
    slug: "letter-of-intent",
    category: "Buying a business",
    title: "Letter of Intent",
    summary: "Put your offer for a business on paper, with the protections a buyer needs written in from the start.",
    includes: [
      "Letter of intent drafted from your agreed terms",
      "Binding and non-binding terms set apart",
      "Exclusivity, due diligence access and conditions",
    ],
    why: "The letter of intent sets the price, the structure and the timetable for the whole deal. Terms agreed loosely at this stage are hard to change later, and the exclusivity period it sets is the time you will have for due diligence.",
    conflict: {
      companyLabel: "Business being bought or sold",
      companyHint: "The company or business name, as listed.",
      partiesLabel: "Your side of the deal",
      partiesHint: "You and anyone buying or selling with you, people or companies, one per line.",
    },
    screening: [buyingOrSelling],
  },
  {
    code: "MA-LOI-REVIEW",
    slug: "letter-of-intent-review",
    category: "Buying a business",
    title: "Letter of Intent Review",
    summary:
      "A lawyer reads the letter of intent or offer in front of you and tells you what it commits you to and what is still open.",
    includes: [
      "What binds you, and when exclusivity ends",
      "What the letter has already fixed",
      "What is still open for the purchase agreement",
    ],
    why: "Once a letter of intent is signed, its binding terms apply and its exclusivity clock is running. Knowing exactly what it commits you to, and what it leaves open, shapes due diligence and the purchase agreement that follows.",
    conflict: {
      companyLabel: "Business being bought or sold",
      companyHint: "The company or business name, as listed.",
      partiesLabel: "Your side of the deal",
      partiesHint: "You and anyone buying or selling with you, people or companies, one per line.",
    },
    screening: [
      buyingOrSelling,
      { name: "signed", label: "Has the letter of intent or offer been signed?", options: ["Yes", "Not yet"] },
    ],
  },
]

export function findLeadService(slug: string | null | undefined): LeadService | undefined {
  return slug ? leadServices.find((s) => s.slug === slug) : undefined
}
