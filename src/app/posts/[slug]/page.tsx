import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'

import { getEntryBySlug } from '@/lib/contentful'
// import MorePosts from '@/components/MorePosts'
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

const customMarkdownOptions = (content: Post['content']) => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
    ),
  },
})

export async function generateMetadata(
  { params }: PostProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug

  const post = await getEntryBySlug<Post>('post', slug)

  return {
    title: `Jason Rundell | Blog: ${post.title}`,
    description: SITE_DESCRIPTION,
    openGraph: {
      images: [`https://${post.featuredImage?.fields.file.fields.file.url}`],
    },
  }
}

export default async function page({ params }: PostProps) {
  const slug = (await params).slug

  const post = await getEntryBySlug<Post>('post', slug)

  if (!post.title) {
    notFound()
  }

  const { title, content, featuredImage } = post

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
                    content as unknown as Document,
                    customMarkdownOptions(content)
                  )}
                </Row>
              </section>
            </StyledBody>
          </article>
          <Spacer />
        </StyledSection>
      </StyledContainer>
      {/* {posts && posts.length > 0 && (
        <StyledDivBgDark>
          <StyledContainer>
            <StyledSection>
              <StyledMorePostsHeading>More posts</StyledMorePostsHeading>
              <Spacer />
              <MorePosts items={posts} />
            </StyledSection>
          </StyledContainer>
        </StyledDivBgDark>
      )} */}
    </>
  )

  // return <Post post={post as PostDef} />
}
