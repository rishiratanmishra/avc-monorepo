---
name: AVC API Backend
description: Use for Express routes, middleware, controllers, services, error handling, contracts, logging, and server-side API work.
---

# AVC API Backend

## Workflow

1. Read `docs/backend/api-standards.md`, `docs/security/standards.md`, and every scoped `AGENTS.md` for touched apps/packages.
2. Inspect existing modules and follow `routes -> middleware -> controller -> service -> database`.
3. Define request/response schemas in `@repo/contracts` before adding endpoints.
4. Validate bodies, params, and query values with Zod; reject untrusted fields.
5. Keep business logic and transaction boundaries in services.
6. Use the standard error envelope and stable status codes. Do not leak raw errors.
7. Add authentication, authorization, and rate-limit review for every mutation. Open `avc-auth-rbac` for role-gated work.
8. Check audit coverage against `docs/backend/api-standards.md`. Current `audit_logs` does not persist outcome, IP, or user-agent; do not claim otherwise.
9. Add unit/contract tests for success, validation failure, unauthorized access, and conflict paths. Integration tests require the harness tracked as a gap in `docs/testing/standards.md`.
10. Validate through `avc-quality-gates`, including `yarn format:check` as informational today.

## Stop conditions

- Domain invariant is undocumented: open `avc-veterinary-domain` and add the rule first.
- New table or migration needed: open `avc-database`.
- Sensitive data or credentials involved: follow `docs/security/standards.md` before implementing.
- Audit or authorization behavior is being claimed as complete: verify the documented schema gaps first.

## Handoffs

- Open `avc-auth-rbac` for sessions, roles, and privileged operations.
- Open `avc-database` for schema, relations, migrations, and transactions.
- Open `avc-veterinary-domain` for domain invariants.
- Load `avc-quality-gates` before completion.
