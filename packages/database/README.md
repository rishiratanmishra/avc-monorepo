# `@repo/database`

Shared MySQL access and Drizzle table definitions. The package owns the MySQL
connection pool, the Drizzle schema, and migration configuration; apps should
use `getDatabase()` instead of creating their own pools.

## Configure MySQL

Copy `.env.example` to `.env` in this package and set `DATABASE_URL` to a MySQL
database that already exists. Do not commit credentials.

```bash
yarn workspace @repo/database generate
yarn workspace @repo/database migrate
```

The schema includes `locations`, `users`, `user_profiles`, `roles`,
`user_roles`, `auth_sessions`, `auth_tokens`, `audit_logs`, and `email_outbox`.
Users store a password hash, never a raw password; the API hashes passwords
with Argon2id. User profiles hold contact and optional address details
separately from authentication fields. Session and one-time-token tables store
only token hashes. The email outbox stores token payloads encrypted with the
API's `EMAIL_TOKEN_ENCRYPTION_KEY` until delivery, then clears them.

Public registration must not accept role assignments; grant staff and admin
roles only through authorized server-side workflows. The initial administrator
must be bootstrapped through a controlled operational process. The outbox
worker uses MySQL 8's `SKIP LOCKED`; configure a shared rate-limit store before
running multiple API instances.

Add future tables in `src/schema/`, export them from `src/schema/index.ts`, and
keep their API contracts in `@repo/contracts`. Review and test generated
migrations before applying them to a production database.
