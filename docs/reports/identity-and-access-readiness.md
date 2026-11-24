# Identity and Access Foundation Readiness Report

Phase 6 milestone report — 25 November 2026.

## Scope and status

This milestone adds the backend-authoritative identity, authentication, authorization, tenant-isolation, and workspace-access foundation. It does not implement the veterinary clinical/business system. All Phase 6 work remains uncommitted on `dev`; no commit, push, pull request, or review was created. Current HEAD is `7248b85` (`ai guides`), which contains the previously preserved Phase 5 work.

The canonical design is `docs/architecture/identity-and-access.md`. API enforcement rules are in `docs/backend/auth-rbac.md`, and domain invariants are in `docs/business-logic/veterinary-domain.md`.

**Phase 7 status update:** the frontend integration described in the "Remaining risks" and "Next milestone" sections below has since been delivered. See `docs/reports/phase7-frontend-integration.md` for the current client integration, browser verification, routing, and handover. Sections 1–7 remain the Phase 6 foundation record.

## 1. Architecture

The platform uses one canonical identity (`users`), one authentication entry point (`POST /api/auth/login`), and one database-backed session cookie (`avc_session`). There is no admin subdomain. All applications are intended to be served from `avcpethospital.com`.

The API is authoritative. Browsers never supply identity, roles, permissions, ownership, or active hospital as trusted claims. The active workspace is stored on the server session in `auth_sessions.active_hospital_id` and `auth_sessions.active_scope`.

Three scopes are enforced:

| Scope    | Authority source                                             | Default destination |
| -------- | ------------------------------------------------------------ | ------------------- |
| Platform | Global `admin` role                                          | `/manage/platform`  |
| Hospital | Active tenant-scoped membership and hospital roles           | `/manage/practice`  |
| Client   | `pet_owner` role plus active `hospital_clients` relationship | `/client`           |

A session with a null `active_scope` has no privileged permissions. This is the safe state for legacy sessions created before the column existed; the user must call `POST /api/access/workspace` before scoped routes are accepted. A person with both staff and client relationships must select the intended scope explicitly.

## 2. Roles and permission rationale

Permissions are stable `scope.resource.action` codes. Roles are stable business identities, and effective permissions are the union of the active roles in the selected scope. The full matrix is canonical in `docs/architecture/identity-and-access.md`.

- `admin` is the existing global platform administrator. It can manage hospitals, platform users, and audit review, but it has no implicit hospital data access.
- `hospital_owner` is the accountable tenant owner and has the broadest hospital authority, including owner-role management.
- `hospital_admin` is operational only. It can manage settings, members, schedules, clients, billing, and inventory but cannot prescribe or write clinical records.
- `veterinarian` is the licensed clinical authority for records, prescriptions, and clinical tasks.
- `veterinary_technician` and `veterinary_assistant` are delegated support roles with progressively narrower clinical permissions; neither can prescribe.
- `receptionist` and `billing` are separated so front-desk and financial authority do not grant clinical record access.
- `pet_owner` is granted by public registration and provides client-scoped profile, appointment, and record access subject to relationship/resource checks.
- Legacy `staff` is retained for compatibility but deliberately grants no production permission and is not assignable through hospital administration endpoints.

Custom-role capability was evaluated. The `permissions` and `role_permissions` tables mirror the code-level map and seed it for future use, but the runtime currently derives permissions from `ROLE_PERMISSIONS` in `@repo/contracts`. Tenant-defined custom roles are not supported yet; they would require tenant-scoped role definitions, contract changes, migration work, and service changes before any UI is added.

## 3. Tenant and membership design

`hospitals` is the tenant root. Staff authority exists only through an active `hospital_memberships` row joined to active `hospital_membership_roles`. A user may hold multiple memberships and multiple roles within a membership, but only the server-selected hospital is active.

`hospital_clients` is the explicit pet-parent relationship and future boundary for pets, appointments, and owner records. Client authority requires both the `pet_owner` role and an active relationship for the active client workspace. There are no pet tables in this milestone, so pet-level ownership checks remain a future invariant.

Invitations are single-use SHA-256-hashed tokens bound to an email address, hospital, role, inviter, and expiration. Acceptance creates or reactivates a membership only when the authenticated user's email matches the invitation. Hospital provisioning creates the tenant as `suspended` and queues a `hospital_owner` invitation; the hospital becomes `active` only when that invitation is accepted. This preserves the active-owner invariant and avoids giving the platform administrator implicit hospital access.

Suspending or revoking a membership immediately denies authorization and revokes sessions whose active hospital is that tenant. Hospital suspension or closure updates status and revokes affected sessions in one transaction. The final platform administrator and final hospital owner cannot be removed.

## 4. Route and application architecture

Target one-origin routing:

```text
/                         public website (apps/web)
/login                    unified sign-in (apps/web)
/workspace                server-derived workspace selection UX (apps/web)
/client/*                 pet-parent experience (apps/web)
/manage/practice/*        hospital practice experience (apps/admin)
/manage/platform/*        platform administration (apps/admin)
/api/*                    Express API
```

