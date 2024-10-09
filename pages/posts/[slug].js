import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import ErrorPage from 'next/error'
import { Spacer, Footer } from '@jasonrundell/dropship'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import MorePosts from '../../components/more-posts'
import PostHeader from '../../components/post-header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/Layout'
import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api/posts'
import PostTitle from '../../components/post-title'
import { CMS_NAME } from '../../lib/constants'

export default function Post({ post, posts, preview }) {
  const router = useRouter()

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article>
              <Head>
                <title>{`${post.title} | Next.js Blog Example with ${CMS_NAME}`}</title>
                <meta property="og:image" content={post.coverImage.url} />
              </Head>
              <Spacer sizeLarge="largest" />
              <Link href={`/`}>Home</Link> &gt;{' '}
              <Link href={`/#blog`}>Blog</Link> &gt; {post.title}
              <Spacer sizeLarge="largest" />
              <header>
                <PostHeader
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  author={post.author}
                />
              </header>
              <PostBody content={post.content} />
            </article>
            <SectionSeparator />

            {posts && morePosts.length > 0 && (
              <Footer>
                <MorePosts items={posts} />
              </Footer>
            )}

            <Spacer sizeLarge="largest" />
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview = false }) {
  const data = await getPostAndMorePosts(params.slug, preview)

  return {
    props: {
      preview,
      post: data?.post ?? null,
      posts: data?.posts ?? null,
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
