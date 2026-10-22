/**
 * FAQs on the lead welcome page. Draft answers written to the lead process ML1
 * approved 2026-10-22; pending ML1 review before go-live.
 */
export type Faq = { question: string; answer: string }

export const leadFaqs: Faq[] = [
  {
    question: "How does this work?",
    answer:
      "Choose the service closest to what you need. Tell us who is involved so we can run a conflict check. Once we confirm we can act, we agree the right service and fixed fee with you, you sign the engagement letter and pay here, and a lawyer takes it from there.",
  },
  {
    question: "What is a conflict check, and why does it come first?",
    answer:
      "Before a lawyer can act for you, they must confirm they don't already act for anyone whose interests conflict with yours. We ask only for names at this stage. Nothing is signed or paid until the check is complete.",
  },
  {
    question: "When do I sign?",
    answer:
      "Only after we've confirmed we can act for you and agreed the service and fee with you. You then sign the engagement letter in the portal, before work begins.",
  },
  {
    question: "Will I need to provide identification?",
    answer:
      "Yes. Before work begins you'll complete a short identification form in the portal, as the Law Society of Ontario requires. We may ask for more information later.",
  },
  {
    question: "How will I receive my documents?",
    answer:
      "Documents and advice are sent to you by email. The portal shows the status of your file so you always know where things stand.",
  },
  {
    question: "Who will handle my file?",
    answer: "A Levine Law lawyer handles your file from start to finish.",
  },
]
