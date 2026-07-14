# Codebase Audit - May 2026

> **Superseded historical snapshot (May 2026).** Do not treat findings here as
> current. Prefer:
>
> - Module map & routes: [`docs/PROJECT_INDEX.md`](../PROJECT_INDEX.md)
> - Domain vocabulary: [`docs/glossary.md`](../glossary.md)
> - Conventions: [`CONVENTIONS.md`](../../CONVENTIONS.md)
> - Testing guidance: [`docs/TESTING_AUDIT_REPORT.md`](../TESTING_AUDIT_REPORT.md)
>
> Kept for audit trail only (e.g. orphans and DRY notes that have since been
> addressed or intentionally deferred).

**Scope:** All of `src/` (components, app, lib, utils, styles, typeDefinitions,
data) plus root configs. **Excludes:** `.next/`, `node_modules/`, `coverage/`,
`.lighthouseci/`, generated tokens (`*.generated.*`), content MDX. **Guiding
principles:** deep modules, ubiquitous language, TDD feedback loops,
interface-first design, no silent fallbacks.

---

## A. Dead / Unused / Orphaned Code

### Confirmed Orphans (no non-self imports across `src/`)

| File                                  | Evidence                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| `src/components/Character.tsx`        | Never imported in any production page/layout. Only exists in its own file.              |
| `src/data/characters.js`              | Only consumer is `Character.tsx`; dies with it.                                         |
| `src/lib/author.ts`                   | Only `src/lib/author.test.ts` imports it; no app or lib code references it.             |
| `src/lib/dompurify-config.ts`         | Zero imports; comment references `isomorphic-dompurify` which is not in `dependencies`. |
| `src/lib/empty-stylesheet.js`         | Zero imports; comment claims a webpack alias that does not exist in `next.config.mjs`.  |
| `src/components/LastSongSkeleton.tsx` | Only its own test file references it; no production page renders it.                    |

### Stale / Dead Exports

| Export                   | Location                          | Status                                                                    |
| ------------------------ | --------------------------------- | ------------------------------------------------------------------------- |
| `SectionHeadingLevel`    | `src/components/chrome/index.ts`  | Re-exported but never imported by any other file.                         |
| `HERO_TERMINAL_SKIP_KEY` | `src/components/HeroTerminal.tsx` | Exported but only used internally and in its own test; make non-exported. |

### Orphaned / Unreachable Routes and Logic

- **`src/middleware.ts`** -
  `config.matcher = ['/api/:path*', '/profile/:path*', '/dashboard/:path*']`
  (line ~260). The `publicRoutes` whitelist plus `/posts/`, `/projects/`,
  `/users/`, `/u/` branches at lines ~111–129 are **unreachable** for real
  requests because those paths never hit the middleware. Either widen the
  matcher or delete the dead branches.
- **`/dashboard`** - `protectedRoutes` includes `/dashboard` but no
  `src/app/dashboard/**` exists → always-dead guard.
- **`src/app/sitemap.xml`** - Static file; omits `/about`, `/contact`, recent
  posts and projects. Stale.
- **`src/app/api/test/route.ts`** - Dev-only endpoint (returns 404 in
  production); only reachable via direct URL.
- **`src/app/supabase-status/page.tsx`** - Not linked from any nav component;
  URL-only access.

### Unused Dependencies / Scripts

| Item                          | Type          | Action                                                                                       |
| ----------------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `dotenv`                      | devDependency | No usage in `src/`, `scripts/`, or root configs. Remove.                                     |
| `webpack`                     | devDependency | No direct import/require; likely a tooling version pin. Verify before removing.              |
| `package.json` `start` script | Script        | Resolves to `"next dev"` - duplicate of `dev`. Production uses `start:ci`. Delete or rename. |

### Dead Commented-Out Code

- `src/lib/dompurify-config.ts` and `src/lib/empty-stylesheet.js` describe
  wiring that no longer exists.
- Small commented `tunnelRoute` block in `next.config.mjs`.

### TODO/FIXME/HACK Inventory

**Count: 0** - clean codebase.

---

## B. DRY Violations / Duplication

### Repeated Styled / Pigment Patterns

