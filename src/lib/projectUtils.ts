import { Project, ProjectCardItem } from '@/typeDefinitions/app'

/** Newest first (same convention as latest posts). */
export function compareProjectsByDateDesc(a: Project, b: Project): number {
  const timeA = a.createdDate ? new Date(a.createdDate).getTime() : 0
  const timeB = b.createdDate ? new Date(b.createdDate).getTime() : 0
  return timeB - timeA
}

/**
 * Map a Project to the lightweight shape consumed by card components.
 * featuredImage is omitted when the source has no usable URL — downstream
 * components treat the image as optional rather than receiving an empty string.
 */
export function toProjectCardItem(project: Project): ProjectCardItem {
  const base: ProjectCardItem = {
    title: project.title,
    excerpt: project.excerpt,
    slug: project.slug,
  }

  if (!project.featuredImage?.src) {
    return base
  }

  return {
    ...base,
    featuredImage: {
      file: { url: project.featuredImage.src },
      altText: project.featuredImage.alt ?? '',
      description: project.featuredImage.description ?? '',
    },
  }
}
