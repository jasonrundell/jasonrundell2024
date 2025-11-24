import { createClient, Entry, EntrySkeletonType, FieldsType } from 'contentful'

import {
  Skill,
  Reference,
  Project,
  Position,
  Post,
} from '@/typeDefinitions/app'

import { ContentfulEntry } from '@/typeDefinitions/contentful'

/**
 * Contentful CMS client configuration and data fetching utilities.
 * Provides type-safe functions for fetching content from Contentful.
 */

// Ensure environment variables are loaded
if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('Contentful space ID and access token must be provided')
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

/**
 * Fetches all entries of a specific content type from Contentful.
 * @param contentType - The Contentful content type identifier
 * @returns Array of entries
 * @throws Error if fetch fails
 */
async function fetchEntries<T extends EntrySkeletonType>(
  contentType: string
): Promise<Entry<ContentfulEntry<T>>[]> {
  try {
    const response = await client.getEntries<ContentfulEntry<T>>({
      content_type: contentType,
    })

    if (response.items.length === 0) {
      console.warn(`No ${contentType} found in Contentful.`)
    }

    return response.items
  } catch (error) {
    console.error(`Error fetching ${contentType} from Contentful:`, error)
    throw error
  }
}

/**
 * Fetches a single entry by ID from Contentful.
 * @param entryId - The Contentful entry ID
 * @returns The entry
 * @throws Error if entry not found or fetch fails
 */
async function fetchEntry<T extends EntrySkeletonType>(
  entryId: string | number
): Promise<Entry<ContentfulEntry<T>>> {
  try {
    const entry = await client.getEntry<ContentfulEntry<T>>(entryId.toString())
    return entry
  } catch (error) {
    console.error(`Error fetching entry ${entryId} from Contentful:`, error)
    throw error
  }
}

/**
 * Fetches a single entry by slug from Contentful.
 * @param contentType - The Contentful content type identifier
 * @param slug - The entry slug
 * @returns The entry
 * @throws Error if entry not found or fetch fails
 */
async function fetchEntryBySlug<T extends EntrySkeletonType>(
  contentType: string,
  slug: string
): Promise<Entry<ContentfulEntry<T>>> {
  try {
    const response = await client.getEntries<ContentfulEntry<T>>({
      content_type: contentType,
      'fields.slug': slug,
    } as Record<string, string>)

    if (response.items.length === 0) {
      throw new Error(`No entry found for slug: ${slug}`)
    }

    return response.items[0]
  } catch (error) {
    console.error(
      `Error fetching entry by slug ${slug} from Contentful:`,
      error
    )
    throw error
  }
}

/**
 * Fetches a single entry from Contentful by entry ID.
 * @param entryId - The Contentful entry ID
 * @returns The entry fields, or throws an error if not found
 * @throws Error if entry cannot be fetched
 */
export async function getEntry<T extends EntrySkeletonType>(
  entryId: string | number
): Promise<T> {
  try {
    const entry = await fetchEntry<T>(entryId)
    return entry.fields as unknown as T
  } catch (error) {
    console.error('Error fetching entry:', error)
    throw new Error(
      `Failed to fetch entry ${entryId}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}

/**
 * Fetches a single entry from Contentful by slug.
 * @param contentType - The Contentful content type
 * @param slug - The entry slug
 * @returns The entry fields, or throws an error if not found
 * @throws Error if entry cannot be fetched
 */
export async function getEntryBySlug<T extends EntrySkeletonType>(
  contentType: string,
  slug: string
): Promise<T> {
  try {
    const entry = await fetchEntryBySlug<T>(contentType, slug)
    return entry.fields as unknown as T
  } catch (error) {
    console.error('Error fetching entry by slug:', error)
    throw new Error(
      `Failed to fetch ${contentType} with slug ${slug}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}

function mapEntriesToFields<T extends FieldsType>(
  entries: Entry<ContentfulEntry<T>>[]
): T[] {
  return entries.map((entry) => entry.fields as unknown as T)
}

/**
 * Fetches all skills from Contentful.
 * @returns Array of skill entries
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const skills = await fetchEntries<Skill>('skill')
    return mapEntriesToFields(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return []
  }
}

/**
 * Fetches all position entries from Contentful.
 * @returns Array of position entries
 */
export async function getPositions(): Promise<Position[]> {
  try {
    const positions = await fetchEntries<Position>('positions')
    return mapEntriesToFields(positions)
  } catch (error) {
    console.error('Error fetching positions:', error)
    return []
  }
}

/**
 * Fetches all reference entries from Contentful.
 * @returns Array of reference entries
 */
export async function getReferences(): Promise<Reference[]> {
  try {
    const references = await fetchEntries<Reference>('reference')
    return mapEntriesToFields(references)
  } catch (error) {
    console.error('Error fetching references:', error)
    return []
  }
}

/**
 * Fetches all project entries from Contentful.
 * @returns Array of project entries
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await fetchEntries<Project>('project')
    return mapEntriesToFields(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

/**
 * Fetches all blog post entries from Contentful.
 * @returns Array of post entries
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await fetchEntries<Post>('post')
    return mapEntriesToFields(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}
