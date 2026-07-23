import React from 'react'
import type { Metadata } from 'next'

import { getPosts } from '@/lib/content'
import {
  BandSection,
  Container,
  Eyebrow,
  DisplayTitle,
  Lead,
} from '@/styles/editorial'
import MorePosts from '@/components/MorePosts'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Writing | Jason Rundell',
  description:
    'Writing by Jason Rundell - notes on engineering leadership, the web, and the practical edges of AI-assisted work.',
  path: '/posts',
})

export const revalidate = 86400

export default async function PostsPage() {
  const posts = await getPosts()

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })

  return (
    <>
      <BandSection tone="paper">
        <Container>
          <Eyebrow label="Writing" />
          <DisplayTitle>Notes on leadership and the craft</DisplayTitle>
          <Lead>
            Longer thoughts on engineering leadership, building for the web, and
            the practical edges of AI-assisted work.
          </Lead>
        </Container>
      </BandSection>

      <BandSection tone="surface">
        <Container>
          <MorePosts posts={sortedPosts} />
        </Container>
      </BandSection>
    </>
  )
}
