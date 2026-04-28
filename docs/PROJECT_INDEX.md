# Project Index

## Purpose
This index is the first stop for contributors and agents. It maps the current module boundaries, runtime entry points, integrations, and validation commands so work can start with targeted reads instead of broad repo scans.

## Repository Map
- `src/app`: Next.js App Router pages, route handlers, server actions, metadata, and route-specific clients.
- `src/components`: Reusable UI components. Feature clusters live in subfolders such as `auth` and `comments`.
- `src/lib`: Shared domain utilities and integration adapters, including Contentful, sanitization, password rules, profile slugs, rate limiting, and design tokens.
- `src/utils`: Cross-cutting helpers that are not app-domain modules. Supabase client wrappers live in `src/utils/supabase`.
- `src/styles`: Shared Pigment-CSS style modules. Put cross-component style reuse here.
- `src/typeDefinitions`: Shared TypeScript shapes for Contentful, app data, and comments.
- `src/public`: Static assets served by Next.js.
- `src/__tests__`: Shared test utilities.
- `docs`: Project docs, audit notes, setup guides, and this index.
- `.cursor`: Project rules and reusable audit command playbooks for AI-assisted work.

## Module Boundaries
- Contentful reads belong in `src/lib/contentful.ts`; consumers should call exported fetch functions instead of creating Contentful clients directly. `fetchEntries` logs Contentful API failures once; `requireEntries` logs and throws when a required collection content type returns zero items (optional collections such as last song return null without that log).
- Supabase browser/server construction belongs in `src/utils/supabase/client.ts` and `src/utils/supabase/server.ts`.
- Supabase availability handling belongs in `src/utils/supabase/status.ts` and `src/utils/supabase/safe-client.ts`.
- Auth and profile mutations are currently centralized in `src/app/actions.ts`. Keep new validation and rate-limit behavior near the action it protects until this file is split.
- Comment API behavior belongs in `src/app/api/comments/**`; shared comment UI belongs in `src/components/comments/**`.
- HTML sanitization has two paths: `src/lib/sanitize.ts` for safe markup rendering and `src/lib/strip-html-tags.ts` for plain-text user input.
- Reusable component styling belongs in `src/styles/common.tsx`; component-local styles should stay beside the component.

## Runtime Entry Points
- `src/app/layout.tsx`: Root application layout, metadata, navigation, footer, and global status banner.
- `src/app/page.tsx`: Homepage route that reads Contentful skills, projects, references, positions, and posts in parallel.
- `src/middleware.ts`: Request middleware and Supabase session refresh.
- `src/instrumentation.ts`: App instrumentation hook.
- `next.config.mjs`: Next.js, Pigment-CSS, Sentry, bundle analyzer, image domains, security headers, and webpack aliases.

## Routes
- `/`: `src/app/page.tsx`
- `/posts/[slug]`: `src/app/posts/[slug]/page.tsx`
- `/projects/[slug]`: `src/app/projects/[slug]/page.tsx`
- `/profile`: `src/app/profile/page.tsx` and `src/app/profile/profile-client.tsx`
- `/u/[slug]`: `src/app/u/[slug]/page.tsx`
- `/users/[id]`: legacy redirect route in `src/app/users/[id]/page.tsx`
- `/sign-in`: `src/app/(auth-pages)/sign-in/page.tsx`
- `/sign-up`: `src/app/(auth-pages)/sign-up/page.tsx` and `src/app/(auth-pages)/sign-up/sign-up-client.tsx`
- `/forgot-password`: `src/app/(auth-pages)/forgot-password/page.tsx`
- `/reset-password`: `src/app/reset-password/page.tsx` and `src/app/reset-password/reset-password-client.tsx`
- `/supabase-status`: `src/app/supabase-status/page.tsx`

## API Routes
- `src/app/api/comments/route.ts`: List and create comments.
- `src/app/api/comments/[id]/route.ts`: Update and delete comments.
- `src/app/api/last-song/route.ts`: Last song endpoint.
- `src/app/api/revalidate/route.ts`: Contentful webhook revalidation endpoint.
- `src/app/api/supabase-status/route.ts`: Supabase health/status endpoint.
- `src/app/api/test/route.ts`: Lightweight test route.
- `src/app/auth/callback/route.ts`: Supabase auth callback route.

## Core Integrations
- Contentful: `src/lib/contentful.ts`, configured by `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`.
- Supabase: `src/utils/supabase/**`, schema reference in `src/lib/db/schema.sql`. Anonymous or session-scoped reads of public profile fields use the `public_user_profiles` view (not `users`), because RLS on `users` cannot limit columns.
- Sentry: `sentry.client.config.js`, `sentry.edge.config.js`, `sentry.server.config.js`, and `next.config.mjs`.
- Design tokens: `src/lib/tokens.ts` generated from `src/lib/common.tokens.json`.

## Testing Map
- Unit and integration tests: `src/**/*.test.ts(x)`.
- Auth flow integration tests: `src/app/(auth-pages)/**/*.integration.test.tsx`.
- Shared test helpers: `src/__tests__/utils/test-utils.tsx`.
- Jest setup: `jest.config.js` and `jest.setup.js`.
- CI workflows: `.github/workflows/build.yml` and `.github/workflows/test-coverage.yml`.

## Validation Commands
These commands work in Windows PowerShell, Windows Command Prompt, macOS Terminal, and Linux shells after `npm install`.

- Lint: `npm run lint`
- Unit and integration tests with coverage: `npm run test:ci`
- Fast local unit run: `npm run test:unit`
- Watch tests while editing: `npm run test:watch`
- Production build: `npm run build`
- Bundle analysis: `npm run analyze`

Expected current noise:
- Jest may print intentional error logs for negative-path API tests.
- `npm run build` may print Supabase Edge runtime warnings and dynamic server usage messages while still completing successfully. Treat new build failures separately from these known warnings.

## Current Coverage Baseline
Last verified locally: `npm run test:ci`.

- Statements: 71.44%
- Branches: 60.99%
- Functions: 70.83%
- Lines: 71.95%

Coverage gate: `scripts/check-coverage.js` enforces 70% statements, functions, and lines, plus 60% branches. Keep branch coverage ratcheting upward as conditional behavior is tested.

## How To Keep This Index Current
Update this file whenever one of the following changes:
- A top-level folder or major `src` subfolder is added, removed, or repurposed.
- A route, route handler, middleware, instrumentation hook, or server action module is introduced or moved.
- An external integration is added, removed, or relocated.
- Test locations, coverage thresholds, or validation commands change.
- A warning becomes expected project noise or an expected warning becomes a failure.

Recommended maintenance flow:
1. Update code/config.
2. Update this index in the same pull request.
3. Run the affected validation command and record any changed baseline.
