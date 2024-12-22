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
  link: string
  featuredImage?: FeaturedImage
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
