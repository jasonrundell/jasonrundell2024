import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import ErrorPage from 'next/error'
import styled from '@emotion/styled'
import { Spacer, Footer } from '@jasonrundell/dropship'
import PostBody from '../../components/post-body'
import MorePosts from '../../components/more-posts'
import PostHeader from '../../components/post-header'
import Layout from '../../components/Layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api/posts'
import PostTitle from '../../components/post-title'
import { SITE_NAME } from '../../lib/constants'
import { tokens } from '../../data/tokens'

export default function Post({ post, posts, preview }) {
  const router = useRouter()

  useEffect(() => {
    // Apply style to the first paragraph in the content
    const firstParagraph = document.querySelector('.post-content p')
    if (firstParagraph) {
      firstParagraph.style.fontSize = tokens['--size-large']
    }
  }, [])

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  const StyledContainer = styled.div`
    padding: 0 ${tokens['--size-large']};

    @media (min-width: 768px) {
      margin: 0 auto;
      max-width: 64rem;
    }
  `

  const StyledSection = styled.section`
    padding: 2rem 0;
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

  return (
    <Layout preview={preview}>
      <Head>
        <title>{`${post.title} | ${SITE_NAME}`}</title>
        {post.featuredImage && post.featuredImage.file && (
          <meta property="og:image" content={post.featuredImage.file.url} />
        )}
      </Head>
      <StyledContainer>
        <StyledSection id="home">
          {router.isFallback ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <Breadcrumb>
                <Link href={`/`}>Home</Link> &gt;{' '}
                <Link href={`/#blog`}>Blog</Link> &gt; {post.title}
              </Breadcrumb>
              <article>
                <PostHeader
                  title={post.title}
                  coverImage={post.coverImage}
                  featuredImage={post.featuredImage}
                  date={post.date}
                  author={post.author}
                />
                <Spacer />
                <StyledBody className="post-content">
                  <PostBody content={post.content} />
                </StyledBody>
              </article>

              {posts && posts.length > 0 && (
                <Footer id="more-posts">
                  <StyledMorePostsHeading>More posts</StyledMorePostsHeading>
                  <Spacer />
                  <MorePosts items={posts} />
                </Footer>
              )}

              <Spacer />
            </>
          )}
        </StyledSection>
      </StyledContainer>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getPostAndMorePosts(params.slug, preview)
  return {
    props: {
      post: data?.post ?? null,
      posts: data?.morePosts ?? null,
      preview,
    },
  }
}

export async function getStaticPaths() {
  const allPosts = await getAllPostsWithSlug()
  return {
    paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
    fallback: true,
  }
}
