import { notFound } from 'next/navigation'
import Project from './Project'
import { getEntryBySlug } from '@/lib/contentful'
import { Project as ProjectDef } from '@/typeDefinitions/app'

type ProjectProps = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: ProjectProps) {
  const { slug } = params

  const project = await getEntryBySlug('project', slug)

  if (!project.title) {
    notFound()
  }

  return <Project project={project as ProjectDef} />
}
