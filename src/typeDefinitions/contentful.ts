import { EntrySkeletonType, FieldsType } from 'contentful'

export type ContentfulContentTypes = 'skill' | 'post' | 'project' | 'reference'

export interface ContentfulEntry<T> {
  fields: T
  contentTypeId: string
}

export interface ContentfulContent {
  json: any
  links: {
    assets: {
      block: {
        sys: {
          id: string
        }
      }[]
    }
  }
}

export interface ContentfulAsset {
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
    contentType: string
  }
  altText?: string
  title: string
  description?: string
}

export interface ContentfulEntry<T extends FieldsType>
  extends EntrySkeletonType {
  fields: T
}

export interface ContentfulSys {
  sys: {
    type: string
    linkType: string | 'Space' | 'ContentType' | 'Environment'
    id: string
  }
}
