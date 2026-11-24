# AVC Pet Hospital engineering workspace

This repository is the development workspace for the AVC Multispeciality Pet
Care Hospital system in Gurugram, Haryana. It is a production-oriented
Veterinary Hospital Management System, not a static marketing demo.

- **Live website and content reference:** [avcpethospital.com](https://avcpethospital.com)
- **Engineering rules:** start at [`docs/README.md`](docs/README.md)
- **AI workflow:** root [`AGENTS.md`](AGENTS.md) and `.opencode/skills/`

The public website is partially implemented in `apps/web`. Login, registration,
contact, and portal surfaces currently use client-side prototype data and are
not connected to the API. The Express API provides a security-conscious auth
foundation only; veterinary domain tables, contracts, services, and workflows
are not implemented yet.

Use the live site as a reference for hospital services and identity. Confirm
current contact details, opening hours, prices, and clinical information with
the hospital before publishing them.

## Requirements

- Node.js 24 or later
- Yarn Classic 1.22.22 (the version declared by this repository)
- MySQL 8 or later for the API and database package

## Install and run

From the repository root:

```bash
yarn install
yarn dev
```

The root `dev` script starts the configured workspaces:

- Website app: [http://localhost:3000](http://localhost:3000)
- Docs app: [http://localhost:3001](http://localhost:3001)
- Staff/admin dashboard: [http://localhost:3002](http://localhost:3002)
- API: [http://localhost:4000](http://localhost:4000)

To run one app at a time:

```bash
yarn start:client # Website app + API
yarn start:admin  # Admin dashboard + API
yarn start:api    # API only
yarn dev          # All apps
```

Before starting the API, copy `apps/api/.env.example` to `apps/api/.env` and
`packages/database/.env.example` to `packages/database/.env`, then set
`DATABASE_URL` in both to the same existing MySQL database. Configure the
Resend settings and email token encryption key in the API environment before
using registration or password recovery.

## Quality gates

Run these from the repository root:

| Command             | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `yarn dev`          | Start all apps in development mode                          |
| `yarn build`        | Build all workspaces that define a build task               |
| `yarn lint`         | Lint all workspaces with ESLint                             |
| `yarn lint:css`     | Lint CSS and guard design-token drift                       |
| `yarn check-types`  | Type-check all workspaces that define the task              |
| `yarn test`         | Run workspace tests through Turborepo                       |
| `yarn format:check` | Check Prettier formatting (informational during transition) |
| `yarn ci`           | Run lint, CSS lint, type check, tests, and build            |
| `yarn format`       | Format TypeScript, TSX, and Markdown files with Prettier    |

CI runs on pushes to `dev`/`main` and on pull requests. `format:check` is
reported but non-blocking until the existing formatting drift is migrated.

Run a task for one workspace with Turbo filters, for example:

```bash
yarn turbo run build --filter=web
yarn turbo run lint --filter=api
```

## Repository layout

```text
apps/
  web/                 Next.js public website and prototype portal pages
  docs/                Separate Next.js starter app; not the canonical docs source
  admin/               Separate Next.js + Ant Design staff dashboard
  api/                 Express + TypeScript auth API
packages/
  ui/                  Starter React components; not yet the production design system
  eslint-config/       Shared ESLint flat configurations with a11y and boundary rules
  typescript-config/   Shared TypeScript configurations
  contracts/           Shared Zod schemas and API/user/profile model types
  database/            Shared Drizzle/MySQL auth schema and migrations
docs/                  Canonical engineering and domain rulebooks
.opencode/skills/       Project-specific AI workflows
scripts/               Engineering guard scripts
```

The API is a separate Express app. Start it with `yarn dev:api` after
configuring the environment files. Database migrations are managed by the
`@repo/database` workspace:

```bash
yarn workspace @repo/database generate
yarn workspace @repo/database migrate
yarn dev:api
```

Registration and password recovery require a Resend API key, a verified sender
domain, and `EMAIL_TOKEN_ENCRYPTION_KEY` (32 random bytes encoded as 64 hex
characters). `apps/api/README.md` documents the current endpoint list and
deployment limitations.

## Website content reference

Google Maps lists two AVC locations in Gurugram:

- [AVC Multispeciality Pet Hospital](https://www.google.com/maps/search/?api=1&query=AVC+Multispeciality+Pet+Hospital+Gurugram) — Regal Garden, Badha, Hayatpur Road, near DLF, Sector 90, Gurugram, Haryana 122505.
- [AVC Pet Boarding](https://www.google.com/maps/search/?api=1&query=AVC+Pet+Boarding+Sector+87+Gurugram) — Sector 87, Gurugram, Haryana 122505.

The official site lists **+91 99900 70026** and **+91 74500 28000** as contact numbers. Confirm which number and services apply to each location before publishing them.

The live site describes outpatient care, boarding, grooming, medical and
preventive care, surgery, emergency services, and laboratory services. It lists
care for dogs, cats, birds, rabbits, guinea pigs, hamsters, and exotic animals.
Treat this as content discovery, not confirmation that every detail is current.

## Deployment

Deployment is not configured in this repository yet. Choose and configure a
hosting platform for the Next.js apps and API before treating this project as
the live hospital system. See `docs/security/standards.md` and
`docs/testing/standards.md` for the remaining production-readiness gaps.
