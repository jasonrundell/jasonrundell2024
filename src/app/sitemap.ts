import type { MetadataRoute } from 'next'
import { SITE_DOMAIN } from '@/lib/constants'
import { getPosts, getProjects } from '@/lib/content'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_DOMAIN}/`, priority: 1.0, changeFrequency: 'weekly' },
  {
    url: `${SITE_DOMAIN}/about`,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    url: `${SITE_DOMAIN}/contact`,
    priority: 0.7,
    changeFrequency: 'yearly',
  },
  {
    url: `${SITE_DOMAIN}/posts`,
    priority: 0.8,
    changeFrequency: 'weekly',
  },
  {
    url: `${SITE_DOMAIN}/projects`,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()])

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_DOMAIN}/posts/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_DOMAIN}/projects/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...STATIC_ROUTES, ...postUrls, ...projectUrls]
}
