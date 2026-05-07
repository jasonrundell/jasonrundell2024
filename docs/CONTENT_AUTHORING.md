# Content Authoring Guide

This site manages all editorial content as local MDX files in the `content/` directory. No CMS account or API key is required to add or edit content.

---

## Directory structure

```
content/
  posts/<slug>/
    index.mdx            ← post body + frontmatter
    featured.webp        ← featured image (any image ext)
    ...                  ← additional inline images
  projects/<slug>/
    index.mdx
    featured.webp
    gallery/
      01.webp
      02.webp
  about/
    skills.mdx           ← frontmatter list only
    positions.mdx        ← frontmatter list only
    references.mdx       ← frontmatter list only
  last-song.mdx          ← frontmatter only
```

Images live **co-located** with their MDX file. They are automatically synced to `public/content/` before every `dev` and `build` run via `scripts/sync-content-images.js`, which serves them at `/content/<type>/<slug>/...`.

---

## Running dev locally

### Windows (PowerShell or Command Prompt)
```powershell
npm install
npm run dev
```

### macOS / Linux
```bash
npm install
npm run dev
```

The `predev` script runs `sync-content-images` automatically — no manual step needed.

---

## Adding a new blog post

1. Create the directory and file:

   **Windows (PowerShell)**
   ```powershell
   New-Item -ItemType Directory "content\posts\my-new-post"
   New-Item "content\posts\my-new-post\index.mdx"
   ```

   **macOS / Linux**
   ```bash
   mkdir -p content/posts/my-new-post
   touch content/posts/my-new-post/index.mdx
   ```

2. Write the frontmatter and body in `content/posts/my-new-post/index.mdx`:

   ```mdx
   ---
   title: "My New Post"
   slug: "my-new-post"
   excerpt: "A one-sentence summary shown in the post list."
   date: "2026-05-05T00:00:00.000Z"
   author: "Jason Rundell"
   featuredImage: "./featured.webp"
   featuredImageAlt: "Descriptive alt text for the featured image"
   featuredImageDescription: "Optional caption shown below the image"
   ---

   Your post body in Markdown. GFM features (tables, task lists,
   strikethrough) are supported.

   ## Heading example

   Regular **bold** and _italic_ text. Inline `code` and fenced blocks:

   ```ts
   const greeting = 'hello'
   ```

   Images from the post directory:

   ![Alt text](./my-inline-image.webp)
   ```

3. Add the featured image (and any inline images) to the same directory.

4. Run `npm run dev` (or `npm run build`) — the sync step runs automatically.

### Frontmatter reference — Post

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `title` | Yes | string | Displayed as the `<h1>` and in metadata |
| `slug` | Yes | string | Must match the directory name |
| `excerpt` | Yes | string | Used in post list and Open Graph description |
| `date` | Yes | ISO 8601 string | `"2026-05-05T00:00:00.000Z"` |
| `author` | No | string | Defaults to `"Jason Rundell"` |
| `featuredImage` | No | relative path | e.g. `"./featured.webp"` |
| `featuredImageAlt` | No | string | Alt text for the featured image |
| `featuredImageDescription` | No | string | Caption below the featured image |

---

## Adding a new project

1. Create the directory:

   **Windows (PowerShell)**
   ```powershell
   New-Item -ItemType Directory "content\projects\my-project"
   New-Item "content\projects\my-project\index.mdx"
   ```

   **macOS / Linux**
   ```bash
   mkdir -p content/projects/my-project
   touch content/projects/my-project/index.mdx
   ```

2. Write `content/projects/my-project/index.mdx`:

   ```mdx
   ---
   title: "My Project"
   slug: "my-project"
   createdDate: "2026-05-01T12:00:00.000Z"
   excerpt: "Short description shown in the project card."
   technology: ["TypeScript", "React", "Next.js"]
   link: "https://github.com/jasonrundell/my-project"
   siteLink: "https://my-project.example.com"
   featuredImage: "./featured.webp"
   featuredImageAlt: "Screenshot of the project"
   gallery:
     - src: "./gallery/01.webp"
       alt: "Gallery image 1 title"
       description: "Optional caption"
   ---

   ## About

   Full project description in Markdown. This content renders on the
   `/projects/<slug>` detail page.
   ```

### Frontmatter reference — Project

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `title` | Yes | string | Project name |
| `slug` | Yes | string | Must match the directory name |
| `createdDate` | Yes | ISO 8601 string | Newer dates appear first in project lists (same format as post `date`) |
| `excerpt` | Yes | string | Shown in the project card |
| `technology` | Yes | string[] | Rendered as the tech stack list |
| `link` | No | string | GitHub / repo URL |
| `siteLink` | No | string | Live site URL |
| `featuredImage` | No | relative path | e.g. `"./featured.webp"` |
| `featuredImageAlt` | No | string | Alt text |
| `gallery` | No | array | Each item: `{ src, alt, description }` |

Gallery `src` values must be relative paths like `"./gallery/01.webp"`.

---

## Editing structured About content

### Skills (`content/about/skills.mdx`)

Each skill needs an `id`, `name`, and `category`. The `id` can be any unique string.

```mdx
---
skills:
  - id: "typescript"
    name: "TypeScript"
    category: "Language"
  - id: "react"
    name: "React"
    category: "Framework"
---
```

### Positions (`content/about/positions.mdx`)

```mdx
---
positions:
  - id: "job-1"
    orderId: 1
    role: "Senior Developer"
    company: "Acme Corp"
    startDate: "2020-01-01"
    endDate: "2023-12-31"
  - id: "job-2"
    orderId: 2
    role: "Lead Developer"
    company: "Globex Inc"
    startDate: "2024-01-01"
    endDate: ""
---
```

Leave `endDate` as `""` for a current position.

### References (`content/about/references.mdx`)

The `quote` field is a plain string (markdown-in-a-YAML-string is not rendered; keep quotes to plain prose).

```mdx
---
references:
  - id: "ref-1"
    company: "Acme Corp"
    citeName: "Jane Doe"
    order: 1
    emphasis: true
    quote: "Jason is an outstanding engineer and thoughtful leader."
---
```

---

## Updating the last song

Edit `content/last-song.mdx` with the song details and commit:

```mdx
---
title: "Song Name"
artist: "Artist Name"
url: "https://music.youtube.com/watch?v=..."
youtubeId: "abc123"
---
```

`youtubeId` is optional. The component uses `url` for the link.

---

## Image conventions

- Supported formats: `.webp`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.avif`
- Name the featured image `featured.<ext>` (e.g. `featured.webp`)
- Gallery images: `gallery/01.webp`, `gallery/02.webp`, …
- Inline images embedded in MDX body: any descriptive name (e.g. `diagram.webp`)
- Images are served at `/content/<type>/<slug>/<filename>` in the browser
- The sync script (`scripts/sync-content-images.js`) runs automatically; never commit to `public/content/` directly

---

## Rebuilding after content changes

Content is read at **build time** (static generation). After adding or editing content:

- **Local dev**: the dev server re-renders on each request; no restart needed
- **Production**: run `npm run build` to regenerate all static pages

### Windows (PowerShell)
```powershell
npm run build
```

### macOS / Linux
```bash
npm run build
```

---

## Migration note

The migration from Contentful was a one-time operation. The migration script has been removed. All content now lives in `content/` and is managed via MDX files as described in this guide.
