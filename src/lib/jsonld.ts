import { Post } from '@/typeDefinitions/app'
import { SITE_DESCRIPTION, SITE_DOMAIN } from '@/lib/constants'
import AUTHOR from '@/lib/author'

/**
 * Builds a schema.org `Person` object for the /about page.
 * Identity data is sourced from `src/lib/author.ts` — single source of truth.
 */
export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR.name,
    jobTitle: 'Engineering Leader',
    url: `${SITE_DOMAIN}/about`,
    sameAs: [AUTHOR.url, 'https://github.com/jasonrundell'],
    description:
      'Engineering leader and player-coach with 25+ years in full-stack web development, joining at inflection points to build the systems, culture, and standards that let teams scale.',
  }
}

/**
 * Builds a schema.org `BlogPosting` object for a single post detail page.
 */
export function buildBlogPostingJsonLd(post: Post, slug: string) {
  const imageUrl = post.featuredImage?.src

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || SITE_DESCRIPTION,
    datePublished: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_DOMAIN}/posts/${slug}`,
    },
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(post.author
      ? { author: { '@type': 'Person', name: post.author } }
      : {}),
  }
}