`apps/admin` remains a separate internal Next.js application, intended to be served at `/manage/*` on the primary domain by a reverse proxy or Next route zone. No admin subdomain was introduced. The reverse-proxy/deployment configuration and production route integration are still outstanding.

Implemented API surface:

| Endpoint                                                                          | Authority                                                                           |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `GET /api/access/context`                                                         | Authenticated session; server-derived context                                       |
| `POST /api/access/workspace`                                                      | Validated platform role, active membership, or active client relationship           |
| `DELETE /api/access/workspace`                                                    | Clears hospital and selects personal client scope                                   |
| `POST /api/access/invitations/accept`                                             | Authenticated session; token and exact email match                                  |
| `GET /api/access/client/:hospitalId/relationship`                                 | Client scope plus active client relationship                                        |
| `GET/POST /api/platform/hospitals`                                                | `platform.hospitals.manage`                                                         |
| `PATCH /api/platform/hospitals/:hospitalId/status`                                | `platform.hospitals.manage`; transactional session revocation on suspension/closure |
| `GET/POST /api/hospitals/:hospitalId/...`                                         | `hospital.members.manage` for the active workspace                                  |
| `PATCH /api/hospitals/:hospitalId/memberships/:membershipId`                      | Member status management with self-lockout and final-owner protection               |
| `PUT/DELETE /api/hospitals/:hospitalId/memberships/:membershipId/roles/:roleCode` | Owner-role changes require owner or explicit platform-plus-membership authority     |
| `PUT/DELETE /api/admin/users/:userId/roles/:roleCode`                             | Legacy platform-only role boundary; hospital/client role codes rejected             |

Client routing is UX only. Every destination is supplied by `/api/access/context`, and every API mutation rechecks session, scope, membership status, role, and permission on the server.

## 5. Database and API changes

New/changed contracts in `@repo/contracts`:

- `models/rbac.ts`: scopes, platform/hospital/client role sets, assignable-role sets, permission codes, role-permission map, hospital/membership/client/workspace/invitation schemas.
- `models/user.ts`: expanded role codes while retaining the existing global `admin` and legacy `staff`.
- `SelectWorkspaceSchema`: explicit `scope` plus optional nullable `hospitalId`.
- `CreateHospitalSchema`: normalized required `ownerEmail`.
- `AssignableHospitalRoleCodeSchema` excludes legacy `staff`.

New/changed schema in `@repo/database`:

- Added `hospitals`, `hospital_memberships`, `hospital_membership_roles`, `hospital_clients`, `hospital_invitations`, `permissions`, and `role_permissions`.
- Extended `auth_sessions` with `active_hospital_id` and `active_scope`.
- Extended `audit_logs` with outcome, hospital, resource, details, IP, and user-agent.
- Extended `email_outbox.type` with `hospital_invitation`.
- Added relations and exported all new tables through the package entry point.

Migrations:

- `0003_fair_roulette.sql`: creates the tenancy/membership/permission tables, adds session and audit columns, adds foreign keys and indexes, and seeds roles, permissions, and role-permission mappings.
- `0004_minor_black_bolt.sql`: adds `auth_sessions.active_scope` and the `hospital_invitation` outbox type.

Generated snapshots and journal were regenerated with `yarn workspace @repo/database generate`; they were not hand-edited. The seed SQL appended to `0003` was reviewed. The migrations have not been applied to a live database in this workspace.

API modules added under `apps/api/src/modules/access/`: access types, Drizzle repository, service, middleware, controllers, routers, container, and test support. Existing auth email service gained invitation email preparation; the legacy role service and controller were hardened to platform roles only. All new routers are mounted in `apps/api/src/app.ts`.

## 6. Security controls and deferrals

Implemented in this foundation:

- Argon2id hashing, dummy verification for unknown users, hashed single-use tokens, and transactional token consumption with row locks.
- Database-backed opaque sessions, HTTP-only cookie, `Secure` in production, `SameSite=lax`, trusted-origin checks, expiry checks, and session revocation on logout/reset/membership loss.
- Strict Zod validation for bodies and route params; strict contracts reject unexpected fields.
- Exact active-scope enforcement with audited denials for platform, hospital, and client routes.
- Route `hospitalId` must equal the server-selected active hospital; client resources require an active client relationship.
- Owner-role restrictions, final-owner protection, final-platform-admin protection, and transactional hospital-status/session revocation.
- Audit records include actor, target, action, outcome, request ID, IP, user-agent, hospital, resource, and details for sensitive operations and denials.
- Invitation acceptance is bound to the authenticated user's exact email.
- No new dependencies were added.

Explicitly deferred:

- MFA and step-up reauthentication. Login alone must not be treated as sufficient for high-risk privileged actions until second-factor delivery, recovery, and step-up policy are designed.
- Shared/distributed rate-limit storage and production `trust proxy` tuning.
- Account lockout automation using the existing unused columns.
- Session listing and per-device revocation UI.
- Email change, self-service deletion, and encryption-key rotation automation.
- Database integration tests and browser E2E harnesses.

