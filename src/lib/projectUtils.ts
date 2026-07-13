import { Project, ProjectCardItem } from '@/typeDefinitions/app'

/** Newest first (same convention as latest posts). */
export function compareProjectsByDateDesc(a: Project, b: Project): number {
  const timeA = a.createdDate ? new Date(a.createdDate).getTime() : 0
  const timeB = b.createdDate ? new Date(b.createdDate).getTime() : 0
  return timeB - timeA
}

/** Map a Project to the lightweight shape consumed by the card list. */
export function toProjectCardItem(project: Project): ProjectCardItem {
  return {
    title: project.title,
    excerpt: project.excerpt,
    slug: project.slug,
    createdDate: project.createdDate,
    technology: project.technology,
  }
}
