/**
 * Portal Terms of Use (ML1 2026-10-22: every portal page links to them, sign-up
 * requires agreement, and the confirmation email must state that the user agreed).
 *
 * Text: ML1's portal Terms of Use and Platform Privacy Policy, version 2026-10-22-portal,
 * copied verbatim from "portal terms.docx" (ML1, 2026-10-22). The document's title, version
 * line and copyright line are shown by the page and footer, not repeated here.
 * TERMS_VERSION is recorded against each user who agrees: change it whenever the text changes.
 */
export const TERMS_URL = "/terms"

export const TERMS_VERSION: string | null = "2026-10-22-portal"

export type TermsBlock = { type: "p"; text: string } | { type: "ul"; items: string[] }

export type TermsSection = { heading: string | null; level: 2 | 3; blocks: TermsBlock[] }

export const TERMS_TEXT: TermsSection[] = [
  {
    heading: null,
    level: 2,
    blocks: [
      {
        type: "p",
        text: "By accessing and browsing levine-law.ca or levinelegal.ca (either one or both, the “Website”) or portal.levine-law.ca (the “Portal” and, together with the Website, the “Platform”), you hereby accept these Terms of Use (the “Terms”), including the Platform Privacy Policy set out hereunder.",
      },
      {
        type: "p",
        text: "If you do not agree to accept the Terms, then you must stop using the Platform immediately.",
      },
    ],
  },
  {
    heading: "Portal and Limited Scope Legal Services",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Through the Portal, Levine Law may, in its discretion, offer limited scope legal services to users who become clients (“Limited Scope Services”). Limited Scope Services are provided only under a separate written engagement agreement between you and Levine Law that describes the nature, extent and scope of the services to be provided and their limitations (an “Engagement Agreement”). No Limited Scope Services will be provided, and no lawyer-client relationship will arise, until Levine Law has completed its conflict check and and an Engagement Agreement has been entered into.",
      },
      {
        type: "p",
        text: "Limited Scope Services are limited to the specific tasks described in the applicable Engagement Agreement. Levine Law will not advise you on, and is not responsible for, any matter or any part of your matter outside that scope, even if it is related to, or comes to our attention while we are providing, the Limited Scope Services. You remain responsible for all other aspects of your matter and should obtain independent legal advice on any issue outside the agreed scope.",
      },
      {
        type: "p",
        text: "If there is a conflict between these Terms and an Engagement Agreement, the Engagement Agreement governs with respect to the Limited Scope Services.",
      },
    ],
  },
  {
    heading: "No Legal Advice",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Except for Limited Scope Services provided under an Engagement Agreement, the information provided on the Platform is not intended to be legal advice. Many factors unknown to us may affect the applicability of any statement or comment that we make on our Platform to your particular circumstances.",
      },
      {
        type: "p",
        text: "Except as set out in an Engagement Agreement, the Platform provides general information on legal and related matters and must not be considered to create a lawyer client relationship in any respect. If you require legal advice, you should retain qualified legal professionals to advise you in the context of your particular circumstances. If you would like to retain Us to give you legal advice, please telephone, email or write to any of our lawyers, or submit a request through the Portal, and we will be pleased to discuss whether or not our firm can assist you.",
      },
    ],
  },
  {
    heading: "No Lawyer Client Relationship",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Accessing the Platform, including creating a Portal account or submitting a request through the Portal, does not by itself create a lawyer-client relationship. A lawyer-client relationship arises only when Levine Law confirms in writing that it will act for you, and then only on the terms and within the scope set out in the applicable Engagement Agreement. Until then, you should not provide us with any unsolicited confidential information or material. Unsolicited information and material may not be treated as confidential and will not be protected by any lawyer-client privilege.",
      },
    ],
  },
  {
    heading: "Intellectual Property Notice",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Levine Law either owns the intellectual property rights in the underlying HTML, Java scripts, text, audio clips, video clips and other content that is made available to you on our Platform, or has obtained the permission of the owner of the intellectual property in such content to use the content on our Platform.",
      },
    ],
  },
  {
    heading: "Limited Licence",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Levine Law grants to you a limited license to display on your computer, print, download and use the underlying HTML, text, audio clips, video clips and other content that is made available to you on our Platform, for non-commercial, personal, or educational purposes only, provided that:",
      },
      {
        type: "ul",
        items: [
          "you do not modify any such content; and",
          "you include with and display on each copy of such content the associated copyright notice and this limited license.",
        ],
      },
      {
        type: "p",
        text: "No other use is permitted. Without limiting the generality of the foregoing, you may not:",
      },
      {
        type: "ul",
        items: [
          "make any commercial use of such content;",
          "include such content in or with any product that you create or distribute; or",
          "copy such content onto your or any other website, platform or service.",
        ],
      },
      {
        type: "p",
        text: "Notwithstanding the above, nothing contained in this licence shall be construed as conferring any right under any copyright of Levine Law or any other person who owns the copyright in content provided on our Platform. Documents and other work product delivered to you as part of Limited Scope Services are governed by the applicable Engagement Agreement and not by this licence.",
      },
    ],
  },
  {
    heading: "No Consultation",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Unless and until We specifically agree to consult with you on a specific matter, nothing on this Platform should be considered to create or otherwise constitute a consultation. Even if we do agree to consult with you on a specific matter, any such consultation shall only take place after we have performed a preliminary check to ensure that there is no conflict of interest.",
      },
    ],
  },
  {
    heading: "No Warranties",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Except as expressly set out in an Engagement Agreement, Levine Law does not warrant the quality, accuracy or completeness of any information on our Platform. Such information is provided “as is” without warranty or condition of any kind. The Platform may include inaccuracies or typographical errors, and Levine Law does not warrant that the Platform, including the Portal, will be available, uninterrupted, secure or error-free. In no event shall Levine Law be liable for any damages whatsoever, including special, indirect or consequential damages, arising out of or in connection with the use or performance of information available on this Platform. Nothing in these Terms limits or excludes any duty or liability that Levine Law owes to a client in respect of Limited Scope Services under an Engagement Agreement or applicable law, including the rules of the Law Society of Ontario.",
      },
    ],
  },
  {
    heading: "No Endorsement",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "No endorsement of any third party products or services is expressed or implied by any information, material or content referred to or included on, or linked from or to this Platform.",
      },
    ],
  },
  {
    heading: "Amendments",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "Levine Law retains the right to amend these Terms at any time, including the right to revoke any permissions. No amendment will change the terms of an Engagement Agreement then in effect unless you agree in writing.",
      },
    ],
  },
  {
    heading: "Use of the Platform",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "If you have problems viewing any part of the Platform, please do not hesitate to contact the Webmaster.",
      },
    ],
  },
  {
    heading: "Portal Accounts",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "To use the Portal, you may be required to create an account. You agree to provide accurate and complete registration information and to keep it current. You are responsible for keeping your login credentials confidential and for all activity under your account. You must notify us promptly at {Portal support email address} if you become aware of any unauthorized access to or use of your account. Levine Law may suspend or terminate your access to the Portal at any time, including if we believe your account has been compromised or these Terms have been breached, subject to any obligations we owe you under an Engagement Agreement.",
      },
    ],
  },
  {
    heading: "Platform Privacy Policy",
    level: 2,
    blocks: [
      {
        type: "p",
        text: "As a law firm, we collect, use and disclose information on a regular basis in order to render our services. We use all information, especially personal information, in accordance with the highest ethical standards.",
      },
      {
        type: "p",
        text: "This Platform Privacy Policy aims to help you understand our personal information collection, use, disclosure and retention practices, specifically as it pertains to this Platform. By providing personal information to us via this Platform or by email you agree to the processing set out in this Platform Privacy Policy.",
      },
      {
        type: "p",
        text: "This Platform Privacy Policy does not apply to, and Levine Law is not responsible for, any third-party websites which may be accessible through links from this Platform. If you follow a link to any of these third-party websites, they will have their own privacy policies and you will need to check these policies before you submit any personal information to such third-party websites.",
      },
    ],
  },
  {
    heading: "1. Who we are and what we do?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "Levine Law (“Levine”, “we”, “us” or “our”) is a law firm. Unless we notify you otherwise, we are the “data controller” of your personal information, i.e. the organization who alone or jointly determines the purposes for which, and the manner in which, any personal information is, or is likely to be, processed.",
      },
    ],
  },
  {
    heading: "2. What personal information do we collect?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "We may collect and process different types of personal information in the course of operating our business and providing our services. These include:",
      },
      {
        type: "p",
        text: "• Contact information such as name, email address and telephone number;",
      },
      {
        type: "p",
        text: "• Portal account information such as username, password, security settings, and login and activity history;",
      },
      {
        type: "p",
        text: "• Biographical information such as job title, employer, photograph and video or audio content;",
      },
      {
        type: "p",
        text: "• Marketing, communication preferences and related information such as meal preferences, feedback and survey responses;",
      },
      {
        type: "p",
        text: "• Billing and financial information such as billing address, bank account and payment information;",
      },
      {
        type: "p",
        text: "• Services information such as details of services that we have purchased;",
      },
      {
        type: "p",
        text: "• Recruitment information such as your curriculum vitae, your education and employment history, details of professional memberships and other information relevant to potential recruitment or association to or with us;",
      },
      {
        type: "p",
        text: "• Platform usage and other technical information such as details of visits to the Platform or information collected through cookies and other tracking technologies;",
      },
      {
        type: "p",
        text: "• Information provided to us by or on behalf of our clients or generated by us in the course of providing our services, which may, where relevant, include special categories of personal information (such as racial or ethnic origin, political opinions, religious or philosophical beliefs, trade-union membership, health or sexual orientation, etc.);",
      },
      {
        type: "p",
        text: "• Identification and other background verification data such as a copy of driver’s licence, passports or utility bills or evidence of beneficial ownership or the source of funds to comply with anti-money laundering laws and collected as part of our client acceptance and ongoing monitoring procedures; and",
      },
      {
        type: "p",
        text: "• Any other personal information provided. Please note that if you provide personal information to us about other people (such as your customers, directors, officers, shareholders or beneficial owners), you must ensure that you have given those individuals an appropriate notice that you are providing their information to us and have obtained their consent to that disclosure.",
      },
      {
        type: "p",
        text: "We do not knowingly collect information from children or other persons who are under 16 years old.",
      },
      {
        type: "p",
        text: "You cannot send us confidential information until we have confirmed in writing that we represent or act for you or your company or organization. Unsolicited emails sent to us from non-clients do not establish a lawyer-client relationship. They may not be privileged and, therefore, are subject to disclosure to third parties.",
      },
    ],
  },
  {
    heading: "3. How do we use personal information?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "We may use personal information in the following ways. In each case, we identify the grounds that we rely on to use your personal information:",
      },
      {
        type: "p",
        text: "• To provide our legal and other services (including Limited Scope Services through the Portal) and to conduct our business – to administer and perform our services, including to carry out our obligations arising from any agreements entered into between you and us. Applicable legal grounds: contract performance, legitimate interests (to enable us to perform our obligations and provide our services), consent;",
      },
      {
        type: "p",
        text: "• To facilitate use of the Platform and to ensure content is relevant – to respond to requests for information or enquiries from visitors to the Platform and to ensure that content from the Platform is presented in the most effective manner for you and for your device. Applicable legal grounds: legitimate interests (to allow us to provide the content and services on the Platform), consent, contract performance;",
      },
      {
        type: "p",
        text: "• For marketing and business development purposes – to provide details of new services, legal updates and invitations to seminars and events where an individual has chosen to receive these. Applicable legal grounds: legitimate interests, consent;",
      },
      {
        type: "p",
        text: "• For research and development purposes (including from a security perspective) – analysis in order to better understand our clients’ services and marketing requirements and to better understand our business and develop our services and offerings. Applicable legal grounds: legitimate interests (to allow us to improve our services);",
      },
      {
        type: "p",
        text: "• For recruitment purposes – to enable us to process applications for employment and to assess your suitability for any position for which an individual may apply. Applicable legal grounds: legitimate interests (to ensure that we can make the most appropriate recruitment decisions for us), contract performance (in order for us to take steps to enter into a contract with someone who requested it);",
      },
      {
        type: "p",
        text: "• To fulfil our legal, regulatory, or risk management obligations – to comply with our legal obligations (performing client due diligence/“know your client”, anti-bribery, sanctions or reputational risk screening, identifying conflicts of interests); for the prevention of fraud and/or other relevant background checks as may be required by applicable law and regulation and best practice at any given time (if false or inaccurate information is provided and fraud is identified or suspected, details may be passed to fraud prevention agencies and may be recorded by us or by them); to enforce our legal rights, to comply with our legal or regulatory reporting obligations and/or to protect the rights of third parties. Applicable legal grounds: legal obligations, legal claims, legitimate interests (to cooperate with law enforcement and regulatory authorities, to ensure acceptable risk profile and to assist with the prevention of crime and fraud). Where we process special categories of personal information we may also rely on substantial public interest (prevention or detection of crime) or legal claims;",
      },
      {
        type: "p",
        text: "• To ensure that we are paid – to recover any payments due to us and where necessary to enforce such recovery through the engagement of debt collection agencies or taking other legal action (including the commencement and carrying out of legal and court proceedings). Applicable legal grounds: contract performance, legal claims, legitimate interests (to ensure that we are paid for our services);",
      },
      {
        type: "p",
        text: "• To reorganize or make changes to our business – In the event that we undergo a reorganization (for example if we merge, combine or divest a part of our business), we may need to transfer some or all of personal information to the relevant third party (or its advisors) as part of any due diligence process or transfer to that reorganized entity or third party your personal information for the same purposes as set out in this Platform Privacy Policy or for the purpose of analyzing any proposed reorganization. Applicable legal grounds: legitimate interests (in order to allow us to change our business).",
      },
    ],
  },
  {
    heading: "4. With whom do we share personal information?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "We are a law firm and as such, any personal information that we collect may be processed within our firm. We may also share personal information with certain third parties such as:",
      },
      {
        type: "p",
        text: "• Third-party service providers who provide website, platform, application development, hosting, maintenance, and other services to us.",
      },
      {
        type: "p",
        text: "• Law enforcement and governmental entities when required by law; and",
      },
      {
        type: "p",
        text: "• An acquirer, successor or assignee as part of any merger or acquisition as well as in the event of an insolvency, bankruptcy, or receivership in which information is transferred to one or more third parties as one of our business assets.",
      },
    ],
  },
  {
    heading: "5. How long and where do we keep personal information?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "We will only keep personal information for as long as reasonably necessary to fulfil the relevant purposes set out in this Platform Privacy Policy and in order to comply with our legal and regulatory obligations. If you would like further information regarding the periods for which personal information will be kept, please contact us as set forth in the “How to contact us?” section.",
      },
    ],
  },
  {
    heading: "6. How do we protect personal information?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "We follow generally accepted industry standards to protect the information submitted to us, both during transmission and once we receive it. We maintain appropriate physical, technical and administrative safeguards to protect personal information against accidental or unlawful destruction, accidental loss, unauthorized alteration, unauthorized disclosure or access, misuse, and any other unlawful form of processing of the personal information in our possession. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure. We cannot ensure or warrant the security of any information you transmit or provide to us, and you do so at your own risk. We also cannot guarantee that such information may not be accessed, disclosed, altered, or destroyed by breach of any of our physical, technical, or administrative safeguards. If you believe personal information has been compromised, please contact us as set forth in the “How to contact us?” section.",
      },
    ],
  },
  {
    heading: "7. What rights does someone have in relation to its personal information?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "Under certain circumstances and in accordance with EU/EEA or other applicable data protection laws, an individual has the following rights:",
      },
      {
        type: "p",
        text: "• Access: entitled to ask if we are processing information and, if we are, request access to personal information. This enables the individual to receive a copy of the personal information we hold and certain other information about him or her;",
      },
      {
        type: "p",
        text: "• Correction: entitled to request that any incomplete or inaccurate personal information we hold be corrected;",
      },
      {
        type: "p",
        text: "• Erasure: entitled to ask us to delete or remove personal information in certain circumstances. There are certain exceptions where we may refuse a request for erasure, for example, where the personal information is required for compliance with law or in connection with claims;",
      },
      {
        type: "p",
        text: "• Restriction: entitled to ask us to suspend the processing of certain personal information, for example to establish its accuracy or the reason for processing it;",
      },
      {
        type: "p",
        text: "• Transfer: request the transfer of certain personal information to another party;",
      },
      {
        type: "p",
        text: "• Objection: one may challenge when we are processing personal information based on a legitimate interest (or those of a third party) or for direct marketing purposes. However, we may be entitled to continue processing information;",
      },
      {
        type: "p",
        text: "• Automated decisions: contest any automated decision made where this has a legal or similar significant effect and ask for it to be reconsidered.",
      },
      {
        type: "p",
        text: "• Consent: where we are processing personal information with consent, withdrawal of consent.",
      },
      {
        type: "p",
        text: "Also have a right to make a complaint with a data protection supervisory authority, in particular in the country/province/state where you normally reside, where we are based or where an alleged infringement of data protection law has taken place.",
      },
      {
        type: "p",
        text: "To exercise any of these rights, please contact us as set forth in the “How to contact us?” section.",
      },
    ],
  },
  {
    heading: "8. How do we use cookies and similar technologies?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "For details of the cookies employed by us, please consult our Cookie Policy, which forms part of this Platform Privacy Policy.",
      },
    ],
  },
  {
    heading: "9. How to contact us?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "For any questions or comments about this Platform Privacy Policy or personal information, to make an access or correction request, to exercise any applicable rights, to make a complaint, or to obtain information about our policies and practices with respect to any service providers outside Canada, our Privacy Officer can be reached by email via office at levine-law.ca.",
      },
    ],
  },
  {
    heading: "10. How we may update this Platform Privacy Policy?",
    level: 3,
    blocks: [
      {
        type: "p",
        text: "We may change the content of the Platform and how we use cookies without notice and consequently our Platform Privacy Policy, including but not limited to any related Cookie Policy, may change from time to time in the future. We therefore encourage you to review them whenever you visit the Platform to stay informed of how we are processing personal information.",
      },
      {
        type: "p",
        text: "This Platform Privacy Policy was last updated October, 2026.",
      },
    ],
  },
]
