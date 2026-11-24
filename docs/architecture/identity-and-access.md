# Identity, Tenancy, and Access Architecture

This document is the production architecture for identity, authentication, authorization, and application access. It applies to `apps/api`, `apps/web`, `apps/admin`, `@repo/contracts`, and `@repo/database`. The Express API is authoritative; Next.js apps are presentation layers and never decide identity or permissions.

## 1. Decisions

1. One canonical identity: `users`. There is no separate customer table, staff identity table, or shadow account store.
2. One authentication entry point: `POST /api/auth/login` with one database-backed, HTTP-only session cookie named `avc_session`.
3. One primary hostname: `avcpethospital.com`. There is no admin subdomain.
4. Three authorization scopes:
   - **platform** — authority over the whole platform;
   - **hospital** — authority inside one hospital tenant;
   - **client** — authority over the signed-in person's own client relationship and future owned-patient resources.
5. Authorization is role-based with granular permissions: roles are stable business identities, permissions are the enforceable units, and a user's effective permissions are the union of the active roles in the active scope.
6. Hospital authority is membership-based. A global role never grants hospital data access. A platform administrator does not automatically become a member of any hospital.
7. The active hospital is stored server-side on the session. A client cannot send a hospital ID to widen its own scope.
8. Pet-parent authority is resource-based. A client account may access only resources linked to an active client relationship or future explicit pet ownership.
9. The existing global `admin` role is retained as the platform administrator role for compatibility. It is not a hospital administrator role.
10. `apps/admin` remains a separate internal Next.js application but is served under the primary domain at `/manage/*`. It is not exposed on a subdomain.

## 2. Roles

### Platform scope

| Role code | Purpose                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin`   | Platform administrator. Manages hospitals, platform users, and audit review. Does not automatically access hospital clinical or client data. |

Public registration never grants this role. Assignment requires the existing platform-admin service re-check and audit flow. Removing the final platform administrator remains forbidden.

### Hospital scope

| Role code               | Purpose                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hospital_owner`        | Accountable owner of one hospital tenant. Can manage hospital settings, memberships, and all hospital operations.                                                   |
| `hospital_admin`        | Operational administrator. Can manage settings, members, scheduling, client lookup, billing, and inventory. Cannot issue prescriptions or write clinical records.   |
| `veterinarian`          | Licensed clinical authority. Can read patients/records, write clinical records, issue prescriptions, and manage clinical tasks.                                     |
| `veterinary_technician` | Credentialed clinical support. Can read patients/records, record delegated clinical work, and manage clinical tasks. Cannot prescribe.                              |
| `veterinary_assistant`  | Non-credentialed support. Can read basic patient information and perform assigned clinical support tasks. Cannot write clinical records independently or prescribe. |
| `receptionist`          | Front desk. Can manage scheduling and look up clients/patients. Cannot access clinical records or billing.                                                          |
| `billing`               | Accounts personnel. Can look up clients and manage billing. Cannot access clinical records.                                                                         |
| `staff`                 | Legacy seeded role from the prototype. It grants no production permission and must not be used for new access.                                                      |

Hospital roles are assigned only through an active hospital membership. A user may hold several hospital roles in one hospital and memberships in several hospitals. A `hospital_owner` membership cannot be revoked or demoted by a `hospital_admin`; only another active `hospital_owner` or a platform administrator with an explicit hospital-management grant may do so.

### Client scope

| Role code   | Purpose                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `pet_owner` | Pet parent/client. Can manage the account profile, future owned-patient records, appointments, and consented record exports. |

A person may simultaneously be a pet parent and hospital staff. Those contexts remain separate and are selected explicitly through the workspace flow.

## 3. Permissions

Permissions are stable `scope.resource.action` codes stored in `permissions` and mapped to roles in `role_permissions`.