| Pattern                                                                        | Locations                                                                                                                | Proposed Home                                                                      |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Auth form shell (`FormWrapper`, `FieldGroup`, `FullWidthButton`, `BottomText`) | `sign-in/page.tsx`, `sign-up/sign-up-client.tsx`, `forgot-password/page.tsx`, `reset-password/reset-password-client.tsx` | `src/components/auth/auth-form-shell.tsx`                                          |
| Preview card heading (`StyledHeading` as `h3`)                                 | `ProjectPreview.tsx`, `PostPreview.tsx`, `Skills.tsx`                                                                    | Add `StyledPreviewHeading` to `src/styles/common.ts`                               |
| Circular translucent icon button                                               | `common.ts` `StyledCloseButton` mirrors gallery `StyledNavButtonLeft/Right`                                              | Unify as `StyledIconCircleButton` with position variants in `src/styles/common.ts` |
| Primary CTA / play button style                                                | `auth/ui/button.tsx`, `LastSong.tsx` `StyledPlayButton`, `comments/styles.ts` `SubmitCommentButton`                      | Standardize behind `Button` variants; remove ad-hoc copies                         |
| Terminal CTA / syntax spans                                                    | `TerminalErrorPage.tsx`, `chrome/TerminalButtonLink.tsx`, `HeroTerminal.tsx`                                             | `src/styles/terminal.ts` + `src/styles/terminal-syntax.ts`                         |
| Skeleton shimmer keyframes + gradient                                          | `comments/skeleton-styles.ts`, `LastSongSkeleton.tsx`                                                                    | `src/styles/skeleton.ts`                                                           |

### Repeated Logic / Helpers

- **`MoreProjects` and `MorePosts`** repeat the
  `featuredImage → { file: { url } }` mapping that
  `projectUtils.toProjectCardItem` already performs. Add a `toPostCardImage`
  utility.
- **`src/lib/jsonld.ts`** hardcodes author identity strings already present in
  `src/lib/author.ts` - single source of truth needed.
- **`src/lib/onlyUnique.js`** is a one-liner used only in `Skills.tsx`. Inline
  `[...new Set(arr)]` and delete the file.
- **`src/lib/strip-html-tags.ts`** doc comment references `@/lib/sanitize` which
  does not exist - stale doc.

### Sign-up Form Duplication

`sign-up-client.tsx` duplicates the entire form JSX in the error branch vs the
default return. Collapse to one `<SignUpFields>` component driven by a prop.

### Supabase Client Overlap

`server.ts`, `client.ts`, `middleware.ts`, `public-client.ts`, `safe-client.ts`,
`status.ts`, and `check-env-vars.ts` each repeat the Supabase URL/anon key
access pattern and construction.

**Plan:** Extract `src/utils/supabase/env.ts` (throwing getters) and
`src/utils/supabase/create-clients.ts` (cookie adapter factory). Re-export
`SupabaseStatus` type from `status.ts` only; remove the local copy in
`SupabaseStatusBanner.tsx`.

### Test Scaffolding

`src/__tests__/utils/test-utils.tsx` `AllTheProviders` is a no-op. Almost no
test imports it. Either populate with real providers (theme, Supabase mock) and
migrate, or delete and document RTL-only usage.

### JS in a TypeScript Codebase

| File                          | Recommendation                               |
| ----------------------------- | -------------------------------------------- |
| `src/lib/constants.js`        | Migrate to `constants.ts` with typed exports |
| `src/lib/onlyUnique.js`       | Inline into `Skills.tsx` and delete          |
| `src/lib/empty-stylesheet.js` | Delete (orphaned)                            |
| `src/data/characters.js`      | Delete (orphaned with `Character.tsx`)       |

### Magic Value Duplication

| Value      | Locations                                                                                        | Action                                                       |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `30000` ms | `CACHE_DURATIONS.CLIENT_CACHE` in `constants.js` and `STATUS_CACHE_DURATION` in `safe-client.ts` | Single `SUPABASE_STATUS_TTL_MS` exported from `constants.ts` |
| `1024` px  | Raw number in `MainNavClient.tsx` resize handler                                                 | Use the tokens large breakpoint                              |
| Site URL   | `SITE_DOMAIN` and `ALLOWED_ORIGINS`/`baseOrigins` both in `constants.js`                         | Derive `ALLOWED_ORIGINS` from `SITE_DOMAIN`                  |

### Prop / Type Shape Duplication

- `PostPreviewProps` and `ProjectPreviewProps` both define
  `image?: { file: { url: string } }`. Use `ContentImage` from
  `src/typeDefinitions/app.ts` consistently.
- `SupabaseStatus` is defined locally in `SupabaseStatusBanner.tsx` and exported
  from `utils/supabase/status.ts`. Remove the local copy.

---

## C. Structure / Readability

### Largest Files (LOC)

| File                                 | ~LOC | >300? | Diagnosis                                                                    |
| ------------------------------------ | ---- | ----- | ---------------------------------------------------------------------------- |
| `src/app/profile/profile-client.tsx` | ~693 | Yes   | Multiple forms + layout + validation in one file. Split by concern.          |
| `src/app/actions.ts`                 | ~684 | Yes   | God module of unrelated server actions. Split into feature files.            |
| `src/components/ProjectGallery.tsx`  | ~344 | Yes   | Grid + modal + portal + keyboard handling. Extract subcomponents + hook.     |
| `src/components/MainNavClient.tsx`   | ~329 | Yes   | Auth state + desktop/mobile markup + Supabase. Extract hook + subcomponents. |
| `src/components/HeroTerminal.tsx`    | ~301 | Yes   | Animation + segmentation + persistence. Separate helpers from component.     |
| `src/middleware.ts`                  | ~262 | No    | CORS + rate limiting + route guards + auth verification. Split into modules. |
| `src/components/MainNav.tsx`         | ~237 | No    | Large `NAVIGATION_STEPS` array dominates. Move data to `MainNav.steps.ts`.   |

