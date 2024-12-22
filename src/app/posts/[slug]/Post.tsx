'use client'

import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styled from '@emotion/styled'
import { Spacer, Row } from '@jasonrundell/dropship'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { MARKS, Document } from '@contentful/rich-text-types'
// import MorePosts from '@/components/MorePosts'
import PostHeader from '@/components/PostHeader'
import { SITE_NAME } from '@/lib/constants'
import { tokens } from '@/data/tokens'
import { Post as PostDef } from '@/typeDefinitions/app'

interface PostProps {
  post: PostDef
}

const customMarkdownOptions = (content: PostDef['content']) => ({
  renderMark: {
    [MARKS.CODE]: (text: React.ReactNode) => (
      <span dangerouslySetInnerHTML={{ __html: text as string }} />
    ),
  },
})

const Post = ({ post }: PostProps) => {
  useEffect(() => {
    // Apply style to the first paragraph in the content
    const firstParagraph = document.querySelector('.post-content p')
    if (firstParagraph) {
      ;(firstParagraph as HTMLElement).style.fontSize = tokens['--size-large']
    }
  }, [])

  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};

    @media (min-width: 48rem) {
      margin: 0 auto;
      max-width: 64rem;
    }
  `

  const StyledSection = styled.section`
    padding: ${tokens['--size-xlarge']} 0;
  `

  const Breadcrumb = styled.div`
    font-size: ${tokens['--size-small']};
    padding-bottom: ${tokens['--size-large']};
  `

  const StyledBody = styled.div`
    p,
    h2,
    h3,
    h4,
    h5,
    h6 {
      width: 100%;
    }
  `

  const StyledMorePostsHeading = styled.h2`
    font-size: ${tokens['--size-large']};
    font-weight: 700;
    color: ${tokens['--secondary-color']};
  `

  const StyledDivBgDark = styled.div`
    background-color: ${tokens['--background-color-2']};
  `

  const { content, featuredImage } = post

  return (
    <>
      <Head>
        <title>{post ? `${post.title} | ${SITE_NAME}` : SITE_NAME}</title>
        {featuredImage && (
          <meta
            property="og:image"
            content={featuredImage.fields.file.fields.file.url}
          />
        )}
      </Head>
      <StyledContainer>
        <StyledSection id="home">
          <Breadcrumb>
            <Link href={`/`}>Home</Link> &gt; <Link href={`/#blog`}>Blog</Link>{' '}
          </Breadcrumb>
          <article>
            <PostHeader post={post as PostDef} />
            <Spacer />
            <StyledBody className="post-content">
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
}

export default Post
