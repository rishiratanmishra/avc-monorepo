# Phase 7 Frontend Integration Handover

Phase 7 milestone report — 25 November 2026.

## Scope and status

Phase 7 connects the Phase 6 identity/access foundation to real `apps/web` and `apps/admin` journeys. The public hospital website remains unauthenticated. Authenticated users are routed only to destinations supplied by the API, and protected pages are guarded by server-side reads of `/api/access/context`.

This is a handover report, not a deployment certificate. All Phase 6 and Phase 7 changes remain uncommitted on `dev` at HEAD `7248b85` (`ai guides`). No commit, push, pull request, or review was created. The canonical design is `docs/architecture/identity-and-access.md`; API enforcement is documented in `docs/backend/auth-rbac.md`.

## 1. Integration architecture

### One canonical client

`@repo/api-client` is the only typed client for browser and server API calls. It:

- parses requests and responses with `@repo/contracts` Zod schemas;
- uses same-origin `/api/*` with `credentials: "include"` in the browser;
- forwards the `avc_session` cookie header when called from a Next.js Server Component;
- exposes login, registration, logout, password-reset request, access context, workspace selection, and workspace clearing;
- throws `ApiError` with the API status/code for consistent UX handling.

No production browser code stores identity, roles, permissions, workspace IDs, or session tokens in `localStorage` or `sessionStorage`. A repository-wide search of `apps/` and `packages/` found no such use.

### Web app

`apps/web/app/layout.tsx` reads the optional access context on the server and seeds `AuthProvider` with it. This avoids a duplicate client-side session fetch. `AuthProvider` owns session status, login/register/logout/reset, refresh, and workspace selection. It routes with `window.location.assign` when the destination is a full document crossing the web/admin app boundary, and uses the Next router only for same-app navigation such as logout to the public home page.

Server-enforced route guards live in `apps/web/lib/server-access.ts`:

- `requireDestination("/client")` guards the pet-parent page;
- missing or expired sessions redirect to `/login?reason=expired`;
- an active destination that does not match the required prefix redirects to `/workspace?reason=forbidden`;
- `/workspace` always shows the selector when a `reason` or `switch=1` query is present, preventing a forbidden request from bouncing back to the active workspace.

New web routes are `/login`, `/workspace`, `/client`, and the legacy `/portal` redirect. The old simulated role portals were removed. New pages use shared layout, `Container`, `Header`, `Footer`, and `MobileActionBar` primitives, design tokens, `noindex` metadata, loading state, and API-backed error/status messaging.

### Admin app

`apps/admin` keeps a separate Next.js application and Ant Design shell but uses `basePath: "/manage"`. Server route guards in `apps/admin/lib/server-access.ts` call the API with the forwarded cookie and redirect cross-app failures to the web app's `/login` or `/workspace`. The admin app supplies workspace switch and logout controls; both use backend-confirmed context or the API logout endpoint. Private-state routes provide not-found and error links back to the web workspace selector.

No second admin surface was added to `apps/web`, and no admin subdomain was introduced.

## 2. Completed journeys

| Journey                     | Result                                                                                                                                                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public site                 | `/` remains unauthenticated; navigation shows `Login / Register`.                                                                                                                                                                                                                                             |
| Unified sign-in             | `POST /api/auth/login` sets the HTTP-only cookie; UI follows the API context destination. Invalid credentials, suspended account, unverified email, and service failures have distinct messages.                                                                                                              |
| Single valid context        | A user with one backend destination has it selected through `POST /api/access/workspace` and lands directly on that destination. Verified with `platform@phase7.test` → `/manage/platform`.                                                                                                                   |
| Multiple valid contexts     | `staff@phase7.test` received two hospital destinations and one client destination from the API and was shown the workspace selector. Selecting North or South resulted in the server-rendered `/manage/practice` page reflecting the selected hospital; selecting the client relationship rendered `/client`. |
| Mixed staff/client identity | Staff and client authority remain separate scopes. The selector uses backend destination `scope` and `hospitalId`; no client-side role mapping is performed.                                                                                                                                                  |
| Session restoration         | Reloading `/manage/platform` and `/manage/practice` preserved the authenticated route because the Server Component re-read the cookie and context.                                                                                                                                                            |
| Logout                      | The web header's Sign out called `POST /api/auth/logout` (204); the context then returned 401 and the UI returned to the public home page with `Login / Register`.                                                                                                                                            |
| Direct protected URL denial | Under an active hospital workspace, `/client` and `/manage/platform` redirected to `/workspace?reason=forbidden`. Under an active platform workspace, `/manage/practice` was denied. No role-name hardcoding decided these outcomes.                                                                          |
| Expired session             | The session expiry was forced in the isolated test database. A protected URL redirected to `/login?reason=expired` and displayed the expiry message.                                                                                                                                                          |
| Revoked membership          | The active North membership was set to `revoked` in the isolated test database. `/manage/practice` was denied, the revoked hospital disappeared from the workspace selector, and the membership was restored afterward.                                                                                       |
| Registration and reset UI   | Implemented through the shared client with pending, success, field-error, and failure states. These two forms were not driven end-to-end in the browser during this handover.                                                                                                                                 |

