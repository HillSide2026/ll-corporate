/**
 * Services offered to leads (prospect tier) on the portal welcome page.
 * ML1 2026-10-22: CORP-001, CORP-002 (founders tier), CORP-003 and CORP-009.
 * CORP-006 Corporate Maintenance is not offered to leads.
 * No prices or add-ons are shown; each fee is quoted after the conflict check (ML1 2026-10-22).
 * Codes are SERVICES_REGISTRY.json codes in ll-secondbrain. Two offers can draw on the
 * same service line (both letter of intent offers draw on COMM-022, ML1 2026-11-18), so
 * the portal tells offers apart by offerKey, never by code.
 */
export type LeadService = {
  /**
   * Unique, stable key for the offer. Stored in intake_conflict_requests.service_code and
   * final_service_code, so it keeps the values those rows were written with. Never change one.
   */
  offerKey: string
  /** Registry service line code (SERVICES_REGISTRY.json). Not unique across offers. */
  code: string
  /** Registry service line name, as in the SharePoint Onboarding library's Service Name column. */
  serviceName: string
  slug: string
  category: string
  title: string
  summary: string
  includes: string[]
  /** Flat test fee (all in) for measuring profitability; not shown to leads. ML1 sets these. */
  testFeeCents?: number
  /** Why a client wants this service; shown on the conflict check page. Draft, pending ML1 review. */
  why: string
  /**
   * Selling points shown once the lead has sent the conflict check (ML1 2026-11-25). DRAFT
   * pending MJL review. Each point is taken from the firm's own records for the service line
   * (sources listed above each offer's points); none states a result, a fee or a timeline.
   */
  sellingPoints: string[]
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
    offerKey: "CORP-001",
    code: "CORP-001",
    serviceName: "Incorporation",
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
    // Sources: Core Solutions CORP-001 Incorporation/Incorporation_SCOPE v06.docx (in-scope use
    // cases, minute book tab structure, Appendix A typical minute book documents); portal includes.
    sellingPoints: [
      "Ontario (OBCA) or federal (CBCA) incorporation for start-ups, family businesses, small businesses and subsidiaries",
      "Articles of incorporation prepared and filed",
      "By-Law No. 1 and the organizing resolutions of the directors and the shareholders",
      "Share subscriptions, consents to act as director and share certificates",
      "Registers of directors, officers, securities, shareholders, transfers and individuals with significant control, with the shareholder ledger",
      "For an Ontario corporation, the register of ownership interests in land",
      "Minute book set up on the firm's 12-tab structure, ready for annual maintenance",
    ],
    conflict: {
      companyLabel: "Proposed company name",
      companyHint: "Leave blank if you haven't chosen one yet.",
      partiesLabel: "Proposed shareholders and directors",
      partiesHint: "Full names, one per line.",
    },
  },
  // Founders' Agreement is the Founders' Agreement level of CORP-002 Shareholder Agreements,
  // which has three levels: Founders' Agreement, Shareholders' Agreement and Unanimous
  // Shareholders' Agreement (ML1 2026-11-24).
  {
    offerKey: "CORP-002",
    code: "CORP-002",
    serviceName: "Shareholder Agreements",
    slug: "founders-shareholder-agreement",
    category: "Co-founders",
    title: "Founders' Agreement",
    summary: "Agree on ownership, vesting, voting and exits before they become disputes.",
    includes: ["Vesting and departure terms", "How founders vote their shares, and deadlocks between them"],
    why: "Without an agreement, the corporate statute and your articles decide what happens when founders disagree or one of you leaves. A founders' agreement sets ownership, vesting, how you vote your shares and exits on your terms, while everyone is still aligned.",
    // Sources: Core Solutions CORP-002 Shareholder Agreements/Shareholder_Agreements_Service_Line_SCOPE_LLS_Redline.docx
    // (rows 1, 2, 7, 9, 14, 15; agreement type, agreement, records after signing); ML1 2026-11-25 (a
    // founders' agreement binds the founders as shareholders and does not restrict the directors).
    sellingPoints: [
      "A written agreement among the founders, as shareholders, setting out vesting and departure terms",
      "How the founders vote their shares, including on the election of directors, and how a deadlock between them is resolved",
      "Deadlock terms for two founders; majority and minority terms for three or more",
      "Transfer restrictions, a right of first refusal, and tag-along and drag-along terms",
      "Terms for the death, incapacity, marriage breakdown, bankruptcy or departure of a founder",
      "Funding terms: capital calls, shareholder loans and pre-emptive rights",
      "The agreement checked against the articles and by-laws so the two do not conflict",
      "After signing, the agreement filed in the minute book and the transfer restriction recorded in the securities register",
    ],
    conflict: {
      companyLabel: "Company name",
      companyHint: "Include a proposed name if the company doesn't exist yet.",
      partiesLabel: "Your co-founders",
      partiesHint: "Full names, one per line.",
    },
  },
  {
    offerKey: "CORP-003",
    code: "CORP-003",
    serviceName: "New Shareholder",
    slug: "new-shareholder",
    category: "Ownership change",
    title: "New Shareholder Admission",
    summary: "Bring in a new shareholder with the approvals, share issuance or transfer, and registers done properly.",
    includes: ["Board and shareholder approvals", "Share issuance or transfer", "Updated registers and certificates"],
    why: "A new shareholder changes who owns and controls the company. Admitting them properly, with the right approvals, share issuance or transfer and updated registers, keeps your records accurate and avoids disputes later about who owns what.",
    // Sources: Core Solutions CORP-003 New Shareholder/Shareholder_Change_Service_Line_SCOPE LLS
    // Redline 2026-10-31.docx (rows 1 to 3, 5 to 8; components, stated capital, ISC register, exemption checklist).
    sellingPoints: [
      "Share issuances under the OBCA or the CBCA, to a new or an existing shareholder",
      "Share transfers, with the articles, any shareholder agreement and any right of first refusal reviewed first",
      "Pre-emptive rights dealt with by offer or written waiver before the documents are drafted",
      "Directors' resolution, subscription agreement and share certificate, with the transfer-restriction legend where required",
      "Stated capital credited to the right class or series",
      "Securities register, register of transfers and register of individuals with significant control brought up to date",
      "The prospectus exemption for the issuance confirmed from the standard set, such as the private issuer exemption",
    ],
    conflict: {
      companyLabel: "Company name",
      companyHint: "The company the new shareholder is joining.",
      partiesLabel: "Existing shareholders and the incoming shareholder",
      partiesHint: "Full names of people or companies, one per line.",
    },
  },
  {
    offerKey: "CORP-009",
    code: "CORP-009",
    serviceName: "Corporate CheckUp",
    slug: "corporate-checkup",
    category: "Records review",
    title: "Review & Update Minute Book",
    summary:
      "A lawyer reviews your corporate records and tells you what is missing or out of date, and what it takes to fix it.",
    includes: ["Minute book and register review", "Public record comparison", "Written list of gaps and fixes"],
    why: "Gaps in corporate records tend to surface at the worst moment: a financing, a sale or a bank's due diligence. This review finds what is missing or out of date while it is still simple to fix.",
    // Sources: Core Solutions CORP-009 Corporate CheckUp/Corporate CheckUp_Service_Line_SCOPE LLS
    // 2026-10-14.docx (rows 1 to 8 and 15; corporate searches, review areas, supervisory checklist,
    // findings and plan, confirmation resolutions, deliverables).
    sellingPoints: [
      "For Ontario (OBCA) and federal (CBCA) corporations up to five years old",
      "Public records searched at the Ontario Business Registry or Corporations Canada and compared against the minute book",
      "Other provincial registries searched where the corporation carries on business in another province",
      "Review of the articles, resolutions, directors and officers, share issuances and transfers, annual proceedings, registers, by-laws and any unanimous shareholder agreement",
      "The reviewer's findings confirmed by a supervising lawyer",
      "A findings table listing each missing or defective record and its fix",
      "A one-page corporate summary of directors, officers, shareholders and filing status",
      "Current-dated omnibus confirming resolutions of the directors and of the shareholders, with updated registers",
    ],
    conflict: {
      companyLabel: "Company name",
      companyHint: "The company whose records we will review.",
      partiesLabel: "Current shareholders, directors and officers",
      partiesHint: "Full names of people or companies, one per line.",
    },
  },
  // Private company M&A entry offers (ML1 2026-10-22). Both draw on COMM-022 Letter of
  // Intent (LOI) Review and Negotiation, a solution (ML1 2026-11-18). Their offerKeys keep
  // the portal keys they were stored under before that ruling.
  {
    offerKey: "MA-LOI-PREP",
    code: "COMM-022",
    serviceName: "Letter of Intent (LOI) Review and Negotiation",
    slug: "letter-of-intent",
    category: "Buying a business",
    title: "Prepare Letter of Intent",
    summary: "Put your offer for a business on paper, with the protections a buyer needs written in from the start.",
    includes: [
      "Letter of intent drafted from your agreed terms",
      "Binding and non-binding terms set apart",
      "Exclusivity, due diligence access and conditions",
    ],
    why: "The letter of intent sets the price, the structure and the timetable for the whole deal. Terms agreed loosely at this stage are hard to change later, and the exclusivity period it sets is the time you will have for due diligence.",
    // Sources: repo 02_PLAYBOOKS/CORPORATE/STRATEGIES/ASSET_PURCHASE/STRATEGY_SCOPE.yaml (Entry A) and
    // SHARE_SALE/STRATEGY_ARCHITECTURE.yaml (M1, calls COMM-022); LLP-055 README (open to buyers or
    // sellers, ML1 2026-10-22); portal includes. Core Solutions has no COMM-022 folder.
    sellingPoints: [
      "A letter of intent drafted from the terms agreed in principle",
      "Binding terms set apart from non-binding terms",
      "Binding terms covering confidentiality, exclusivity, governing law and how the letter ends",
      "Non-binding terms covering price and payment, what is being bought, assumed liabilities, conditions, the target closing date and the scope and timing of due diligence",
      "For a buyer, exclusivity long enough for due diligence, with due diligence access written in",
      "On an asset purchase, price allocation and the HST going-concern election raised from the start",
      "Available to buyers and sellers",
    ],
    conflict: {
      companyLabel: "Business being bought or sold",
      companyHint: "The company or business name, as listed.",
      partiesLabel: "Your side of the deal",
      partiesHint: "You and anyone buying or selling with you, people or companies, one per line.",
    },
    screening: [buyingOrSelling],
  },
  {
    offerKey: "MA-LOI-REVIEW",
    code: "COMM-022",
    serviceName: "Letter of Intent (LOI) Review and Negotiation",
    slug: "letter-of-intent-review",
    category: "Buying a business",
    title: "Review Letter of Intent",
    summary:
      "A lawyer reads the letter of intent or offer in front of you and tells you what it commits you to and what is still open.",
    includes: [
      "What binds you, and when exclusivity ends",
      "What the letter has already fixed",
      "What is still open for the purchase agreement",
    ],
    why: "Once a letter of intent is signed, its binding terms apply and its exclusivity clock is running. Knowing exactly what it commits you to, and what it leaves open, shapes due diligence and the purchase agreement that follows.",
    // Sources: repo 02_PLAYBOOKS/CORPORATE/STRATEGIES/ASSET_PURCHASE/STRATEGY_SCOPE.yaml (Entry B) and
    // SHARE_SALE/STRATEGY_ARCHITECTURE.yaml (M1 Entry B review memo); LLP-055 README (open to buyers
    // or sellers); portal includes. Core Solutions has no COMM-022 folder.
    sellingPoints: [
      "Review of the letter of intent or offer in hand, signed or not",
      "What binds now, and when exclusivity ends",
      "What the letter has already fixed",
      "What is left open for the purchase agreement, often price allocation and the HST election on an asset deal",
      "The findings set out in a short written memo",
      "Available to buyers and sellers",
    ],
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

/** Looks an offer up by the key stored in intake_conflict_requests.service_code. */
export function findLeadServiceByKey(offerKey: string | null | undefined): LeadService | undefined {
  return offerKey ? leadServices.find((s) => s.offerKey === offerKey) : undefined
}
