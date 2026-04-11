# Features

Feature modules live here after backend client-safe contracts exist.

Feature modules may compose:

- routes
- server/client components
- presentation-specific view models
- calls to `src/lib/api/`

Feature modules must not define:

- domain status enums
- workflow transitions
- dashboard aggregates
- permission matrices
- command eligibility rules

If `ll-task-tracker` does not provide the needed data or command contract, the feature must render an unavailable or empty state.
