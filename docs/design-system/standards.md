# Design System Standards

## Status

A token set exists in `apps/web/app/globals.css`. It is the current visual source of truth for `apps/web`, but it is incomplete. Enforcement is partially automated: stylelint reports raw colors as warnings, and a token guard ratchets existing raw-color, raw-spacing, undefined-token, and noncanonical-breakpoint debt. This document defines how all new UI must be written.

## Tokens

Use tokens for all visual decisions:

| Category   | Use                                                                           |
| ---------- | ----------------------------------------------------------------------------- |
| Color      | `--md-sys-color-*` and documented aliases in `globals.css`                    |
| Typography | `--typescale-*`, `--font-family-*`, `--tracking-*`                            |
| Spacing    | `--space-*`, not arbitrary pixel values                                       |
| Radius     | `--radius-*`                                                                  |
| Elevation  | `--shadow-*`                                                                  |
| Layout     | `--max-width`, `--auth-banner-height`, `--auth-form-width`, `--header-height` |

Rules:

- Do not introduce raw hex, `rgb()`, or `hsl()` values in component CSS.
- Do not introduce arbitrary pixel spacing when a `--space-*` token exists.
- If a token is missing, add it to `globals.css` first, then use it. Never invent a local one-off value.
- If a token is referenced but undefined, fix the token definition before building the component.
- Do not duplicate theme values in TypeScript. Generated TS access is acceptable only if derived from the CSS token source.
- `yarn lint:css` runs stylelint plus `scripts/check-css-tokens.mjs`.
- The schemaVersion 3 guard compares exact raw-color values, raw spacing values, and media/container breakpoint widths by file, plus exact undefined custom property names, against `scripts/css-token-baseline.json`. A new value, a higher count for an existing value, or a new undefined token fails CI; reducing or removing baseline debt is always allowed.
- The spacing check targets `px`/`rem` lengths in padding, margin, gap, and their logical/physical longhands. Token declarations in `globals.css` are not treated as component violations.
- The breakpoint check accepts only `639`, `640`, `768`, `991`, `992`, and `1024` pixels in `min-width`, `max-width`, `width`, and range media/container features. Other widths are ratcheted as legacy debt.
- The baseline is a reviewed debt record, not a bypass. Updating it requires:
  `node scripts/check-css-tokens.mjs --update-baseline --reviewed-by=<name> --reason=<why>`. The generated `review` metadata and baseline diff must be included in code review.
- `color-no-hex` and several stylelint rules remain warnings; they must be resolved in new work even when the guard does not fail the build.

## Conflicting tokens

- `apps/web/constants/theme.ts` currently conflicts with `globals.css` and must not be used for new web UI.
- `apps/admin` uses Ant Design tokens. Keep admin theming inside `apps/admin/app/layout.tsx` until a shared theme pipeline exists.
- Never claim cross-app theme synchronization unless both apps consume the same source.

## Components

Before creating a component, inspect:

- `apps/web/components/ui/` for primitives.
- `apps/web/components/layout/` for layout primitives.
- `apps/web/components/pages/` for page sections.
- `packages/ui/` for shared primitives.

Rules:

- Prefer extending an existing component variant over creating a new one.
- A component must expose variants through props, not duplicated class names in callers.
- New primitives require a documented use case and at least two anticipated call sites.
- Do not use starter components from `packages/ui` in production without promotion review.
- Keep interactive state, keyboard behavior, and ARIA relationships in the reusable component.

## Required component states

Every interactive component must define:

- default
- hover
- focus-visible
- active/pressed where applicable
- disabled where applicable
- loading
- error
- empty
- success

Global focus styling exists, but components must not rely on it when custom focus behavior is needed.

## Accessibility

- Use semantic HTML before ARIA.
- Every control must have an accessible name.
- Tabs require `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and a matching `tabpanel`.
- Accordions require `aria-expanded`, `aria-controls`, and a controlled content region.
- Status messages must use `role="status"` or `aria-live`.
- Errors must use `role="alert"` and be associated with the relevant field.
- Never ship a clickable `<div>` where a `<button>` or `<a>` works.
- Preserve visible focus indicators.

## Responsive rules

- Mobile-first by default; add complexity at larger breakpoints.
- Existing CSS is not yet consolidated to one small set. The widths below are the values currently present in the repository and are the only breakpoint values to reuse in new work.
- Canonical widths for new work: `640px` (`639/640` boundary), `768px`, `992px` (`991/992` boundary), and `1024px`.
- Legacy one-off widths remain as debt and must not be copied into new components: `440px`, `480px`, `576px`, `600px`, `840px`, `860px`, `900px`, and `960px`.
- Do not introduce a new breakpoint width. If none of the canonical widths fits, document the need in this table first.
- The schemaVersion 3 CSS guard fails new noncanonical media/container widths and new raw spacing values; existing legacy values are ratcheted in `scripts/css-token-baseline.json`.
- Test layouts at mobile, tablet, and desktop widths before considering a UI change complete.
- Respect `prefers-reduced-motion` for animation-heavy sections.

## Visual consistency

- Public pages, portals, and admin should feel like one product, even when their underlying libraries differ.
- Do not redesign unrelated sections while implementing a feature.
- Do not introduce a new icon library when an existing one already covers the need.
- Broken anchors, duplicate IDs, and hardcoded localhost links are not acceptable in new work.
