# AVC Pet Hospital website

This repository is the development workspace for the AVC Multispeciality Pet
Care Hospital website in Gurugram, Haryana.

- **Live website and content reference:** [avcpethospital.com](https://avcpethospital.com)
- **Application planned for the website:** `apps/web`
- **Current status:** the Next.js apps still display the Turborepo starter pages.
  The hospital website has not yet been rebuilt in this repository.

Use the live site as a reference for the hospital's services and identity.
Confirm current contact details, opening hours, prices, and clinical information
with the hospital before publishing them in the rebuilt site.

## Requirements

- Node.js 24 or later
- Yarn Classic 1.22.22 (the version declared by this repository)

## Install and run

From the repository root:

```bash
yarn install
yarn dev
```

The root `dev` script starts all four apps:

- Website app: [http://localhost:3000](http://localhost:3000)
- Docs app: [http://localhost:3001](http://localhost:3001)
- Staff/admin dashboard: [http://localhost:3002](http://localhost:3002)
- API: [http://localhost:4000](http://localhost:4000)

To run one app at a time:

```bash
yarn workspace web dev
yarn workspace docs dev
yarn workspace admin dev
yarn dev:api
```

Before starting the API, copy `apps/api/.env.example` to `apps/api/.env` and
`packages/database/.env.example` to `packages/database/.env`, then set
`DATABASE_URL` in both to the same existing MySQL database. Configure the
Resend settings and email token encryption key in the API environment before
using registration or password recovery.

## Common commands

Run these from the repository root:

| Command            | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `yarn dev`         | Start all apps in development mode                       |
| `yarn build`       | Build all workspaces that define a build task            |
| `yarn lint`        | Lint all workspaces that define a lint task              |
| `yarn check-types` | Type-check all workspaces that define the task           |
| `yarn format`      | Format TypeScript, TSX, and Markdown files with Prettier |

Run a task for only one app with Turbo filters, for example:

```bash
yarn turbo run build --filter=web
yarn turbo run lint --filter=docs
```

## Repository layout

```text
apps/
  web/                 Next.js app intended for the hospital website
  docs/                Separate Next.js app (currently a starter page)
  admin/               Separate Next.js + Ant Design staff dashboard
  api/                 Express + TypeScript backend
packages/
  ui/                  Shared React components
  eslint-config/       Shared ESLint flat configurations
  typescript-config/   Shared TypeScript configurations
  contracts/           Shared Zod schemas and API/user/profile model types
  database/            Shared Drizzle/MySQL client, user schema, and migrations
```

The `web` and `docs` apps are independent Next.js workspaces. Shared packages
can be imported by either app using their workspace package names.

The API is a separate Express app. Start it with `yarn dev:api` after configuring
`apps/api/.env` and `packages/database/.env` from their example files. Database
migrations are managed by the `@repo/database` workspace:

```bash
yarn workspace @repo/database generate
yarn workspace @repo/database migrate
yarn dev:api
```

Registration and password recovery require a Resend API key, a verified sender
domain, and `EMAIL_TOKEN_ENCRYPTION_KEY` (32 random bytes encoded as 64 hex
characters). The API README documents the environment variables and deployment
limitations.

## Website content reference

Google Maps lists two AVC locations in Gurugram:

- [AVC Multispeciality Pet Hospital](https://www.google.com/maps/search/?api=1&query=AVC+Multispeciality+Pet+Hospital+Gurugram) — Regal Garden, Badha, Hayatpur Road, near DLF, Sector 90, Gurugram, Haryana 122505.
- [AVC Pet Boarding](https://www.google.com/maps/search/?api=1&query=AVC+Pet+Boarding+Sector+87+Gurugram) — Sector 87, Gurugram, Haryana 122505.

The official site lists **+91 99900 70026** and **+91 74500 28000** as contact numbers. Confirm which number and services apply to each location before publishing location-specific details.

The live site describes outpatient care, boarding, grooming, medical and
preventive care, surgery, emergency services, and laboratory services. It lists
care for dogs, cats, birds, rabbits, guinea pigs, hamsters, and exotic animals.
Treat this as a starting point for content discovery, not as confirmation that
every service or detail is current.

## Deployment

Deployment is not configured in this repository yet. Choose and configure a
hosting platform for the Next.js app before treating this project as the live
hospital website.
