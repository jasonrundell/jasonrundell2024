# Domain glossary

Canonical vocabulary for people, code, prompts, and docs. Prefer these terms;
list synonyms only under **Avoid**. Refresh this file when naming drifts.

See also: `CONVENTIONS.md` (directory roles + condensed vocabulary).

| Term | Definition | Where used | Avoid |
| --- | --- | --- | --- |
| Post | A blog entry authored as MDX under `content/posts/` | Type `Post`, route `/posts`, `getPosts` / `getLatestPosts` in `src/lib/content.ts`, JSON-LD `BlogPosting` | Article, blog entry (in code), CMS entry |
| Project | A portfolio piece authored as MDX under `content/projects/` | Type `Project`, route `/projects`, `getProjects` / `getFeaturedProjects`, JSON-LD `CreativeWork` | Case study (as type name), portfolio item (in code) |
| Blog | User-facing section label for the posts index | Nav label "Blog"; URL remains `/posts` | Calling the route `/blog` |
| Sign in / Sign out | Authenticated session start / end | UI copy, `/sign-in`, `signInAction` / `signOutAction`, page `SignInPage` | Login, Logout, Log in, Log out (UI or new symbols) |
| UserProfile | Public profile for an authenticated user | Type `UserProfile`, `/profile`, `/u/[slug]`, JSON-LD `Person` | Account page (as type), user page |
| Content | File-based MDX tree under `content/`, read only via `src/lib/content.ts` | `getPosts`, `getProjects`, `getSkills`, etc. | Contentful, CMS fetch, `contentful.ts` |
| Author | Site author identity for bylines and JSON-LD | `src/lib/author.ts`, consumed by `src/lib/jsonld.ts` | Hard-coded author strings in page components |
| Comment | User comment on a post or project | `src/app/api/comments/**`, `src/components/comments/**` | Discussion, reply (as type name) |
| Chrome | Shared shell UI (nav chrome, terminal-styled controls) | `src/components/chrome/**` | Layout kit, shell widgets |
| Editorial | Current marketing visual system primitives | `src/styles/editorial.tsx` | Terminal theme (for new marketing pages) |

## Naming rules

1. One preferred term per concept in new code, tests, and docs.
2. If a synonym appears mid-task, stop and reconcile here before continuing.
3. Module and interface names added during planning belong in this table.
