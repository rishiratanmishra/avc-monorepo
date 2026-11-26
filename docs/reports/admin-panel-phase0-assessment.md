# Admin Panel Phase 0 Assessment

## Scope

This report records the read-only Phase 0 assessment of `apps/admin`, the Express API, shared contracts, API client, database schema, and canonical engineering documentation. It is a status report, not a new rule source. Normative rules remain in the documents linked from `docs/README.md`.

No runtime code, schema, contracts, or migrations were changed during the assessment.

## 1. Current architecture

`apps/admin` is a separate Next.js App Router application using Ant Design, served under the `/manage` base path. It is the only staff administration surface; no second admin app exists in `apps/web`.

Current routes:

| Route              | Status                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `/manage`          | Reads optional access context and redirects to the authorized destination, or renders a sign-in/unavailable state. |
| `/manage/practice` | Server-guarded practice workspace; renders the current shell.                                                      |
| `/manage/platform` | Server-guarded platform workspace; renders the current shell.                                                      |

The shell provides a sidebar, top header, workspace label, active hospital name, effective permission tags, workspace switch link, and logout button. There are no nested product routes, tables, forms, detail views, charts, or domain services.

Server guards live in `apps/admin/lib/server-access.ts` and use `/api/access/context` with the forwarded HTTP-only session cookie. Authorization is API-authoritative; the shell only displays server-provided context.

## 2. Existing capabilities that can be reused

- Authentication, HTTP-only session cookie, logout, profile, verification, and password reset APIs.
- Access context, workspace selection, and clear-workspace APIs.
- Platform hospital list, create, and status-change APIs.
- Hospital membership list, invitation, membership status, and membership role APIs.
- Platform administrator role assignment/revocation with final-admin protection.
- Server-enforced platform, hospital, and client scope guards with exact active-workspace matching.
- Audit logging with actor, target, action, outcome, hospital, resource, request ID, IP, and user-agent.
- Transactional service patterns with row locks for token, role, invitation, and outbox operations.
- `@repo/contracts` RBAC schemas and `@repo/api-client` strict Zod-parsed transport.
- The web application's reference layering: domain service functions, TanStack Query hooks, provider, and shared Formik/Zod form primitives from `@repo/ui/form`.
- Ant Design primitives already available in `apps/admin`: `Layout`, `Menu`, `Table`, `Form`, `Button`, `Tag`, `Space`, and `Typography`.

## 3. Missing capabilities

No operational domain API or persistence exists for:

- Pets/patients and explicit pet-owner records.
- Appointments, clinical records, vaccinations, prescriptions, and treatments.
- Services and hospital service configuration.
- Invoices, payments, refunds, and inventory.
- Communication consent, templates, campaigns, recipients, and delivery records.
- Analytics and reporting.
- Platform audit-log read endpoints.
- Client-facing `/accept-invitation` route.
- Frontend component, E2E, and database-integration test harnesses.

The database contains 16 identity/tenancy/RBAC tables, but no clinical or business-domain tables.

## 4. Proposed navigation and page hierarchy

Platform area:

- `/manage/platform` — platform overview; remains the API destination landing route.
- `/manage/platform/hospitals` — hospital list and status management.
- `/manage/platform/users` — account list, account creation, and platform-admin role management.
- `/manage/platform/audit` — deferred until an audit-read endpoint exists.

Practice area:

- `/manage/practice` — practice overview; remains the API destination landing route.
- `/manage/practice/staff` — membership list, invitations, roles, and status.
- `/manage/practice/clients` — deferred until a hospital client-list endpoint exists.
- `/manage/practice/patients` — deferred until pet/patient tables and invariants exist.
- `/manage/practice/schedule` — deferred until appointment contracts and tables exist.
- `/manage/practice/services` — deferred until a service catalog is defined.
- `/manage/practice/billing`, `/manage/practice/communications`, `/manage/practice/analytics`, and `/manage/practice/settings` — deferred until their domain and API foundations exist.

All nested routes must use the area base guard (`/manage/practice` or `/manage/platform`), not the full nested path, because the API emits only base destinations.

Navigation visibility may be derived from `activeWorkspace.permissions`, but backend guards remain authoritative.

## 5. Organization and hospital domain model

The existing canonical model has one identity table (`users`) and one authorization tenant root (`hospitals`). Multi-hospital access is represented by `hospital_memberships` plus `hospital_membership_roles`; a user may also have multiple `hospital_clients` relationships.

Conceptual status:

| Concept                                                                        | Status                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------- |
| User, profile, global roles                                                    | Implemented                                             |
| Hospital, membership, membership roles                                         | Implemented                                             |
| Permissions and role-permission map                                            | Implemented, contract-driven at runtime                 |
| Session with active scope/hospital                                             | Implemented                                             |
| Invitations                                                                    | Implemented                                             |
| Client relationship                                                            | Implemented as a user-to-hospital relationship          |
| Organization entity                                                            | Requires architectural decision                         |
| Pet/patient, clinical records, services, appointments, billing, communications | Missing; domain invariants and contracts required first |

The brief's `organization` level is not a current tenant root. Adding it would require an explicit decision in `docs/architecture/identity-and-access.md` before schema or authorization changes.

## 6. Frontend and backend boundaries

Frontend:

- Pages remain thin: metadata, server guard, server/client data composition.
- Components compose UI and user interactions only.
- Domain API operations belong in separately exported service functions.
- TanStack Query hooks own server state, mutations, cache synchronization, and invalidation.
- Forms use Formik, Zod schemas, and `@repo/ui/form`.
- Local state is limited to genuine UI behavior.
- Components never call APIs directly.

Backend:

