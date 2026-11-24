# Frontend Standards

## Scope

Applies to `apps/web` and `apps/admin`. `apps/admin` uses Ant Design; the same architectural rules apply even when the component library differs.

## Next.js App Router

- Keep `app/` route files thin: metadata, data loading, route-level state, and composition.
- Put reusable sections under `components/pages/` and primitives under `components/ui/`. `apps/web/components/sections/` is a compatibility re-export only; do not add new sections there.
- Use Server Components by default. Add `"use client"` only for interactivity, browser APIs, or event handlers.
- Do not mark an entire page client-only unless the whole page is interactive.
- Route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` are required for new product routes.

## Layouts

- Public page chrome belongs in a shared route layout, not repeated in every page.
- Until layouts are consolidated, new pages must follow the existing composition pattern exactly.
- Do not create a second admin surface. `apps/admin` is the staff admin; web portal pages are presentation-only.
- Route protection must be enforced server-side. Client redirects are UX only, never authorization.

## State management

- Use local component state for ephemeral UI state.
- Use React Context only for cross-cutting UI state with a clear provider boundary.
- Do not put authoritative user roles, permissions, or medical data in `localStorage` or client-only context.
- Server state must come from the API through typed contracts.

## Forms and API integration

- Define request/response shapes in `@repo/contracts`.
- Validate on the server; client validation is for UX only.
- Every form must have:
  - field-level errors,
  - submit pending state,
  - success state,
  - failure state,
  - accessible error and status announcements.
- Never show success for a request that was not sent.
- Never collect PII into state without a real submission path and documented retention.

### Reusable form and server-state architecture

- **Form state:** Formik only, mounted through `FormikForm` from `@repo/ui/form`. Do not add per-field `useState` for values, touched state, errors, or submission state.
- **Fields:** use `InputTextField`, `InputTextAreaField`, `InputPasswordField`, `InputSelectField`, and `FormSubmitButton` from `@repo/ui/form`. They own labels, required indicators, Formik binding, touched/error display, ARIA wiring, disabled/read-only states, and field styling.
- **Validation:** define flat, app-local Zod form schemas with user-facing messages and adapt them with `zodValidationSchema` from `@repo/ui/form`. Shared request/response shapes remain in `@repo/contracts`; API validation remains authoritative.
- **API boundary:** `@repo/api-client` owns HTTP transport and standardized errors. Domain service functions such as `LoginUser` wrap individual operations; TanStack Query hooks such as `useLoginUser` own cache lifecycle and navigation side effects. Components consume the hooks; they never call the API client directly.
- **Session cache:** `QueryClientProvider` is mounted in the web root layout. `GET /api/access/context` is cached under the shared auth query key. Auth mutations must synchronize that cache and route from the authoritative context so identity, workspace, and permission data cannot go stale.
- **Server errors:** keep API failures separate from field validation. Surface field issues through Formik and request failures through a form-level `role="alert"`; success through `role="status"`. Normalize auth/transport failures with the app-level `authErrorMessage` helper so login, registration, password reset, and workspace selection announce consistent messages.

Illustrative future form (same infrastructure, no new plumbing):

```tsx
<FormikForm
  initialValues={petValues}
  validationSchema={zodValidationSchema(petSchema)}
  onSubmit={handlePetSubmit}
>
  <InputTextField name="petName" label="Pet name" required placeholder="Enter pet name" />
  <InputSelectField name="species" label="Species" options={speciesOptions} required />
  <InputTextAreaField name="notes" label="Care notes" />
  <FormSubmitButton pendingLabel="Saving…">Save pet</FormSubmitButton>
</FormikForm>
```

The submit handler calls a domain TanStack mutation such as `useCreatePet()`, which invokes a service function backed by `@repo/api-client`.

## Authentication and protected pages

- The API session cookie is the only trusted session representation.
- Do not accept user-supplied roles from forms or URLs.
- Do not implement one-click role switching in production paths.
- The current `localStorage` demo role/session behavior is documented as a prototype exception in `docs/backend/auth-rbac.md`; never copy it into new work.
- Portal pages must be gated by server-enforced role checks.

## SEO and metadata

- Every public page must export `metadata` or use a shared metadata generator.
- Define `title`, `description`, canonical URL, and Open Graph fields for public routes.
- Keep sitemap entries aligned with real, indexable routes.
- Private portal and admin routes should be `noindex`.

## Performance

- Use `next/image` for images.
- Lazy-load heavy interactive sections when appropriate.
- Avoid client bundles for static content.
- Do not add animation libraries for simple CSS transitions.

## Admin-specific rules

- Ant Design theme tokens live in `apps/admin/app/layout.tsx`.
- Demo and sample data in both admin and web portal prototypes must be visibly labeled and must not use “live” or “real-time” wording unless the data is API-backed.
- Do not duplicate admin workflows in `apps/web`.

## Validation before completion

- `yarn lint`
- `yarn lint:css`
- `yarn check-types`
- `yarn test`
- `yarn build`
- Manual responsive and keyboard check for any UI change
