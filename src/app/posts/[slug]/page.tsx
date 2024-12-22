import { notFound } from 'next/navigation'
import Post from './Post'
import { getEntryBySlug } from '@/lib/contentful'
import { Post as PostDef } from '@/typeDefinitions/app'

type PostProps = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PostProps) {
  const { slug } = params

  const post = await getEntryBySlug('post', slug)

  if (!post.title) {
    notFound()
  }

  return <Post post={post as PostDef} />
}
