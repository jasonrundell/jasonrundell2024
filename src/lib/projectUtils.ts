import { Project, ProjectCardItem } from '@/typeDefinitions/app'

/**
 * Map a Contentful Project entry to the lightweight shape consumed by card
 * components. featuredImage is omitted when the source has no usable file
 * URL — downstream components must treat the image as optional rather than
 * receiving a synthesised empty string (which Next/Image rejects with a
 * "missing required `src` property" warning at runtime).
 */
export function toProjectCardItem(project: Project): ProjectCardItem {
  const fields = project.featuredImage?.fields
  const file = fields?.file?.fields?.file
  const url = file?.url

  const base: ProjectCardItem = {
    title: project.title,
    excerpt: project.excerpt,
    slug: project.slug,
  }

  if (!url) {
    return base
  }

  return {
    ...base,
    featuredImage: {
      file: { url },
      altText: fields?.altText ?? '',
      description: fields?.description ?? '',
    },
  }
}
