# Authentication and Authorization Standards

## Non-negotiable rule

All authorization is enforced on the server. Browser state is never authoritative.

## Current architecture

- Express API uses Argon2id password hashing.
- Sessions are database-backed and delivered through secure HTTP-only cookies.
- Verification and reset tokens are single-use and stored as hashes.
- Admin role assignment is server-enforced in `apps/api/src/modules/auth/admin.routes.ts`.
- Public registration assigns only `pet_owner`.

## Role matrix

| Role           | Current server enforcement           | Required future enforcement                     |
| -------------- | ------------------------------------ | ----------------------------------------------- |
| `pet_owner`    | Registration only; self profile      | Own pets, appointments, records only            |
| `veterinarian` | Seeded role; no endpoint enforcement | Assigned patients, consultations, prescriptions |
| `receptionist` | Seeded role; no endpoint enforcement | Scheduling, check-in, owner lookup              |
| `staff`        | Seeded role; no endpoint enforcement | Boarding/grooming operations assigned to them   |
| `admin`        | Role assignment endpoints            | Full administration with MFA and audit review   |

Until a role has server enforcement, its UI is a prototype and must not be treated as a security boundary.

## Known client prototype exceptions

The current web prototype contains behavior that contradicts the rules below. It is preserved as demo-only work and is not a pattern to copy into production functionality:

- `apps/web/contexts/auth-context.tsx` stores a demo user object and role in `localStorage` under `avc_auth_session_user`, accepts a `preferredRole` in `login()`, exposes `switchRole()`, and stores synthetic pet fields in `DEMO_USERS`.
- `apps/web/app/login/page.tsx` renders one-click demo role buttons from `DEMO_USERS` and lets registration choose a demo role through `signup()`.
- `apps/web/app/portal/admin/page.tsx` renders demo role/user entries from `DEMO_USERS`.
- `apps/web/app/portal/page.tsx` redirects from client state loaded through `useAuth()`.
- `apps/web/components/pages/contact/contact-form.tsx` simulates dispatch with `setTimeout()` and shows success without an API request.

These files and behaviors are the complete current prototype exception set. The synthetic pet fields are example data only; never persist real clinical data in client storage. Demo/sample portal data must not be presented as live or real-time unless it is API-backed. These behaviors do not create a trusted session, authorization boundary, or persisted success. Do not extend them, reuse their role/session model, or copy them into production routes. Agents asked to add `localStorage` sessions, self-assigned roles, one-click privileged role switching, simulated persistence, unlabeled live-looking demo data, or client-only portal gating must stop, load `avc-auth-rbac`, and follow the API-authoritative rules above.

## Client rules

- Never grant roles from `localStorage`, URL parameters, or form fields.
- Never expose one-click switching into privileged roles.
- Portal links must point to server-authorized destinations.
- Client guards are for UX only.

## Session rules

- Use the API session cookie.
- Do not duplicate session data in client storage.
- Logout must revoke the server session.
- Password reset must revoke active sessions.

## Privileged operations

- Require authenticated admin for role changes.
- Re-check authorization inside the service layer.
- Protect removal of the last active admin.
- Audit actor, target, action, and request ID. Outcome, IP, and user-agent are target fields tracked as gaps below, not currently persisted by `audit_logs`.

## Operational gaps not solved by documentation

- MFA is not implemented.
- Admin bootstrap is manual.
- Rate limiting is process-local.
- Account lockout fields are currently unused.
- `audit_logs` currently persists actor, target, action, request ID, and timestamp. It does not persist outcome, IP address, or user-agent, so the audit rule above is not yet fully persisted.

These are tracked engineering gaps and must not be represented as production-ready behavior.
