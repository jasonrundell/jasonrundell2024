import { Project, ProjectCardItem } from '@/typeDefinitions/app'

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
