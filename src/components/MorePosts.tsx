import { Grid } from '@jasonrundell/dropship'
import PostPreview from './PostPreview'

export interface MorePostsProps {
  items: {
    title: string
    featuredImage: {
      file: {
        url: string
      }
      altText: string
      description: string
    }
    date: string
    excerpt: string
    slug: string
  }[]
}

export default function MorePosts({ items }: MorePostsProps) {
  return (
    <section id="more-posts">
      <Grid
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="1fr 1fr 1fr"
        columnGap="2rem"
        rowGap="2rem"
      >
        {items.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            image={post.featuredImage}
            date={post.date}
            excerpt={post.excerpt}
            slug={post.slug}
          />
        ))}
      </Grid>
    </section>
  )
}