| Permission                       | Platform admin | Hospital owner | Hospital admin | Veterinarian | Technician | Assistant | Receptionist | Billing | Pet parent |
| -------------------------------- | :------------: | :------------: | :------------: | :----------: | :--------: | :-------: | :----------: | :-----: | :--------: |
| `platform.hospitals.manage`      |       ✓        |                |                |              |            |           |              |         |            |
| `platform.users.manage`          |       ✓        |                |                |              |            |           |              |         |            |
| `platform.audit.read`            |       ✓        |                |                |              |            |           |              |         |            |
| `hospital.settings.manage`       |                |       ✓        |       ✓        |              |            |           |              |         |            |
| `hospital.members.manage`        |                |       ✓        |       ✓        |              |            |           |              |         |            |
| `hospital.clients.read`          |                |       ✓        |       ✓        |              |            |           |      ✓       |    ✓    |            |
| `hospital.schedule.manage`       |                |       ✓        |       ✓        |      ✓       |            |           |      ✓       |         |            |
| `hospital.patients.read`         |                |       ✓        |       ✓        |      ✓       |     ✓      |     ✓     |      ✓       |         |            |
| `hospital.records.read`          |                |       ✓        |       ✓        |      ✓       |     ✓      |           |              |         |            |
| `hospital.records.write`         |                |       ✓        |                |      ✓       |     ✓      |           |              |         |            |
| `hospital.clinical_tasks.manage` |                |       ✓        |                |      ✓       |     ✓      |     ✓     |              |         |            |
| `hospital.prescriptions.write`   |                |       ✓        |                |      ✓       |            |           |              |         |            |
| `hospital.billing.manage`        |                |       ✓        |       ✓        |              |            |           |              |    ✓    |            |
| `hospital.inventory.manage`      |                |       ✓        |       ✓        |              |            |           |              |         |            |
| `client.profile.manage`          |                |                |                |              |            |           |              |         |     ✓      |
| `client.appointments.manage`     |                |                |                |              |            |           |              |         |     ✓      |
| `client.records.read`            |                |                |                |              |            |           |              |         |     ✓      |

This matrix is the least-privilege baseline. A role with no mark for an action is denied even if another role held by the same user grants it only in a different hospital scope. Permissions from multiple roles are unioned only within the same active hospital membership.

## 4. Tenant and membership model

- `hospitals` is the tenant root. `locations` remains a campus/address inside a hospital and does not become a second authorization scope.
- `hospital_memberships` links a user to a hospital with status `invited`, `active`, `suspended`, or `revoked`.
- `hospital_membership_roles` links an active membership to one or more hospital roles.
- `hospital_clients` links a pet parent to a hospital with status `active`, `suspended`, or `ended`. It is the future resource boundary for pets, appointments, and owner records.
- Invitations are single-use hashed tokens tied to a hospital, email address, role, inviter, and expiry. Acceptance creates or reactivates a membership only for the invited email account.
- Suspending or revoking a membership immediately denies hospital authorization and revokes sessions whose active workspace is that hospital. Suspended users remain globally authenticated but lose the affected hospital context.
- Hospital resource handlers receive the active hospital from the server session and must reject a mismatched path/body hospital ID with `403 FORBIDDEN`. They must also check the specific permission and resource relationship before reading or mutating data.

## 5. Session and workspace selection

- The session cookie contains only an opaque 256-bit token. Roles, permissions, user IDs, and hospital IDs are never placed in the cookie or browser storage.
- `auth_sessions.active_hospital_id` records the selected hospital, if any, and `auth_sessions.active_scope` records `platform`, `hospital`, or `client`. Both are server-side and cannot be supplied by the browser.
- A session with a null `active_scope` has no privileged permissions. It must select an authorized workspace before scoped API routes are accepted. This is the safe state for legacy sessions created before the column existed.
- `GET /api/access/context` is the authoritative source for the current user's global roles, active memberships, client relationships, effective permissions, active workspace, and allowed application destinations.
- `POST /api/access/workspace` accepts `{ "scope": "...", "hospitalId": "..." | null }`. It changes scope only after the API verifies the matching active membership, client relationship, or platform role. It returns `403` for inactive or unrelated contexts.
- Selecting `client` requires the `pet_owner` role and activates client authority even when the same person also has staff membership there. Selecting `hospital` activates only the membership roles in that tenant.
- Every scoped guard requires an exact matching `active_scope`; a null or mismatched scope is denied and audited.
- `DELETE /api/access/workspace` clears the selected hospital and returns the user to a personal client context.
- Login does not guess a final page. The client requests `/api/access/context` and follows one destination supplied by the API. If several are valid, the client shows a workspace selector; the API still enforces the selected scope and hospital on every later request.

Workspace outcomes:

| User state                                                  | Result                                                                                                                                                            |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Active with one client relationship and no staff membership | `/client`                                                                                                                                                         |
| Active with one hospital membership                         | `/manage/practice`                                                                                                                                                |
| Active platform administrator only                          | `/manage/platform`                                                                                                                                                |
| Active with several valid contexts                          | Workspace selector, then the chosen authorized destination                                                                                                        |
| Both pet-parent and staff relationships                     | Workspace selector; staff authority is not active until a hospital workspace is selected, and client authority is not active until a client workspace is selected |
| No active authorized context                                | A limited account page with no privileged destination                                                                                                             |
| Suspended account                                           | Login denied                                                                                                                                                      |
| Suspended/revoked membership                                | Context excludes it; selecting it returns `403`                                                                                                                   |
| Expired session or logout                                   | All protected requests return `401`; cookie is cleared                                                                                                            |

## 6. Application and routing architecture

All applications are served from one origin:

