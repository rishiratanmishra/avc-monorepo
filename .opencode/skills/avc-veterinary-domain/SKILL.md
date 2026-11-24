---
name: AVC Veterinary Domain
description: Use for any pet, owner, appointment, availability, consultation, medical record, vaccination, prescription, billing, or inventory behavior.
---

# AVC Veterinary Domain

## Workflow

1. Read the root `AGENTS.md` and every scoped `AGENTS.md` for the apps or packages you will touch.
2. Read `docs/business-logic/veterinary-domain.md` first. It is authoritative for invariants.
3. Identify the entity and rule involved. If the rule is missing or ambiguous, add it to the canonical document before implementation.
4. Open `avc-api-backend` to define the API contract in `@repo/contracts`.
5. Open `avc-database` to define schema and migration in `@repo/database` if persistence is required.
6. Open `avc-auth-rbac` for role-scoped transitions and ownership checks.
7. Implement server-side service logic and status transitions in `apps/api`.
8. Add unit/contract tests that prove the invariant, invalid transitions, authorization denial, and conflict handling. Integration coverage requires the harness tracked in `docs/testing/standards.md`.
9. Only after server rules and available tests exist, build or update the UI using `avc-frontend` and `avc-ui-design-system`.
10. Update canonical documentation if a new invariant or workflow becomes official.
11. Load `avc-quality-gates` before completion.

## Non-negotiable order

`document invariant -> contract -> schema -> service -> available tests -> UI`

Do not reverse this order. Do not invent appointment conflicts, medical history behavior, consent rules, or billing rules from assumptions.
