'use client'
import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styled from '@emotion/styled'
import { Spacer } from '@jasonrundell/dropship'
import PostBody from '@/components/PostBody'
// import MorePosts from '@/components/MorePosts'
import PostHeader from '@/components/PostHeader'
import { SITE_NAME } from '@/lib/constants'
import { tokens } from '@/data/tokens'
import { Post as PostDef } from '@/typeDefinitions'

interface PostProps {
  post: PostDef
}

const Post = ({ post }: PostProps) => {
  useEffect(() => {
    // Apply style to the first paragraph in the content
    const firstParagraph = document.querySelector('.post-content p')
    if (firstParagraph) {
      firstParagraph.style.fontSize = tokens['--size-large']
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

  const { title, content, author, date, featuredImage } = post

  console.log('author', author.fields.picture.fields.file)

  return (
    <>
      <Head>
        <title>{post ? `${post.title} | ${SITE_NAME}` : SITE_NAME}</title>
        {featuredImage && (
          <meta
            property="og:image"
            content={featuredImage.fields.file.fields}
          />
        )}
      </Head>
      <StyledContainer>
        <StyledSection id="home">
          <Breadcrumb>
            <Link href={`/`}>Home</Link> &gt; <Link href={`/#blog`}>Blog</Link>{' '}
            &gt; {post.title}
          </Breadcrumb>
          <article>
            <PostHeader
              title={title}
              featuredImage={featuredImage}
              date={date}
              author={author}
            />
            <Spacer />
            <StyledBody className="post-content">
              <PostBody content={content} />
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
