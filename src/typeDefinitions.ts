import { Document } from '@contentful/rich-text-types'

/** Contentful */
export type ContentfulContentTypes = 'skill' | 'post' | 'project' | 'reference'

export interface ContentfulEntry<T> {
  fields: T
  contentTypeId: string
}

export interface ContentfulAsset {
  file: {
    url: string
    details: string[]
    fileName: string
    contentType: string
  }
  altText: string
  title: string
  description: string
}

/** Application */
export interface Categories {
  categories: string[]
}

export interface Skill {
  id: string
  name: string
  category: string
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
  quote: Document
}

export interface References {
  references: Reference[]
}

export interface Project {
  title: string
  slug: string
  order: number
  excerpt: string
  description: Document
  technology: string[]
  link: string
}

export interface Projects {
  projects: Project[]
}

export interface FeaturedPostImage {
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
    file: {
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
    altText: string
    title: string
    description: string
  }
}

export interface Post {
  title: string
  slug: string
  content: Document
  excerpt: string
  featuredImage: FeaturedPostImage
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
