import { fetchGraphQL } from './fetchGraphQL'
const GRAPHQL_FIELDS = `
sys {
  id
}
id
orderId
role
company
startDate
endDate
`

function extractPositions(fetchResponse) {
  return fetchResponse?.data?.positionsCollection?.items?.[0]
}

function extractPositionsEntries(fetchResponse) {
  return fetchResponse?.data?.positionsCollection?.items
}

export async function getAllPositionsWithId() {
  const entries = await fetchGraphQL(
    `query {
      positionsCollection(where: { id_exists: true }, order: orderId_DESC) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractPostEntries(entries)
}

export async function getAllPositionsForHome(preview) {
  const entries = await fetchGraphQL(
    `query {
      positionsCollection(order: orderId_DESC, preview: ${
        preview ? 'true' : 'false'
      }) {
        items {
          ${GRAPHQL_FIELDS}
        }
      }
    }`,
    preview
  )
  return extractPositionsEntries(entries)
}

export async function getSkillsAndMorePositions(slug, preview) {
  const entry = await fetchGraphQL(
    `query {
      positionsCollection(where: { id: "${id}" }, preview: ${
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
      positionsCollection(where: { id_not_in: "${id}" }, order: orderId_DESC, preview: ${
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
    post: extractPositions(entry),
    morePosts: extractPositionsEntries(entries),
  }
}
