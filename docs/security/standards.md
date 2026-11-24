# Security Standards

## Non-negotiable rules

- Never trust browser state for identity, roles, permissions, or prices.
- Never store credentials, tokens, or medical data in `localStorage`.
- Never commit secrets. Use environment variables through documented examples.
- Never expose raw errors, stack traces, or database messages to clients.
- Never return password hashes, token hashes, or private keys in API responses.

## Secrets and environment

- Every environment variable consumed by code must be documented in an `.env.example`.
- Every optional feature must state which variables enable it.
- Turbo inputs must declare environment variables that affect build output.
- Production cookies require HTTPS and secure attributes.
- Encryption keys need a rotation plan before sensitive payloads reach production.

## Input and output

- Validate all request bodies, params, and query strings with Zod contracts.
- Escape or encode untrusted content before rendering in HTML or email.
- Reject unexpected fields where the contract uses strict schemas.
- Cap request body size.
- Validate redirects against an allowlist.

## Authentication and authorization

- Use the API session cookie as the only trusted session.
- Enforce roles server-side on every protected route and service method.
- Audit privileged actions.
- Failed logins must be rate limited and logged; audit-record persistence is a tracked gap in `docs/backend/auth-rbac.md`.
- Account lockout and MFA are tracked gaps, not implemented controls.

## Personal and medical data

- Minimize collection: do not collect fields with no defined use or retention.
- Provide clear consent for submissions involving pets, owners, or medical details.
- Do not render real patient data in public/client-only prototypes.
- Access must be role-scoped and audited.
- Define retention and deletion behavior before adding domain storage.

## File uploads

No upload pipeline exists yet. When added:

- validate MIME type and extension;
- enforce size limits;
- store outside the public directory;
- use signed URLs for access;
- scan untrusted files;
- never execute uploaded content;
- audit upload and access events.

## Web vulnerabilities

- Keep Helmet and trusted-origin middleware enabled.
- Use CSRF defenses for cookie-authenticated mutations.
- Avoid `dangerouslySetInnerHTML`.
- Keep dependencies patched.
- Do not introduce eval-like patterns or dynamic code execution from user input.

## Rate limiting and availability

- Public mutations require rate limits.
- Multi-instance deployment requires a shared rate-limit store.
- Configure `trust proxy` behind a load balancer.
- External dependencies must have timeouts and graceful failure states.

## Required review questions

Before approving a change, ask:

1. Can an unauthenticated user reach this?
2. Can a user supply a role or ownership ID they do not own?
3. Is any secret or medical data logged, cached, or shipped to the browser?
4. Does a failed operation leave partial state?
5. Is the action audited if it is privileged or sensitive?
