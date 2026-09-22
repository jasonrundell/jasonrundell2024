import { getEntryBySlug, getPosts } from '@/lib/content'
import { renderShareCard } from '@/components/ShareCard'
import {
  SHARE_CARD_SIZE,
  formatShareCardDate,
  joinShareCardMeta,
} from '@/components/ShareCard.helpers'

export const alt = 'Blog post by Jason Rundell'
export const size = SHARE_CARD_SIZE
export const contentType = 'image/png'

// Content ships with the build, so every card is rendered ahead of time and
// the font files are never read at request time.
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getEntryBySlug('post', params.slug)

  return renderShareCard({
    section: 'Blog',
    title: post.title,
    meta: joinShareCardMeta([
      post.date ? formatShareCardDate(post.date) : undefined,
      post.author,
    ]),
  })
}
