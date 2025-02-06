import Head from 'next/head'
import Link from 'next/link'
import { Spacer, Row } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'

import { getEntryBySlug } from '@/lib/contentful'
// import MorePosts from '@/components/MorePosts'
import PostHeader from '@/components/PostHeader'
import { SITE_NAME } from '@/lib/constants'
import { Post } from '@/typeDefinitions/app'
import {
  StyledContainer,
  StyledSection,
  StyledBody,
  StyledBreadcrumb,
} from '@/styles/common'

type PostProps = {
  params: {
    slug: string
  }
}

const customMarkdownOptions = (content: Post['content']) => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
    ),
  },
})

export default async function page({ params }: PostProps) {
  const { slug } = params

  const post = await getEntryBySlug<Post>('post', slug)

  if (!post.title) {
    notFound()
  }

  const { title, content, featuredImage } = post

  return (
    <>
      <Head>
        <title>{title ? `${title} | ${SITE_NAME}` : SITE_NAME}</title>
        {featuredImage && (
          <meta
            property="og:image"
            content={featuredImage.fields.file.fields.file.url}
          />
        )}
      </Head>
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
