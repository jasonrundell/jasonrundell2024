# Jason Rundell Personal Site

Personal marketing and portfolio site for Jason Rundell — technical engineering
leader and hands-on builder. Built with Next.js App Router, file-based MDX
content, Pigment CSS, and Supabase (auth, profiles, comments).

## Features

- **File-based content**: Posts and projects live as MDX under `content/`, read
  through `src/lib/content.ts`.
- **Responsive design**: Optimized for desktop and mobile.
- **Accessible and inclusive**: Semantic HTML, contrast, and keyboard-friendly
  patterns.
- **SEO-friendly**: Next.js Metadata API, Open Graph, and JSON-LD. Every page
  builds its canonical, Open Graph, and Twitter tags through
  `src/lib/metadata.ts`.
- **Image optimization**: `next/image` plus build-time content image sync.

### Regenerating brand assets

Generated artifacts are committed, so these only need re-running when their
source changes:

| Command                     | Produces                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| `npm run tokens:build`      | `src/lib/tokens.generated.ts`, `src/styles/tokens.generated.css`      |
| `npm run illustrations:build` | `src/components/illustrations/paths.generated.ts`                    |
| `npm run social:build`      | `public/images/og-default.png`, `public/favicon/maskable-512.png`     |

Static assets are served from `public/`. Note that `src/public/` is **not** a
served directory - it only holds images that components `import` and Next.js
bundles.

## Development

### Project documentation

- Project index: [docs/PROJECT_INDEX.md](./docs/PROJECT_INDEX.md)
- Domain glossary: [docs/glossary.md](./docs/glossary.md)
- Codebase conventions: [CONVENTIONS.md](./CONVENTIONS.md)
- Content authoring: [docs/CONTENT_AUTHORING.md](./docs/CONTENT_AUTHORING.md)
- Keep the index and glossary updated when routes, modules, or domain terms change.

### Validation

The same npm commands work in Windows PowerShell, Windows Command Prompt, macOS
Terminal, and Linux shells.

- Lint: `npm run lint`
- Tests with enforced coverage gates: `npm run test:ci`
- Production build: `npm run build`

Coverage is enforced by `scripts/check-coverage.js` (70% statements/functions/lines).

### Getting started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and set Supabase values
3. Install dependencies: `npm install`
4. Run validation: `npm run lint` and `npm run test:ci`
5. Run the development server: `npm run dev`

## Technologies

- **Next.js**: App Router for server-rendered pages and route handlers
- **React**: UI components (server-first)
- **MDX / gray-matter**: File-based posts and projects
- **Supabase**: Auth, profiles, comments (RLS required)
- **Pigment CSS**: Styled components and design tokens
- **Jest**: Unit and integration tests

## License

This project is licensed under the MIT License.
