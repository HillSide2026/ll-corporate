# Contracts

This folder is the only frontend source for domain shapes consumed from `ll-task-tracker`.

Rules:

- Backend contracts are canonical.
- Do not duplicate types in features, pages, or components.
- Do not define local status enums.
- Do not encode workflow transitions.
- Do not derive permission or action eligibility.
- Do not expose raw backend internals to UI modules.

If a backend contract is not available yet, create a minimal `PROVISIONAL` contract only when a shell or test needs a shape. Provisional contracts must be clearly named, narrow, and removed or replaced when `ll-task-tracker` provides the real client-safe DTO.
