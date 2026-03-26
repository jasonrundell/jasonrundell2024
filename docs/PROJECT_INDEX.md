# Project Index

## Purpose
This index maps the repository structure, key runtime entry points, integrations, and tests so contributors can navigate quickly and keep architecture knowledge current.

## Repository Map
- `src/app`: Next.js App Router pages and API route handlers.
- `src/components`: Reusable UI components.
- `src/lib`: Shared libraries and integration clients (Contentful, tokens, utilities). `src/lib/strip-html-tags.ts`: `stripHtmlTags` for plain text (API routes, no jsdom); removes `script`/`style` blocks and inner content, then strips remaining tags and decodes entities. `src/lib/sanitize.ts`: `sanitizeHTML` via `isomorphic-dompurify` for safe markup with `dangerouslySetInnerHTML` (e.g. Contentful code marks). Side-import `dompurify-config` sets Node/jsdom env before DOMPurify loads.
- `src/utils`: Cross-cutting helpers, including Supabase server/browser utilities.
- `src/styles`: Global styles and style modules.
- `src/data`: Static/local data modules.
- `src/typeDefinitions`: TypeScript type definitions.
- `src/public`: Static assets served by Next.js.
- `src/__tests__`: Shared testing utilities.
- `docs`: Project documentation and audit notes.

## Runtime Entry Points
- `src/app/layout.tsx`: Root application layout.
- `src/app/page.tsx`: Homepage route.
- `src/middleware.ts`: Request middleware.
- `src/instrumentation.ts`: App instrumentation hook.

### API and Auth Routes
- `src/app/api/revalidate/route.ts`: Contentful webhook revalidation endpoint.
- `src/app/api/supabase-status/route.ts`: Supabase health/status endpoint.
- `src/app/api/last-song/route.ts`: Last song endpoint.
- `src/app/auth/callback/route.ts`: Supabase auth callback route.

## Core Integrations
- **Contentful**: `src/lib/contentful.ts`
- **Supabase**: `src/utils/supabase/server.ts`, `src/utils/supabase/client.ts`, `src/utils/supabase/safe-client.ts`
- **Sentry**: `sentry.client.config.js`, `sentry.edge.config.js`, `sentry.server.config.js`

## Testing Map
- **Unit/integration tests**: `src/**/*.test.ts(x)`
- **Integration-focused auth tests**: `src/app/(auth-pages)/**`
- **Shared test helpers**: `src/__tests__/utils/test-utils.tsx`

### Run Tests (Windows, macOS, Linux)
- Install dependencies: `npm install`
- Run all tests with coverage: `npm test`
- Run unit-only tests: `npm run test:unit`
- Run CI-style tests locally: `npm run test:ci`

Notes:
- The same `npm` commands work in Windows PowerShell, Command Prompt, macOS Terminal, and Linux shells.
- If execution policies block scripts on Windows, run in Command Prompt or PowerShell with an execution policy that allows npm scripts.

## How To Keep This Index Current
Update this file whenever one of the following changes:
- A new top-level folder is added or removed.
- A route/middleware/instrumentation entry point is introduced or moved.
- An external integration is added, removed, or relocated.
- Test locations or test commands are changed.

Recommended maintenance flow:
1. Update code/config.
2. Update this index in the same pull request.
3. Verify referenced paths and commands still work.
