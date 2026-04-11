# Portal Components

This folder contains portal shell and layout components.

Allowed here:

- navigation presentation
- layout structure
- loading, empty, and unavailable states
- client-safe display components

Not allowed here:

- backend calls
- workflow decisions
- status branching
- permission or command eligibility logic
- raw backend DTO handling

Domain data must arrive through `src/lib/contracts/` and `src/lib/api/`.
