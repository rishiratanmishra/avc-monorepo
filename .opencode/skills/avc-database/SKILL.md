---
name: AVC Database
description: Use for Drizzle schema changes, migrations, relations, data integrity, transactions, and retention decisions.
---

# AVC Database

## Workflow

1. Read `docs/database/standards.md`, `docs/business-logic/veterinary-domain.md`, and every scoped `AGENTS.md` for touched apps/packages.
2. Inspect `packages/database/src/schema/`, `relations.ts`, and existing migrations.
3. Confirm the domain invariant is documented before adding a domain table.
4. Follow naming rules for tables, columns, indexes, and foreign keys.
5. Define explicit relations, constraints, and delete behavior. Add matching contracts only after the schema shape is intentional.
6. Generate migrations with the package script. Review generated SQL; do not hand-edit generated snapshots or journal files.
7. Use transactions for multi-table writes and row locks for token consumption today. Slot/counter row locks are future domain work and require an invariant and table first.
8. Document rollback or forward-fix strategy and retention behavior in the PR.
9. Root `yarn test` is API-only today. Database integration tests need provisioning as tracked in `docs/testing/standards.md`.
10. Validate through `avc-quality-gates`.

## Stop conditions

- Any clinical/PII table lacks audit, access scope, or retention rules: stop and document the rule first.
- A requested change would hard-delete medical history: stop; this violates `docs/business-logic/veterinary-domain.md`.

## Handoffs

- Open `avc-api-backend` for service and contract boundaries.
- Open `avc-veterinary-domain` before adding domain tables.
- Load `avc-quality-gates` before completion.