Browser verification used isolated fixtures in `avc_phase7_test` with password `Password123!`. No fixture credentials or patient data were added to source control.

## 3. Routing and deployment

Local one-origin behavior uses Next rewrites:

```text
/api/*       -> Express API (API_UPSTREAM)
/manage/*    -> apps/admin (ADMIN_UPSTREAM, development only)
everything else -> apps/web
```

`apps/admin` uses `basePath: "/manage"` and a `basePath: false` rewrite for `/api/*`. Cross-app navigation uses full document loads so the destination app's server guard always runs.

Production still requires a reverse proxy or route zone on `avcpethospital.com`:

```text
/api/*       -> Express
/manage/*    -> apps/admin
/*           -> apps/web
```

Deployments must set `API_UPSTREAM`, `ADMIN_UPSTREAM`, `APP_ORIGIN`, `NEXT_PUBLIC_SITE_URL`, and the API's trusted CORS/origin values for the same origin. The admin process must not be exposed on a separate hostname. A committed production proxy/ingress configuration is still outstanding; the current implementation is documented and locally verified through Next rewrites.

## 4. Session and workspace handling

- The browser holds only an opaque HTTP-only `avc_session` cookie; the backend owns active scope and hospital.
- `GET /api/access/context` is the single source for roles, memberships, relationships, permissions, destinations, active workspace, and active destination.
- `POST /api/access/workspace` receives the backend-supplied `scope` and `hospitalId` and returns a fresh context. The UI never invents or strengthens a scope.
- A single destination is selected automatically as a navigation convenience; multiple destinations require explicit selection.
- `activeDestination` is authoritative for exact workspace routing. Route guards compare its `path` prefix; they do not compare role names.
- Missing or expired sessions, forbidden destinations, and stale/revoked workspaces degrade to login or the workspace selector without rendering privileged content.

## 5. Validation results

Gates were run locally with Yarn 1.22.22 and Turbo 2.11.10. The two remaining ESLint warnings are pre-existing in `contact-form.tsx` and `why-choose-us.tsx`; the Phase 7 login and auth-context warnings from the Phase 5 baseline were resolved. `format:check` is informational in CI and its 70 flagged files are pre-existing drift; no file added or edited in this milestone remains flagged.

| Gate                          | Result                                                              |
| ----------------------------- | ------------------------------------------------------------------- |
| `yarn lint`                   | Exit 1 — 2 pre-existing web warnings; no new failures               |
| `yarn verify:eslint-coverage` | Exit 0                                                              |
| `yarn lint:css`               | Exit 0; 41 CSS files, 190 pre-existing warnings, 0 errors           |
| `yarn check-types`            | Exit 0                                                              |
| `yarn test`                   | Exit 0                                                              |
| `yarn build`                  | Exit 0                                                              |
| `yarn format:check`           | Exit 1 — informational; 70 pre-existing files, none introduced here |

Browser verification included keyboard traversal of the login form: focus progressed through the logo, main navigation, Sign In, Create Account, and email input. Lighthouse reported accessibility, best practices, and SEO scores of 1.0 for `/login` with no failures. The current browser tooling does not provide viewport emulation, so mobile layout was reviewed through token-based CSS and stylelint rather than a true mobile viewport capture. `node_modules/next/dist/docs/` contains no installed Next.js guide in this workspace; the App Router integration was validated through the existing code patterns and runtime checks.

Temporary database helper scripts used to create fixtures, expire a session, and revoke a membership were removed after verification.

## 6. Remaining gaps

- No committed component, E2E, or database integration harness exists. Browser checks in this report were manual and are not a repeatable CI gate.
- No committed production reverse-proxy/ingress configuration exists; deployment routing remains documentary.
- Registration and password-reset flows were implemented but not browser-driven end to end.
- `/accept-invitation` remains unimplemented despite the API-complete invitation flow.
- MFA, step-up authentication, distributed rate limiting, lockout automation, session listing, and per-device revocation remain deferred from Phase 6.
- Pet-level resource authorization waits for clinical domain tables and ownership invariants.
- `format:check` drift, 190 CSS warnings, and 2 ESLint warnings are pre-existing debt; none were introduced by this milestone.

## 7. Next milestone

1. Provision committed E2E coverage for login, workspace selection, protected-URL denial, expiry, revocation, and logout before treating these journeys as regression-protected.
2. Add the production one-origin proxy/ingress definition and verify `/manage/*` deployment against the real domain.
3. Complete the invitation acceptance page and the first client workflow backed by an authorized API route.
4. Introduce clinical domain tables only after extending the canonical ownership and retention invariants.
5. Design MFA/step-up policy and production rate-limit/lockout storage before enabling high-risk privileged operations.

## 8. Review notes

- All changes are uncommitted; review the full diff before any commit.
- `apps/web/AGENTS.md` contains a generated `nextjs-agent-rules` block added by `next dev`. It was preserved verbatim and should be included in review.
- The migration `packages/database/drizzle/0003_identity_access.sql` includes reviewed role/permission seed statements appended during Phase 6/7 setup.
