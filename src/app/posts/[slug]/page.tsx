import type { Metadata } from 'next'
import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import { notFound } from 'next/navigation'

import { getEntryBySlug, getPosts } from '@/lib/content'
import RenderedMDX from '@/components/markdown/RenderedMDX'
import PostHeader from '@/components/PostHeader'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { buildBlogPostingJsonLd } from '@/lib/jsonld'
import { buildPageMetadata } from '@/lib/metadata'
import {
  StyledContainer,
  StyledSection,
  StyledBody,
  StyledBreadcrumb,
} from '@/styles/common'
import CommentsSection from '@/components/comments/CommentsSection'

type PostProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const slug = (await params).slug
  const post = await getEntryBySlug('post', slug)

  return buildPageMetadata({
    title: `${post.title} | Jason Rundell`,
    description: post.excerpt || SITE_DESCRIPTION,
    path: `/posts/${slug}`,
    type: 'article',
    publishedTime: post.date,
    image: post.featuredImage?.src
      ? {
          src: post.featuredImage.src,
          alt: post.featuredImage.alt || post.title,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
        }
      : undefined,
  })
}

export default async function page({ params }: PostProps) {
  const slug = (await params).slug
  const post = await getEntryBySlug('post', slug)

  if (!post.title) {
    notFound()
  }

  const blogPostingJsonLd = buildBlogPostingJsonLd(post, slug)

  return (
    <>
      <StyledContainer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostingJsonLd),
          }}
        />
        <StyledSection id="home">
          <StyledBreadcrumb>
            <Link href={`/`}>Home</Link> &gt; <Link href={`/posts`}>Blog</Link>{' '}
          </StyledBreadcrumb>
          <article>
            <PostHeader post={post} />
            <Spacer />
            <StyledBody>
              <section>
                <Row>
                  <RenderedMDX source={post.content} />
                </Row>
              </section>
            </StyledBody>
          </article>
          <Spacer />
          <CommentsSection contentType="post" contentSlug={slug} />
        </StyledSection>
      </StyledContainer>
    </>
  )
}
