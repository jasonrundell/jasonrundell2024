import { Grid } from '@jasonrundell/dropship'

import { Post, Posts } from '@/typeDefinitions/app'
import PostPreview from './PostPreview'

const MorePosts = ({ posts }: Posts) => {
  return (
    <section id="more-posts">
      <Grid
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="1fr 1fr 1fr"
        columnGap="2rem"
        rowGap="2rem"
      >
        {posts.map((post: Post) => {
          const { title, featuredImage, date, excerpt, slug } = post

          return (
            <PostPreview
              key={slug}
              title={title}
              image={featuredImage.fields.file.fields}
              date={date}
              excerpt={excerpt}
              slug={slug}
            />
          )
        })}
      </Grid>
    </section>
  )
}

export default MorePosts
