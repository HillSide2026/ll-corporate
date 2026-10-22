/**
 * FAQs on the lead welcome page. Draft answers written to the lead process ML1
 * approved 2026-10-22; pending ML1 review before go-live.
 */
export type Faq = { question: string; answer: string }

export const leadFaqs: Faq[] = [
  {
    question: "How does this work?",
    answer:
      "Choose the service closest to what you need. Tell us who is involved so we can run a conflict check. Once we confirm we can act, we email you the engagement letter and a request for service-specific information. You sign the letter and pay by email, and a lawyer takes it from there.",
  },
  {
    question: "What is a conflict check, and why does it come first?",
    answer:
      "Before a lawyer can act for you, they must confirm they don't already act for anyone whose interests conflict with yours. We ask only for names at this stage. Nothing is signed or paid until the check is complete.",
  },
  {
    question: "When do I sign?",
    answer:
      "Only after we've confirmed we can act for you. We email you the engagement letter, and you sign it and pay from that email before work begins.",
  },
  {
    question: "Will I need to provide identification?",
    answer:
      "Yes. Before work begins, you come back to the portal and answer a few identification questions, as the Law Society of Ontario requires. If necessary, we will also ask you to provide identification.",
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
