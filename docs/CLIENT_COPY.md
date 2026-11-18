# Client Workspace Copy

The draft wording for the client workspace lives in `ll-secondbrain`, not here:

[LLP-055 `planning/CLIENTS_SITE_COPY_SALVAGE.md`](https://github.com/HillSide2026/ll-secondbrain/blob/main/04_INITIATIVES/LL_PORTFOLIO/07_GROWTH_PROJECTS/LLP-055/planning/CLIENTS_SITE_COPY_SALVAGE.md)

It holds the copy salvaged on 2026-11-18 from the six pages of the SharePoint Clients site
(`/sites/Clients`), which ML1 ruled are rewritten as instructions for firm staff, since
clients never see SharePoint (LLP-055; draft ADR-008 in LLP-037). Part 1 is the source text
word for word. Part 2 adapts it for this app:

| Copy                    | Where it would go here                                                        |
| ----------------------- | ----------------------------------------------------------------------------- |
| Welcome                 | Workspace dashboard, `app/corporate/app/page.tsx`                             |
| Documents introduction  | `app/corporate/app/documents/page.tsx`                                        |
| Support                 | A Support page in the workspace (not built)                                   |
| Client FAQs             | A client FAQ list, on the pattern of `src/lib/portal/leadFaqs.ts` (not built) |
| Corporate law resources | A Resources page in the workspace (not built)                                 |

Status: draft, not approved. Client-facing wording needs ML1 approval before it goes into
the app (LLP-055 Governance). Edit the copy in `ll-secondbrain`, then bring the approved
text here; do not keep a second copy in this repo.
