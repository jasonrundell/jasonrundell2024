import type { Metadata } from 'next'
import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'
import { sanitizeHTML } from '@/lib/sanitize'

import { getEntryBySlug, getPosts } from '@/lib/contentful'
import PostHeader from '@/components/PostHeader'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { Post } from '@/typeDefinitions/app'
import {
  StyledContainer,
  StyledSection,
  StyledBody,
  StyledBreadcrumb,
} from '@/styles/common'

type PostProps = {
  params: Promise<{ slug: string }>
}

/**
 * Custom markdown options for rendering Contentful rich text.
 * Sanitizes HTML content to prevent XSS attacks.
 */
const customMarkdownOptions = () => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(String(text)),
        }}
      />
    ),
  },
})

// Revalidate every day (ISR - Incremental Static Regeneration)
export const revalidate = 86400

// Generate static params for all posts at build time
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const slug = (await params).slug

  const post = await getEntryBySlug<Post>('post', slug)

  const imageUrl = post.featuredImage?.fields?.file?.fields?.file?.url
    ? `https://${post.featuredImage.fields.file.fields.file.url}`
    : undefined

  return {
    title: `${post.title} | Jason Rundell`,
    description: SITE_DESCRIPTION,
    openGraph: {
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function page({ params }: PostProps) {
  const slug = (await params).slug

  const post = await getEntryBySlug<Post>('post', slug)

  if (!post.title) {
    notFound()
  }

  return (
    <>
      <StyledContainer>
        <StyledSection id="home">
          <StyledBreadcrumb>
            <Link href={`/`}>Home</Link> &gt; <Link href={`/#blog`}>Blog</Link>{' '}
          </StyledBreadcrumb>
          <article>
            <PostHeader post={post as Post} />
            <Spacer />
            <StyledBody>
              <section>
                <Row>
                  {documentToReactComponents(
                    post.content as unknown as Document,
                    customMarkdownOptions()
                  )}
                </Row>
              </section>
            </StyledBody>
          </article>
          <Spacer />
        </StyledSection>
      </StyledContainer>
    </>
  )
}