```text
/                 public veterinary hospital website (apps/web)
/login            unified sign-in (apps/web)
/workspace        server-derived workspace selection UX (apps/web)
/client/*         pet-parent experience (apps/web)
/manage/practice/* hospital management experience (apps/admin)
/manage/platform/* platform administration experience (apps/admin)
/api/*            Express API
```

`apps/admin` uses a `/manage` base path and is routed by the edge/reverse proxy on the same hostname. This keeps one cookie scope, one origin, and one login while preserving the existing Next.js application boundaries and Ant Design theme ownership. Consolidating `apps/admin` into `apps/web` would couple two different UI systems and is not justified at this stage.

Implementation status: the applications use same-origin `/api/*` fetches through `@repo/api-client` with `credentials: "include"`. In local development, `apps/web` rewrites `/api/*` to the Express API and `/manage/*` to `apps/admin`; `apps/admin` uses `basePath: "/manage"` and a `basePath: false` `/api/*` rewrite. Production must place the same-origin reverse proxy in front of all three processes: `/api/*` -> Express, `/manage/*` -> `apps/admin`, everything else -> `apps/web`. Set `API_UPSTREAM`, `ADMIN_UPSTREAM`, `APP_ORIGIN`, and `NEXT_PUBLIC_SITE_URL` for the deployed origin; do not expose the admin app on a subdomain.

Client routing is UX only. Every destination is supplied by `/api/access/context`, and every API mutation revalidates the session, active workspace, membership status, role, and permission on the server. Next.js Server Components call `/api/access/context` with the forwarded `avc_session` cookie and enforce destination prefixes before rendering private routes; client checks are navigation-only.

### Implemented API surface

| Endpoint                                                                          | Authority                                                                                                    |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `GET /api/access/context`                                                         | Authenticated session; server-derived context                                                                |
| `POST /api/access/workspace`                                                      | Authenticated session; validates platform role, active membership, or active client relationship             |
| `DELETE /api/access/workspace`                                                    | Authenticated session; clears hospital and activates personal client context                                 |
| `POST /api/access/invitations/accept`                                             | Authenticated session; invitation token and exact email match                                                |
| `GET /api/access/client/:hospitalId/relationship`                                 | Active client scope and active client relationship                                                           |
| `GET/POST /api/platform/hospitals`                                                | `platform.hospitals.manage`                                                                                  |
| `PATCH /api/platform/hospitals/:hospitalId/status`                                | `platform.hospitals.manage`; status change and session revocation are transactional on suspension or closure |
| `GET /api/hospitals/:hospitalId/memberships`                                      | `hospital.members.manage` for the active workspace                                                           |
| `POST /api/hospitals/:hospitalId/invitations`                                     | `hospital.members.manage`; owner role invitations require owner or explicit platform authority               |
| `PATCH /api/hospitals/:hospitalId/memberships/:membershipId`                      | `hospital.members.manage`; last-owner and self-service lockout protections                                   |
| `PUT/DELETE /api/hospitals/:hospitalId/memberships/:membershipId/roles/:roleCode` | `hospital.members.manage`; owner-role changes require owner or explicit platform authority                   |
| `PUT/DELETE /api/admin/users/:userId/roles/:roleCode`                             | Legacy platform-only role endpoint; rejects hospital and client role codes                                   |

Creating a hospital queues a single-use `hospital_owner` invitation and leaves the hospital suspended until that invitation is accepted. This avoids an active tenant without an accountable owner and avoids giving the platform administrator implicit hospital access.

## 7. Security controls

Implemented in this foundation:

- Argon2id password hashing and dummy-hash verification for nonexistent users.
- Database-backed opaque sessions with hashed storage, HTTP-only cookies, `Secure` in production, `SameSite=lax`, and trusted-origin checks for mutations.
- Login and email-action rate limits, with process-local storage.
- Single-use hashed verification and password-reset tokens; password reset revokes all sessions.
- Server-side platform/hospital/client authorization with explicit permissions.
- Invitation acceptance bound to the invited email address.
- Audit records with actor, target, action, outcome, request ID, IP, user-agent, hospital, resource, and timestamp for sensitive operations and authorization denials.
- Session activity updates and active-workspace revocation when a membership is suspended or revoked.
- Last-platform-administrator and last-hospital-owner protections.

Deferred with explicit risk ownership:

- MFA and step-up reauthentication for privileged actions.
- Shared/distributed rate-limit storage and `trust proxy` tuning for multi-instance production.
- Account lockout automation using the existing `failed_login_attempts` and `locked_until` columns.
- Session listing and per-device revocation UI.
- Email-change and self-service account deletion.
- Encryption-key rotation automation for the email outbox.
- Database integration and browser E2E harnesses; see `docs/testing/standards.md`.

Production deployment is not complete until the deferred controls appropriate to the launch risk are implemented and verified.
