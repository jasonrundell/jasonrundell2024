import React from 'react'
import Link from 'next/link'
import { Row, Spacer } from '@jasonrundell/dropship'

import { getPosts } from '@/lib/contentful'
import {
  StyledContainer,
  StyledSection,
  StyledBreadcrumb,
} from '@/styles/common'
import MorePosts from '@/components/MorePosts'

export const metadata = {
  title: 'Blog | Jason Rundell',
  description:
    'The full blog archive by Jason Rundell — notes on the web, engineering, AI, and the craft of shipping.',
}

export const revalidate = 86400

export default async function PostsPage() {
  const posts = await getPosts()

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })

  return (
    <StyledContainer>
      <StyledSection id="posts">
        <StyledBreadcrumb>
          <Link href="/">Home</Link> &gt; Blog
        </StyledBreadcrumb>
        <h1>Blog</h1>
        <Row>
          <p>
            Notes, tutorials, and longer thoughts on building for the web, the
            engineering craft, and the practical edges of AI-assisted work.
          </p>
        </Row>
        <Spacer />
        <Row>
          <MorePosts posts={sortedPosts} />
        </Row>
      </StyledSection>
    </StyledContainer>
  )
}
