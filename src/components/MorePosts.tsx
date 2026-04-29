import React from 'react'
import { Grid } from '@jasonrundell/dropship'

import { Post, Posts } from '@/typeDefinitions/app'
import PostPreview from './PostPreview'
import { RevealStaggerGroup, RevealStaggerItem } from '@/styles/motion'

function MorePosts({ posts }: Posts) {
  return (
    <section id="more-posts">
      <RevealStaggerGroup>
        <Grid
          gridTemplateColumns="1fr"
          mediumTemplateColumns="1fr 1fr"
          largeTemplateColumns="1fr 1fr 1fr"
          columnGap="2rem"
          rowGap="2rem"
        >
          {posts.map((post: Post, index: number) => {
            const { title, featuredImage, date, excerpt, slug } = post

            return (
              <RevealStaggerItem key={slug} index={index}>
                <PostPreview
                  title={title}
                  image={featuredImage?.fields.file.fields}
                  date={date}
                  excerpt={excerpt}
                  slug={slug}
                />
              </RevealStaggerItem>
            )
          })}
        </Grid>
      </RevealStaggerGroup>
    </section>
  )
}

export default React.memo(MorePosts)
