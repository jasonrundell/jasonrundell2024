# Project Index

## Purpose
This index is the first stop for contributors and agents. It maps the current module boundaries, runtime entry points, integrations, and validation commands so work can start with targeted reads instead of broad repo scans.

## Repository Map
- `content/`: Markdown content tree managed by the site author. Subdirectories follow the schema documented in `docs/CONTENT_AUTHORING.md`. Images live co-located with their MDX files and are synced to `public/content/` at build time by `scripts/sync-content-images.js`.
- `src/app`: Next.js App Router pages, route handlers, server actions, metadata, and route-specific clients.
- `src/components`: Reusable UI components. Feature clusters live in subfolders such as `auth` and `comments`.
- `src/lib`: Shared domain utilities. Key modules: `content.ts` (file-based content API), `markdown.tsx` (MDX renderer), `author.ts` (shared author identity), `projectUtils.ts`, `jsonld.ts`, `tokens.ts`.
- `src/utils`: Cross-cutting helpers. Supabase client wrappers live in `src/utils/supabase`.
- `src/styles`: Shared Pigment-CSS style modules.
- `src/typeDefinitions`: Shared TypeScript shapes for app data and comments.
- `src/public`: Static assets served by Next.js.
- `src/__tests__`: Shared test utilities.
- `scripts`: Build and maintenance scripts (`build-tokens.js`, `sync-content-images.js`, `check-coverage.js`).
- `docs`: Project docs, audit notes, and this index.
- `.cursor`: Project rules and reusable audit command playbooks for AI-assisted work.

## Module Boundaries
- **Content reads** belong in `src/lib/content.ts`. Consumers call exported functions (`getPosts`, `getProjects`, `getSkills`, `getPositions`, `getReferences`, `getLastSong`, `getEntryBySlug`, `getFeaturedProjects`, `getLatestPosts`) instead of reading the filesystem directly. The module throws (never returns fallback data) when required content is missing.
- **MDX rendering** belongs in `src/lib/markdown.tsx`. The `<RenderedMDX source={string} />` client component handles GFM tables and fenced code blocks.
- **Supabase** browser/server construction belongs in `src/utils/supabase/client.ts` and `src/utils/supabase/server.ts`.
- **Supabase availability** handling belongs in `src/utils/supabase/status.ts` and `src/utils/supabase/safe-client.ts`.
- **Auth and profile mutations** are centralized in `src/app/actions.ts`.
- **Comment API** behavior belongs in `src/app/api/comments/**`; shared comment UI in `src/components/comments/**`.
- **HTML sanitization** for user input: `src/lib/strip-html-tags.ts`.
- **Reusable component styling** in `src/styles/common.tsx`.

## Runtime Entry Points
- `src/app/layout.tsx`: Root layout, metadata, navigation, footer, and global status banner.
- `src/app/page.tsx`: Homepage — reads projects, posts, and lastSong in parallel via `src/lib/content.ts`.
- `src/middleware.ts`: Request middleware and Supabase session refresh.
- `src/instrumentation.ts`: App instrumentation hook.
- `next.config.mjs`: Next.js, Pigment-CSS, Sentry, bundle analyzer, security headers, and webpack aliases.
- `scripts/sync-content-images.js`: Copies images from `content/` to `public/content/` (run automatically by `predev` and `prebuild`).

## Routes
- `/`: `src/app/page.tsx`
- `/posts/[slug]`: `src/app/posts/[slug]/page.tsx`
- `/projects/[slug]`: `src/app/projects/[slug]/page.tsx`
- `/about`: `src/app/about/page.tsx`
- `/posts`: `src/app/posts/page.tsx`
- `/projects`: `src/app/projects/page.tsx`
- `/profile`: `src/app/profile/page.tsx` and `src/app/profile/profile-client.tsx`
- `/u/[slug]`: `src/app/u/[slug]/page.tsx`
- `/users/[id]`: legacy redirect route
- `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`: auth pages
- `/supabase-status`: Supabase health page

## API Routes
- `src/app/api/comments/route.ts`: List and create comments.
- `src/app/api/comments/[id]/route.ts`: Update and delete comments.
- `src/app/api/supabase-status/route.ts`: Supabase health/status endpoint.
- `src/app/api/test/route.ts`: Lightweight test route.
- `src/app/auth/callback/route.ts`: Supabase auth callback route.

## Core Integrations
- **Content**: File-based MDX in `content/`. See `docs/CONTENT_AUTHORING.md` for authoring instructions.
- **Supabase**: `src/utils/supabase/**`, schema in `src/lib/db/schema.sql`.
- **Sentry**: `sentry.client.config.js`, `sentry.edge.config.js`, `sentry.server.config.js`, and `next.config.mjs`.
- **Design tokens**: `src/lib/tokens.ts` generated from `src/lib/common.tokens.json` via `npm run tokens:build`.

## Testing Map
- Unit and integration tests: `src/**/*.test.ts(x)`.
- Auth flow integration tests: `src/app/(auth-pages)/**/*.integration.test.tsx`.
- Content lib tests use real fixtures in `src/lib/__fixtures__/content/`.
- Shared test helpers: `src/__tests__/utils/test-utils.tsx`.
- Jest setup: `jest.config.js` and `jest.setup.js`.
- CI workflow: `.github/workflows/build.yml`.

## Validation Commands
These commands work in Windows PowerShell, Windows Command Prompt, macOS Terminal, and Linux shells after `npm install`.

- Lint: `npm run lint`
- Unit and integration tests with coverage: `npm run test:ci`
- Fast local unit run: `npm run test:unit`
- Watch tests while editing: `npm run test:watch`
- Production build: `npm run build`
- Sync content images manually: `node ./scripts/sync-content-images.js`
- Bundle analysis: `npm run analyze`

Expected current noise:
- Jest may print intentional error logs for negative-path API and content tests.
- Next.js build prints Sentry deprecation warnings about `sentry.server.config.js` — these are pre-existing and do not affect functionality.
- Next.js build prints Supabase Edge Runtime warnings — these are pre-existing.
