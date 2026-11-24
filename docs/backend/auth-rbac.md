# Authentication and Authorization Standards

## Non-negotiable rule

All authorization is enforced on the server. Browser state is never authoritative.

The production model is specified in `docs/architecture/identity-and-access.md`; that document is authoritative for scope, roles, permissions, membership, workspace selection, and routing. This document records the API enforcement rules and current implementation status.

## Current architecture

- Express API uses Argon2id password hashing.
- Sessions are database-backed and delivered through one secure HTTP-only cookie, `avc_session`. Only an opaque token is sent to the browser.
- Verification, password-reset, and hospital-invitation tokens are single-use and stored as SHA-256 hashes.
- Public registration assigns only `pet_owner`. It never assigns a platform or hospital role.
- Global `admin` is the platform administrator role. Hospital authority comes only from `hospital_memberships` plus `hospital_membership_roles`.
- Permissions are stable codes mapped to roles; authorization checks permissions, not UI labels.
- The active hospital and scope are stored on `auth_sessions.active_hospital_id` and `auth_sessions.active_scope`, not in a client claim or header. A user with both staff and client relationships must select the intended scope explicitly. A null legacy scope grants no privileged permission until a workspace is selected.
- Access context, workspace selection, hospital provisioning, invitations, and membership management are exposed under `/api/access`, `/api/platform`, and `/api/hospitals`.
- Legacy `/api/admin/users/:userId/roles/:roleCode` assigns only platform-scoped roles. It must never assign hospital or client roles.

## Role matrix

| Role                    | Scope    | Server enforcement                                                                                    |
| ----------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `pet_owner`             | client   | Registration; self profile; future owned-resource checks through `hospital_clients` and pet ownership |
| `admin`                 | platform | Existing global role endpoints plus platform permission checks; no automatic hospital data access     |
| `hospital_owner`        | hospital | Membership-gated hospital permissions; last-owner protection                                          |
| `hospital_admin`        | hospital | Membership-gated operational permissions; cannot manage owner roles or prescribe                      |
| `veterinarian`          | hospital | Membership-gated clinical permissions including prescriptions and clinical records                    |
| `veterinary_technician` | hospital | Membership-gated delegated clinical tasks and record entries; no prescribing                          |
| `veterinary_assistant`  | hospital | Membership-gated support tasks; no independent clinical records or prescribing                        |
| `receptionist`          | hospital | Membership-gated scheduling and client/patient lookup; no clinical or billing access                  |
| `billing`               | hospital | Membership-gated client lookup and billing; no clinical access                                        |
| `staff`                 | hospital | Legacy seeded role; deliberately grants no production permission                                      |

The complete permission matrix is in `docs/architecture/identity-and-access.md`.

## Request enforcement rules

1. `requireAccessAuthentication` validates the session hash, expiry, and active user status, then attaches only `userId`, `sessionId`, active hospital, and active scope from the database.
2. Every scoped guard requires an exact `platform`, `hospital`, or `client` scope. Null and mismatched scopes are denied and audited.
3. `requirePlatformPermission` requires platform scope and queries the user's active platform roles for the named permission. Services re-check before mutations.
4. `requireHospitalPermission` requires hospital scope, an active membership for the active session hospital, the named permission, and a matching route `hospitalId`; mismatches return `403`.
5. `requireClientPermission` plus `requireClientResource` require client scope, a client permission, and an active relationship for the server-selected hospital. Client handlers never accept an ownership claim from the request body.
6. Client scope additionally requires the `pet_owner` role; an active client relationship alone does not create permissions.
7. Privileged mutations are transactional, audited with actor/target/action/outcome/request ID, and protected against removal of the last platform administrator or last hospital owner.
8. Denied permission and workspace checks are audited with outcome `denied`, the requested permission or reason, scope, hospital, IP, and user-agent.
9. Suspending or revoking a membership revokes sessions whose active hospital is that tenant and removes it from future access-context responses.
10. Owner-role grants and removals require an active hospital owner or a platform administrator with an explicit active hospital membership and management permission. The final owner still cannot be removed.

## Known client prototype exceptions

The production client paths no longer use demo identity or `localStorage`. `apps/web/contexts/auth-context.tsx`, `apps/web/app/login/page.tsx`, and the legacy `/portal/*` routes were replaced in Phase 7 with API-backed state, real login/registration/logout, and server-enforced destinations. The remaining documented prototype exceptions are outside identity and access:

- `apps/web/components/pages/contact/contact-form.tsx` still simulates dispatch with `setTimeout()` and shows success without an API request.

The synthetic pet fields and one-click role switching previously present in the demo login and portal pages were removed from the production paths. Never persist real clinical data in client storage. Demo/sample data must not be presented as live or real-time unless it is API-backed. Agents asked to add `localStorage` sessions, self-assigned roles, one-click privileged role switching, simulated persistence, unlabeled live-looking demo data, or client-only portal gating must stop, load `avc-auth-rbac`, and follow the API-authoritative rules above.

## Client rules

- Never grant roles from `localStorage`, URL parameters, or form fields.
- Never expose one-click switching into privileged roles.
- Use `/api/access/context` as the only source of navigation destinations and workspace state.
- Portal links must point to server-authorized destinations.
- Client guards are for UX only.

## Session rules

- Use the API session cookie only.
- Do not duplicate session data in client storage.
- Logout must revoke the server session.
- Password reset must revoke active sessions.
- Membership suspension/revocation must revoke affected active hospital sessions.
- A session with an expired `expires_at` is rejected even if the cookie has not yet expired.

## Privileged operations

- Require an authenticated principal with the exact platform or hospital permission.
- Re-check authorization inside the service layer after acquiring the relevant row lock.
- Protect removal of the final active platform administrator and the final active hospital owner.
- Audit actor, target, action, outcome, scope, request ID, IP, and user-agent.
- Reject client-supplied role codes, hospital IDs, and ownership IDs outside the validated contract.

## Operational gaps not solved by this foundation

- MFA and step-up authentication are not implemented.
- Platform-administrator bootstrap remains a controlled manual operation.
- Rate limiting is process-local and needs a shared store for horizontal scaling.
- `trust proxy` must be configured correctly behind the production load balancer.
- Account lockout fields remain unused; automated lockout is deferred.
- Session listing and per-device revocation are not implemented.
- Encryption-key rotation for the email outbox is not automated.
- Database integration and browser E2E harnesses are not provisioned; see `docs/testing/standards.md`.

These are tracked engineering gaps and must not be represented as production-ready behavior.
