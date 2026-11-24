# Database Standards

## Ownership

`@repo/database` owns the MySQL pool, Drizzle schema, relations, and migrations. No app may create its own pool or define ad hoc table types.

## Current scope

Implemented tables cover authentication and users only:

- `locations`
- `roles`
- `users`
- `user_profiles`
- `user_roles`
- `auth_sessions`
- `auth_tokens`
- `audit_logs`
- `email_outbox`

No pet, appointment, consultation, medical, billing, or inventory tables exist yet.

## Naming

- Tables: plural snake_case, e.g. `appointment_slots`.
- Columns: snake_case.
- Foreign keys: `<singular_table>_id`.
- Indexes: `<table>_<columns>_idx`.
- Unique constraints: `<table>_<columns>_uniq`.
- Timestamps: `created_at`, `updated_at`; soft deletion `deleted_at`.

## Schema rules

- Define every table in `src/schema/`, export from `src/schema/index.ts`.
- Add Drizzle relations in `src/schema/relations.ts`.
- Keep matching boundary types in `@repo/contracts`.
- Use explicit foreign keys with deliberate delete behavior.
- Store secrets only as hashes; tokens must never be stored in plaintext.
- Do not add medical/PII fields to shared contracts unless required for an API boundary.

## Migrations

- Generate with `yarn workspace @repo/database generate`.
- Review generated SQL before applying.
- Never hand-edit generated snapshots or journal files.
- Apply with `yarn workspace @repo/database migrate`.
- Migration changes require a rollback or forward-fix note in the PR.
- Production migrations must be reviewed separately from application code.

## Integrity and lifecycle

- Prefer soft deletion for clinical and customer records.
- Hard deletion is allowed only for ephemeral security records with documented retention.
- Every domain table that contains PII must define an audit strategy.
- Status fields must have documented transitions before implementation.
- Avoid nullable columns unless null has a defined business meaning.

## Transaction rules

- Multi-table writes use transactions.
- Row locks are required for token consumption, slot assignment, and counter increments.
- No domain write should leave partial state on failure.

## Deferred work

The following are engineering gaps, not rules to ignore:

- Domain schema is absent.
- Soft deletion policy is not implemented.
- Account lockout fields are unused.
- Migration validation is not in CI.
- Backup/restore runbook does not exist.
