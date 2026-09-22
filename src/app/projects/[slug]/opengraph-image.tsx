import { getEntryBySlug, getProjects } from '@/lib/content'
import { renderShareCard } from '@/components/ShareCard'
import {
  SHARE_CARD_SIZE,
  joinShareCardMeta,
} from '@/components/ShareCard.helpers'

export const alt = 'Project by Jason Rundell'
export const size = SHARE_CARD_SIZE
export const contentType = 'image/png'

// Content ships with the build, so every card is rendered ahead of time and
// the font files are never read at request time.
export const dynamicParams = false

/** How many stack entries fit on the meta line before it crowds the frame. */
const MAX_TECH = 3

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function Image({ params }: { params: { slug: string } }) {
  const project = await getEntryBySlug('project', params.slug)
  const year = new Date(project.createdDate).getUTCFullYear()

  return renderShareCard({
    section: 'Projects',
    title: project.title,
    meta: joinShareCardMeta([
      Number.isNaN(year) ? undefined : String(year),
      ...project.technology.slice(0, MAX_TECH),
    ]),
  })
}
