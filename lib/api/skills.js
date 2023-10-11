import { fetchGraphQL } from './fetchGraphQL'
const GRAPHQL_FIELDS = `
id
category
name
`

function extractSkills(fetchResponse) {
  return fetchResponse?.data?.skillCollection?.items?.[0]
}

function extractSkillsEntries(fetchResponse) {
  return fetchResponse?.data?.skillCollection?.items
}

export async function getPreviewSkillsById(slug) {
  const entry = await fetchGraphQL(
    `query {
      skillCollection(where: { id: "${id}" }, preview: true, limit: 1) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  )
  return extractPost(entry)
}

export async function getAllSkillsWithId() {
  const entries = await fetchGraphQL(
    `query {
      skillCollection(where: { id_exists: true }, order: name_ASC) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractPostEntries(entries)
}

export async function getAllSkillsForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      skillCollection(order: name_ASC, preview: ${preview ? 'true' : 'false'}) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractSkillsEntries(entries)
}

export async function getKillsAndMoreSkills(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      skillCollection(where: { id: "${id}" }, preview: ${
      preview ? 'true' : 'false'
    }, limit: 1) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  const entries = await fetchGraphQL(
    `query {
      skillCollection(where: { id_not_in: "${id}" }, order: name_ASC, preview: ${
      preview ? 'true' : 'false'
    }, limit: 2) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return {
    post: extractSkills(entry),
    morePosts: extractSkillsEntries(entries),
  }
}