- Routes declare HTTP shape and middleware.
- Controllers translate HTTP to service calls.
- Validation schemas own request/input validation.
- Services own domain rules and transactions.
- Repositories own module-specific persistence where justified.
- Authorization and hospital scope checks are enforced on the backend and rechecked in services.
- New domain work follows contracts → domain invariant → schema/migration → service/tests → client.

## 7. Security and RBAC implications

- A platform administrator does not implicitly receive hospital access.
- Hospital routes require exact `activeScope === "hospital"` and route `hospitalId === activeHospitalId`, plus an active membership and named permission.
- Client resource routes must verify both the client scope and the active hospital relationship.
- Suspended memberships, revoked memberships, suspended hospitals, expired sessions, and session revocation must be respected.
- Navigation visibility is UX only; hiding controls is not authorization.
- High-risk actions currently rely on login-only authorization; MFA/step-up, shared rate limits, session listing, and per-device revocation remain documented deferrals.
- Failed logins are not currently written to the audit log.

## 8. Database changes required

Phase 1 does not require new tables.

Before operational phases, the following must be decided and documented:

- Whether `organizations` is a grouping attribute on `hospitals` or a new tenant root.
- Hospital ownership of `locations`; the current `locations` table has no `hospital_id`.
- Audit-log `scope` storage or documented use of `resourceType`/`details`.
- Soft-delete and retention behavior for clinical and customer records.
- Row-locked final-owner rechecks.
- Uniqueness rules for client numbers and pending invitations.

Pet, appointment, clinical, billing, inventory, and communication tables must not be added until their invariants are documented in `docs/business-logic/veterinary-domain.md`.

## 9. Implementation milestones and dependencies

| Phase   | Scope                                                          | Dependency status                                                                                      |
| ------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Phase 1 | Admin shell, base-area guard, navigation, page layout patterns | Ready                                                                                                  |
| Phase 2 | Platform hospital list/create/status                           | Ready; organization-level ownership requires a decision                                                |
| Phase 3 | Hospital staff/membership management                           | Ready                                                                                                  |
| Phase 4 | Client and pet management                                      | Clients blocked by missing list endpoint; pets blocked by domain/schema work                           |
| Phase 5 | Services and appointments                                      | Blocked by domain invariants, contracts, tables, and API                                               |
| Phase 6 | WhatsApp and communications                                    | Blocked by provider, consent, and domain decisions                                                     |
| Phase 7 | Analytics and reports                                          | Ready only for metrics derivable from existing authoritative data; new permission definitions required |
| Phase 8 | Billing and finance                                            | Blocked by domain invariants, contracts, tables, and API                                               |

Phases must remain incremental and reviewable. A blocked phase must not be replaced with fabricated data or an unofficial integration.

### Implementation status

- Phase 1 is implemented: permission-aware navigation, base-area and permission guards, shared page header, aligned Ant/AVC tokens, Query provider, and thin route composition.
- Phase 2 is implemented for hospital list, create, and status change using real API data. The organization-level ownership question remains an open architectural decision and was not invented.
- Phase 3 is implemented for hospital membership list, invitation, status change, and role assignment through existing endpoints. Owner-only and last-owner restrictions are enforced by the API and mirrored as UI guards where the active context makes them knowable. A dedicated `HospitalMembershipViewSchema` was added because the administrative membership response intentionally omits the effective permissions carried by access-context memberships.
- Platform user management is implemented under `/manage/platform/users`: `platform.users.manage` guards list/create and platform-admin role assignment. Creation is limited to `pet_owner` or platform `admin`, requires email verification, and leaves hospital roles to membership management.
- Phases 4–8 remain blocked as described above. No clinical, billing, communication, or analytics data has been simulated.
- Browser verification used real data from the isolated `avc_phase7_test` database: platform hospital list and create-form validation, and practice staff list with role/status controls. No test data was fabricated or mutated for verification.

## 10. Design direction

Admin UI must use the existing Ant Design foundation and the AVC visual identity from `apps/web/app/globals.css` as the reference palette and typography. Ant Design theme tokens remain local to `apps/admin` until a shared theme pipeline exists.

The product should favor dense, functional layouts:

- stable sidebar with permission-aware sections;
- top header with workspace identity and global actions;
- contextual page header with a single primary action;
- tables for comparable records;
- focused detail and edit views;
- explicit loading, empty, error, and success states;
- no decorative cards, fabricated metrics, or placeholder data presented as real.

## Known documentation discrepancies

- `README.md` and `apps/admin/README.md` were updated to describe the authorized, API-backed admin workspace rather than the retired sample-data prototype.
- `.opencode/skills/avc-frontend/SKILL.md` says no typed API client exists; `@repo/api-client` does exist.
- Some backend/security docs and skills say audit outcome/IP/user-agent are missing; the schema and migration now include them.
- `docs/reports/identity-and-access-readiness.md` names migration files that do not exist on disk.
- `APP_ORIGIN` and `NEXT_PUBLIC_SITE_URL` can diverge as cross-app link sources.
- The installed Next.js guides referenced by scoped `AGENTS.md` are present under `node_modules/next/dist/docs/` and were consulted for the added routes.
- Admin theming is intentionally duplicated as local aliases in `apps/admin/lib/admin-theme.ts`; it is not a shared cross-app token pipeline.

## Validation status

- `yarn verify:eslint-coverage`, `yarn lint:css`, `yarn check-types`, `yarn test`, and `yarn build` pass.
- `yarn lint` fails only on two pre-existing `apps/web` accessibility warnings; all changed workspaces lint clean.
- `yarn format:check` still reports pre-existing drift in untouched files; every file changed for this phase was formatted with Prettier.
- Root tests remain API-only; no frontend/E2E harness exists yet, so browser verification was performed manually against real isolated data.
