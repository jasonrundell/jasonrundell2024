import { fetchGraphQL } from './fetchGraphQL'
const GRAPHQL_FIELDS = `
sys {
  id
}
id
company
citeName
order
emphasis
quote {
  json
}
`

function extractReferences(fetchResponse) {
  return fetchResponse?.data?.referenceCollection?.items?.[0]
}

function extractReferencesEntries(fetchResponse) {
  return fetchResponse?.data?.referenceCollection?.items
}

export async function getAllReferencesWithId() {
  const entries = await fetchGraphQL(
    `query {
      referenceCollection(where: { id_exists: true }, order: citeName_ASC) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractPostEntries(entries)
}

export async function getAllReferencesForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      referenceCollection(order: order_ASC, preview: ${
        preview ? 'true' : 'false'
      }) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractReferencesEntries(entries)
}

export async function getSkillsAndMoreReferences(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      referenceCollection(where: { id: "${id}" }, preview: ${
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
      referenceCollection(where: { id_not_in: "${id}" }, order: citeName_ASC, preview: ${
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
    post: extractReferences(entry),
    morePosts: extractReferencesEntries(entries),
  }
}
