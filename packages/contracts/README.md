# `@repo/contracts`

Shared runtime validation schemas and inferred TypeScript types for data that
crosses app and API boundaries. Zod schemas live in `src/models/` and are
exported from the package entry point.

The package includes API health/error and pagination contracts, location
contracts, and public user/profile/role schemas. `UserSchema` intentionally
does not contain a password or password hash. `CreateAccountSchema` validates
the password only as an input; never persist or return the raw value. Public
registration schemas do not accept role assignments—grant privileged roles
only through authorized server-side workflows.

Keep request/response contracts here so the web app and API validate against
the same definitions. Database table definitions belong in `@repo/database`;
avoid putting secrets or patient medical data in shared contracts.

```ts
import { CreateLocationSchema, type Location } from "@repo/contracts";
```
