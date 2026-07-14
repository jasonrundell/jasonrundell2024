# Project Conventions

Quick-reference for contributors and AI agents. Keeps the codebase's ubiquitous
language consistent across code, prompts, and documentation.

---

## Directory Roles

| Directory              | Purpose                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/`             | App-domain logic and pure TypeScript utilities (no Next.js / React imports). Examples: `content.ts`, `jsonld.ts`, `rate-limit.ts`.     |
| `src/utils/`           | Framework adapter code - wrappers around Next.js, Supabase, and other third-party SDKs. Examples: `utils/supabase/`, `utils/utils.ts`. |
| `src/components/`      | React components (server and client). Sub-folders for domain clusters: `auth/`, `chrome/`, `comments/`, `markdown/`.                   |
| `src/app/`             | Next.js App Router pages, layouts, and server actions. Server actions live in `src/app/actions/` (one file per feature).               |
| `src/styles/`          | Pigment CSS styled primitives and design tokens. Not React components; pure style exports.                                             |
| `src/typeDefinitions/` | Shared TypeScript types and interfaces (e.g. `Post`, `Project`, `Comment`).                                                            |
| `src/data/`            | Static data that cannot be fetched at runtime. Keep minimal; prefer CMS content.                                                       |
| `src/__tests__/`       | Shared test utilities (`test-utils.tsx`). Co-locate unit tests with source files (`*.test.tsx`).                                       |

---

## File Naming

| Location                           | Convention                                                | Example                                   |
| ---------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| `src/components/` (root)           | `PascalCase.tsx`                                          | `PostPreview.tsx`, `MainNav.tsx`          |
| `src/components/auth/`             | `kebab-case.tsx`                                          | `auth-form-shell.tsx`, `form-message.tsx` |
| `src/components/*/` (sub-folders)  | Follow parent convention                                  | `comments/CommentItem.tsx` (PascalCase)   |
| `src/lib/`, `src/utils/`           | `kebab-case.ts`                                           | `rate-limit.ts`, `strip-html-tags.ts`     |
| `src/app/` pages                   | `page.tsx`, `layout.tsx`, `route.ts` (Next.js convention) |                                           |
| `src/app/actions/`                 | `kebab-case.ts`                                           | `sign-in.ts`, `update-profile.ts`         |
| Helpers extracted from a component | `<Component>.helpers.ts`                                  | `hero-terminal.helpers.ts`                |
| Colocated step/data files          | `<Component>.steps.ts`                                    | `MainNav.steps.ts`                        |

---

## Vocabulary (Ubiquitous Language)

Canonical glossary: [`docs/glossary.md`](./docs/glossary.md). Keep that file
current; this table is a short summary for contributors.

| Concept              | Code type name | User-facing label               | JSON-LD term   | Notes                                                                          |
| -------------------- | -------------- | ------------------------------- | -------------- | ------------------------------------------------------------------------------ |
| Blog entry           | `Post`         | "Blog" (section), "post" (item) | `BlogPosting`  | Nav link text is "Blog"; the route is `/posts`; the TypeScript type is `Post`. |
| Portfolio piece      | `Project`      | "Project"                       | `CreativeWork` |                                                                                |
| Authenticated action | -              | "Sign in" / "Sign out"          | -              | Never "Login" / "Logout". Page export: `SignInPage`.                           |
| Public profile       | `UserProfile`  | -                               | `Person`       |                                                                                |
| Site author identity | `Author`       | -                               | via `Person`   | `src/lib/author.ts` — used by `src/lib/jsonld.ts`.                             |

---

## Error Handling

**Rule: no silent fallbacks.** When a required value is missing, throw or
log-and-throw. Do not substitute a default string and continue.

```ts
// Bad - hides missing data
const name = user.display_name ?? 'User'

// Good - surfaces the gap
if (!user.display_name) throw new Error('display_name is required')
const name = user.display_name
```

Exceptions: UI-only display components may show a graceful placeholder _only_
when the missing value is non-critical and the degraded state is intentional and
documented.

---

## Client vs Server Components

- Default to **server components**. Add `'use client'` only when the component
  uses `useState`, `useEffect`, browser APIs, or event handlers.
- Keep client boundaries as small (as deep in the tree) as possible to minimize
  bundle size.
- Never fetch data inside a client component; pass it as props from a server
  parent.

---

## Styling (Pigment CSS)

- Use `styled()` from `@pigment-css/react` for component-scoped styles.
- **For cross-component reuse:** hoist to `src/styles/common.ts`,
  `src/styles/skeleton.ts`, `src/styles/terminal.ts`, etc.
- **For component-local reuse repeated 3+ times:** define a `const` at the top
  of the component file. When the same pattern appears in 3+ _different_ files,
  move it to the shared styles directory.
- Never use raw hex or magic numbers for colors or spacing; always reference a
  design token from `src/lib/tokens.ts`.

---

## Testing

- Minimum **70% unit test coverage** enforced by `scripts/check-coverage.js`.
- Co-locate tests: `Foo.tsx` → `Foo.test.tsx` in the same directory.
- Integration tests live in `*.integration.test.tsx`.
- Use `@testing-library/react` directly; the `AllTheProviders` wrapper in
  `src/__tests__/utils/test-utils.tsx` is available for tests that need a
  provider context.
- Run the full suite before finishing any PR: `npm run test:ci`.
