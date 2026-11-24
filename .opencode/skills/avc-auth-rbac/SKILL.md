---
name: AVC Auth and RBAC
description: Use for authentication, sessions, cookies, roles, permissions, protected routes, profile ownership, or privileged operations.
---

# AVC Auth and RBAC

## Workflow

1. Read the root `AGENTS.md` and every scoped `AGENTS.md` for the apps or packages you will touch.
2. Read `docs/backend/auth-rbac.md`, `docs/security/standards.md`, and `docs/backend/api-standards.md`.
3. Inspect current middleware, auth service, session handling, and role usage before editing.
4. Treat the API session cookie as the only trusted session representation.
5. Enforce authorization on the server for both routes and service methods.
6. Check the role matrix in `docs/backend/auth-rbac.md`; update the canonical doc when a new role or permission is introduced.
7. Reject client-supplied roles, ownership claims, and privileged identifiers outside the documented prototype exception set.
8. Audit privileged actions with actor, target, action, and request ID. Outcome, IP, and user-agent are target fields tracked as gaps, not currently persisted by `audit_logs`.
9. Add available unit/contract tests for allowed and denied access. RBAC integration tests require the harness tracked in `docs/testing/standards.md`.
10. Validate through `avc-quality-gates`.

## Stop conditions

- Task asks for new client-side role switching or `localStorage` sessions outside the documented prototype exceptions: do not implement; explain the security rule.
- Task adds admin capability without MFA/audit review: document the MFA gap, obtain explicit scope approval, and use the current audit schema fields.
- Task asks to treat prototype portal behavior as a production authorization boundary: stop.

## Handoffs

- Open `avc-api-backend` for protected routes, services, and error envelopes.
- Open `avc-frontend` for client UX around protected pages.
- Open `avc-ui-design-system` for accessible role-driven UI.
- Load `avc-quality-gates` before completion.
