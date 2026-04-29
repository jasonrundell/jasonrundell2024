import { Document } from '@contentful/rich-text-types'
import { EntrySkeletonType } from 'contentful'
import { ContentfulContent, ContentfulSys, ContentfulAsset } from './contentful'

export interface Categories {
  categories: string[]
}

export interface Skill extends EntrySkeletonType {
  id: string
  name: string
  category: string
}

export interface Position extends EntrySkeletonType {
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
export interface Reference extends EntrySkeletonType {
  id: string
  company: string
  citeName: string
  order: number
  emphasis: boolean
  quote: Document
}

export interface References {
  references: Reference[]
}

export interface Project extends EntrySkeletonType {
  title: string
  slug: string
  order: number
  excerpt: string
  description: ContentfulContent
  technology: string[]
  link?: string
  siteLink?: string
  featuredImage?: FeaturedImage
  gallery?: GalleryImage[]
}

export interface Projects {
  projects: Project[]
}

export interface FeaturedImage {
  metadata: {
    tags: string[]
    concepts: string[]
  }
  sys: {
    space: ContentfulSys
    id: string
    type: string
    createdAt: string
    updatedAt: string
    environment: ContentfulSys
    publishedVersion: number
    revision: number
    contentType: ContentfulSys
    locale: string | 'en-US'
  }
  fields: {
    title: string
    altText?: string
    description?: string
    file: {
      metadata: {
        tags: string[]
        concepts: string[]
      }
      sys: {
        space: ContentfulSys
        id: string
        type: string
        createdAt: string
        updatedAt: string
        environment: ContentfulSys
        publishedVersion: number
        revision: number
        contentType: { sys: string[] }
        locale: string | 'en-US'
      }
      fields: {
        title: string
        file: {
          url: string
          details: {
            size: number
            image: {
              width: number
              height: number
            }
          }
          fileName: string
          contentType: string | 'image/webp'
        }
      }
    }
  }
}

export interface GalleryImage {
  metadata: {
    tags: string[]
    concepts: string[]
  }
  sys: {
    space: ContentfulSys
    id: string
    type: string
    createdAt: string
    updatedAt: string
    environment: ContentfulSys
    publishedVersion: number
    revision: number
    locale: string | 'en-US'
  }
  fields: {
    title: string
    description?: string
    file: {
      url: string
      details: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
      fileName: string
      contentType: string
    }
  }
}

export interface Post extends EntrySkeletonType {
  title: string
  slug: string
  content: ContentfulContent
  excerpt: string
  featuredImage: FeaturedImage
  date: string
  author: {
    metadata: {
      tags: string[]
      concepts: string[]
    }
    sys: {
      space: { sys: string[] }
      id: string
      type: string
      createdAt: string
      updatedAt: string
      environment: { sys: string[] }
      publishedVersion: number
      revision: number
      contentType: { sys: string[] }
      locale: string
    }
    fields: {
      name: string
      picture: {
        metadata: {
          tags: string[]
          concepts: string[]
        }
        sys: {
          space: { sys: string[] }
          id: string
          type: string
          createdAt: string
          updatedAt: string
          environment: { sys: string[] }
          publishedVersion: number
          revision: number
          contentType: { sys: string[] }
          locale: string
        }
        fields: ContentfulAsset
      }
    }
  }
}

export interface Posts {
  posts: Post[]
}

export interface LastSong extends EntrySkeletonType {
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
