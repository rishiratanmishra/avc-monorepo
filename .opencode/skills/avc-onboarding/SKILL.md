---
name: AVC Onboarding
description: Use when starting work in this repository, assessing scope, or unsure which app, package, rulebook, or skill applies.
---

# AVC Onboarding

## Workflow

1. Read the repository root `AGENTS.md`.
2. Read `docs/README.md` and `docs/ai/instruction-hierarchy.md`.
3. Read `docs/architecture/standards.md`.
4. Read the scoped `AGENTS.md` for every app or package you will touch, even if the session started at the repository root.
5. Inspect `package.json`, `turbo.json`, and the target workspace before forming a plan.
6. Search for existing implementations of the requested behavior. Reuse or extend them before proposing new files.
7. Identify the authoritative boundary:
   - product rules: `docs/business-logic/veterinary-domain.md`
   - API rules: `docs/backend/api-standards.md`
   - UI rules: `docs/design-system/standards.md` and `docs/frontend/standards.md`
   - data rules: `docs/database/standards.md`
8. State the intended change scope and any rule documents that must be updated.
9. Do not edit files during orientation unless the task explicitly requires implementation.
10. Before completion, load `avc-quality-gates`.

## Stop conditions

- The task requires a domain invariant that is not documented: open `avc-veterinary-domain`.
- The task touches authentication or roles: open `avc-auth-rbac`.
- The task touches UI: open `avc-ui-design-system` and, for routes or forms, `avc-frontend`.
- Schema work: open `avc-database`. API contracts or services: open `avc-api-backend`. Validation/tooling changes: open `avc-quality-gates`.
