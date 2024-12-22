import Error from '@/components/Error'
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

  if (!project) {
    return <Error />
  }

  return <Project project={project as ProjectDef} />
}