## 7. Actual validation results

Gates were run locally on Windows with Yarn 1.22.22 and Turbo 2.11.10. Baseline figures are the recorded Phase 5 final results; final figures are from this workspace after all Phase 6 changes.

| Gate                          | Phase 5 baseline                     | Final result                                | Change                          |
| ----------------------------- | ------------------------------------ | ------------------------------------------- | ------------------------------- |
| `yarn lint`                   | Exit 1 — 4 pre-existing web warnings | Exit 1 — same 4 web warnings                | No new lint failures            |
| `yarn verify:eslint-coverage` | Exit 0 — 126 files                   | Exit 0 — 147 files; 0 ignored-file failures | Coverage guard passes           |
| `yarn lint:css`               | Exit 0 — 44 CSS files, 338 warnings  | Exit 0 — 44 CSS files, 338 warnings         | Unchanged                       |
| `yarn check-types`            | Exit 0                               | Exit 0 — 9/9 tasks                          | Pass                            |
| `yarn test`                   | Exit 0                               | Exit 0 — 20 tests, 5 suites, 0 failures     | Expanded from 8 to 20 tests     |
| `yarn build`                  | Exit 0                               | Exit 0 — 6/6 tasks                          | Pass                            |
| `yarn format:check`           | Exit 1 — 71 files                    | Exit 1 — 66 files                           | Pre-existing drift reduced by 5 |
| `drizzle-kit check`           | Not recorded                         | Exit 0 — "Everything's fine"                | Migration graph is consistent   |

The four lint warnings are in pre-existing prototype files: login label association, contact form label association, a non-interactive element with an interactive role, and synchronous `setState` in an effect in the demo auth context. `format:check` remains informational in CI and still fails only on pre-existing formatting drift; all files added or touched in this milestone were formatted with the repository Prettier configuration.

Test coverage in this milestone includes: authorized role unions, mixed client/staff identities, platform versus hospital boundaries, multiple memberships, suspended membership denial, cross-hospital denial, client resource relationship checks, null-scope denial until workspace selection, expired/revoked sessions with denial audits, hospital provisioning and invitation acceptance, invitation email binding, owner-only authority, final-owner protection, membership and hospital suspension session revocation, and legacy platform-role boundary rejection.

Test files:

- `apps/api/src/modules/auth/auth.test.ts`
- `apps/api/src/modules/auth/role.service.test.ts`
- `apps/api/src/modules/access/access.test.ts`
- `apps/api/src/modules/access/hospital-administration.test.ts`

## 8. Remaining risks

- At the end of Phase 6, the web and admin apps were still prototypes with no production `fetch` integration, API-backed login, workspace selector, `/client`, or `/manage/*` routing. Phase 7 replaced those prototype flows and added local one-origin routing; see the Phase 7 report for current status.
- At the end of Phase 6, the prototype auth context used `localStorage`, demo users, `preferredRole`, one-click role switching, and simulated success. Phase 7 removed those production-path exceptions; no browser storage is used for identity or access state.
- The invitation email links to `/accept-invitation`, but no client route consumes the token yet. Invitation acceptance is API-complete but not user-journey-complete.
- At the end of Phase 6, migrations had been generated and SQL reviewed but not applied to an isolated MySQL instance. Phase 7 applied the full migration chain manually to an isolated `avc_phase7_test` database for browser verification; a committed migration harness is still absent.
- Tests use in-memory repository fakes. There is no API+database integration test, no HTTP client harness, no component harness, and no E2E driver.
- MFA, step-up authentication, shared rate limiting, lockout, per-device session management, and key rotation remain unimplemented.
- Pet-level resource authorization cannot be enforced until pet ownership tables and invariants exist in the next domain milestone.
- Custom roles are evaluated but not implemented; the code-level role-permission map remains authoritative at runtime.
- Platform-administrator bootstrap remains a controlled manual operation.

## 9. Next milestone

The first three items below were delivered in Phase 7; the remaining items are carried forward. See `docs/reports/phase7-frontend-integration.md` for the current plan.

1. Replace the prototype client/auth flows with API-backed login, `/api/access/context`, workspace selection, and server-authorized destinations. **Delivered in Phase 7.**
2. Implement local one-origin routing for `/manage/*`; remove the admin-subdomain assumption from deployment configuration. **Delivered in Phase 7 for development; production proxy configuration remains outstanding.**
3. Add a `/workspace` client page that submits workspace choices to the API. **Delivered in Phase 7.** `/accept-invitation` remains outstanding.
4. Commit E2E coverage for the authenticated journeys and provision migration/API integration tests for sessions, invitations, memberships, and tenant isolation.
5. Design MFA and step-up policy, then add shared rate-limit storage and lockout before treating privileged operations as launch-ready.
6. Introduce the first clinical domain tables only after the existing domain invariants are extended for pets, owners, appointments, and resource ownership.
