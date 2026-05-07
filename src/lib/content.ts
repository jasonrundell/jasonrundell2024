import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  Post,
  Project,
  Skill,
  Position,
  Reference,
  LastSong,
  ContentImage,
} from '@/typeDefinitions/app'
import { compareProjectsByDateDesc } from '@/lib/projectUtils'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function readMdx(filePath: string): matter.GrayMatterFile<string> {
  if (!fs.existsSync(filePath)) {
    const msg = `Content file not found: ${filePath}`
    console.error(msg)
    throw new Error(msg)
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  return matter(raw)
}

/**
 * Resolve a content-directory-relative image path to a public URL.
 *
 * Images live at  content/posts/<slug>/featured.webp
 * They are served from public/content/posts/<slug>/featured.webp
 * (symlinked or copied via next.js public dir or static serving).
 *
 * We store them relative to the mdx file (e.g. "./featured.webp").
 * We resolve them to an absolute public path: /content/posts/<slug>/featured.webp
 */
function resolveImagePath(relativeSrc: string, mdxDir: string): string {
  if (!relativeSrc) return ''
  if (relativeSrc.startsWith('http') || relativeSrc.startsWith('/')) {
    return relativeSrc
  }
  const absolutePath = path.resolve(mdxDir, relativeSrc)
  // Convert absolute fs path to public URL by stripping the cwd/content prefix
  const contentBase = path.join(process.cwd(), 'content')
  const publicPath = absolutePath
    .replace(contentBase, '/content')
    .replace(/\\/g, '/')
  return publicPath
}

function slugDirs(contentType: 'posts' | 'projects'): string[] {
  const dir = path.join(CONTENT_DIR, contentType)
  if (!fs.existsSync(dir)) {
    const msg = `Content directory not found: ${dir}`
    console.error(msg)
    throw new Error(msg)
  }
  return fs.readdirSync(dir).filter((entry) => {
    const full = path.join(dir, entry)
    return fs.statSync(full).isDirectory()
  })
}

function requireData<T>(contentType: string, data: T[], label: string): T[] {
  if (data.length === 0) {
    const msg = `No ${label} entries found in ${contentType}.`
    console.error(msg)
    throw new Error(msg)
  }
  return data
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

function parsePost(slug: string): Post {
  const mdxDir = path.join(CONTENT_DIR, 'posts', slug)
  const filePath = path.join(mdxDir, 'index.mdx')
  const { data, content } = readMdx(filePath)

  const featuredImageSrc = data.featuredImage
    ? resolveImagePath(data.featuredImage as string, mdxDir)
    : undefined

  const featuredImage: ContentImage | undefined = featuredImageSrc
    ? {
        src: featuredImageSrc,
        alt: (data.featuredImageAlt as string | undefined) ?? '',
        description: (data.featuredImageDescription as string | undefined) ?? '',
      }
    : undefined

  return {
    title: data.title as string,
    slug: (data.slug as string | undefined) ?? slug,
    content,
    excerpt: (data.excerpt as string | undefined) ?? '',
    featuredImage,
    date: (data.date as string | undefined) ?? '',
    author: (data.author as string | undefined) ?? 'Jason Rundell',
  }
}

export async function getPosts(): Promise<Post[]> {
  const slugs = slugDirs('posts')
  const posts = slugs.map((slug) => parsePost(slug))
  return requireData('posts', posts, 'post')
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  const posts = await getPosts()
  return [...posts]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    .slice(0, limit)
}

export async function getEntryBySlug(contentType: 'post', slug: string): Promise<Post>
export async function getEntryBySlug(contentType: 'project', slug: string): Promise<Project>
export async function getEntryBySlug(
  contentType: 'post' | 'project',
  slug: string
): Promise<Post | Project> {
  if (contentType === 'post') {
    return parsePost(slug)
  }
  if (contentType === 'project') {
    return parseProject(slug)
  }
  const msg = `Unknown content type for getEntryBySlug: ${contentType}`
  console.error(msg)
  throw new Error(msg)
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

function parseProjectCreatedDate(slug: string, raw: unknown): string {
  if (raw == null || (typeof raw === 'string' && raw.trim() === '')) {
    const msg = `Project "${slug}" is missing required frontmatter field: createdDate`
    console.error(msg)
    throw new Error(msg)
  }
  const dateStr = String(raw)
  const t = new Date(dateStr).getTime()
  if (Number.isNaN(t)) {
    const msg = `Project "${slug}" has invalid createdDate in frontmatter: ${dateStr}`
    console.error(msg)
    throw new Error(msg)
  }
  return dateStr
}

function parseProject(slug: string): Project {
  const mdxDir = path.join(CONTENT_DIR, 'projects', slug)
  const filePath = path.join(mdxDir, 'index.mdx')
  const { data, content } = readMdx(filePath)

  const featuredImageSrc = data.featuredImage
    ? resolveImagePath(data.featuredImage as string, mdxDir)
    : undefined

  const featuredImage: ContentImage | undefined = featuredImageSrc
    ? {
        src: featuredImageSrc,
        alt: (data.featuredImageAlt as string | undefined) ?? '',
        description: (data.featuredImageDescription as string | undefined) ?? '',
      }
    : undefined

  const rawGallery = data.gallery as
    | Array<{ src: string; alt?: string; description?: string }>
    | undefined

  const gallery: ContentImage[] | undefined = rawGallery
    ? rawGallery.map((g) => ({
        src: resolveImagePath(g.src, mdxDir),
        alt: g.alt ?? '',
        description: g.description ?? '',
      }))
    : undefined

  return {
    title: data.title as string,
    slug: (data.slug as string | undefined) ?? slug,
    createdDate: parseProjectCreatedDate(slug, data.createdDate),
    excerpt: (data.excerpt as string | undefined) ?? '',
    description: content,
    technology: (data.technology as string[] | undefined) ?? [],
    link: data.link as string | undefined,
    siteLink: data.siteLink as string | undefined,
    featuredImage,
    gallery,
  }
}

export async function getProjects(): Promise<Project[]> {
  const slugs = slugDirs('projects')
  const projects = slugs.map((slug) => parseProject(slug))
  return requireData('projects', projects, 'project')
}

export async function getFeaturedProjects(limit: number): Promise<Project[]> {
  const projects = await getProjects()
  return [...projects].sort(compareProjectsByDateDesc).slice(0, limit)
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export async function getSkills(): Promise<Skill[]> {
  const filePath = path.join(CONTENT_DIR, 'about', 'skills.mdx')
  const { data } = readMdx(filePath)
  const skills = (data.skills as Skill[] | undefined) ?? []
  return requireData('skills', skills, 'skill')
}

// ---------------------------------------------------------------------------
// Positions
// ---------------------------------------------------------------------------

export async function getPositions(): Promise<Position[]> {
  const filePath = path.join(CONTENT_DIR, 'about', 'positions.mdx')
  const { data } = readMdx(filePath)
  const positions = (data.positions as Position[] | undefined) ?? []
  return requireData('positions', positions, 'position')
}

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

export async function getReferences(): Promise<Reference[]> {
  const filePath = path.join(CONTENT_DIR, 'about', 'references.mdx')
  const { data } = readMdx(filePath)
  const references = (data.references as Reference[] | undefined) ?? []
  return requireData('references', references, 'reference')
}

// ---------------------------------------------------------------------------
// Last Song
// ---------------------------------------------------------------------------

export async function getLastSong(): Promise<LastSong | null> {
  const filePath = path.join(CONTENT_DIR, 'last-song.mdx')
  if (!fs.existsSync(filePath)) {
    return null
  }
  const { data } = readMdx(filePath)
  if (!data.title && !data.artist) {
    return null
  }
  return {
    title: data.title as string,
    artist: data.artist as string,
    url: data.url as string,
    youtubeId: data.youtubeId as string | undefined,
  }
}
