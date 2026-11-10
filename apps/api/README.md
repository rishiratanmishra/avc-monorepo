# AVC API

Express 5 + TypeScript backend for the AVC Pet Hospital monorepo. The API uses
controller/service/route separation, Zod request validation, shared contracts,
and the Drizzle/MySQL package. Authentication uses Argon2id password hashes,
single-use hashed verification/reset tokens, database-backed sessions, secure
cookies, role-based authorization, and audit records for admin role changes.

## Requirements

- Node.js 24 or later
- Yarn Classic 1.22.22
- MySQL 8 or later (the email outbox worker uses `SKIP LOCKED`)
- A Resend account and verified sending domain for registration and password
  recovery email

## Run locally

From the monorepo root:

1. Copy `apps/api/.env.example` to `apps/api/.env`.
2. Copy `packages/database/.env.example` to `packages/database/.env`.
3. Set `DATABASE_URL` in both files to the same existing MySQL database.
4. Set `RESEND_API_KEY`, `EMAIL_FROM`, and `EMAIL_TOKEN_ENCRYPTION_KEY` in the
   API environment. The encryption key must be 32 random bytes encoded as 64
   hexadecimal characters; generate one locally with
   `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
5. Install dependencies, apply migrations, and start the API:

```bash
yarn install
yarn workspace @repo/database migrate
yarn dev:api
```

The API listens on [http://localhost:4000](http://localhost:4000). Set
`APP_ORIGIN` to the frontend origin and `CORS_ORIGINS` to its comma-separated
allowed browser origins. Email links target `/verify-email` and
`/reset-password` on `APP_ORIGIN`; the frontend must read the token from the
URL fragment and POST it to the matching API endpoint.

## Endpoints

| Method   | Path                                       | Purpose                                      |
| -------- | ------------------------------------------ | -------------------------------------------- |
| `GET`    | `/`                                        | Basic API status                             |
| `GET`    | `/api/health`                              | Liveness check; does not require MySQL       |
| `GET`    | `/api/health/ready`                        | Readiness check; verifies MySQL connectivity |
| `POST`   | `/api/auth/register`                       | Register a pet-owner account                 |
| `POST`   | `/api/auth/login`                          | Sign in and set a session cookie             |
| `POST`   | `/api/auth/logout`                         | Revoke the current session                   |
| `GET`    | `/api/auth/me`                             | Get the authenticated user and profile       |
| `PATCH`  | `/api/auth/profile`                        | Update the current user's profile            |
| `POST`   | `/api/auth/verify-email`                   | Consume an email verification token          |
| `POST`   | `/api/auth/resend-verification`            | Request a verification email                 |
| `POST`   | `/api/auth/request-password-reset`         | Request a password reset email               |
| `POST`   | `/api/auth/reset-password`                 | Consume a reset token and change password    |
| `PUT`    | `/api/admin/users/:userId/roles/:roleCode` | Assign a role (admin only)                   |
| `DELETE` | `/api/admin/users/:userId/roles/:roleCode` | Revoke a role (admin only)                   |

## Useful commands

Run from the monorepo root:

```bash
yarn turbo run build --filter=api
yarn turbo run lint --filter=api
yarn turbo run check-types --filter=api
yarn workspace api test
yarn workspace @repo/database generate
yarn workspace @repo/database migrate
```

Review generated migrations before applying them. Keep real credentials out of
source control.

## Important deployment notes

- Public registration assigns only the `pet_owner` role. Staff and admin roles
  require an existing administrator; bootstrap the first admin through a
  controlled, audited operational process before exposing admin workflows.
- The rate limiter is process-local. Use a shared store before deploying
  multiple API instances.
- Configure and verify a production Resend sending domain. Never share API keys
  or encryption keys in source control or chat.
- The frontend verification and password-reset pages are not implemented yet.
- Admin MFA, operational monitoring, and live MySQL/Resend integration testing
  remain deployment work. This is a security-conscious foundation, not a
  production certification.

## Structure

```text
src/
  config/       Environment parsing
  errors/       Application errors
  middleware/   Authentication, validation, origin checks, rate limits
  modules/
    auth/       Registration, sessions, email delivery, role administration
    health/     Health routes, controllers, and services
```

Shared Zod contracts live in `packages/contracts`; reusable Drizzle database
access and table definitions live in `packages/database`.
