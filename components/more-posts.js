import { Section, Grid } from '@jasonrundell/dropship'
import PostPreview from '../components/post-preview'

export default function MorePosts({ items }) {
  return (
    <Section id="more-posts">
      <Grid
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="1fr 1fr 1fr"
        columnGap="2rem"
        rowGap="2rem"
        id="grid"
      >
        {items.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </Grid>
    </Section>
  )
}
