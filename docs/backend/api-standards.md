# API Standards

## Scope

Applies to `apps/api` and any future server-side route handlers. Express is the authoritative API runtime; do not add a second backend framework without an architecture decision record.

## Structure

```text
routes -> middleware -> controller -> service -> database
```

- `*.routes.ts`: path, method, middleware chain only.
- `*.controller.ts`: HTTP translation only.
- `*.service.ts`: business rules and transaction boundaries.
- `*.repository.ts`: module-specific database access where the query surface justifies it; inject repositories into services rather than scattering Drizzle queries through controllers or routes.
- `*.container.ts`: composition of module services and repositories where dependency injection is used.
- `errors/`: application error types.
- `middleware/`: cross-cutting concerns.

Backend work follows the repository-wide responsibility standard in `docs/architecture/standards.md`. Routes and controllers must not absorb domain rules, and services must not bypass API authorization or tenant-scope enforcement.

## Routes

- Use REST-style, lowercase kebab-case paths.
- Version only when a breaking change requires it; do not version preemptively.
- Validate params and query values, not just bodies.
- Every mutating route must have authentication/authorization and rate-limit review.

## Contracts

- Request and response schemas belong in `@repo/contracts`.
- Validate incoming bodies with Zod middleware.
- Validate responses for new endpoints using shared schemas.
- Never return password hashes, token hashes, or raw secrets.

## Errors

Use the existing envelope:

```json
{
  "error": {
    "code": "string_machine_code",
    "message": "Human-readable message",
    "details": {}
  }
}
```

- Do not leak stack traces or database errors to clients.
- Include the request ID in logs and audit records.
- Map domain errors to stable status codes in one place.

## Status codes

- `200` successful read/update with body.
- `201` created resource.
- `202` accepted asynchronous work.
- `204` successful action with no body.
- `400` validation failure.
- `401` unauthenticated.
- `403` authenticated but unauthorized.
- `404` not found or intentionally hidden.
- `409` conflict/invalid state transition.
- `429` rate limited.
- `503` dependency unavailable.

## Transactions

- Multi-table writes must use a transaction.
- Token/session/password operations must retain current locking behavior.
- Domain workflows must define their own transaction boundaries in the service layer.

## Logging and audit

- Log with request ID.
- Audit all privileged actions and sensitive data access.
- Failed authentication attempts must be observable through rate limiting and logging; audit-record persistence is a tracked gap in `docs/backend/auth-rbac.md`.
- Never log credentials, tokens, or medical data.

## Rate limiting

- Login, registration, email actions, and any future public mutation require rate limits.
- Process-local limits are acceptable only for local development.
- Multi-instance deployment requires a shared store and `trust proxy` configuration.

## New feature rule

Do not implement veterinary domain endpoints until `docs/business-logic/veterinary-domain.md` defines the relevant invariant and status transitions.
