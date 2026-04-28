import { Project, ProjectCardItem } from '@/typeDefinitions/app'

export function toProjectCardItem(project: Project): ProjectCardItem {
  const fields = project.featuredImage?.fields
  const file = fields?.file?.fields?.file

  return {
    title: project.title,
    excerpt: project.excerpt,
    slug: project.slug,
    featuredImage: {
      file: { url: file?.url ?? '' },
      altText: fields?.altText ?? '',
      description: fields?.description ?? '',
    },
  }
}
