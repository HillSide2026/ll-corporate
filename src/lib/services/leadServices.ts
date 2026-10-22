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
  /** Why a client wants this service; shown on the conflict check page. Draft, pending ML1 review. */
  why: string
  /** Conflict check form wording for this service (ML1 2026-10-22). */
  conflict: { companyLabel: string; companyHint: string; partiesLabel: string; partiesHint: string }
}

export const leadServices: LeadService[] = [
  {
    code: "CORP-001",
    slug: "incorporation",
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
]
