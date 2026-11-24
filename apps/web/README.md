# AVC Pet Hospital website app

The `web` workspace is a Next.js App Router presentation app for AVC
Multispeciality Pet Care Hospital. Public marketing sections are implemented;
login, registration, contact, and portal pages currently use prototype data and
are not connected to the API.

The Express API is authoritative for validation, authorization, persistence,
and business rules. Do not add client-only auth or fake persistence outside the
documented prototype exceptions in `docs/backend/auth-rbac.md`. Canonical rules
live in the repository root `AGENTS.md` and `docs/README.md`.

Use [avcpethospital.com](https://avcpethospital.com) as the live content
reference. Confirm service details and other time-sensitive information with
the hospital before publishing.

Google Maps lists two Gurugram locations: [AVC Multispeciality Pet
Hospital](https://www.google.com/maps/search/?api=1&query=AVC+Multispeciality+Pet+Hospital+Gurugram)
in Sector 90 and [AVC Pet Boarding](https://www.google.com/maps/search/?api=1&query=AVC+Pet+Boarding+Sector+87+Gurugram)
in Sector 87. Confirm each location's services and contact details with the
hospital before publishing them.

## Development

Run commands from the monorepo root:

```bash
yarn workspace web dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to
`.env.local` if you need to override `NEXT_PUBLIC_SITE_URL` for sitemap output.

## Useful commands

```bash
yarn workspace web build
yarn workspace web lint
yarn workspace web check-types
yarn lint:css
```

## Source layout

```text
app/                     Routes, metadata, layout, globals.css
components/layout/       Header, footer, mobile action bar
components/pages/        Page sections grouped by product area
components/ui/           App-local UI primitives
constants/               Static content and configuration
contexts/                Client UI state; never authoritative identity
```

Follow `docs/frontend/standards.md` and `docs/design-system/standards.md`.
Load the `avc-ui-design-system` or `avc-frontend` skill before making changes.