### Server / Client Boundary Issues

- **`src/app/layout.tsx` ~48:** `await MainNav()` - `MainNav` is not async; the
  `await` is redundant and misleading.
- **`src/lib/markdown.tsx`:** Marked `'use client'`; verify whether this is
  required for `react-markdown` v10 in RSC context.
- **`MoreProjects.tsx` and `ContentImage.tsx`:** Both use `'use client'` - check
  whether the client island could be a smaller leaf to reduce bundle size.

### Type Safety Findings

| Location                           | Issue                                             |
| ---------------------------------- | ------------------------------------------------- |
| `src/lib/markdown.tsx` ~26–27      | `: any` on `img` component renderer               |
| `src/lib/content.ts` ~125–136      | `as unknown as T` double cast in `getEntryBySlug` |
| `src/app/profile/page.tsx` ~58–110 | `as string \| undefined` casts on DB fields       |

### Naming / Vocabulary Drift

| Term                                               | Locations                                                   | Action                                                                    |
| -------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| "Blog" vs `Post` vs `BlogPosting`                  | Nav label, type name, JSON-LD                               | Pick one user-facing label ("Blog") and one type name (`Post`); document. |
| `post` loop variable in `MoreProjects.tsx` line 23 | Component iterates `ProjectCardItem`                        | Rename to `project`.                                                      |
| "Login" vs "Sign in"                               | `MainNavClient.tsx` mobile nav ~311 vs all other auth pages | Standardize to "Sign in".                                                 |
| `kebab-case` vs `PascalCase` files                 | `src/components/auth/` vs `src/components/`                 | Document convention (see `CONVENTIONS.md`).                               |

### Error Handling Anti-Patterns (vs "no silent fallbacks" rule)

| Location                                             | Issue                                                                             |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| `src/utils/supabase/check-env-vars.ts`               | Truthy check only; no throw. Consumers silently degrade.                          |
| `src/components/comments/CommentsSection.tsx` ~33–46 | Returns `[]` on fetch failure; shows "no comments" instead of an error state.     |
| `src/lib/content.ts` ~92–104, ~158–179               | `?? ''` and `'Jason Rundell'` default masks bad frontmatter.                      |
| `src/app/profile/profile-client.tsx`                 | `\|\| 'User'`, `\|\| 'No email provided'` display fallbacks hide data gaps.       |
| `src/app/api/comments/route.ts` ~95, ~166–167        | `profile_slug: ... ?? 'user'` and display name defaults.                          |
| `src/middleware.ts` ~235–238                         | Auth verification `catch` continues as unauthenticated with only `console.error`. |
| `src/app/layout.tsx` ~11–15                          | `react-axe` dynamic import has no `.catch`.                                       |

### Async Handling Issues

- `src/app/layout.tsx` - `import('react-axe').then(...)` has no `.catch`; a
  failed dynamic import surfaces as an unhandled rejection in development.

### `src/` Organization

| Issue                                              | Evidence                                           | Recommendation                                                                         |
| -------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/lib/markdown.tsx` is UI in `lib/`             | `.tsx` in a `lib/` folder implies framework code   | Move to `src/components/markdown/RenderedMDX.tsx`                                      |
| `src/lib/db/schema.sql` is a DB artifact in `lib/` | Not a TypeScript module                            | Move to `supabase/migrations/` or `docs/schema/`                                       |
| `utils/` vs `lib/` overlap                         | Both hold rate limiting, Supabase helpers, content | Document the mnemonic: `lib/` = app domain + pure logic; `utils/` = framework adapters |

### Test Coverage Gaps (toward 70% goal)

**Highest-value untested targets:**

1. `src/app/actions.ts` per-action coverage (large surface)
2. `src/utils/utils.ts` `encodedRedirect` (high fan-in)
3. Presentational: `PostPreview`, `PostHeader`, `Skills`, `Positions`,
   `References`, `PostAuthor`, `BackToTop`
4. `src/app/profile/profile-client.tsx` slices (tractable after split)

### Accessibility Quick Scan

- `ProjectGallery.tsx` modal uses `role="dialog"` but may lack a focus trap and
  `aria-labelledby`. Backdrop `onClick` pattern needs a keyboard-equivalent
  (already has `onKeyDown` on tiles - verify modal close).
- `src/lib/markdown.tsx` renders `alt={alt ?? ''}` - empty alt if markdown omits
  alt text (content risk).

---

## Action Map (see Refactor Roadmap)

See
[refactor roadmap in plan](../../.cursor/plans/codebase-audit-and-refactor_b8a7845c.plan.md)
for the phased P0–P4 execution plan.
