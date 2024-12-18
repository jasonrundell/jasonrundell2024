// import { useEffect } from 'react'
// import { useRouter } from 'next/router'
// import Head from 'next/head'
// import Link from 'next/link'
// import ErrorPage from 'next/error'
// import styled from '@emotion/styled'
// import { Spacer } from '@jasonrundell/dropship'
// import PostBody from '../../components/PostBody'
// import MorePosts from '../../components/MorePosts'
// import PostHeader from '../../components/PostHeader'
// import Layout from '../../components/Layout'
// import { getAllPostsWithSlug, getPostAndMorePosts } from '../../lib/api/posts'
// import { SITE_NAME } from '../../lib/constants'
// import { tokens } from '../../data/tokens'
import Error from './Error'
import Post from './Post'
import { getEntryBySlug } from '@/lib/contentful'

type PostProps = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PostProps) {
  const { slug } = params

  const post = await getEntryBySlug('post', slug)

  // const router = useRouter()

  if (!post) {
    return <Error />
  }

  return <Post post={post} />
}

// export async function getStaticProps({ params, preview = false }) {
//   const data = await getPostAndMorePosts(params.slug, preview)
//   return {
//     props: {
//       post: data?.post ?? null,
//       posts: data?.morePosts ?? null,
//       preview,
//     },
//   }
// }

// export async function getStaticPaths() {
//   const allPosts = await getAllPostsWithSlug()
//   return {
//     paths: allPosts?.map(({ slug }) => `/posts/${slug}`) ?? [],
//     fallback: true,
//   }
// }
