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
    question: "Why can't I describe my matter yet?",
    answer:
      "Until we confirm we can act for you, please share only who is involved. Sending details of your matter before then could prevent us from acting for you or for someone else.",
  },
  {
    question: "What if the service I chose isn't the right one?",
    answer:
      "That's fine. The service you choose is a starting point. After the conflict check, we confirm the right service and its fee with you before you agree to anything.",
  },
  {
    question: "When do I sign and pay?",
    answer:
      "Only after we've confirmed we can act and agreed the service and fee with you. You then sign the engagement letter in the portal and pay the fixed fee by card, before work begins.",
  },
  {
    question: "What does the fixed fee include?",
    answer:
      "The fee covers the work described for the confirmed service. Disbursements, such as government filing fees, are charged in addition and are set out in your engagement letter.",
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
