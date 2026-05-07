export interface Categories {
  categories: string[]
}

export interface Skill {
  id: string
  name: string
  category: string
}

export interface Position {
  id: string
  orderId: number
  role: string
  company: string
  startDate: string
  endDate: string
}

export interface Positions {
  positions: Position[]
}

export interface Skills {
  skills: Skill[]
}

export interface Reference {
  id: string
  company: string
  citeName: string
  order: number
  emphasis: boolean
  /** Plain markdown string (converted from Contentful rich text during migration) */
  quote: string
}

export interface References {
  references: Reference[]
}

export interface ContentImage {
  src: string
  alt: string
  description?: string
  width?: number
  height?: number
}

export interface Project {
  title: string
  slug: string
  /** ISO 8601 string; used for sort order (newest first in listings) */
  createdDate: string
  excerpt: string
  /** Raw MDX source string rendered by <RenderedMDX /> */
  description: string
  technology: string[]
  link?: string
  siteLink?: string
  featuredImage?: ContentImage
  gallery?: ContentImage[]
}

export interface Projects {
  projects: Project[]
}

export type ProjectCardItem = {
  title: string
  featuredImage?: {
    file: { url: string }
    altText: string
    description: string
  }
  excerpt: string
  slug: string
}

export interface Post {
  title: string
  slug: string
  /** Raw MDX source string rendered by <RenderedMDX /> */
  content: string
  excerpt: string
  featuredImage?: ContentImage
  date: string
  /** Author name (resolved from shared author identity) */
  author: string
}

export interface Posts {
  posts: Post[]
}

export interface LastSong {
  title: string
  artist: string
  url: string
  youtubeId?: string
}

export interface Comment {
  id: string
  user_id: string
  display_name: string
  /** Public profile path segment; links to /u/{profile_slug} */
  profile_slug: string
  content_type: 'post' | 'project'
  content_slug: string
  body: string
  created_at: string
  updated_at: string
}

export interface PublicProfile {
  auth_user_id: string
  full_name: string
  profile_slug: string
  created_at: string
}
