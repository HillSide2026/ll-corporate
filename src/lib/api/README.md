# API Boundary

All `ll-task-tracker` interaction belongs in this folder.

Rules:

- Components and pages must not call `fetch` directly.
- Components and pages must not call `/case/*` or any backend route directly.
- Adapters must return contract-shaped data from `src/lib/contracts/`.
- UI modules must not mutate backend domain objects directly.
- Domain writes require backend command contracts before implementation.

This layer adapts transport concerns only: base URLs, auth headers, response parsing, error normalization, and contract mapping.
