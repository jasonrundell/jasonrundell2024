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
    jobTitle: 'Manager / Full Stack Developer',
    url: `${SITE_DOMAIN}/about`,
    sameAs: [
      AUTHOR.url,
      'https://github.com/jasonrundell',
    ],
    description:
      'AI-first Application Development Manager and Senior Full Stack Web Developer with 20+ years leading high-impact web platforms and engineering teams.',
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
    ...(post.author ? { author: { '@type': 'Person', name: post.author } } : {}),
  }
}
