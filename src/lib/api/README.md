# API Boundary

All `ll-task-tracker` interaction belongs in this folder.

Rules:

- Components and pages must not call `fetch` directly.
- Components and pages must not call `/case/*` or any backend route directly.
- Adapters must return contract-shaped data from `src/lib/contracts/`.
- UI modules must not mutate backend domain objects directly.
- Domain writes require backend command contracts before implementation.

This layer adapts transport concerns only: base URLs, auth headers, response parsing, error normalization, and contract mapping.

## SharePoint client libraries

`sharepointGraph.ts` is the one other adapter here: read-only Microsoft Graph access to client
document libraries on the SharePoint Clients site, through the LL-Client Portal Entra app
(LLP-055, ML1 2026-11-18). One grant covers every library on that site, so the library is
always taken from the user's membership (`src/lib/portal/clientLibraryStore.ts`), never from
the request. `src/lib/portal/clientLibraryIsolation.test.ts` fails if a user can reach
another client's library.
